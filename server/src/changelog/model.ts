import { Changelog } from '../generated/openapi';
import { prisma } from '../prisma';

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
		level: log.level,
		list: log.list.map((llvl) => llvl.level),
		from: log.from || undefined,
		to: log.to || undefined,
		timestamp: log.timestamp.toISOString(),
	}));
}
