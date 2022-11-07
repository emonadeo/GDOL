package user

import (
	"github.com/emonadeo/gdol/pkg/model"
)

func (user User) GetUsers() ([]model.UserWithScore, error) {
	return user.store.Find()
}

func (user User) GetUserByName(name string) (model.UserFull, error) {
	return user.store.FindByName(name)
}
