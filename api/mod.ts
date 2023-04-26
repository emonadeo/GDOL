import { Hono, Database, HonoEnv } from '../deps.ts';

import { route as api } from './routes/index.ts';

export type Api = typeof api;

export interface GdolEnv extends HonoEnv {
	Variables: {
		db: Database;
	};
}

export function createApi(db: Database): Api {
	return new Hono<GdolEnv>()
		.use(async (c, next) => {
			c.set('db', db);
			await next();
		})
		.route('/', api);
}
