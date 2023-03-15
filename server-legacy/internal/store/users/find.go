package users

import (
	"context"

	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/emonadeo/gdol/internal/util"
)

func (u Users) Find(ctx context.Context) ([]openapi.UserWithScoreAndRank, error) {
	users, err := u.Qry.UsersFind(ctx)
	if err != nil {
		return nil, err
	}
	var userss []openapi.UserWithScoreAndRank
	for _, user := range users {
		userss = append(userss, openapi.UserWithScoreAndRank{
			Id:          user.ID,
			Name:        user.Name,
			Nationality: util.NullString(user.Nationality),
			Score:       user.Score,
			Rank:        user.Rank,
		})
	}
	return userss, nil
}
