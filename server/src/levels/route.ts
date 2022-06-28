import { FastifyPluginAsync } from 'fastify';
import { Levels } from '../generated/openapi';
import { createLevel } from './model';

const plugin: FastifyPluginAsync = async function (fastify) {
	// Create Level
	fastify.post<{
		Body: Levels.PostLevels.RequestBody;
		Querystring: Levels.PostLevels.RequestQuery;
		Params: Levels.PostLevels.RequestParams;
		Headers: Levels.PostLevels.RequestHeaders;
		Reply: Levels.PostLevels.ResponseBody;
	}>('/levels', async function (req, res) {
		await createLevel(req.body);
		res.send();
	});
};

export default plugin;
