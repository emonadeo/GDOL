package auth

import (
	"github.com/emonadeo/gdol/internal/model"
	"github.com/labstack/echo/v5"
)

func (api api) postRefresh(c echo.Context) error {

	auth := model.Auth{
		AccessToken:  "",
		RefreshToken: "",
	}

	return c.JSON(200, auth)
}
