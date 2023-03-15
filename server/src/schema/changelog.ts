import { z } from 'zod';

import { Level } from './level.ts';
import { List } from './list.ts';

export const Changelog = z.intersection(
	// shared properties
	z.object({
		timestamp: z.string().datetime(),
		reason: z.string(),
		level: Level,
		list: List,
	}),
	// action-specific properties
	z.discriminatedUnion('action', [
		z.object({
			action: z.literal('add'),
			to: z.number().int().positive(),
		}),
		z.object({
			action: z.literal('archive'),
			from: z.number().int().positive(),
		}),
		z.object({
			action: z.literal('move'),
			from: z.number().int().positive(),
			to: z.number().int().positive(),
		}),
	])
);
