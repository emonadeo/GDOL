module api

import vweb
import strconv { atoi }
import model
import list

['/list'; get]
pub fn (mut api Api) get_list() vweb.Result {
	list := list.get_list(api.db) or { return api.server_error(500) }
	return api.json<[]model.Level>(list)
}

['/list/:rank'; get]
pub fn (mut api Api) get_level_by_rank(rank string) vweb.Result {
	irank := atoi(rank) or { return api.server_error(400) }
	level := list.get_level_by_rank(api.db, irank) or { return api.server_error(500) }
	return api.json<model.Level>(level)
}
