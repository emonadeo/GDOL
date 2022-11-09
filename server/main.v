module main

import pg
import vweb
import strconv { atoi }

#flag -I/opt/homebrew/opt/libpq/include
#flag -L/opt/homebrew/opt/libpq/lib

const (
	http_port   = 3000
	db_host     = 'localhost'
	db_port     = 5432
	db_user     = 'example'
	db_password = 'example'
	db_name     = 'gdol'
	qry_list    = '
		SELECT levels.id,
			levels.gd_id,
			levels.name,
			users.name as user,
			levels.video
		FROM (
				SELECT *
				FROM list_log
				ORDER BY list_log.timestamp DESC
				LIMIT 1
			) AS latest_list_log,
			UNNEST(list_level_ids) WITH ORDINALITY
			JOIN levels ON levels.id = unnest
			JOIN users ON users.id = levels.user_id
		ORDER BY ordinality ASC;
	'
)

struct App {
	vweb.Context
pub mut:
	db pg.DB
}

pub fn (mut app App) before_request() {
	println('[Web] $app.Context.req.method $app.Context.req.url')
	// CORS
	app.add_header('Access-Control-Allow-Origin', '*')
}

fn main() {
	vweb.run(new_app() or { panic(err) }, http_port)
}

fn new_app() !&App {
	mut app := &App{
		db: pg.connect(pg.Config{
			host: db_host
			port: db_port
			user: db_user
			password: db_password
			dbname: db_name
		}) or { return err }
	}

	return app
}

struct Level {
	id    int
	gd_id int
	name  string
	user  string
	video string
}

['/list'; get]
pub fn (mut app App) ping() ?vweb.Result {
	rows := app.db.exec(qry_list) or { return err }

	mut levels := []Level{}
	for _, row in rows {
		levels << Level{
			id: atoi(row.vals[0]) or { 0 }
			gd_id: atoi(row.vals[1]) or { 0 }
			name: row.vals[2]
			user: row.vals[3]
			video: row.vals[4]
		}
	}
	return app.json<[]Level>(levels)
}
