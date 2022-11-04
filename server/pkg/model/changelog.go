package model

type ChangelogLevel struct {
	Id   int32  `json:"id"`
	Name string `json:"name"`
	// GdId  int32  `json:"gd_id"`
	// Video string `json:"video"`
}

type Changelog struct {
	Timestamp string           `json:"timestamp"`
	Action    string           `json:"action"`
	From      int32            `json:"from,omitempty"`
	To        int32            `json:"to,omitempty"`
	Reason    string           `json:"reason,omitempty"`
	Level     ChangelogLevel   `json:"level"`
	List      []ChangelogLevel `json:"list"`
}
