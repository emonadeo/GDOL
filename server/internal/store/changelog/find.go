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
		var afterLevels []openapi.Level
		for i, id := range entry.ListAfterLevelIds {
			afterLevels = append(afterLevels, openapi.Level{
				Id:   id,
				Name: entry.ListAfterLevelNames[i],
			})
		}

		var beforeLevels []openapi.Level
		for i, id := range entry.ListBeforeLevelIds {
			beforeLevels = append(beforeLevels, openapi.Level{
				Id:   id,
				Name: entry.ListBeforeLevelNames[i],
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
			List:       afterLevels,
			ListBefore: beforeLevels,
		})
	}
	return entriess, nil
}
