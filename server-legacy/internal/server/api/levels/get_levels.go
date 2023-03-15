package levels

import (
	"github.com/labstack/echo/v5"
)

func (api api) getLevels(c echo.Context) error {
	levels, err := api.app.Store.Levels.Find(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(200, levels)
}
