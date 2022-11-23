package model

type List []Level

type ListUpdate struct {
	Level_id int32  `json:"level_id"`
	Rank     int32  `json:"rank"`
	Reason   string `json:"reason"`
}

type ListArchive struct {
	Reason string `json:"reason"`
}
