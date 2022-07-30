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

// TODO: Use redis over global variable
export const scores: { [userId: number]: number } = {};

export async function getUsers(): Promise<UserWithRecords[]> {
	const users = await prisma.user.findMany();
	const usersWithRecords: UserWithRecords[] = await Promise.all(
		users.map(async (user) => {
			const records = await prisma.record.findMany({
				where: {
					userId: user.id,
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
			if (scores[user.id] === undefined) {
				let score = 0;
				for (const record of records) {
					const rank = await getRank(record.levelId);
					if (rank) score += getPoints(rank, record.level.requirement, record.percentage);
				}
				scores[user.id] = score;
			}
			return {
				id: user.id,
				name: user.name,
				records: records.map((record) => ({
					...record,
					timestamp: record.timestamp.toISOString(),
					video: record.video || undefined,
				})),
				score: scores[user.id],
			};
		})
	);

	return usersWithRecords.sort((a, b) => b.score - a.score);
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
