package store

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/emonadeo/gdol/generated/sqlc"

	_ "github.com/lib/pq"
)

// Make configurable
const (
	dbUser     = "example"
	dbPassword = "example"
	dbName     = "gdol"
	dbSslMode  = "disable"
)

type Store struct {
	ctx context.Context
	db  *sql.DB
	orm *sqlc.Queries
}

func New() (*Store, error) {
	ctx := context.Background()

	db, err := sql.Open("postgres", fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s", dbUser, dbPassword, dbName, dbSslMode))
	if err != nil {
		return nil, err
	}

	orm := sqlc.New(db)

	return &Store{
		ctx: ctx,
		db:  db,
		orm: orm,
	}, nil
}
