import { Hono } from '../../../deps.ts';
import { find } from '../../../store/changelog/find.ts';
import { Changelog } from '../../../types/mod.ts';

export const route = new Hono().get('/', (c) => {
	const changelogs: Changelog[] = find(c.get('db'));
	return c.json(changelogs);
});
