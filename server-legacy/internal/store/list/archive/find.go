package archive

import (
	"context"
	"time"

	"database/sql"

	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/emonadeo/gdol/internal/util"
	"github.com/lib/pq"
)

const qryFind = `
SELECT
    list_archive.timestamp,
    levels.id,
    levels.name,
    levels.gd_id,
    levels.video,
    levels.requirement,
    users.id AS user_id,
    users.name AS user_name,
    users.nationality AS user_nationality,
    users.discord_id AS user_discord_id,
    verifier.id AS verifier_id,
    verifier.name AS verifier_name,
    verifier.nationality AS verifier_nationality,
    verifier.discord_id AS verifier_discord_id,
    array_remove(array_agg(creators.id), NULL) :: bigint [ ] AS creator_ids,
    array_remove(array_agg(creators.name), NULL) :: text [ ] AS creator_names,
    array_agg(creators.nationality) AS creator_nationalities,
    array_agg(creators.discord_id) AS creator_discord_ids
FROM
    list_archive
    JOIN levels ON levels.id = list_archive.level_id
    JOIN users ON users.id = levels.user_id
    JOIN users verifier ON verifier.id = levels.verifier_id
    LEFT JOIN user_created_level ON user_created_level.level_id = list_archive.level_id
    LEFT JOIN users creators ON creators.id = user_created_level.user_id
GROUP BY
    list_archive.timestamp,
    levels.id,
    users.id,
    verifier.id;
`

func (a Archive) Find(ctx context.Context) ([]openapi.LevelArchived, error) {
	// Cannot use sqlc because of https://github.com/kyleconroy/sqlc/issues/185
	rows, err := a.DB.QueryContext(ctx, qryFind)
	if err != nil {
		return nil, err
	}

	levels := []openapi.LevelArchived{}

	for rows.Next() {
		var timestamp time.Time
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
		var creatorIds []int64
		var creatorNames []string
		var creatorNationalities []sql.NullString
		var creatorDiscordIds []sql.NullString

		rows.Scan(
			&timestamp,
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
			pq.Array(&creatorIds),
			pq.Array(&creatorNames),
			pq.Array(&creatorNationalities),
			pq.Array(&creatorDiscordIds),
		)

		creators := []openapi.User{}
		for i, id := range creatorIds {
			creators = append(creators, openapi.User{
				Id:          id,
				Name:        creatorNames[i],
				Nationality: util.NullString(creatorNationalities[i]),
			})
		}

		levels = append(levels, openapi.LevelArchived{
			Timestamp:   timestamp,
			Id:          id,
			Name:        name,
			GdId:        util.NullInt64(gdId),
			Video:       util.NullString(video),
			Requirement: util.NullInt16(requirement),
			User: openapi.User{
				Id:          userId,
				Name:        userName,
				Nationality: util.NullString(userNationality),
			},
			Verifier: openapi.User{
				Id:          verifierId,
				Name:        verifierName,
				Nationality: util.NullString(verifierNationality),
			},
			Creators: creators,
		})
	}
	return levels, nil
}
