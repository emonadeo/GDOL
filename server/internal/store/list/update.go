package list

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
	"github.com/emonadeo/gdol/internal/util"
)

func (l List) Update(ctx context.Context, rank int16, levelId int64, reason *string) error {
	tx, err := l.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	qtx := l.Qry.WithTx(tx)

	listLevelIds, err := qtx.ListUpdateFindCurrentListLevelIds(ctx)
	if err != nil {
		return err
	}

	from := sql.NullInt16{}
	action := sqlc.ListLogActionAdd

	// Check if level is on the list
	if i := indexOf(listLevelIds, levelId); i != -1 {
		// Set action to 'move'
		action = sqlc.ListLogActionMove
		// Remove level from the list
		listLevelIds = append(listLevelIds[:i], listLevelIds[i+1:]...)
		// Update 'from'
		from = sql.NullInt16{
			Int16: i + 1,
			Valid: true,
		}
	}

	// Insert level into list
	listLevelIds = append(listLevelIds[:rank], listLevelIds[rank-1:]...)
	listLevelIds[rank-1] = levelId

	// Trim to max_length
	if len(listLevelIds) > int(l.Settings.MaxLength) {
		listLevelIds = listLevelIds[:l.Settings.MaxLength]
	}

	// Remove level from Archive (Doesn't error if level isn't in the archive)
	err = qtx.ListUpdateDeleteArchive(ctx, levelId)
	if err != nil {
		return err
	}

	// Persist Insert
	err = qtx.ListUpdateInsert(ctx, sqlc.ListUpdateInsertParams{
		ListLevelIds: listLevelIds,
		Action:       action,
		LevelID:      levelId,
		From:         from,
		To: sql.NullInt16{
			Int16: rank,
			Valid: true,
		},
		Reason: util.StrPtrToNullString(reason),
	})
	if err != nil {
		return err
	}

	// Push overflowing level to archive
	if len(listLevelIds) > int(l.Settings.MaxLength) {
		qtx.ListUpdateInsertArchive(ctx, listLevelIds[len(listLevelIds)-1])
	}

	tx.Commit()
	return nil
}

func indexOf(slice []int64, id int64) int16 {
	for i := int16(0); i < int16(len(slice)); i++ {
		if slice[i] == id {
			return i
		}
	}
	return -1
}
