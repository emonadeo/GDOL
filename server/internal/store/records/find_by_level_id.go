package records

import (
	"context"

	"github.com/emonadeo/gdol/internal/model"
	"github.com/emonadeo/gdol/internal/util"
)

func (r Records) FindByLevelId(ctx context.Context, levelId int64) ([]model.RecordWithUser, error) {
	rows, err := r.Qry.RecordsFindByLevelId(ctx, levelId)
	if err != nil {
		return nil, err
	}
	records := []model.RecordWithUser{}
	for _, row := range rows {
		records = append(records, model.RecordWithUser{
			Record: model.Record{
				Timestamp:  row.Timestamp.String(), // TODO: Figure out how timestamps are handled in Go
				Percentage: row.Percentage,
				Video:      util.NullString(row.Video),
			},
			User: model.User{
				Id:          row.UserID,
				Name:        row.UserName,
				Nationality: util.NullString(row.UserNationality),
			},
		})
	}
	return records, nil
}
