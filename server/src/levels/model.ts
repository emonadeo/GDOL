import { Levels, Record } from '../generated/openapi';
import { postList } from '../list/model';
import { prisma } from '../prisma';

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
				},
			},
			user: true,
		},
		orderBy: {
			percentage: 'desc',
		},
	});

	return res.map((record) => ({ ...record, video: record.video || undefined }));
}
