import { copy } from 'https://deno.land/std@0.184.0/fs/mod.ts';
import { join } from 'https://deno.land/std@0.184.0/path/mod.ts';

const outDir = 'dist/';

const keep = ['.git'];

const sources = [
	'api/routes',
	'api/mod.ts',
	'api/types.ts',
	'cmd/',
	'migrations/',
	'store/',
	'types/',
	'web/dist/',
	'LICENSE.md',
	'README.md',
	'cli.ts',
	'deps.ts',
	'mod.ts',
];

await emptyDir(outDir, keep);

await Promise.all(sources.map(async (source) => await copy(source, join(outDir, source))));

/**
 * Forked from https://deno.land/std@0.184.0/fs/empty_dir.ts
 * Does not delete files and directories included in keep
 */
async function emptyDir(dir: string, keep: string[]) {
	try {
		const items = [];
		for await (const dirEntry of Deno.readDir(dir)) {
			if (keep.includes(dirEntry.name)) {
				continue;
			}
			items.push(dirEntry);
		}

		while (items.length) {
			const item = items.shift();
			if (item && item.name) {
				const filepath = join(dir, item.name);
				await Deno.remove(filepath, { recursive: true });
			}
		}
	} catch (err) {
		if (!(err instanceof Deno.errors.NotFound)) {
			throw err;
		}

		// if not exist. then create it
		await Deno.mkdir(dir, { recursive: true });
	}
}
