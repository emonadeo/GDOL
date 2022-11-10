module db

import pg

pub fn connect(options pg.Config) !pg.DB {
	return pg.connect(options)
}
