import { z } from 'zod';

import { User } from './user.ts';

export const Level = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	gdId: z.number().int().positive().optional(),
	video: z.string().optional(),
	requirement: z.number().nonnegative().optional(),
	user: User,
	verifier: User,
	creators: z.array(User),
});

export const LevelWithRank = Level.extend({
	rank: z.number().int().positive(),
});

export const LevelArchived = Level.extend({
	timestamp: z.string().datetime(),
});
