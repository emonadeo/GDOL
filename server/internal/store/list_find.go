package store

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/internal/model"
	"github.com/emonadeo/gdol/internal/util"
	"github.com/lib/pq"
)

const qryMono = `
SELECT
    levels.id,
    levels.name,
    levels.gd_id,
    levels.video,
    levels.requirement,
    users.id,
    users.name,
    users.nationality,
    verifier.id,
    verifier.name,
    verifier.nationality,
    array_agg(creators.id),
    array_agg(creators.name),
    array_agg(creators.nationality)
FROM (
        SELECT list_log.list_level_ids
        FROM list_log
        ORDER BY list_log.timestamp DESC
        LIMIT 1
    ) AS latest_list_log,
    UNNEST(latest_list_log.list_level_ids) WITH ORDINALITY AS list_level_id
    JOIN levels ON levels.id = list_level_id
    JOIN users ON users.id = levels.user_id
    JOIN users verifier ON verifier.id = levels.verifier_id
    JOIN user_created_level ON user_created_level.level_id = list_level_id
    JOIN users creators ON creators.id = user_created_level.user_id
GROUP BY levels.id,
    users.id,
    verifier.id,
    ordinality
ORDER BY ordinality ASC;
`

func (store Store) ListFind(ctx context.Context) (model.List, error) {
	rows, err := store.db.QueryContext(ctx, qryMono)
	if err != nil {
		return nil, err
	}
	list := model.List{}
	for rows.Next() {
		var id int64
		var name string
		var gdId sql.NullInt64
		var video sql.NullString
		var requirement sql.NullInt16
		var userId int64
		var userName string
		var userNationality sql.NullString
		var verifierId int64
		var verifierName string
		var verifierNationality sql.NullString
		var creatorIds []int64
		var creatorNames []string
		var creatorNationalities []sql.NullString

		rows.Scan(
			&id,
			&name,
			&gdId,
			&video,
			&requirement,
			&userId,
			&userName,
			&userNationality,
			&verifierId,
			&verifierName,
			&verifierNationality,
			pq.Array(&creatorIds),
			pq.Array(&creatorNames),
			pq.Array(&creatorNationalities),
		)

		creators := []model.User{}
		for i, id := range creatorIds {
			creators = append(creators, model.User{
				Id:          id,
				Name:        creatorNames[i],
				Nationality: util.NullString(creatorNationalities[i]),
			})
		}

		list = append(list, model.Level{
			Id:          id,
			Name:        name,
			GdId:        util.NullInt64(gdId),
			Video:       util.NullString(video),
			Requirement: util.NullInt16(requirement),
			User: model.User{
				Id:          userId,
				Name:        userName,
				Nationality: util.NullString(userNationality),
			},
			Verifier: model.User{
				Id:          verifierId,
				Name:        verifierName,
				Nationality: util.NullString(verifierNationality),
			},
			Creators: creators,
		})
	}
	return list, nil
}
