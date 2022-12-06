package list

import (
	"github.com/labstack/echo/v5"
)

func (api api) getList(c echo.Context) error {
	list, err := api.app.Store.List.Find(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(200, list)
}
