import { Command, Database, databasePath } from '../deps.ts';
import { Gdol } from '../mod.ts';

export const seed = new Command()
	.description('Populate the database with dummy data.')
	.action(async () => {
		const gdol = new Gdol();
		if ((await Deno.readFile(databasePath)).length === 0) {
			await gdol.migrate();
		}
		await seedList(gdol.db);
	});

const _json = { assert: { type: 'json' } } as const;
const _seed_data_dir = 'seed_data';

type SeedLevel = {
	name: string;
	user: SeedUser;
	verifier: SeedUser;
	creators: SeedUser[];
	gd_id: number;
	requirement: number;
	video: string;
	records: SeedRecord[];
};

type SeedUser = {
	name: string;
	nationality?: string;
};

type SeedRecord = {
	user: SeedUser;
	video: string;
	percentage: string;
};

async function seedList(db: Database) {
	const levelIds: number[] = [];
	const list = (await import(`./${_seed_data_dir}/_list.json`, _json)).default as string[];
	const length = list.length;
	for (const [i, slug] of list.entries()) {
		console.log(`Seeding level ${slug}`);
		const level = (await import(`./${_seed_data_dir}/${slug}.json`, _json)).default as SeedLevel;
		const levelId = seedLevel(db, level);
		levelIds.push(levelId);

		db.prepare(
			`INSERT INTO list_log ("list_level_ids", "timestamp", "action", "level_id", "to", "reason")
		 VALUES (:list_level_ids, unixepoch('now')-:length+:i, :action, :level_id, :to, :reason)`
		).run({
			i,
			length,
			list_level_ids: JSON.stringify(levelIds),
			action: 'ADD',
			level_id: levelId,
			to: levelIds.length,
			reason: 'Seeded',
		});
	}
}

function seedLevel(db: Database, level: SeedLevel): number {
	const userId = seedUser(db, level.user);
	const verifierId = seedUser(db, level.verifier);
	const creatorIds = [level.user, ...level.creators].map((creator) => seedUser(db, creator));

	const result = db
		.prepare(
			`INSERT INTO levels (name, gd_id, user_id, verifier_id, video, requirement)
				  VALUES (:name, :gd_id, :user_id, :verifier_id, :video, :requirement) RETURNING id`
		)
		.value<[number]>({
			name: level.name,
			gd_id: level.gd_id,
			user_id: userId,
			verifier_id: verifierId,
			video: level.video,
			requirement: level.requirement,
		});

	if (result === undefined) {
		console.error('Inserting level returned undefined id');
		return -1;
	}

	const [id] = result;

	// seed creators
	creatorIds.forEach((creatorId, i) =>
		seedUserCreatedLevel(db, [level.user, ...level.creators][i].name, creatorId, level.name, id)
	);

	// seed records
	level.records.forEach((record) => seedRecord(db, level.name, id, record));

	return id;
}

function seedRecord(db: Database, levelName: string, levelId: number, record: SeedRecord): void {
	const userId = seedUser(db, record.user);
	try {
		db.prepare(
			`INSERT INTO records (timestamp, percentage, video, user_id, level_id)
		 VALUES (unixepoch('now'), :percentage, :video, :user_id, :level_id)`
		).run({
			percentage: record.percentage,
			video: record.video,
			user_id: userId,
			level_id: levelId,
		});
	} catch (_) {
		console.log('Found duplicate in Records:', levelName, record.user.name);
	}
}

function seedUserCreatedLevel(
	db: Database,
	userName: string,
	userId: number,
	levelName: string,
	levelId: number
): void {
	try {
		db.prepare('INSERT INTO user_created_level (user_id, level_id) VALUES (?, ?)').run(
			userId,
			levelId
		);
	} catch (_) {
		console.log('Found duplicate in Creators:', levelName, userName);
	}
}

function seedUser(db: Database, user: SeedUser): number {
	const findResult = db.prepare('SELECT id FROM users WHERE name = ?').value<[number]>(user.name);

	if (findResult !== undefined) {
		return findResult[0];
	}

	const insertResult = db
		.prepare(`INSERT INTO users (name) VALUES (?) RETURNING id`)
		.value<[number]>(user.name);

	if (insertResult === undefined) {
		console.error('Inserting user returned undefined id');
		return -1;
	}

	const [id] = insertResult;
	return id;
}
