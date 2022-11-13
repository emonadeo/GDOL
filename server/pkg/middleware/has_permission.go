package middleware

import "github.com/labstack/echo/v4"

func HasPermission(permission string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// TODO: Check for permission
			hasPermission := true
			if !hasPermission {
				return echo.ErrForbidden
			}

			if err := next(c); err != nil {
				return err
			}
			return nil
		}
	}
}
