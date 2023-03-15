// No code using echo should be outside this package
package server

import (
	"os"

	"github.com/emonadeo/gdol/internal/core"
	"github.com/emonadeo/gdol/internal/server/api"
	"github.com/emonadeo/gdol/internal/server/middleware"
	"github.com/labstack/echo/v5"
	echoMiddleware "github.com/labstack/echo/v5/middleware"
	"github.com/rs/zerolog"
)

func New(app *core.App) (*echo.Echo, error) {
	e := echo.New()

	// Logger
	// TODO: Implement fully custom Logger
	writer := zerolog.ConsoleWriter{Out: os.Stderr}
	logger := zerolog.New(writer).With().Timestamp().Logger()
	e.Use(echoMiddleware.RequestLoggerWithConfig(echoMiddleware.RequestLoggerConfig{
		LogURI:    true,
		LogStatus: true,
		LogValuesFunc: func(c echo.Context, v echoMiddleware.RequestLoggerValues) error {
			logger.Info().
				Str("Method", v.Method).
				Str("URI", v.URI).
				Int("Status", v.Status).
				Msg("Request")

			return nil
		},
	}))

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
