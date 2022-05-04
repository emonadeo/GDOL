import { FastifyPluginAsync } from 'fastify';
import { Prisma, Level } from '@prisma/client';
import { prisma } from '../prisma';

// TODO: Clean-up, Alternatives?
const qry = Prisma.sql`
	SELECT "id", "name", "userName", "verifierName", "video" FROM (
		SELECT "levelIds" FROM "List" ORDER BY "timestamp" DESC LIMIT 1
	) AS l, unnest(l."levelIds") WITH ORDINALITY as lid
	JOIN "Level" AS level ON lid = level.id
	ORDER BY ordinality
`;

async function latest(): Promise<Level[]> {
	return await prisma.$queryRaw<Level[]>(qry);
}

export const list: FastifyPluginAsync = async function (fastify) {
	// Get List
	fastify.get<{
		Reply: Level[];
	}>('/list', async (_, res) => {
		res.send(await latest());
	});

	// Add a level to list
	fastify.post('/list', async (_, res) => {});

	// Move a level on list
	fastify.patch('/list', async (_, res) => {});
};
