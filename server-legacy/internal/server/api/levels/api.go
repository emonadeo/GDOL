package levels

import (
	"github.com/emonadeo/gdol/internal/core"
	"github.com/labstack/echo/v5"
)

func Bind(app *core.App, group *echo.Group) {
	api := api{app}
	group.POST("", api.createLevel)
	group.GET("", api.getLevels)
	group.GET("/:id/records", api.getRecordsByLevelId)
}

type api struct {
	app *core.App
}
