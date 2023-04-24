import { semver_sort, semver_valid, std_flags_parse } from './deps.ts';

import { seed } from './_seed.ts';
import { migrations } from './migrations/mod.ts';

import { Gdol } from './mod.ts';

// TODO: Build a proper CLI (using Cliffy?)

const flags = std_flags_parse(Deno.args);

const gdol = new Gdol();

// --init: run migrations
if (flags.init) {
	let migrationFiles = [];
	for await (const fileName of migrations) {
		if (fileName.slice(-4) !== '.sql') {
			console.warn('Skipping non-.sql file:', fileName);
			continue;
		}
		const semver = semver_valid(fileName.slice(0, -4));
		if (semver === null) {
			console.error('Skipped invalid migration:', fileName);
			continue;
		}
		migrationFiles.push(fileName);
	}
	migrationFiles = semver_sort(migrationFiles);

	for (const migrationFile of migrationFiles) {
		const migration = await (
			await fetch(new URL(`./migrations/${migrationFile}`, import.meta.url))
		).text();
		try {
			console.info('Running migration', migrationFile);
			gdol.db.run(migration);
		} catch (_) {
			console.error(
				`Failed to run migration ${migrationFile}. Perhaps you already initialized it?`
			);
		}
	}
}

// --seed: seed database
if (flags.seed) {
	await seed(gdol.db);
}

await gdol.serve();
