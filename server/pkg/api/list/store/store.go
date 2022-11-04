package store

import (
	"context"

	"github.com/emonadeo/gdol/pkg/generated/sqlc"
)

type Store struct {
	Ctx     context.Context
	DB      sqlc.DBTX
	Queries *sqlc.Queries
}

func New(ctx context.Context, db sqlc.DBTX, queries *sqlc.Queries) Store {
	return Store{ctx, db, queries}
}
