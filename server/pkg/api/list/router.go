package list

import (
	"net/http"
	"strconv"

	"github.com/emonadeo/gdol/pkg/model"
	"github.com/labstack/echo/v4"
)

type Router struct {
	list List
}

func (r Router) Get(ctx echo.Context) error {
	list, err := r.list.Get()
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, list)
}

func (r Router) GetLevel(ctx echo.Context) error {
	rank, err := strconv.Atoi(ctx.Param("rank"))
	if err != nil {
		return err
	}

	level, err := r.list.GetLevel(rank)
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, level)
}

func (r Router) Update(ctx echo.Context) error {
	// TODO: Implement
	return nil
}

func (r Router) Archive(ctx echo.Context) error {
	rank, err := strconv.Atoi(ctx.Param("rank"))
	if err != nil {
		return err
	}

	var archive model.ListArchive
	if err := ctx.Bind(&archive); err != nil {
		return err
	}

	return r.list.Archive(int16(rank), archive)
}
