import { Hono } from '../../../deps.ts';
import { GdolEnv } from '../../types.ts';

export const route = new Hono<GdolEnv>();
