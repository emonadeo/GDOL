package model

type Changelog struct {
	Timestamp string  `json:"timestamp"`
	Action    string  `json:"action"`
	From      *int16  `json:"from"`
	To        *int16  `json:"to"`
	Reason    *string `json:"reason"`
	Level     Level   `json:"level"`
	List      []Level `json:"list"`
}
