package users

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
)

type Users struct {
	DB  *sql.DB
	Qry *sqlc.Queries
}

func New(db *sql.DB, qry *sqlc.Queries) *Users {
	return &Users{
		DB:  db,
		Qry: qry,
	}
}
