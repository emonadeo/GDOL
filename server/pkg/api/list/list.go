package list

import (
	"context"

	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/emonadeo/gdol/pkg/model"
	"github.com/labstack/echo/v4"
)

type List struct {
	c     context.Context
	db    sqlc.DBTX
	store Store
}

type Service interface {
	Get() (model.List, error)
}

func Bind(e *echo.Echo, ctx context.Context, db sqlc.DBTX) {
	list := List{
		c:     ctx,
		db:    db,
		store: Store{Ctx: ctx, DB: db},
		// TODO
	}
	router := Router{list}
	group := e.Group("/list")
	group.GET("", router.get)
}
