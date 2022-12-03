import { RouteDataFunc } from '@solidjs/router';
import { createResource, Resource } from 'solid-js';

// TODO: Generate using OpenAPI
export interface User {
	id: number;
	name: string;
	nationality: string;
}

export interface Level {
	rank: number;
	id: number;
	gd_id?: number;
	name: string;
	video?: string;
	user: User;
	verifier: User;
	creators: User[];
}

export interface UserWithScoreAndRank {
	id: string;
	name: string;
	nationality?: string;
	score: number;
	rank: number;
}

export interface Record {
	timestamp: string;
	percentage: number;
	video: string;
}

export type RecordWithUser = Record & { user: User };
export type RecordWithLevel = Record & { level: Level };

async function fetchList(): Promise<Level[]> {
	// TODO: Use OpenAPI
	const res = await fetch(`${import.meta.env.VITE_GDOL_URL}/list`);

	if (!res.ok) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch list`);
	}

	const levels: Level[] = await res.json();
	return levels.map((lvl, i) => ({ ...lvl, rank: i + 1 }));
}

export const ListData: RouteDataFunc<unknown, Resource<Level[]>> = function () {
	const [list] = createResource(fetchList);
	return list;
};

async function fetchUsers(): Promise<UserWithScoreAndRank[]> {
	// TODO: Use OpenAPI
	const res = await fetch(`${import.meta.env.VITE_GDOL_URL}/users`);

	if (!res.ok) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch users`);
	}

	const users: UserWithScoreAndRank[] = await res.json();
	return users;
}

export const UsersData: RouteDataFunc<unknown, Resource<UserWithScoreAndRank[]>> = function () {
	const [users] = createResource(fetchUsers);
	return users;
};

async function fetchLevelByRank(rank: number): Promise<Level> {
	// TODO: Use OpenAPI
	const res = await fetch(`${import.meta.env.VITE_GDOL_URL}/list/${rank}`);

	if (!res.ok) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch users`);
	}

	const level: Level = await res.json();
	return level;
}

async function fetchLevelRecords(levelId: number | undefined): Promise<RecordWithUser[]> {
	if (!levelId) return [];

	// TODO: Use OpenAPI
	const res = await fetch(`${import.meta.env.VITE_GDOL_URL}/levels/${levelId}/records`);

	if (!res.ok) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch users`);
	}

	const records: RecordWithUser[] = await res.json();
	return records;
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
