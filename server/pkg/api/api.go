package api

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/api/list"
	listHttp "github.com/emonadeo/gdol/pkg/api/list/http"
	"github.com/emonadeo/gdol/pkg/server"
)

func Start() error {
	c := context.Background()

	db, err := sql.Open("postgres", "user=example password=example dbname=gdol sslmode=disable")
	if err != nil {
		return err
	}

	// queries := sqlc.New(db)

	e := server.New()

	v1 := e.Group("")

	listHttp.NewHTTP(list.Initialize(c, db), v1)

	// TODO Outsource config
	server.Start(e, &server.Config{
		Port:                ":3000",
		ReadTimeoutSeconds:  10,
		WriteTimeoutSeconds: 5,
		Debug:               true,
	})

	return nil
}
