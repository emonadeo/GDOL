package model

type ListLevel struct {
	Id    int32  `json:"id"`
	GdId  int32  `json:"gd_id,omitempty"`
	Name  string `json:"name"`
	User  string `json:"user"`
	Video string `json:"video,omitempty"`
}

type List []ListLevel
