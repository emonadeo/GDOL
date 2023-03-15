package records

import (
	"context"

	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/emonadeo/gdol/internal/util"
)

func (r Records) FindByLevelId(ctx context.Context, levelId int64) ([]openapi.RecordWithUser, error) {
	rows, err := r.Qry.RecordsFindByLevelId(ctx, levelId)
	if err != nil {
		return nil, err
	}
	records := []openapi.RecordWithUser{}
	for _, row := range rows {
		records = append(records, openapi.RecordWithUser{
			Timestamp:  row.Timestamp,
			Percentage: row.Percentage,
			Video:      util.NullString(row.Video),
			User: openapi.User{
				Id:          row.UserID,
				Name:        row.UserName,
				Nationality: util.NullString(row.UserNationality),
			},
		})
	}
	return records, nil
}
