package list

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/api/list/store"
	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/labstack/echo/v4"
)

type List struct {
	ctx   context.Context
	store store.Store
}

func Bind(e *echo.Echo, ctx context.Context, db *sql.DB, queries *sqlc.Queries) {
	list := List{
		ctx:   ctx,
		store: store.New(ctx, db, queries),
	}
	router := Router{list}
	group := e.Group("/list")

	// swagger:route GET /list List ListGet
	//
	// Get Levels on List
	//
	// Retrieves all levels on the list ordered by rank
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetListResponse
	group.GET("", router.Get)

	// swagger:route GET /list/{rank} List ListGetLevel
	//
	// Get Level by Rank
	//
	// Retrieves the level at the given rank on the list
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetLevelResponse
	group.GET("/:rank", router.GetLevel)

	// swagger:route POST /list List ListUpdate
	//
	// Get Level by Rank
	//
	// Retrieves the level at the given rank on the list
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200:
	group.POST("", router.Update)

	// swagger:route DELETE /list/{rank} List ListArchive
	//
	// Get Level by Rank
	//
	// Retrieves the level at the given rank on the list
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200:
	group.DELETE("/:rank", router.Archive)
}
