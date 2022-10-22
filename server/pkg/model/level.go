package model

type Level struct {
	Id       int32  `json:"id"`
	GdId     int32  `json:"gd_id,omitempty"`
	Name     string `json:"name"`
	Rank     int32  `json:"rank,omitempty"`
	User     User   `json:"user"`
	Verifier User   `json:"verifier"`
	Creators []User `json:"creators"`
	Video    string `json:"video"`
}
