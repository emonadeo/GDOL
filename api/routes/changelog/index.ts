import { Hono } from '../../../deps.ts';
import { find } from '../../../store/changelog/find.ts';
import { GdolEnv } from '../../mod.ts';

export const route = new Hono<GdolEnv>().get('/', (c) => {
	const changelogs = find(c.get('db'));
	return c.jsonT(changelogs);
});
