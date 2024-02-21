import { createApi } from './api/mod.ts';
import { migrations } from './migrations/mod.ts';
import { score } from './score.ts';

import {
	Database,
	databasePath,
	Hono,
	semver_canParse,
	semver_compare,
	semver_parse,
	std_contentType,
} from './deps.ts';

export type GdolServeOptions = {
	port?: number;
	web?: boolean;
};

export type GdolHandlerOptions = GdolServeOptions;

export class Gdol {
	db: Database;

	constructor() {
		this.db = new Database(databasePath);
		this.db.function('gdol_score', score);
	}

	async serve(options?: GdolServeOptions): Promise<void> {
		const port = options?.port ?? 80;

		// run migrations if database is empty
		if ((await Deno.readFile(databasePath)).length === 0) {
			console.log('Initializing Database');
			await this.migrate();
		}

		Deno.serve({ port }, await this.handler(options));
	}

	async handler(options?: GdolHandlerOptions): Promise<Deno.ServeHandler> {
		const port = options?.port ?? 80;
		const web = options?.web ?? true;

		const router = new Hono();

		// serve api
		router.route('/api', createApi(this.db));

		if (!web) {
			return router.fetch;
		}

		// serve web
		Deno.env.set('GDOL_API_URL', `http://127.0.0.1:${port}/api/`);
		const { handle } = await import('./web/dist/server/entry.mjs');
		Deno.env.delete('GDOL_API_URL');
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

		return router.fetch;
	}

	async migrate(): Promise<void> {
		const migrationFiles: string[] = [];
		for await (const fileName of migrations) {
			if (fileName.slice(-4) !== '.sql') {
				console.warn(databasePath);
				continue;
			}
			const semver = semver_canParse(fileName.slice(0, -4));
			if (semver === null) {
				console.error('Skipped invalid migration:', fileName);
				continue;
			}
			migrationFiles.push(fileName);
		}

		migrationFiles.sort((a, b) => semver_compare(semver_parse(a), semver_parse(b)));

		for (const migrationFile of migrationFiles) {
			const migration = await (
				await fetch(new URL(`./migrations/${migrationFile}`, import.meta.url))
			).text();
			try {
				console.info('Running migration', migrationFile);
				this.db.run(migration);
			} catch (_) {
				console.error(
					`Failed to run migration ${migrationFile}. Perhaps it is already initialized?`
				);
			}
		}
	}
}
