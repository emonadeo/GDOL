module model

pub struct Level {
	id          i64    [required]
	name        string [required]
	gd_id       i64    [required]
	video       string
	requirement i16    [required]
	user        User   [required]
	verifier    User   [required]
	creators    []User [required]
}

pub struct LevelWithRank {
	Level
	rank i16 [required]
}
