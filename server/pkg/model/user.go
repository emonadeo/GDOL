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

type UserFull struct {
	Id             int64        `json:"id"`
	Name           string       `json:"name"`
	Nationality    string       `json:"nationality,omitempty"`
	Score          float64      `json:"score"`
	Records        []UserRecord `json:"records"`
	Levels         []LevelSlim  `json:"levels"`
	LevelsVerified []LevelSlim  `json:"levels_verified"`
	LevelsCreated  []LevelSlim  `json:"levels_created"`
}

type UserRecord struct {
	Timestamp  string    `json:"timestamp"`
	Percentage int32     `json:"percentage"`
	Video      string    `json:"video"`
	Level      LevelSlim `json:"level"`
}
