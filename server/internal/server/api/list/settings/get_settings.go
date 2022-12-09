package settings

import (
	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/labstack/echo/v5"
)

func (api api) getListSettings(c echo.Context) error {
	// TODO
	maxLength := 150
	autoUnarchive := true
	overrideRequirementAfter := 75

	return c.JSON(200, openapi.ListSettings{
		MaxLength:                &maxLength,
		AutoUnarchive:            &autoUnarchive,
		OverrideRequirementAfter: &overrideRequirementAfter,
	})
}
