import { Hono } from '../../deps.ts';
import { GdolEnv } from '../types.ts';

import { route as levels } from './levels/index.ts';
import { route as list } from './list/index.ts';
import { route as users } from './users/index.ts';

export const route = new Hono<GdolEnv>()
	.route('/levels', levels)
	.route('/list', list)
	.route('/users', users);
