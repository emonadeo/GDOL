package list

import (
	"context"

	"github.com/emonadeo/gdol/pkg/api/list/store"
	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/emonadeo/gdol/pkg/model"
	"github.com/labstack/echo/v4"
)

type Service interface {
	Get(echo.Context) (model.List, error)
}

func New(c context.Context, db sqlc.DBTX, store Store) *List {
	return &List{c, db, store}
}

func Initialize(c context.Context, db sqlc.DBTX) *List {
	return New(c, db, store.List{})
}

type List struct {
	c     context.Context
	db    sqlc.DBTX
	store Store
}

type Store interface {
	Get(c context.Context, db sqlc.DBTX) (model.List, error)
}
