package list

import (
	"strconv"

	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/labstack/echo/v5"
)

func (api api) updateList(c echo.Context) error {
	rank, err := strconv.Atoi(c.PathParam("rank"))
	if err != nil {
		return err
	}

	update := new(openapi.UpdateListJSONRequestBody)
	if err := c.Bind(update); err != nil {
		return err
	}

	err = api.app.Store.List.Update(c.Request().Context(), int16(rank), update.LevelId, update.Reason)
	if err != nil {
		return err
	}

	return nil
}
