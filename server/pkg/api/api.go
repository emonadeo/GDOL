package api

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/api/list"
	listHttp "github.com/emonadeo/gdol/pkg/api/list/http"
	"github.com/emonadeo/gdol/pkg/server"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Start() error {
	c := context.Background()

	db, err := sql.Open("postgres", "user=example password=example dbname=gdol sslmode=disable")
	if err != nil {
		return err
	}

	// queries := sqlc.New(db)

	e := server.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

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
