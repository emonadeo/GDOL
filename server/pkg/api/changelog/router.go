package changelog

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Router struct {
	changelog Changelog
}

func (r Router) Get(ctx echo.Context) error {
	changelog, err := r.changelog.Get()
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, changelog)
}
