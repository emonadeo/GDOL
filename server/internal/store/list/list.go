package list

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
)

type List struct {
	DB  *sql.DB
	Qry *sqlc.Queries
}

func New(db *sql.DB, qry *sqlc.Queries) List {
	return List{
		DB:  db,
		Qry: qry,
	}
}
