package routes

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

func (r Router) GetLevelByRank(c echo.Context) error {
	levelId, err := strconv.Atoi(c.Param("rank"))
	if err != nil {
		return err
	}
	level, err := r.Store.LevelFindByRank(levelId)
	if err != nil {
		return err
	}
	return c.JSON(200, level)
}
