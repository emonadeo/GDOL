import { Level, List } from '../generated/openapi.js';
import { ListLogAction } from '../generated/prisma/index.js';
import { prisma } from '../prisma.js';

/**
 * Extracts the list of levels from the latest log record
 * @returns List of levels
 */
export async function getCurrentList(): Promise<List.GetList.ResponseBody> {
	const res = await prisma.listLog.findFirst({
		include: {
			list: {
				include: {
					level: {
						include: {
							creators: true,
							user: true,
							verifier: true,
						},
					},
				},
				orderBy: {
					index: 'asc',
				},
			},
		},
		orderBy: {
			timestamp: 'desc',
		},
	});

	if (!res) return [];

	return res.list.map((log, i) => ({
		...log.level,
		rank: i + 1,
	}));
}

/**
 * Adds or moves a level on the list
 */
export async function postList(body: List.PostList.RequestBody): Promise<void> {
	const currentList: Level[] = await getCurrentList();
	const currentIndex: number = currentList.findIndex((level) => level.id === body.level);
	const newIndex: number = body.rank - 1;
	const levelExistsInList: boolean = currentIndex !== -1;

	// Do not update if Level is already at specified rank
	if (levelExistsInList && currentIndex === newIndex) return;

	const newList: number[] = currentList.map((level) => level.id);

	// Remove old position of level
	if (levelExistsInList) newList.splice(currentIndex, 1);

	// Add level at new position
	newList.splice(newIndex, 0, body.level);

	await prisma.listLog.create({
		data: {
			action: levelExistsInList ? ListLogAction.MOVE : ListLogAction.ADD,
			from: levelExistsInList ? currentIndex + 1 : undefined,
			to: body.rank,
			levelId: body.level,
			list: {
				createMany: {
					data: newList.map((levelId, index) => ({ levelId, index })),
				},
			},
			reason: body.reason,
		},
	});
}

/**
 * Archive level on the list
 */
export async function archiveListLevel(rank: number, reason?: string): Promise<void> {
	const currentList: Level[] = await getCurrentList();

	// Rank out of range
	if (rank < 1 || rank > currentList.length) return;

	const newList: number[] = currentList.map((level) => level.id);

	// Remove level
	newList.splice(rank - 1, 1);

	await prisma.listLog.create({
		data: {
			action: ListLogAction.DELETE,
			from: rank,
			levelId: currentList[rank - 1].id,
			list: {
				createMany: {
					data: newList.map((levelId, index) => ({ levelId, index })),
				},
			},
			reason,
		},
	});
}

/**
 * Get level by rank
 */
export async function getListLevelByRank(rank: number): Promise<Level | undefined> {
	const res = await prisma.listLog.findFirst({
		include: {
			list: {
				include: {
					level: {
						include: {
							creators: true,
							user: true,
							verifier: true,
						},
					},
				},
				where: {
					index: rank - 1,
				},
			},
		},
		orderBy: {
			timestamp: 'desc',
		},
	});

	if (!res) return undefined;

	return {
		...res.list[0].level,
		rank,
	};
}
