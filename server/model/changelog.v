module model

pub struct Changelog {
	timestamp string  [required]
	action    string  [required]
	from      i16     [omitempty]
	to        i16     [omitempty]
	reason    string
	level     Level   [required]
	list      []Level [required]
}
