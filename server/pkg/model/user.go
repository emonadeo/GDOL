package model

type User struct {
	Id          int32  `json:"id"`
	Name        string `json:"name"`
	Nationality string `json:"nationality"`
}
