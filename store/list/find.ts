import { Database } from '../../deps.ts';
import { Level } from '../../types/mod.ts';

const query = await (await fetch(new URL('./find.sql', import.meta.url))).text();

type RawLevel = {
	level_id: number;
	level_name: string;
	level_gd_id: number | null;
	level_video: string | null;
	level_requirement: number | null;
	user_id: number;
	user_name: string;
	user_nationality: string | null;
	verifier_id: number;
	verifier_name: string;
	verifier_nationality: string | null;
	creator_ids: string;
	creator_names: string;
	creator_nationalities: string;
};

function levelFromRaw(level: RawLevel): Level {
	const creator_ids = JSON.parse(level.creator_ids) as number[];
	const creator_names = JSON.parse(level.creator_names) as string[];
	const creator_nationalities = JSON.parse(level.creator_nationalities) as Array<string | null>;

	return {
		id: level.level_id,
		name: level.level_name,
		gd_id: level.level_gd_id ?? undefined,
		video: level.level_video ?? undefined,
		requirement: level.level_requirement ?? undefined,
		user: {
			id: level.user_id,
			name: level.user_name,
			nationality: level.user_nationality ?? undefined,
		},
		verifier: {
			id: level.verifier_id,
			name: level.verifier_name,
			nationality: level.verifier_nationality ?? undefined,
		},
		creators: creator_ids.map((creator_id, i) => ({
			id: creator_id,
			name: creator_names.at(i) as string,
			nationality: creator_nationalities.at(i) ?? undefined,
		})),
	};
}

export function find(db: Database): Level[] {
	return db.prepare(query).all<RawLevel>().map(levelFromRaw);
}
