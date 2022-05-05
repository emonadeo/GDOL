import { FastifyPluginAsync, RouteHandlerMethod } from 'fastify';
import { Level } from '@prisma/client';
import { getCurrent } from './model';

const plugin: FastifyPluginAsync = async function (fastify) {
	// Get List
	fastify.get<{
		Reply: Level[];
	}>('/list', async function (_, res) {
		res.send(await getCurrent());
	});

	// TODO Edit List
	fastify.post('/list', async (_, res) => {});
};

export default plugin;
