package level

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/api/level/store"
	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/labstack/echo/v4"
)

type Level struct {
	ctx   context.Context
	store store.Store
}

func Bind(e *echo.Echo, ctx context.Context, db *sql.DB, queries *sqlc.Queries) {
	level := Level{
		ctx:   ctx,
		store: store.New(ctx, db, queries),
	}
	router := Router{level}
	group := e.Group("/levels")

	// swagger:route GET /levels/{id}/records List ListGetLevel
	//
	// Get Level by Rank
	//
	// Retrieves the level at the given rank on the list
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetLevelResponse
	group.GET("/:id/records", router.GetLevelRecords)
}
