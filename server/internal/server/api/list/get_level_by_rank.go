package list

import (
	"strconv"

	"github.com/labstack/echo/v5"
)

func (api api) getLevelByRank(c echo.Context) error {
	levelId, err := strconv.Atoi(c.PathParam("rank"))
	if err != nil {
		return err
	}
	level, err := api.app.Store.LevelFindByRank(c.Request().Context(), levelId)
	if err != nil {
		return err
	}
	return c.JSON(200, level)
}
