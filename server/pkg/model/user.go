package model

type User struct {
	Id          int64   `json:"id"`
	Name        string  `json:"name"`
	Nationality *string `json:"nationality"`
}

type UserWithScoreAndRank struct {
	User
	Score float64 `json:"score"`
	Rank  int     `json:"rank"`
}
