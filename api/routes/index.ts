import { Hono } from '../../deps.ts';
import { GdolEnv } from '../mod.ts';

import { route as changelog } from './changelog/index.ts';
import { route as levels } from './levels/index.ts';
import { route as list } from './list/index.ts';
import { route as users } from './users/index.ts';

export const route = new Hono<GdolEnv>()
	.route('/changelog', changelog)
	.route('/levels', levels)
	.route('/list', list)
	.route('/users', users);
