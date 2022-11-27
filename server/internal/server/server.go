// No code using echo should be outside this package
package server

import (
	"github.com/emonadeo/gdol/internal/core"
	"github.com/emonadeo/gdol/internal/server/api"
	"github.com/emonadeo/gdol/internal/server/middleware"
	"github.com/labstack/echo/v5"
	echoMiddleware "github.com/labstack/echo/v5/middleware"
)

func New(app core.App) (*echo.Echo, error) {
	e := echo.New()

	// GZip
	e.Use(echoMiddleware.Gzip())

	// CORS
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	e.Use(middleware.LoadAuthContext())

	api.Bind(app, e)

	return e, nil
}
