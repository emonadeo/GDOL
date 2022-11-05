package model

type Level struct {
	Id       int64  `json:"id"`
	GdId     int64  `json:"gd_id,omitempty"`
	Name     string `json:"name"`
	Rank     int32  `json:"rank,omitempty"`
	User     User   `json:"user"`
	Verifier User   `json:"verifier"`
	Creators []User `json:"creators"`
	Video    string `json:"video"`
}
