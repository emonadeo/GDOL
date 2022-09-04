import { Record, UserFull, UserWithScore } from '../generated/openapi.js';
import { prisma } from '../prisma.js';

// TODO: outsource function, remove pointercrate implementation before release
/**
 * Calculate the amount of points given to a player for a record on a level
 * @param rank Rank of the level
 * @param requirement Minimum percentage to qualify
 * @param percentage Percentage of the record
 */
export function getPoints(rank: number, requirement: number, percentage: number): number {
	let beatenScore = 0;
	if (55 < rank && rank <= 150) {
		let b = 6.273;
		beatenScore = 56.191 * Math.pow(2, (54.147 - (rank + 3.2)) * (Math.log(50) / 99)) + b;
	} else if (35 < rank && rank <= 55) {
		let g = 1.036;
		let h = 25.071;
		beatenScore = 212.61 * Math.pow(g, 1 - rank) + h;
	} else if (20 < rank && rank <= 35) {
		let c = 1.0099685;
		let d = 31.152;
		beatenScore = (250 - 83.389) * Math.pow(c, 2 - rank) - d;
	} else if (0 < rank && rank <= 20) {
		let e = 1.168;
		let f = 100.39;
		beatenScore = (250 - f) * Math.pow(e, 1 - rank) + f;
	} else {
		beatenScore = 0;
	}

	if (percentage !== 100 && rank <= 75) {
		return (beatenScore * Math.pow(5, (percentage - requirement) / (100 - requirement))) / 10;
	}

	return beatenScore;
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

// TODO: Reorganize/Rewrite
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

	const verifications = await prisma.user
		.findUnique({
			where: { id: userId },
		})
		.levelsVerified();

	let score = 0;

	for (const record of records) {
		const rank = await getRank(record.levelId);
		if (rank) score += getPoints(rank, record.level.requirement, record.percentage);
	}

	for (const level of verifications) {
		const rank = await getRank(level.id);
		if (rank) score += getPoints(rank, level.requirement, 100);
	}

	score = Math.round((score + Number.EPSILON) * 100) / 100;

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
