package list

import (
	"context"

	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/emonadeo/gdol/pkg/model"
	"github.com/labstack/echo/v4"
)

type List struct {
	ctx   context.Context
	db    sqlc.DBTX
	store Store
}

type Service interface {
	Get(ctx echo.Context) (model.List, error)
}

// swagger:response GetListResponse
type GetListResponse []struct {
	Id    int    `json:"id"`
	GdId  int    `json:"gd_id"`
	Name  string `json:"name"`
	User  string `json:"user"`
	Video string `json:"video"`
}

func Bind(e *echo.Echo, ctx context.Context, db sqlc.DBTX) {
	list := List{
		ctx:   ctx,
		db:    db,
		store: Store{Ctx: ctx, DB: db},
		// TODO DRY
	}
	router := Router{service: list}
	group := e.Group("/list")

	// swagger:route GET /list List GetList
	//
	// Get Levels on List
	//
	// Retrieves all levels on the list ordered by rank
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetListResponse
	group.GET("", router.get)
}
