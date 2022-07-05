import { FastifyPluginAsync } from 'fastify';
import { List } from '../generated/openapi';
import { archiveListLevel, getCurrentList, getListLevelByRank, postList } from './model';

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

	// Get List Level
	fastify.get<{
		Body: List.GetListLevel.RequestBody;
		Querystring: List.GetListLevel.RequestQuery;
		Params: List.GetListLevel.RequestParams;
		Headers: List.GetListLevel.RequestHeaders;
		Reply: List.GetListLevel.ResponseBody;
	}>('/list/:rank', async function (req, res) {
		res.send(await getListLevelByRank(req.params.rank));
	});

	// Archive List Level
	fastify.delete<{
		Body: List.DeleteListLevel.RequestBody;
		Querystring: List.DeleteListLevel.RequestQuery;
		Params: List.DeleteListLevel.RequestParams;
		Headers: List.DeleteListLevel.RequestHeaders;
		Reply: List.DeleteListLevel.ResponseBody;
	}>('/list/:rank', async function (req, res) {
		await archiveListLevel(Number(req.params.rank), req.body.reason);
		res.send();
	});
};

export default plugin;
