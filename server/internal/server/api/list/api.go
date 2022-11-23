package list

import (
	"github.com/emonadeo/gdol/internal/core"
	"github.com/labstack/echo/v5"
)

func Bind(app core.App, group *echo.Group) {
	api := api{app}
	group.GET("", api.get)
	group.POST("", api.post)
	group.GET("/:rank", api.getLevelByRank)
	group.DELETE("/:rank", api.delete)
}

type api struct {
	app core.App
}
