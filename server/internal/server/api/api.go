package api

import (
	"github.com/emonadeo/gdol/internal/core"
	"github.com/emonadeo/gdol/internal/server/api/list"
	"github.com/labstack/echo/v5"
)

func Init(app core.App, e *echo.Echo) {
	list.Bind(app, e.Group("/list"))
}
