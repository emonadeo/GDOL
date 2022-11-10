module api

import vweb
import pg
import db

struct Api {
	vweb.Context
pub mut:
	db pg.DB
}

pub fn new(config pg.Config) !&Api {
	mut api := &Api{
		db: db.connect(config) or { return err }
	}

	return api
}

pub fn (mut api Api) before_request() {
	println('[Vweb] $api.Context.req.method $api.Context.req.url')
	// CORS
	api.add_header('Access-Control-Allow-Origin', '*')
}

// TODO: Remove
fn (mut api Api) not_implemented() vweb.Result {
	api.set_status(501, 'Not Implemented')
	return api.text('501 Not Implemented')
}
