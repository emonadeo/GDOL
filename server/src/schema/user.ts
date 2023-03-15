import { z } from 'zod';

export const User = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	nationality: z.string().optional(),
});

export const UserWithScore = User.extend({
	score: z.number().nonnegative(),
});

export const UserWithScoreAndRank = UserWithScore.extend({
	rank: z.number().int().positive(),
});
