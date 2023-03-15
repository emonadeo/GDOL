package api

import (
	"github.com/emonadeo/gdol/internal/core"
	"github.com/emonadeo/gdol/internal/server/api/auth"
	"github.com/emonadeo/gdol/internal/server/api/changelog"
	"github.com/emonadeo/gdol/internal/server/api/levels"
	"github.com/emonadeo/gdol/internal/server/api/list"
	"github.com/emonadeo/gdol/internal/server/api/users"
	"github.com/labstack/echo/v5"
)

func Bind(app *core.App, e *echo.Echo) {
	auth.Bind(app, e.Group("/auth"))
	changelog.Bind(app, e.Group("/changelog"))
	levels.Bind(app, e.Group("/levels"))
	list.Bind(app, e.Group("/list"))
	users.Bind(app, e.Group("/users"))
}
