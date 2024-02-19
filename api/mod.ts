import { Database, Hono } from '../deps.ts';

import { route as api } from './routes/index.ts';

export type Api = typeof api;

export function createApi(db: Database): Api {
	return new Hono()
		.use(async (c, next) => {
			c.set('db', db);
			await next();
		})
		.route('/', api);
}
