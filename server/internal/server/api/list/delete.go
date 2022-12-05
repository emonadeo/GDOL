package list

import (
	"strconv"

	"github.com/emonadeo/gdol/internal/model"
	"github.com/labstack/echo/v5"
)

func (api api) delete(c echo.Context) error {
	rank, err := strconv.Atoi(c.PathParam("rank"))
	if err != nil {
		return err
	}
	// TODO: Get Reason from Body
	err = api.app.Store.List.DeleteByRank(c.Request().Context(), int16(rank), model.ListArchive{})
	if err != nil {
		return err
	}
	return c.NoContent(200)
}
