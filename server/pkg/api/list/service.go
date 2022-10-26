package list

import (
	"github.com/emonadeo/gdol/pkg/model"
	"github.com/labstack/echo/v4"
)

func (list List) Get(ctx echo.Context) (model.List, error) {
	return list.store.Find()
}
