package level

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Router struct {
	level Level
}

func (r Router) GetLevelRecords(ctx echo.Context) error {
	levelId, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return err
	}
	records, err := r.level.GetLevelRecords(int64(levelId))
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, records)
}
