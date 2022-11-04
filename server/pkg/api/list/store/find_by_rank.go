package store

import (
	"database/sql"
	"strconv"

	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/emonadeo/gdol/pkg/model"
	"github.com/lib/pq"
)

const sqlFindByRank = `
	SELECT
		levels.id,
		levels.gd_id,
		levels.name,
		users.*,
		verifier.*,
		array_agg(creators.id),
		array_agg(creators.name),
		array_agg(creators.nationality),
		levels.video
	FROM (
		SELECT list_level_ids[$1] AS list_level_id FROM list_log
		ORDER BY list_log.timestamp DESC
		LIMIT 1
	) AS _
	JOIN levels ON levels.id = list_level_id
	JOIN users ON users.id = levels.user_id
	JOIN users verifier ON verifier.id = levels.verifier_id
	JOIN user_created_level ON user_created_level.level_id = levels.id
	JOIN users creators ON user_created_level.user_id = creators.id
	GROUP BY
		levels.id,
		users.id,
		verifier.id
`

type Level struct {
	Id       int32
	GdId     int32
	Name     string
	User     sqlc.User
	Verifier sqlc.User
	Creators []sqlc.User
	Video    sql.NullString
}

func (store Store) FindByRank(rank int) (model.Level, error) {
	row := store.DB.QueryRowContext(store.Ctx, sqlFindByRank, rank)
	var level Level
	creatorIds := []string{}
	creatorNames := []string{}
	creatorNationalities := []sql.NullString{}
	err := row.Scan(
		&level.Id,
		&level.GdId,
		&level.Name,
		&level.User.ID,
		&level.User.Name,
		&level.User.Nationality,
		&level.Verifier.ID,
		&level.Verifier.Name,
		&level.Verifier.Nationality,
		pq.Array(&creatorIds),
		pq.Array(&creatorNames),
		pq.Array(&creatorNationalities),
		&level.Video,
	)
	if err != nil {
		return model.Level{}, err
	}

	creators := []model.User{}
	for i := range creatorIds {
		id, err := strconv.Atoi(creatorIds[i])
		if err != nil {
			return model.Level{}, err
		}
		creators = append(creators, model.User{
			Id:          int32(id),
			Name:        creatorNames[i],
			Nationality: creatorNationalities[i].String,
		})
	}

	return model.Level{
		Id:   level.Id,
		GdId: level.GdId,
		Name: level.Name,
		User: model.User{
			Id:          int32(level.User.ID),
			Name:        level.User.Name,
			Nationality: level.User.Nationality.String,
		},
		Verifier: model.User{
			Id:          int32(level.Verifier.ID),
			Name:        level.Verifier.Name,
			Nationality: level.Verifier.Nationality.String,
		},
		Creators: creators,
		Video:    level.Video.String,
	}, nil
}
