import { FastifyPluginAsync } from 'fastify';
import { Users } from '../generated/openapi';
import { getUsers } from './model';

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
};

export default plugin;
