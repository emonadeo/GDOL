package store

import (
	"database/sql"

	"github.com/emonadeo/gdol/pkg/model"
)

const sqlFind = `
	SELECT levels.id, levels.gd_id, levels.name, users.name as user, levels.video FROM (
		SELECT * FROM list_log
		ORDER BY list_log.timestamp DESC
		LIMIT 1
	) AS latest_list_log, UNNEST(latest_list_log.list_level_ids) WITH ORDINALITY AS "list_level_id"
	JOIN levels ON levels.id = list_level_id
	JOIN users ON users.id = levels.user_id
	ORDER BY ordinality ASC;
`

type ListLevel struct {
	Id    int32
	GdId  int32
	Name  string
	User  string
	Video sql.NullString
}

func (store Store) Find() (model.List, error) {
	rows, err := store.DB.QueryContext(store.Ctx, sqlFind)
	if err != nil {
		return nil, err
	}
	var list model.List
	for rows.Next() {
		var level ListLevel
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
