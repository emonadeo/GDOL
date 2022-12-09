package levels

import (
	"context"

	"github.com/emonadeo/gdol/generated/sqlc"
	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/emonadeo/gdol/internal/util"
)

func (l Levels) Create(ctx context.Context, level openapi.CreateLevelJSONRequestBody) error {
	err := l.Qry.LevelsCreate(ctx, sqlc.LevelsCreateParams{
		Name:        level.Name,
		GdID:        util.Int64PtrToNullInt64(level.GdId),
		UserID:      level.UserId,
		VerifierID:  level.VerifierId,
		Video:       util.StrPtrToNullString(level.Video),
		Requirement: util.Int16PtrToNullInt16(level.Requirement),
		Column7:     level.CreatorIds,
	})
	if err != nil {
		return err
	}

	return nil
}
