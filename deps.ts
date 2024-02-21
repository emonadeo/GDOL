export const version = '0.1.0';
export const databasePath = 'gdol.db';

import { Database } from 'https://deno.land/x/sqlite3@0.9.1/mod.ts';

export { exists as std_exists } from 'https://deno.land/std@0.216.0/fs/mod.ts';
export { contentType as std_contentType } from 'https://deno.land/std@0.216.0/media_types/mod.ts';
export {
	canParse as semver_canParse,
	compare as semver_compare,
	parse as semver_parse,
} from 'https://deno.land/std@0.216.0/semver/mod.ts';
export { Database };
export { Hono } from 'https://deno.land/x/hono@v4.0.5/mod.ts';
export { Command } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts';

declare module 'https://deno.land/x/hono@v4.0.5/mod.ts' {
	interface ContextVariableMap {
		db: Database;
	}
}
