package changelog

import (
	"context"

	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/emonadeo/gdol/internal/util"
)

func (c Changelog) Find(ctx context.Context) ([]openapi.Changelog, error) {
	entries, err := c.Qry.ChangelogFind(ctx)
	if err != nil {
		return nil, err
	}

	var entriess []openapi.Changelog
	for _, entry := range entries {
		var list []openapi.Level
		for i, id := range entry.ListLevelIds {
			list = append(list, openapi.Level{
				Id:   id,
				Name: entry.ListLevelNames[i],
			})
		}

		entriess = append(entriess, openapi.Changelog{
			Timestamp: entry.Timestamp,
			Action:    openapi.ChangelogAction(entry.Action),
			From:      util.NullInt16(entry.From),
			To:        util.NullInt16(entry.To),
			Reason:    util.NullString(entry.Reason),
			Level: openapi.Level{
				Id:   entry.LevelID,
				Name: entry.LevelName,
			},
			List: list,
		})
	}
	return entriess, nil
}
