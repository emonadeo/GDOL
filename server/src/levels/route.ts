import { FastifyPluginAsync } from 'fastify';
import { Levels } from '../generated/openapi';
import { createLevel, getLevelRecords } from './model';

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

	// Get Level Records
	fastify.get<{
		Body: Levels.GetLevelRecords.RequestBody;
		Querystring: Levels.GetLevelRecords.RequestQuery;
		Params: Levels.GetLevelRecords.RequestParams;
		Headers: Levels.GetLevelRecords.RequestHeaders;
		Reply: Levels.GetLevelRecords.ResponseBody;
	}>('/levels/:id/records', async function (req, res) {
		res.send(await getLevelRecords(Number(req.params.id)));
	});
};

export default plugin;
