import { Hono } from '../../../deps.ts';
import { find } from '../../../store/users/find.ts';

export const route = new Hono().get('/', (c) => {
	const users = find(c.get('db'));
	return c.json(users);
});
