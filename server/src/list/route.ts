import { FastifyPluginAsync } from 'fastify';
import { List } from '../generated/openapi';
import { getCurrentList, postList } from './model';

const plugin: FastifyPluginAsync = async function (fastify) {
	// Get List
	fastify.get<{
		Body: List.GetList.RequestBody;
		Querystring: List.GetList.RequestQuery;
		Params: List.GetList.RequestParams;
		Headers: List.GetList.RequestHeaders;
		Reply: List.GetList.ResponseBody;
	}>('/list', async function (_, res) {
		res.send(await getCurrentList());
	});

	// Edit List
	fastify.post<{
		Body: List.PostList.RequestBody;
		Querystring: List.PostList.RequestQuery;
		Params: List.PostList.RequestParams;
		Headers: List.PostList.RequestHeaders;
		Reply: List.PostList.ResponseBody;
	}>('/list', async function (req, res) {
		await postList(req.body);
		res.send();
	});
};

export default plugin;
