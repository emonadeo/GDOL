module model

pub struct User {
	id          i64    [required]
	name        string [required]
	nationality string
}

pub struct UserWithScoreAndRank {
	User
	score f32 [required]
	rank  i16 [required]
}
