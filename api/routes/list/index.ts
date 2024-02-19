import { Hono } from '../../../deps.ts';
import { find } from '../../../store/list/find.ts';

export const route = new Hono().get('/', (c) => {
	const list = find(c.get('db'));
	return c.json(list);
});
