package store

import (
	"database/sql"
	"fmt"

	"github.com/emonadeo/gdol/generated/sqlc"
)

// TODO: Make configurable
const (
	dbUser     = "example"
	dbPassword = "example"
	dbName     = "gdol"
	dbSslMode  = "disable"
)

type Store struct {
	db  *sql.DB
	qry *sqlc.Queries
}

func New() (*Store, error) {
	db, err := sql.Open("postgres", fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s", dbUser, dbPassword, dbName, dbSslMode))
	if err != nil {
		return nil, err
	}

	qry := sqlc.New(db)

	return &Store{db, qry}, nil
}
