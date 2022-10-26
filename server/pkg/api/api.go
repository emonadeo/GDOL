// GDOL
//
// API for GDOL
//
//	Schemes: http, https
//	Host: localhost
//	BasePath: /
//	Version: 2.0.0
//	License: MIT http://opensource.org/licenses/MIT
//	Contact: Emanuel Pilz<emonadeo@gmail.com> http://github.com/emonadeo
//
//	Consumes:
//	- application/json
//
//	Produces:
//	- application/json
//
//	Security:
//	- bearer:
//
//	SecurityDefinitions:
//	bearer:
//	    type: apiKey
//	    name: Authorization
//	    in: header
//
// swagger:meta
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
