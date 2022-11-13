package store

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
	"github.com/emonadeo/gdol/pkg/model"
)

func (store Store) ListArchive(rank int16, archive model.ListArchive) error {
	tx, err := store.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	qtx := store.orm.WithTx(tx)
	levelId, err := qtx.ListDelete(store.ctx, sqlc.ListDeleteParams{
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
	err = qtx.ListArchive(store.ctx, levelId)
	if err != nil {
		return err
	}
	return tx.Commit()
}
