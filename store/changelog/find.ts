import { Database } from '../../deps.ts';
import { Changelog, Level } from '../../types/mod.ts';

const query = await (await fetch(new URL('./find.sql', import.meta.url))).text();

type RawChangelog = {
	timestamp: number;
	action: 'ADD' | 'ARCHIVE' | 'MOVE';
	from?: number;
	to?: number;
	reason?: string;
	level_id: number;
	level_name: string;
	list_level_ids: string;
	list_level_names: string;
};

function changelogFromRaw(changelog: RawChangelog): Changelog {
	const listLevelIds = JSON.parse(changelog.list_level_ids) as number[];
	const listLevelNames = JSON.parse(changelog.list_level_names) as string[];

	return {
		timestamp: changelog.timestamp * 1000,
		action: changelog.action.toLowerCase() as 'add' | 'archive' | 'move',
		from: changelog.from,
		to: changelog.to,
		reason: changelog.reason,
		level: {
			id: changelog.level_id,
			name: changelog.level_name,
		} as unknown as Level, // TODO:
		list: listLevelIds.map((id, i) => ({
			id,
			name: listLevelNames[i],
		})),
	};
}

export function find(db: Database): Changelog[] {
	return db.prepare(query).all<RawChangelog>().map(changelogFromRaw);
}
