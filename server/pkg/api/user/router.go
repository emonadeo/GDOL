package user

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Router struct {
	user User
}

func (r Router) GetUsers(ctx echo.Context) error {
	users, err := r.user.GetUsers()
	if err != nil {
		return err
	}
	return ctx.JSON(http.StatusOK, users)
}
