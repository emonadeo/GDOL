import list from './_seed_data/_list.json' assert { type: 'json' };
import { Database } from './deps.ts';

const _json = { assert: { type: 'json' } } as const;
const _seed_data_dir = '_seed_data';

type User = {
	banned: boolean;
	id: number;
	name: string;
};

type Nationality = {
	country_code: string;
	nation: string;
	subdivision?: string;
};

type Record = {
	id: number;
	progress: number;
	status: 'approved' | 'rejected' | 'submitted' | 'under consideration';
	video?: string;
	player: User;
	nationality?: Nationality;
};

type Level = {
	name: string;
	position?: number;
	id: number;
	requirement: number;
	video?: string;
	level_id?: number;
	verifier: User;
	creators: User[];
	publisher: User;
	records: Record[];
	thumbnail?: string;
};

export async function seed(db: Database) {
	const level_ids: number[] = [];
	for (const file_id of list) {
		const level = (await import(`./${_seed_data_dir}/${file_id}.json`, _json)).default as Level;
		const level_id = seed_level(db, level);
		level_ids.push(level_id);

		db.prepare(
			`INSERT INTO list_log ("list_level_ids", "timestamp", "action", "level_id", "to", "reason")
		 VALUES (:list_level_ids, unixepoch('now'), :action, :level_id, :to, :reason)`
		).run({
			list_level_ids: JSON.stringify(level_ids),
			action: 'ADD',
			level_id,
			to: level_ids.length,
			reason: 'Seeded',
		});
	}
}

function seed_level(db: Database, level: Level): number {
	const publisher_id = seed_user(db, level.publisher);
	const verifier_id = seed_user(db, level.verifier);
	const creator_ids = level.creators.map((creator) => seed_user(db, creator));

	const result = db
		.prepare(
			`INSERT INTO levels (name, gd_id, user_id, verifier_id, video, requirement)
				  VALUES (:name, :gd_id, :user_id, :verifier_id, :video, :requirement) RETURNING id`
		)
		.value<[number]>({
			name: level.name,
			gd_id: level.level_id,
			user_id: publisher_id,
			verifier_id,
			video: level.video,
			requirement: level.requirement,
		});

	if (result === undefined) {
		console.error('inserting level returned undefined id');
		return -1;
	}

	const [id] = result;

	// seed creators
	creator_ids.forEach((creator_id) => seed_user_created_level(db, creator_id, id));

	// seed records
	level.records.forEach((record) => seed_record(db, id, record));

	return id;
}

function seed_record(db: Database, level_id: number, record: Record): void {
	const user_id = seed_user(db, record.player);
	db.prepare(
		`INSERT INTO records (timestamp, percentage, video, user_id, level_id)
		 VALUES (unixepoch('now'), :percentage, :video, :user_id, :level_id)`
	).run({
		percentage: record.progress,
		video: record.video,
		user_id,
		level_id,
	});
}

function seed_user_created_level(db: Database, user_id: number, level_id: number): void {
	db.prepare('INSERT INTO user_created_level (user_id, level_id) VALUES (?, ?)').run(
		user_id,
		level_id
	);
}

function seed_user(db: Database, user: User): number {
	const find_result = db.prepare('SELECT id FROM users WHERE name = ?').value<[number]>(user.name);

	if (find_result !== undefined) {
		return find_result[0];
	}

	const insert_result = db
		.prepare(`INSERT INTO users (name) VALUES (?) RETURNING id`)
		.value<[number]>(user.name);

	if (insert_result === undefined) {
		console.error('inserting user returned undefined id');
		return -1;
	}

	const [id] = insert_result;
	return id;
}
