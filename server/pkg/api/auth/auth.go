package auth

import (
	"github.com/emonadeo/gdol/pkg/api/auth/routes"
	"github.com/labstack/echo/v4"
)

func Bind(group *echo.Group) {
	group.POST("/login", routes.PostLogin)
	group.GET("/refresh/:token", routes.GetRefresh)
}
