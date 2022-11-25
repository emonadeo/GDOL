package records

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
)

type Records struct {
	DB  *sql.DB
	Qry *sqlc.Queries
}

func New(db *sql.DB, qry *sqlc.Queries) Records {
	return Records{
		DB:  db,
		Qry: qry,
	}
}
