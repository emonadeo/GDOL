package list

import (
	"context"

	"github.com/emonadeo/gdol/pkg/api/list/store"
	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/labstack/echo/v4"
)

type List struct {
	ctx   context.Context
	store store.Store
}

func Bind(e *echo.Echo, ctx context.Context, db sqlc.DBTX, queries *sqlc.Queries) {
	list := List{
		ctx:   ctx,
		store: store.New(ctx, db, queries),
	}
	router := Router{list}
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
	group.GET("", router.Get)

	// swagger:route GET /list/{rank} List GetList
	//
	// Get Level by Rank
	//
	// Retrieves the level at the given rank on the list
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetLevelResponse
	group.GET("/:rank", router.GetLevel)
}
