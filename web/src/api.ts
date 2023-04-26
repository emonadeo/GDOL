import { Api } from '@gdol/node';
import { hc } from 'hono/client';

// TODO: type-safety

declare namespace Deno {
	const env: Map<string, string>;
}

export const api = hc<Api>(
	import.meta.env.DEV ? import.meta.env.GDOL_API_URL : Deno.env.get('GDOL_API_URL')!
);
