package store

import "github.com/emonadeo/gdol/pkg/model"

func (store Store) FindRecords(levelId int64) ([]model.LevelRecord, error) {
	rows, err := store.Queries.LevelFindRecords(store.Ctx, levelId)
	if err != nil {
		return nil, err
	}
	var records []model.LevelRecord
	for _, r := range rows {
		records = append(records, model.LevelRecord{
			Timestamp:  r.Timestamp.Time.String(),
			Percentage: r.Percentage.Int16,
			Video:      r.Video.String,
			User: model.User{
				Id:          r.UserID,
				Name:        r.Name,
				Nationality: r.Nationality.String,
			},
		})
	}
	return records, nil
}
