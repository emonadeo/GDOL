package util

import "github.com/labstack/echo/v4"

func Route(route func(c echo.Context) (interface{}, error)) func(c echo.Context) error {
	return func(c echo.Context) error {
		res, err := route(c)
		if err != nil {
			return err
		}
		return c.JSON(200, res)
	}
}
