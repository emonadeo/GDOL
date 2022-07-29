import { UserWithScore } from '../generated/openapi';
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

export async function getUsers(): Promise<UserWithScore[]> {
	const users = await prisma.user.findMany();
	const usersWithScore: UserWithScore[] = await Promise.all(
		users.map(async (user) => {
			if (scores[user.id] === undefined) {
				const records = await prisma.record.findMany({
					where: {
						userId: user.id,
					},
					include: {
						level: true,
					},
				});
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
				score: scores[user.id],
			};
		})
	);

	return usersWithScore.sort((a, b) => b.score - a.score);
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
