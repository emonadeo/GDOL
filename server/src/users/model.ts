import { Record, UserFull, UserWithScore } from '../generated/openapi';
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

	const records = await prisma.user
		.findUnique({
			where: { id: userId },
		})
		.records({
			include: {
				level: true,
			},
		});

	let score = 0;

	for (const record of records) {
		const rank = await getRank(record.levelId);
		if (rank) score += getPoints(rank, record.level.requirement, record.percentage);
	}

	scores[userId] = score;

	return score;
}

async function getRecords(userId: number): Promise<Record[]> {
	const records = await prisma.user
		.findUnique({
			where: { id: userId },
		})
		.records({
			include: {
				user: true,
				level: {
					include: {
						user: true,
						creators: true,
						verifier: true,
						log: {
							take: 1,
							select: {
								index: true,
							},
							orderBy: {
								logTimestamp: 'desc',
							},
						},
					},
				},
			},
		});
	return records.map((record) => ({
		user: record.user,
		level: {
			...record.level,
			rank: record.level.log[0]?.index + 1 || 0,
		},
		percentage: record.percentage,
		timestamp: record.timestamp.toISOString(),
		video: record.video || undefined,
	}));
}

// TODO: Use redis over global variable
export const scores: { [userId: number]: number } = {};

export async function getUsers(): Promise<UserWithScore[]> {
	const users = await prisma.user.findMany();
	const usersWithScore: UserWithScore[] = await Promise.all(
		users.map(async (user) => {
			return {
				id: user.id,
				name: user.name,
				score: await getScore(user.id),
			};
		})
	);

	return usersWithScore.sort((a, b) => b.score - a.score);
}

export async function getUserById(userId: number): Promise<UserFull | undefined> {
	// TODO: Add (redis) cache
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
			levels: {
				include: {
					user: true,
					verifier: true,
					creators: true,
					log: {
						take: 1,
						select: {
							index: true,
						},
						orderBy: {
							logTimestamp: 'desc',
						},
					},
				},
			},
			levelsCreated: {
				include: {
					user: true,
					verifier: true,
					creators: true,
					log: {
						take: 1,
						select: {
							index: true,
						},
						orderBy: {
							logTimestamp: 'desc',
						},
					},
				},
			},
			levelsVerified: {
				include: {
					user: true,
					verifier: true,
					creators: true,
					log: {
						take: 1,
						select: {
							index: true,
						},
						orderBy: {
							logTimestamp: 'desc',
						},
					},
				},
			},
		},
	});
	const userFull: UserFull | null = user && {
		id: user.id,
		name: user.name,
		levels: user.levels.map((level) => ({
			...level,
			rank: level.log[0]?.index + 1 || undefined,
		})),
		levelsCreated: user.levelsCreated.map((level) => ({
			...level,
			rank: level.log[0]?.index + 1 || undefined,
		})),
		levelsVerified: user.levelsVerified.map((level) => ({
			...level,
			rank: level.log[0]?.index + 1 || undefined,
		})),
		// TODO: Confirm that Records and Score get batched by Prisma
		records: await getRecords(user.id),
		score: await getScore(user.id),
	};
	return userFull || undefined;
}
