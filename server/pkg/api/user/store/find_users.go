package store

import "github.com/emonadeo/gdol/pkg/model"

func (store Store) FindUsers() ([]model.UserWithScore, error) {
	users, err := store.Queries.GetUsers(store.Ctx)
	if err != nil {
		return nil, err
	}
	var userss []model.UserWithScore
	for _, user := range users {
		userss = append(userss, model.UserWithScore{
			Id:          user.ID,
			Name:        user.Name,
			Nationality: user.Nationality.String,
			Score:       user.Score,
		})
	}
	return userss, nil
}
