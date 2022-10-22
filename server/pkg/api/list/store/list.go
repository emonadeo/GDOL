package store

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/emonadeo/gdol/pkg/model"
)

type List struct{}

const sqlGet = `
SELECT levels.id, levels.gd_id, levels.name, users.name as user, levels.video FROM (
	SELECT * FROM list_log
  	ORDER BY list_log.timestamp DESC
  	LIMIT 1
) AS latest_list_log, UNNEST(latest_list_log.list_level_ids) WITH ORDINALITY AS "list_level_id"
JOIN levels
ON levels.id = list_level_id
JOIN users
ON users.id = levels.user_id
ORDER BY ordinality ASC;
`

func (l List) Get(c context.Context, db sqlc.DBTX) (model.List, error) {
	rows, err := db.QueryContext(c, sqlGet)
	if err != nil {
		return nil, err
	}
	var list model.List
	for rows.Next() {
		var level struct {
			Id    int32
			GdId  int32
			Name  string
			User  string
			Video sql.NullString
		}
		err := rows.Scan(&level.Id, &level.GdId, &level.Name, &level.User, &level.Video)
		if err != nil {
			return nil, err
		}
		list = append(list, model.ListLevel{
			Id:    level.Id,
			GdId:  level.GdId,
			Name:  level.Name,
			User:  level.User,
			Video: level.Video.String,
		})
	}
	return list, nil
}
