import { Hono, Database } from '../deps.ts';
import { GdolEnv } from './types.ts';

import { route as api } from './routes/index.ts';

export type Api = typeof api;

export function createApi(db: Database): Api {
	return new Hono<GdolEnv>()
		.use(async (c, next) => {
			c.set('db', db);
			await next();
		})
		.route('/', api);
}
