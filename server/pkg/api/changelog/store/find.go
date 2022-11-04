package store

import (
	"database/sql"
	"strconv"

	"github.com/emonadeo/gdol/pkg/model"
	"github.com/lib/pq"
)

const sqlFind = `
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
		Id   int32
		Name string
	}
}

func (store Store) Find() ([]model.Changelog, error) {
	rows, err := store.DB.QueryContext(store.Ctx, sqlFind)
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

		levels := []model.ChangelogLevel{}
		for i := range levelId {
			id, err := strconv.Atoi(levelId[i])
			if err != nil {
				return []model.Changelog{}, nil
			}
			levels = append(levels, model.ChangelogLevel{
				Id:   int32(id),
				Name: levelName[i],
			})
		}

		changelog = append(changelog, model.Changelog{
			Timestamp: entry.Timestamp,
			Action:    entry.Action,
			From:      int32(entry.From.Int16),
			To:        int32(entry.To.Int16),
			Reason:    entry.Reason.String,
			Level: model.ChangelogLevel{
				Id:   entry.Level.Id,
				Name: entry.Level.Name,
			},
			List: levels,
		})
	}
	return changelog, nil
}
