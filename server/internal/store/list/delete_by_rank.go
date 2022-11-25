package list

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
	"github.com/emonadeo/gdol/internal/model"
)

func (l List) DeleteByRank(ctx context.Context, rank int16, archive model.ListArchive) error {
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
		Reason: sql.NullString{
			String: archive.Reason,
			Valid:  archive.Reason != "",
		},
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
