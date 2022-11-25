package users

import (
	"github.com/labstack/echo/v5"
)

func (api api) getByName(c echo.Context) error {
	name := c.PathParam("name")
	level, err := api.app.Store.Users.FindByName(c.Request().Context(), name)
	if err != nil {
		return err
	}
	return c.JSON(200, level)
}
