package changelog

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/api/changelog/store"
	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/labstack/echo/v4"
)

type Changelog struct {
	ctx   context.Context
	store store.Store
}

func Bind(e *echo.Echo, ctx context.Context, db *sql.DB, queries *sqlc.Queries) {
	changelog := Changelog{
		ctx:   ctx,
		store: store.New(ctx, db, queries),
	}
	router := Router{changelog}
	group := e.Group("/changelog")

	// swagger:route GET /changelog Changelog ChangelogGet
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetChangelogResponse
	group.GET("", router.Get)
}
