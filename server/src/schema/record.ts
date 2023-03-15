import { z } from 'zod';
import { User } from './user';
import { Level } from './level';

export const Record = z.object({
	timestamp: z.string().datetime(),
	percentage: z.number().int().min(0).max(100),
	video: z.string(),
});

export const RecordWithUser = Record.extend({
	user: User,
});

export const RecordWithLevel = Record.extend({
	level: Level,
});
