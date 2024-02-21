import { Database } from '../../deps.ts';
import { Changelog } from '../../types/mod.ts';

const query = await (await fetch(new URL('./find.sql', import.meta.url))).text();

type RawChangelog = {
	timestamp: number;
	action: 'add' | 'archive' | 'move';
	from: number | null;
	to: number | null;
	reason: string | null;
	level_id: number;
	level_name: string;
	list_before_level_ids: string;
	list_before_level_names: string;
	list_after_level_ids: string;
	list_after_level_names: string;
};

function changelogFromRaw(changelog: RawChangelog): Changelog {
	const listBeforeLevelIds = JSON.parse(changelog.list_before_level_ids) as number[];
	const listBeforeLevelNames = JSON.parse(changelog.list_before_level_names) as string[];
	const listAfterLevelIds = JSON.parse(changelog.list_after_level_ids) as number[];
	const listAfterLevelNames = JSON.parse(changelog.list_after_level_names) as string[];

	return {
		timestamp: new Date(changelog.timestamp * 1000).toISOString(),
		action: changelog.action,
		from: (changelog.from ?? undefined) as number, // RawChangelog fulfills discriminated union properties of Changelog
		to: (changelog.to ?? undefined) as number, // RawChangelog fulfills discriminated union properties of Changelog
		reason: changelog.reason ?? undefined,
		level: {
			id: changelog.level_id,
			name: changelog.level_name,
		},
		listBefore: listBeforeLevelIds.map((id, i) => ({
			id,
			name: listBeforeLevelNames[i],
		})),
		listAfter: listAfterLevelIds.map((id, i) => ({
			id,
			name: listAfterLevelNames[i],
		})),
	};
}

export function find(db: Database): Changelog[] {
	return db.prepare(query).all<RawChangelog>().map(changelogFromRaw);
}
