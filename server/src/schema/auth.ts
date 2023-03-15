import { z } from 'zod';

export const Auth = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
});
