package store

import "github.com/emonadeo/gdol/pkg/model"

func (store Store) FindByName(name string) (model.UserFull, error) {
	user, err := store.Queries.UserFindByName(store.Ctx, name)
	if err != nil {
		return model.UserFull{}, err
	}

	// Records
	var records []model.UserRecord
	for i := range user.RecordTimestamps {
		records = append(records, model.UserRecord{
			Timestamp:  user.RecordTimestamps[i],
			Percentage: user.RecordPercentage[i],
			Video:      user.RecordVideo[i],
			Level: model.LevelSlim{
				Id:   user.RecordLevelID[i],
				Name: user.RecordLevelName[i],
			},
		})
	}

	// Levels published
	levels := []model.LevelSlim{}
	for i := range user.PublishedID {
		levels = append(levels, model.LevelSlim{
			Id:   user.PublishedID[i],
			Name: user.PublishedName[i],
		})
	}

	// Levels verified
	levelsVerified := []model.LevelSlim{}
	for i := range user.VerifiedID {
		levelsVerified = append(levels, model.LevelSlim{
			Id:   user.VerifiedID[i],
			Name: user.VerifiedName[i],
		})
	}

	// Levels created
	levelsCreated := []model.LevelSlim{}
	for i := range user.CreatedID {
		levelsCreated = append(levels, model.LevelSlim{
			Id:   user.CreatedID[i],
			Name: user.CreatedName[i],
		})
	}

	res := model.UserFull{
		Id:             user.ID,
		Name:           user.Name,
		Nationality:    user.Nationality.String,
		Score:          user.Score,
		Records:        records,
		Levels:         levels,
		LevelsVerified: levelsVerified,
		LevelsCreated:  levelsCreated,
	}

	return res, nil
}
