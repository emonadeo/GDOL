import { Hono } from '../../../deps.ts';
import { find } from '../../../store/users/find.ts';
import { GdolEnv } from '../../mod.ts';

export const route = new Hono<GdolEnv>().get('/', (c) => {
	const users = find(c.get('db'));
	return c.jsonT(users);
});
