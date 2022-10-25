package list

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Router struct {
	service Service
}

func (r Router) get(c echo.Context) error {
	list, err := r.service.Get()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, list)
}
