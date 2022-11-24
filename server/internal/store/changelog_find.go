package store

import (
	"context"
	"database/sql"
	"strconv"

	"github.com/emonadeo/gdol/pkg/model"
	"github.com/emonadeo/gdol/pkg/util"
	"github.com/lib/pq"
)

const sqlChangelogFind = `
SELECT
	list_log.timestamp,
	list_log.action,
	list_log.from,
	list_log.to,
	list_log.reason,
	level.id,
	level.name,
	array_agg(levels.id),
	array_agg(levels.name)
FROM (
	SELECT *, UNNEST(list_log.list_level_ids) AS list_level_id FROM list_log
	ORDER BY list_log.timestamp DESC
) AS list_log
JOIN levels ON levels.id = list_level_id
JOIN levels level ON level.id = list_log.level_id
GROUP BY list_log.id, list_log.timestamp, list_log.action, list_log.from, list_log.to, list_log.reason, level.id
ORDER BY list_log.timestamp DESC
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

func (store Store) ChangelogFind(ctx context.Context) ([]model.Changelog, error) {
	rows, err := store.db.QueryContext(ctx, sqlChangelogFind)
	if err != nil {
		return nil, err
	}
	var changelog []model.Changelog
	for rows.Next() {
		var entry Entry
		var levelId []string
		var levelName []string

		err := rows.Scan(
			&entry.Timestamp,
			&entry.Action,
			&entry.From,
			&entry.To,
			&entry.Reason,
			&entry.Level.Id,
			&entry.Level.Name,
			pq.Array(&levelId),
			pq.Array(&levelName),
		)

		if err != nil {
			return nil, err
		}

		levels := []model.Level{}
		for i := range levelId {
			id, err := strconv.Atoi(levelId[i])
			if err != nil {
				return []model.Changelog{}, nil
			}
			levels = append(levels, model.Level{
				Id:   int64(id),
				Name: levelName[i],
			})
		}

		changelog = append(changelog, model.Changelog{
			Timestamp: entry.Timestamp,
			Action:    entry.Action,
			From:      util.NullInt16(entry.From),
			To:        util.NullInt16(entry.To),
			Reason:    util.NullString(entry.Reason),
			Level: model.Level{
				Id:   entry.Level.Id,
				Name: entry.Level.Name,
			},
			List: levels,
		})
	}
	return changelog, nil
}
