package archive

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
)

type Archive struct {
	DB  *sql.DB
	Qry *sqlc.Queries
}

func New(db *sql.DB, qry *sqlc.Queries) *Archive {
	return &Archive{
		DB:  db,
		Qry: qry,
	}
}
