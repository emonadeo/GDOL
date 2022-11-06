package level

import "github.com/emonadeo/gdol/pkg/model"

// swagger:response
type GetLevelRecordsResponse struct {
	// in: body
	Body model.LevelRecord
}
