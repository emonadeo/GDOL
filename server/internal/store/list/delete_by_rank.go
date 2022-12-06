package list

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/emonadeo/gdol/internal/util"
)

func (l List) DeleteByRank(ctx context.Context, rank int16, archive openapi.ArchiveLevelByListRankJSONRequestBody) error {
	tx, err := l.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	qtx := l.Qry.WithTx(tx)
	levelId, err := qtx.ListDeleteByRankPushLog(ctx, sqlc.ListDeleteByRankPushLogParams{
		From: sql.NullInt16{
			Int16: int16(rank),
			Valid: true,
		},
		Reason: util.StrPtrToNullString(archive.Reason),
	})
	if err != nil {
		return err
	}
	err = qtx.ListDeleteByRankPushArchive(ctx, levelId)
	if err != nil {
		return err
	}
	return tx.Commit()
}
