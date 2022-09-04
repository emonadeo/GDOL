import { FastifyPluginAsync } from 'fastify';
import { Levels } from '../generated/openapi.js';
import { createLevel, createLevelRecord, getLevelRecords } from './model.js';

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

	// Create Level Record
	fastify.post<{
		Body: Levels.PostLevelRecords.RequestBody;
		Querystring: Levels.PostLevelRecords.RequestQuery;
		Params: Levels.PostLevelRecords.RequestParams;
		Headers: Levels.PostLevelRecords.RequestHeaders;
		Reply: Levels.PostLevelRecords.ResponseBody;
	}>('/levels/:id/records', async function (req, res) {
		await createLevelRecord(
			Number(req.params.id),
			req.body.userId,
			Number(req.body.percentage || 100),
			req.body.video
		);
		res.send();
	});
};

export default plugin;
