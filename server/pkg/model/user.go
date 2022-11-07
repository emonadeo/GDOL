package model

type User struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Nationality string `json:"nationality,omitempty"`
}

type UserWithScore struct {
	Id          int64   `json:"id"`
	Name        string  `json:"name"`
	Nationality string  `json:"nationality,omitempty"`
	Score       float64 `json:"score"`
}
