package list

import "github.com/emonadeo/gdol/pkg/model"

func (list List) Get() (model.List, error) {
	return list.store.Find()
}
