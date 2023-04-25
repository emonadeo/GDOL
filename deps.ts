export const version = '0.1.0';
export const databasePath = 'gdol.db';

export { exists as std_exists } from 'https://deno.land/std@0.184.0/fs/mod.ts';
export { type Handler, serve as std_serve } from 'https://deno.land/std@0.184.0/http/server.ts';
export { contentType as std_contentType } from 'https://deno.land/std@0.184.0/media_types/mod.ts';
export {
	sort as semver_sort,
	valid as semver_valid,
} from 'https://deno.land/std@0.184.0/semver/mod.ts';
export { Hono, type Env as HonoEnv } from 'https://deno.land/x/hono@v3.1.6/mod.ts';
export { Database } from 'https://deno.land/x/sqlite3@0.9.1/mod.ts';
export { Command } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts';
