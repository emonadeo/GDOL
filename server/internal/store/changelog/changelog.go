package changelog

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
)

type Changelog struct {
	DB  *sql.DB
	Qry *sqlc.Queries
}

func New(db *sql.DB, qry *sqlc.Queries) Changelog {
	return Changelog{
		DB:  db,
		Qry: qry,
	}
}
