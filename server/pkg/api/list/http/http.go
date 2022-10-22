package list

import (
	"net/http"

	"github.com/emonadeo/gdol/pkg/api/list"
	"github.com/labstack/echo/v4"
)

type HTTP struct {
	service list.Service
}

func NewHTTP(service list.Service, r *echo.Group) {
	h := HTTP{service}
	g := r.Group("/list")
	g.GET("", h.get)
}

func (h HTTP) get(c echo.Context) error {
	list, err := h.service.Get(c)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, list)
}
