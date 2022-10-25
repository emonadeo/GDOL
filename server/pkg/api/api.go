package api

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/api/list"
	"github.com/emonadeo/gdol/pkg/server"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Start() error {
	ctx := context.Background()

	db, err := sql.Open("postgres", "user=example password=example dbname=gdol sslmode=disable")
	if err != nil {
		return err
	}

	e := server.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	list.Bind(e, ctx, db)

	// TODO Outsource config
	server.Start(e, &server.Config{
		Port:                ":3000",
		ReadTimeoutSeconds:  10,
		WriteTimeoutSeconds: 5,
		Debug:               true,
	})

	return nil
}
