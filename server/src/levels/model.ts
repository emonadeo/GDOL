import { Levels, Record } from '../generated/openapi.js';
import { postList } from '../list/model.js';
import { prisma } from '../prisma.js';

export async function createLevel(level: Levels.PostLevels.RequestBody): Promise<void> {
	const res = await prisma.level.create({
		data: {
			name: level.name,
			levelId: level.levelId,
			userId: level.userId,
			verifierId: level.verifierId,
			creators: {
				connect: level.creatorIds.map((id) => ({ id })),
			},
			requirement: level.requirement !== undefined ? level.requirement : 100,
			video: level.video,
		},
	});

	if (level.rank === undefined) return;

	postList({ level: res.id, rank: level.rank });
}

export async function getLevelRecords(levelId: number): Promise<Record[]> {
	// TODO: Too much nesting? Overfetching? Massive SQL JOIN?
	const res = await prisma.record.findMany({
		where: {
			levelId,
		},
		include: {
			level: {
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
			user: true,
		},
		orderBy: [
			{
				percentage: 'desc',
			},
			{
				timestamp: 'asc',
			},
		],
	});

	return res.map((record) => ({
		level: {
			...record.level,
			rank: record.level.log[0]?.index + 1,
		},
		user: record.user,
		percentage: record.percentage,
		timestamp: record.timestamp.toISOString(),
		video: record.video || undefined,
	}));
}

export async function createLevelRecord(
	levelId: number,
	userId: number,
	percentage: number,
	video: string | undefined
): Promise<void> {
	await prisma.record.create({
		data: {
			levelId,
			userId,
			percentage,
			video,
		},
	});
}
