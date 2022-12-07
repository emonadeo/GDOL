package changelog

import (
	"context"
	"database/sql"
	"strconv"
	"time"

	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/emonadeo/gdol/internal/util"
	"github.com/lib/pq"
)

// TODO: Use sqlc (workaround needed)
const sqlFind = `
-- unnest list_before_levels, join with levels, and aggregate back into array
SELECT
    list_log.timestamp,
    list_log.action,
    list_log.from,
    list_log.to,
    list_log.reason,
    level.id,
    level.name,
    -- pass after through
    list_after_level_ids,
    list_after_level_names,
    -- agg before
    array_remove(array_agg(list_before_level.id), NULL) AS list_before_level_ids,
    array_remove(array_agg(list_before_level.name), NULL) AS list_before_level_names
FROM
    (
        -- unnest list_after_levels, join with levels, and aggregate back into array
        SELECT
            list_log.timestamp,
            list_log.action,
            list_log.from,
            list_log.to,
            list_log.reason,
            list_log.level_id,
            -- agg after
            array_remove(array_agg(list_after_level.id), NULL) AS list_after_level_ids,
            array_remove(array_agg(list_after_level.name), NULL) AS list_after_level_names,
            -- unnest before
            UNNEST(
                CASE
                    WHEN list_log.list_before_level_ids <> '{}' THEN list_log.list_before_level_ids
                    ELSE '{NULL}'
                END
            ) AS list_before_level_id
        FROM
            (
                SELECT
                    list_log.timestamp,
                    list_log.action,
                    list_log.from,
                    list_log.to,
                    list_log.reason,
                    list_log.level_id,
                    -- pass before through
                    list_log.list_before_level_ids,
                    -- unnest after
                    UNNEST(
                        CASE
                            WHEN list_log.list_after_level_ids <> '{}' THEN list_log.list_after_level_ids
                            ELSE '{NULL}'
                        END
                    ) AS list_after_level_id
                FROM
                    list_log
                ORDER BY
                    list_log.timestamp DESC
            ) AS list_log
            LEFT JOIN levels list_after_level ON list_after_level.id = list_log.list_after_level_id
        GROUP BY
            list_log.timestamp,
            list_log.action,
            list_log.from,
            list_log.to,
            list_log.reason,
            list_log.level_id,
            -- group unnest back together
            list_log.list_before_level_ids
        ORDER BY
            list_log.timestamp DESC
    ) AS list_log
    LEFT JOIN levels list_before_level ON list_before_level.id = list_log.list_before_level_id
    LEFT JOIN levels level ON level.id = list_log.level_id
GROUP BY
    list_log.timestamp,
    list_log.action,
    list_log.from,
    list_log.to,
    list_log.reason,
    level.id,
    level.name,
    list_log.list_after_level_ids,
    list_log.list_after_level_names
ORDER BY
    list_log.timestamp DESC
`

type Entry struct {
	Timestamp string
	Action    string
	From      sql.NullInt16
	To        sql.NullInt16
	Reason    sql.NullString
	Level     struct {
		Id   int64
		Name string
	}
}

func (c Changelog) Find(ctx context.Context) ([]openapi.Changelog, error) {
	rows, err := c.DB.QueryContext(ctx, sqlFind)
	if err != nil {
		return nil, err
	}
	var changelog []openapi.Changelog
	for rows.Next() {
		var entry Entry
		var afterLevelIds []string
		var afterLevelNames []string
		var beforeLevelIds []string
		var beforeLevelNames []string

		err := rows.Scan(
			&entry.Timestamp,
			&entry.Action,
			&entry.From,
			&entry.To,
			&entry.Reason,
			&entry.Level.Id,
			&entry.Level.Name,
			pq.Array(&afterLevelIds),
			pq.Array(&afterLevelNames),
			pq.Array(&beforeLevelIds),
			pq.Array(&beforeLevelNames),
		)

		if err != nil {
			return nil, err
		}

		afterLevels := []openapi.Level{}
		for i := range afterLevelIds {
			id, err := strconv.Atoi(afterLevelIds[i])
			if err != nil {
				return nil, err
			}
			afterLevels = append(afterLevels, openapi.Level{
				Id:   int64(id),
				Name: afterLevelNames[i],
			})
		}

		beforeLevels := []openapi.Level{}
		for i := range beforeLevelIds {
			id, err := strconv.Atoi(beforeLevelIds[i])
			if err != nil {
				return nil, err
			}
			beforeLevels = append(beforeLevels, openapi.Level{
				Id:   int64(id),
				Name: beforeLevelNames[i],
			})
		}

		timestamp, err := time.Parse(time.RFC3339, entry.Timestamp)
		if err != nil {
			return nil, err
		}

		changelog = append(changelog, openapi.Changelog{
			Timestamp: timestamp,
			Action:    openapi.ChangelogAction(entry.Action),
			From:      util.NullInt16(entry.From),
			To:        util.NullInt16(entry.To),
			Reason:    util.NullString(entry.Reason),
			Level: openapi.Level{
				Id:   entry.Level.Id,
				Name: entry.Level.Name,
			},
			List:       afterLevels,
			ListBefore: beforeLevels,
		})
	}
	return changelog, nil
}
