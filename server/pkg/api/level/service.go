package level

import (
	"github.com/emonadeo/gdol/pkg/model"
)

func (level Level) GetLevelRecords(levelId int64) ([]model.LevelRecord, error) {
	return level.store.FindRecords(levelId)
}
