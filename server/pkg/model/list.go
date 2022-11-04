package model

type ListLevel struct {
	Id    int32  `json:"id"`
	GdId  int32  `json:"gd_id,omitempty"`
	Name  string `json:"name"`
	User  string `json:"user"`
	Video string `json:"video,omitempty"`
}

type List []ListLevel

type ListUpdate struct {
	Level_id int32  `json:"level_id"`
	Rank     int32  `json:"rank"`
	Reason   string `json:"reason"`
}

type ListArchive struct {
	Reason string `json:"reason"`
}
