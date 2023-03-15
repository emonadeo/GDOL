package archive

import (
	"github.com/labstack/echo/v5"
)

func (api api) getListArchive(c echo.Context) error {
	levels, err := api.app.Store.List.Archive.Find(c.Request().Context())
	if err != nil {
		return err
	}
	return c.JSON(200, levels)
}
