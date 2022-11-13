package list

import (
	"github.com/emonadeo/gdol/pkg/api/list/routes"
	"github.com/emonadeo/gdol/pkg/store"
	"github.com/labstack/echo/v4"
)

func Bind(group *echo.Group) {
	store, err := store.New()
	if err != nil {
		panic(err)
	}

	r := routes.Router{Store: store}

	// swagger:route GET /list List ListGet
	//
	// Get Levels on List
	//
	// Retrieves all levels on the list ordered by rank
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetListResponse
	group.GET("", r.Get)

	// swagger:route POST /list List ListUpdate
	//
	// Get Level by Rank
	//
	// Retrieves the level at the given rank on the list
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200:
	group.POST("", r.Post)

	// swagger:route GET /list/{rank} List ListGetLevel
	//
	// Get Level by Rank
	//
	// Retrieves the level at the given rank on the list
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200: GetLevelResponse
	group.GET("/:rank", r.GetLevelByRank)

	// swagger:route DELETE /list/{rank} List ListArchive
	//
	// Get Level by Rank
	//
	// Retrieves the level at the given rank on the list
	//
	// Responses:
	//     default: GenericErrorResponse
	//     200:
	group.DELETE("/:rank", r.Delete)
}
