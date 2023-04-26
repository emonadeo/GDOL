import { Hono } from '../../../deps.ts';
import { find } from '../../../store/list/find.ts';
import { GdolEnv } from '../../mod.ts';

export const route = new Hono<GdolEnv>().get('/', (c) => {
	const list = find(c.get('db'));
	return c.jsonT(list);
});
