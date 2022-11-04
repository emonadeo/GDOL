package changelog

import (
	"github.com/emonadeo/gdol/pkg/model"
)

func (changelog Changelog) Get() ([]model.Changelog, error) {
	return changelog.store.Find()
}
