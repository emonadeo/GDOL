import { List } from '../generated/openapi';
import { prisma } from '../prisma';

/**
 * Extracts the list of levels from the latest log record
 * @returns List of levels
 */
export async function getCurrent(): Promise<List.GetList.ResponseBody> {
	const res = await prisma.listLog.findFirst({
		include: {
			list: {
				include: {
					level: true,
				},
				orderBy: {
					index: 'asc',
				},
			},
		},
	});

	if (!res) return [];

	return res.list.map((log) => log.level);
}
