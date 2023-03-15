package list

import (
	"strconv"

	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/labstack/echo/v5"
)

func (api api) archiveLevelByRank(c echo.Context) error {
	rank, err := strconv.Atoi(c.PathParam("rank"))
	if err != nil {
		return err
	}

	archive := new(openapi.ArchiveLevelByListRankJSONRequestBody)
	if err := c.Bind(archive); err != nil {
		return err
	}

	err = api.app.Store.List.DeleteByRank(c.Request().Context(), int16(rank), *archive)
	if err != nil {
		return err
	}
	return c.NoContent(200)
}
