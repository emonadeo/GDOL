package list

import "github.com/emonadeo/gdol/pkg/model"

// swagger:response
type GetListResponse struct {
	// in: body
	Body model.List
}

// swagger:response
type GetLevelResponse struct {
	// in: body
	Body model.Level
}
