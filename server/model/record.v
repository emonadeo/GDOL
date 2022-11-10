module model

pub struct Record {
	timestamp  string [required]
	percentage i16    [required]
	video      string
}

pub struct RecordWithLevel {
	Record
	level Level [required]
}

pub struct RecordWithUser {
	Record
	user User [required]
}
