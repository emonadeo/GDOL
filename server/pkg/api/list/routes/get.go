package routes

import (
	"github.com/labstack/echo/v4"
)

func (r Router) Get(c echo.Context) error {
	list, err := r.Store.ListFind()
	if err != nil {
		return err
	}
	return c.JSON(200, list)
}
