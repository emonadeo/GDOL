import { Changelog } from '../generated/openapi.js';
import { prisma } from '../prisma.js';

export async function getChangelog(): Promise<Changelog.GetChangelog.ResponseBody> {
	const res = await prisma.listLog.findMany({
		include: {
			level: {
				include: {
					user: true,
					verifier: true,
					creators: true,
				},
			},
			list: {
				include: {
					level: {
						include: {
							user: true,
							verifier: true,
							creators: true,
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

	return res.map((log) => ({
		action: log.action,
		level: {
			...log.level,
			rank: log.to || undefined,
		},
		list: log.list.map((llvl, i) => ({
			...llvl.level,
			rank: i + 1,
		})),
		from: log.from || undefined,
		to: log.to || undefined,
		timestamp: log.timestamp.toISOString(),
		reason: log.reason || undefined,
	}));
}
