package list

import "context"

func (l List) Update(ctx context.Context, rank int16, levelId int64, reason *string) error {
	tx, err := l.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	// qtx := l.Qry.WithTx(tx)

	// TODO
	// Steps:
	// Check if level is on list
	// Yes -> Move
	// No -> Insert -> Archive #150

	// Check if level is in archive
	// Yes -> Remove

	return nil
}
