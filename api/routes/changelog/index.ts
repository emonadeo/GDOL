import { Hono } from '../../../deps.ts';
import { find } from '../../../store/changelog/find.ts';
import { Changelog } from '../../../types/mod.ts';
import { GdolEnv } from '../../mod.ts';

export const route = new Hono<GdolEnv>().get('/', (c) => {
	const changelogs: Changelog[] = find(c.get('db'));
	return c.jsonT(changelogs);
});
