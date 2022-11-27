package store

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
	"github.com/emonadeo/gdol/internal/store/changelog"
	"github.com/emonadeo/gdol/internal/store/levels"
	"github.com/emonadeo/gdol/internal/store/list"
	"github.com/emonadeo/gdol/internal/store/records"
	"github.com/emonadeo/gdol/internal/store/users"
)

// TODO: Make configurable
type Store struct {
	Changelog changelog.Changelog
	Levels    levels.Levels
	List      list.List
	Records   records.Records
	Users     users.Users
}

func New(postgresUrl string) (*Store, error) {
	db, err := sql.Open("postgres", postgresUrl)
	if err != nil {
		return nil, err
	}

	qry := sqlc.New(db)

	store := &Store{
		Changelog: changelog.New(db, qry),
		Levels:    levels.New(db, qry),
		List:      list.New(db, qry),
		Records:   records.New(db, qry),
		Users:     users.New(db, qry),
	}

	return store, nil
}
