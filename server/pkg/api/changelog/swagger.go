package changelog

import "github.com/emonadeo/gdol/pkg/model"

// swagger:response
type GetChangelogResponse struct {
	// in: body
	Body struct {
		action string
		list   model.List
	}
}
