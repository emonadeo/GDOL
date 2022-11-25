package levels

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
)

type Levels struct {
	DB  *sql.DB
	Qry *sqlc.Queries
}

func New(db *sql.DB, qry *sqlc.Queries) Levels {
	return Levels{
		DB:  db,
		Qry: qry,
	}
}
