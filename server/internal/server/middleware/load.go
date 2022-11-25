package middleware

import "github.com/labstack/echo/v5"

// TODO
func LoadAuthContext() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			token := c.Request().Header.Get("Authorization")
			if token == "" {
				return next(c)
			}
			return next(c)
		}
	}
}
