package list

import (
	"github.com/emonadeo/gdol/pkg/model"
)

func (list List) Get() (model.List, error) {
	return list.store.Find()
}

func (list List) GetLevel(rank int) (model.Level, error) {
	return list.store.FindByRank(rank)
}

func (list List) Update(update model.ListUpdate) error {
	return nil
}

func (list List) Archive(rank int16, archive model.ListArchive) error {
	return list.store.Archive(rank, archive)
}
