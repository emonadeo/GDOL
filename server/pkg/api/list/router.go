package list

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Router struct {
	service Service
}

func (r Router) get(ctx echo.Context) error {
	list, err := r.service.Get(ctx)
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, list)
}
