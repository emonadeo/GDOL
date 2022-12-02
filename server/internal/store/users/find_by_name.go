package users

import (
	"context"

	"github.com/emonadeo/gdol/internal/model"
	"github.com/emonadeo/gdol/internal/util"
)

func (u Users) FindByName(ctx context.Context, name string) (model.UserWithScoreAndRank, error) {
	user, err := u.Qry.UsersFindByName(ctx, name)
	if err != nil {
		return model.UserWithScoreAndRank{}, err
	}

	// TODO: Records
	// var records []model.RecordWithLevel
	// for i := range user.RecordTimestamps {
	// 	records = append(records, model.RecordWithLevel{
	// 		Record: model.Record{
	// 			Timestamp:  user.RecordTimestamps[i],
	// 			Percentage: int16(user.RecordPercentage[i]),
	// 			Video:      user.RecordVideo[i],
	// 		},
	// 		Level: model.Level{
	// 			Id:   user.RecordLevelID[i],
	// 			Name: user.RecordLevelName[i],
	// 		},
	// 	})
	// }

	// TODO: Levels published
	// levels := []model.Level{}
	// for i := range user.PublishedID {
	// 	levels = append(levels, model.Level{
	// 		Id:   user.PublishedID[i],
	// 		Name: user.PublishedName[i],
	// 	})
	// }

	// TODO: Levels verified
	// levelsVerified := []model.Level{}
	// for i := range user.VerifiedID {
	// 	levelsVerified = append(levels, model.Level{
	// 		Id:   user.VerifiedID[i],
	// 		Name: user.VerifiedName[i],
	// 	})
	// }

	// TODO: Levels created
	// levelsCreated := []model.Level{}
	// for i := range user.CreatedID {
	// 	levelsCreated = append(levels, model.Level{
	// 		Id:   user.CreatedID[i],
	// 		Name: user.CreatedName[i],
	// 	})
	// }

	res := model.UserWithScoreAndRank{
		User: model.User{
			Id:          user.ID,
			Name:        user.Name,
			Nationality: util.NullString(user.Nationality),
		},
		Score: user.Score,
		Rank:  user.Rank,
		// Records: records,
		// Levels:  levels,
		// LevelsVerified: levelsVerified,
		// LevelsCreated:  levelsCreated,
	}

	return res, nil
}
