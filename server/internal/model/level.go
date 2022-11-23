package model

type Level struct {
	Id          int64   `json:"id"`
	Name        string  `json:"name"`
	GdId        *int64  `json:"gd_id"`
	Video       *string `json:"video"`
	Requirement *int16  `json:"requirement"`
	User        User    `json:"user"`
	Verifier    User    `json:"verifier"`
	Creators    []User  `json:"creators"`
}

type LevelWithRank struct {
	Level
	Rank int32 `json:"rank"`
}
