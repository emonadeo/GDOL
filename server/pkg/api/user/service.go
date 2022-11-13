package user

import (
	"github.com/emonadeo/gdol/pkg/model"
)

func (user User) GetUsers() ([]model.UserWithScoreAndRank, error) {
	return user.store.Find()
}

func (user User) GetUserByName(name string) (model.UserWithScoreAndRank, error) {
	return user.store.FindByName(name)
}
