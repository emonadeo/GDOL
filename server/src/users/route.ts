import { FastifyPluginAsync } from 'fastify';
import { Users } from '../generated/openapi';
import { getUserById, getUsers } from './model';

const plugin: FastifyPluginAsync = async function (fastify) {
	// Get Users
	fastify.get<{
		Body: Users.GetUsers.RequestBody;
		Querystring: Users.GetUsers.RequestQuery;
		Params: Users.GetUsers.RequestParams;
		Headers: Users.GetUsers.RequestHeaders;
		Reply: Users.GetUsers.ResponseBody;
	}>('/users', async function (_, res) {
		res.send(await getUsers());
	});

	// Get User By ID
	fastify.get<{
		Body: Users.GetUser.RequestBody;
		Querystring: Users.GetUser.RequestQuery;
		Params: Users.GetUser.RequestParams;
		Headers: Users.GetUser.RequestHeaders;
		Reply: Users.GetUser.ResponseBody;
	}>('/users/:id', async function (req, res) {
		res.send(await getUserById(Number(req.params.id)));
	});
};

export default plugin;
