package levels

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/internal/util"
	"github.com/emonadeo/gdol/pkg/model"
	"github.com/lib/pq"
)

func (l Levels) FindByRank(ctx context.Context, rank int16) (model.Level, error) {
	// Cannot use sqlc because of https://github.com/kyleconroy/sqlc/issues/185
	row := l.DB.QueryRowContext(ctx, "SELECT * FROM list WHERE list.rank = $1", rank)

	var id int64
	var name string
	var gdId sql.NullInt64
	var video sql.NullString
	var requirement sql.NullInt16
	var userId int64
	var userName string
	var userNationality sql.NullString
	var userDiscordId sql.NullString
	var verifierId int64
	var verifierName string
	var verifierNationality sql.NullString
	var verifierDiscordId sql.NullString
	var creatorsId []int64
	var creatorsName []string
	var creatorsNationality []sql.NullString
	var creatorsDiscordId []sql.NullString

	err := row.Scan(
		&rank,
		&id,
		&name,
		&gdId,
		&video,
		&requirement,
		&userId,
		&userName,
		&userNationality,
		&userDiscordId,
		&verifierId,
		&verifierName,
		&verifierNationality,
		&verifierDiscordId,
		pq.Array(&creatorsId),
		pq.Array(&creatorsName),
		pq.Array(&creatorsNationality),
		pq.Array(&creatorsDiscordId),
	)
	if err != nil {
		return model.Level{}, err
	}

	creators := []model.User{}
	for i, id := range creatorsId {
		creators = append(creators, model.User{
			Id:          id,
			Name:        creatorsName[i],
			Nationality: util.NullString(creatorsNationality[i]),
		})
	}

	level := model.Level{
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
	}

	return level, nil
}
