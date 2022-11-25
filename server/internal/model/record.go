package model

type Record struct {
	Timestamp  string  `json:"timestamp"`
	Percentage int16   `json:"percentage"`
	Video      *string `json:"video"`
}

type RecordWithUser struct {
	Record
	User User `json:"user"`
}

type RecordWithLevel struct {
	Record
	Level Level `json:"level"`
}
