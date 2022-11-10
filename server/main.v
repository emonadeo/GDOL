module main

import api
import pg
import vweb

#flag -I/opt/homebrew/opt/libpq/include
#flag -L/opt/homebrew/opt/libpq/lib

const (
	http_port = 3000
	db_config = pg.Config{
		host: 'localhost'
		port: 5432
		user: 'example'
		password: 'example'
		dbname: 'gdol'
	}
)

fn main() {
	vweb.run(api.new(db_config) or { panic(err) }, http_port)
}
