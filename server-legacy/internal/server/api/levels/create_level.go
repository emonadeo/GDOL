package levels

import (
	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/labstack/echo/v5"
)

func (api api) createLevel(c echo.Context) error {
	update := new(openapi.CreateLevelJSONRequestBody)
	if err := c.Bind(update); err != nil {
		return err
	}

	err := api.app.Store.Levels.Create(c.Request().Context(), *update)
	if err != nil {
		return err
	}

	return nil
}
