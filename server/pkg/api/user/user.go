package user

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/pkg/api/user/store"
	"github.com/emonadeo/gdol/pkg/generated/sqlc"
	"github.com/labstack/echo/v4"
)

type User struct {
	ctx   context.Context
	store store.Store
}

func Bind(e *echo.Echo, ctx context.Context, db *sql.DB, queries *sqlc.Queries) {
	level := User{
		ctx:   ctx,
		store: store.New(ctx, db, queries),
	}
	router := Router{level}
	group := e.Group("/users")

	// swagger:route GET /users User UsersGet
	//
	// Get Users
	//
	// Get all users sorted by score
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetUsersResponse
	group.GET("", router.GetUsers)
}
