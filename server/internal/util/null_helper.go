package util

import (
	"database/sql"
	"encoding/json"
)

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

// TODO: Clean up
// https://www.calhoun.io/how-to-determine-if-a-json-key-has-been-set-to-null-or-not-provided/
type JSONPatchInt16 struct {
	Value *int16
	Set   bool
}

func (i *JSONPatchInt16) UnmarshalJSON(data []byte) error {
	// If this method was called, the value was set.
	i.Set = true

	if string(data) == "null" {
		// The key was set to null
		i.Value = nil
		return nil
	}

	// The key isn't set to null
	var temp int16
	if err := json.Unmarshal(data, &temp); err != nil {
		return err
	}
	i.Value = &temp
	return nil
}
