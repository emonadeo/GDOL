package levels

import (
	"strconv"

	"github.com/labstack/echo/v5"
)

func (api api) getRecordsByLevelId(c echo.Context) error {
	levelId, err := strconv.Atoi(c.PathParam("id"))
	if err != nil {
		return err
	}
	list, err := api.app.Store.RecordsFindByLevelId(c.Request().Context(), int64(levelId))
	if err != nil {
		return err
	}
	return c.JSON(200, list)
}
