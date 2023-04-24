import { createApi } from '../api/mod.ts';
import { std_serve, Database, Hono } from '../deps.ts';

const db = new Database('gdol.db');
const api = createApi(db);
const router = new Hono().route('/api', api);

std_serve(router.fetch, {
	port: 3001,
});
