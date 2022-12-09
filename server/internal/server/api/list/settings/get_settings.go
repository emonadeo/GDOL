package settings

import (
	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/labstack/echo/v5"
)

func (api api) getListSettings(c echo.Context) error {
	return c.JSON(200, openapi.ListSettings{
		MaxLength:                &api.app.Store.List.Settings.MaxLength,
		AutoUnarchive:            &api.app.Store.List.Settings.AutoUnarchive,
		OverrideRequirementAfter: api.app.Store.List.Settings.OverrideRequirementAfter,
	})
}
