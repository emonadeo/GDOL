module list

import model
import pg
import strconv { atoi }

pub fn get_list(db pg.DB) ![]model.Level {
	level_rows := db.exec(qry_list) or { return err }
	mut levels := []model.Level{}
	for _, level in level_rows {
		level_id := atoi(level.vals[0]) or { 0 }
		levels << model.Level{
			id: level_id
			name: level.vals[1]
			gd_id: atoi(level.vals[2]) or { 0 }
			video: level.vals[3]
			requirement: i16(atoi(level.vals[4]) or { 100 })
			creators: get_creators_by_level_id(db, level_id) or { return err }
			user: model.User{
				id: atoi(level.vals[5]) or { 0 }
				name: level.vals[6]
				nationality: level.vals[7]
			}
			verifier: model.User{
				id: atoi(level.vals[8]) or { 0 }
				name: level.vals[9]
				nationality: level.vals[10]
			}
		}
	}
	return levels
}

pub fn get_level_by_rank(db pg.DB, rank int) !model.Level {
	level_rows := db.exec_param(qry_level_by_rank, rank.str()) or { return err }
	vals := level_rows[0].vals
	level_id := atoi(vals[0]) or { 0 }
	return model.Level{
		id: level_id
		name: vals[1]
		gd_id: atoi(vals[2]) or { 0 }
		video: vals[3]
		requirement: i16(atoi(vals[4]) or { 100 })
		creators: get_creators_by_level_id(db, level_id) or { return err }
		user: model.User{
			id: atoi(vals[5]) or { 0 }
			name: vals[6]
			nationality: vals[7]
		}
		verifier: model.User{
			id: atoi(vals[8]) or { 0 }
			name: vals[9]
			nationality: vals[10]
		}
	}
}

fn get_creators_by_level_id(db pg.DB, level_id int) ![]model.User {
	creator_rows := db.exec_param(qry_creators, level_id.str()) or { return err }
	mut creators := []model.User{}
	for _, creator_row in creator_rows {
		creators << model.User{
			id: atoi(creator_row.vals[0]) or { 0 }
			name: creator_row.vals[1]
			nationality: creator_row.vals[1]
		}
	}
	return creators
}
