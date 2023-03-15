import { z } from 'zod';

import { Level } from './level.ts';

export const List = z.array(Level);

export const ListSettings = z.object({
	max_length: z.number().int().nonnegative().nullable(),
	auto_unarchive: z.boolean(),
	override_requirement_after: z.number().int().nonnegative().nullable(),
});
