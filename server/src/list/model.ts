import { Level, List } from '../generated/openapi';
import { ListLogAction, Prisma } from '../generated/prisma';
import { prisma } from '../prisma';

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

	return res.list.map((log) => log.level);
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
			from: currentIndex + 1,
			to: body.rank,
			levelId: body.level,
			list: {
				createMany: {
					data: newList.map((levelId, index) => ({ levelId, index })),
				},
			},
		},
	});
}
