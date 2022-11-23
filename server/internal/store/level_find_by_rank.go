package store

import (
	"context"

	"github.com/emonadeo/gdol/pkg/model"
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

// TODO
func (store Store) LevelFindByRank(ctx context.Context, rank int) (model.Level, error) {
	return model.Level{}, nil
}
