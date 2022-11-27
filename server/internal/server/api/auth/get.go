package auth

import (
	"github.com/emonadeo/gdol/internal/auth"
	"github.com/emonadeo/gdol/internal/discord"
	"github.com/labstack/echo/v5"
)

func (api api) get(c echo.Context) error {
	code := c.QueryParam("code")
	if code == "" {
		// TODO: Use normalized error response format
		return c.NoContent(400)
	}

	userId, err := discord.GetIdFromCode(code)
	if err != nil {
		// TODO: This error can have multiple causes. More differentiation is needed.
		// Usually this is when the code is incorrect, but it can also be an internal error.
		return c.NoContent(400)
	}

	// TODO: Fetch roles from db
	auth := auth.CreateToken(userId, []string{})

	return c.JSON(200, auth)
}
