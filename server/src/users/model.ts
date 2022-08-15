import { UserWithRecords } from '../generated/openapi';
import { prisma } from '../prisma';

// TODO: outsource function
/**
 * Calculate the amount of points given to a player for a record on a level
 * @param rank Rank of the level
 * @param requirement Minimum percentage to qualify
 * @param percentage Percentage of the record
 */
export function getPoints(rank: number, requirement: number, percentage: number): number {
	return 100 - rank + 1;
}

async function getRank(levelId: number): Promise<number | undefined> {
	const listLogLevel = await prisma.listLogLevel.findFirst({
		where: {
			levelId,
		},
		orderBy: {
			logTimestamp: 'desc',
		},
	});
	return (listLogLevel && listLogLevel.index + 1) || undefined;
}

async function getScore(userId: number): Promise<number> {
	if (scores[userId] !== undefined) {
		return scores[userId];
	}

	// TODO: Remove duplicate, e.g. use DataLoader
	const records = await getRecords(userId);

	let score = 0;

	for (const record of records) {
		const rank = await getRank(record.level.id);
		if (rank) score += getPoints(rank, record.level.requirement, record.percentage);
	}

	scores[userId] = score;

	return score;
}

async function getRecords(userId: number) {
	const records = await prisma.record.findMany({
		where: {
			userId,
		},
		include: {
			level: {
				include: {
					user: true,
					creators: true,
					verifier: true,
				},
			},
			user: true,
		},
	});
	return records.map((record) => ({
		...record,
		timestamp: record.timestamp.toISOString(),
		video: record.video || undefined,
	}));
}

// TODO: Use redis over global variable
export const scores: { [userId: number]: number } = {};

export async function getUsers(): Promise<UserWithRecords[]> {
	const users = await prisma.user.findMany();
	const usersWithRecords: UserWithRecords[] = await Promise.all(
		users.map(async (user) => {
			// TODO: Remove duplicate
			return {
				id: user.id,
				name: user.name,
				// TODO: Remove duplicate, e.g. use DataLoader
				records: await getRecords(user.id),
				score: await getScore(user.id),
			};
		})
	);

	return usersWithRecords.sort((a, b) => b.score - a.score);
}

export async function getUserById(userId: number): Promise<UserWithRecords | undefined> {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			records: {
				include: {
					level: {
						include: {
							user: true,
							creators: true,
							verifier: true,
						},
					},
					user: true,
				},
			},
			levels: true,
			levelsCreated: true,
			levelsVerified: true,
		},
	});
	// TODO: Remove duplicate
	const userWithRecords = user && {
		id: user.id,
		name: user.name,
		// TODO: Remove duplicate, e.g. use DataLoader
		records: await getRecords(user.id),
		score: await getScore(user.id),
	};
	return userWithRecords || undefined;
}
