package list

import (
	"github.com/emonadeo/gdol/internal/core"
	"github.com/emonadeo/gdol/internal/server/api/list/archive"
	"github.com/emonadeo/gdol/internal/server/api/list/settings"
	"github.com/labstack/echo/v5"
)

func Bind(app *core.App, group *echo.Group) {
	api := api{app}
	settings.Bind(app, group.Group("/settings"))
	archive.Bind(app, group.Group("/archive"))
	group.GET("", api.getList)
	group.POST("/:rank", api.updateList)
	group.GET("/:rank", api.getLevelByRank)
	group.DELETE("/:rank", api.archiveLevelByRank)
}

type api struct {
	app *core.App
}
