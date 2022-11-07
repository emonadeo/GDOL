package user

import (
	"github.com/emonadeo/gdol/pkg/model"
)

func (user User) GetUsers() ([]model.UserWithScore, error) {
	return user.store.FindUsers()
}
