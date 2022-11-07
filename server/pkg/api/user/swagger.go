package user

import "github.com/emonadeo/gdol/pkg/model"

// swagger:response
type GetUsersResponse struct {
	// in: body
	Body []model.User
}
