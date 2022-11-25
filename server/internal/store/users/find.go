package users

import (
	"context"

	"github.com/emonadeo/gdol/internal/model"
	"github.com/emonadeo/gdol/internal/util"
)

func (u Users) Find(ctx context.Context) ([]model.UserWithScoreAndRank, error) {
	users, err := u.Qry.UsersFind(ctx)
	if err != nil {
		return nil, err
	}
	var userss []model.UserWithScoreAndRank
	for _, user := range users {
		userss = append(userss, model.UserWithScoreAndRank{
			User: model.User{
				Id:          user.ID,
				Name:        user.Name,
				Nationality: util.NullString(user.Nationality),
			},
			Score: user.Score,
		})
	}
	return userss, nil
}
