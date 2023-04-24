import { Api } from '@gdol/api';
import { hc } from 'hono/client';

export const api = hc<Api>(
	// TODO: type-safety
	import.meta.env.DEV ? import.meta.env.GDOL_API_URL : Deno.env.get('GDOL_API_URL')!
);
