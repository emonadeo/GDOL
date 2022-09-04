import { fastify, FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import cors from '@fastify/cors';
import validation from 'openapi-validator-middleware';

import list from './list/route.js';
import levels from './levels/route.js';
import changelog from './changelog/route.js';
import users from './users/route.js';
import { resolve } from 'path';

const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});

validation.init(resolve('../openapi.yml'), { framework: 'fastify' });

app.register(cors as any); // TODO: Remove in production

app.register(validation.validate({}));

app.setErrorHandler(async (err, req, res) => {
	if (err instanceof validation.InputValidationError) {
		return res.status(400).send();
	}
	res.status(500).send();
});

app.register(list);
app.register(levels);
app.register(changelog);
app.register(users);

// Run the server
app.listen({ port: 3001 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
