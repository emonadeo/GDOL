package store

import (
	"database/sql"

	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/emonadeo/gdol/pkg/model"
)

func (store Store) Archive(rank int16, archive model.ListArchive) error {
	tx, err := store.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	qtx := store.Queries.WithTx(tx)
	levelId, err := qtx.ListDelete(store.Ctx, sqlc.ListDeleteParams{
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
	err = qtx.ListArchive(store.Ctx, levelId)
	if err != nil {
		return err
	}
	return tx.Commit()
}
