import { FastifyPluginAsync } from 'fastify';
import { List } from '../generated/openapi';
import { getCurrent } from './model';

const plugin: FastifyPluginAsync = async function (fastify) {
	// Get List
	fastify.get<{
		Reply: List.GetList.ResponseBody;
	}>('/list', async function (_, res) {
		res.send(await getCurrent());
	});

	// TODO Edit List
	fastify.post('/list', async (_, res) => {});
};

export default plugin;
