import { createApi } from './api/mod.ts';

import { Hono, std_serve, std_contentType, Database } from './deps.ts';

export class Gdol {
	db: Database;

	constructor() {
		this.db = new Database('gdol.db');
	}

	async serve(options?: { port?: number }) {
		const port = options?.port ?? 80;
		Deno.env.set('GDOL_API_URL', `http://127.0.0.1:${port}/api/`);
		const { handle } = await import('./web/dist/server/entry.mjs');
		const router = createRouter(handle, this.db);
		await std_serve(router.fetch, { port });
		Deno.env.delete('GDOL_API_URL');
	}
}

function createRouter(handle: (req: Request) => Promise<Response>, db: Database) {
	const router = new Hono();

	router.route('/api', createApi(db));

	router.all('*', async (c) => {
		const request = c.req.raw;

		// attempt to serve client
		const clientResponse = (await handle(request)) as Response;
		if (clientResponse.status !== 404) {
			return clientResponse;
		}

		// if request path not found in client, try to fetch a static file instead
		const requestUrl = new URL(request.url);
		try {
			const response = await fetch(
				new URL(`.${requestUrl.pathname}`, new URL('./web/dist/client/', import.meta.url))
			);
			if (!response.ok) {
				return c.notFound();
			}
			// set content type if not set
			const suffix = requestUrl.pathname.split('.').at(-1);
			if (response.headers.get('Content-Type') !== null || suffix === undefined) {
				return response;
			}
			const contentTypeValue = std_contentType(`.${suffix}`);
			if (contentTypeValue === undefined) {
				return response;
			}
			return new Response(response.body, {
				headers: {
					...response.headers,
					'Content-Type': contentTypeValue,
				},
			});
		} catch (_) {
			// return 404 if fetch error
			// this happens if you try to fetch a local file `file://...` that doesn't exist
			return c.notFound();
		}
	});

	return router;
}
