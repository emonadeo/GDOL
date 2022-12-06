package util

import "database/sql"

// TODO: Move into store

func NullString(v sql.NullString) *string {
	if v.Valid {
		return &v.String
	} else {
		return nil
	}
}

func NullInt16(v sql.NullInt16) *int16 {
	if v.Valid {
		return &v.Int16
	} else {
		return nil
	}
}

func NullInt64(v sql.NullInt64) *int64 {
	if v.Valid {
		return &v.Int64
	} else {
		return nil
	}
}

func StrPtrToNullString(p *string) sql.NullString {
	if p != nil {
		return sql.NullString{
			String: *p,
			Valid:  *p != "",
		}
	}
	return sql.NullString{
		Valid: false,
	}
}
