import { FastifyPluginAsync } from 'fastify';
import { Changelog } from '../generated/openapi.js';
import { getChangelog } from './model.js';

const plugin: FastifyPluginAsync = async function (fastify) {
	// Get Changelog
	fastify.get<{
		Body: Changelog.GetChangelog.RequestBody;
		Querystring: Changelog.GetChangelog.RequestQuery;
		Params: Changelog.GetChangelog.RequestParams;
		Headers: Changelog.GetChangelog.RequestHeaders;
		Reply: Changelog.GetChangelog.ResponseBody;
	}>('/changelog', async function (_, res) {
		res.send(await getChangelog());
	});
};

export default plugin;
