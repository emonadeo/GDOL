import { RouteDataFunc } from '@solidjs/router';
import { createResource, Resource } from 'solid-js';
import { api } from 'src/api';
import { Changelog, Level, RecordWithUser, UserWithScoreAndRank } from 'src/generated/openapi';

async function fetchList(): Promise<Level[]> {
	const { data, error } = await api.list.getList();

	if (error != null) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch list`);
	}

	return data.map((lvl, i) => ({ ...lvl, rank: i + 1 }));
}

export const ListData: RouteDataFunc<unknown, Resource<Level[]>> = function () {
	const [list] = createResource(fetchList);
	return list;
};

async function fetchUsers(): Promise<UserWithScoreAndRank[]> {
	const { data, error } = await api.users.getUsers();

	if (error != null) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch users`);
	}

	return data;
}

export const UsersData: RouteDataFunc<unknown, Resource<UserWithScoreAndRank[]>> = function () {
	const [users] = createResource(fetchUsers);
	return users;
};

async function fetchLevelByRank(rank: number): Promise<Level> {
	const { data, error } = await api.list.getLevelByListRank(rank);

	if (error != null) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch level`);
	}

	return data;
}

async function fetchLevelRecords(levelId: number | undefined): Promise<RecordWithUser[]> {
	if (!levelId) return [];

	const { data, error } = await api.levels.getRecordsByLevel(levelId);

	if (error != null) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch level records`);
	}

	return data;
}

interface LevelByRankDataRes {
	level: Resource<Level>;
	records: Resource<RecordWithUser[]>;
}

export const LevelByRankData: RouteDataFunc<unknown, LevelByRankDataRes> = function ({ params }) {
	const rank = Number(params.rank);
	// TODO: Rank can be NaN. The created resource does error as intended, but handle this separately?
	const [level] = createResource(() => rank, fetchLevelByRank);
	const [records] = createResource(() => level()?.id, fetchLevelRecords);

	return { level, records };
};

export async function archiveLevelByRank(rank: number, reason?: string): Promise<void> {
	const { error } = await api.list.archiveLevelByListRank(rank, { reason });

	if (error != null) {
		throw new Error(`Couldn't archive level`);
	}
}

export async function addOrMoveLevel(
	rank: number,
	levelId: number,
	reason?: string
): Promise<void> {
	const { error } = await api.list.updateList(rank, { level_id: levelId, reason });

	if (error != null) {
		throw new Error(`Couldn't add or move level`);
	}
}

async function fetchChangelog(): Promise<Changelog[]> {
	const { data, error } = await api.changelog.getChangelog();

	if (error != null) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch users`);
	}

	return data;
}

export const ChangelogData: RouteDataFunc<unknown, Resource<Changelog[]>> = function () {
	const [changelog] = createResource(fetchChangelog);
	return changelog;
};
