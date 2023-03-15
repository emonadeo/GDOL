package auth

import (
	"github.com/emonadeo/gdol/internal/core"
	"github.com/labstack/echo/v5"
)

func Bind(app *core.App, group *echo.Group) {
	api := api{app}
	group.GET("", api.get)
	group.POST("/refresh", api.postRefresh)
}

type api struct {
	app *core.App
}
