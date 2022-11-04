package store

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/generated/sqlc"
)

type Store struct {
	Ctx     context.Context
	DB      *sql.DB
	Queries *sqlc.Queries
}

func New(ctx context.Context, db *sql.DB, queries *sqlc.Queries) Store {
	return Store{ctx, db, queries}
}
