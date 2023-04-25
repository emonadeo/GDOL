import { build, emptyDir } from 'https://deno.land/x/dnt@0.34.0/mod.ts';
import { version } from '../deps.ts';

// watch entry points
import '../api/mod.ts';
import '../types/mod.ts';

const outDir = './api/dist';

const honoVersion = '3.1.6';

await emptyDir(outDir);

await build({
	compilerOptions: {
		lib: ['dom', 'es2022'],
		skipLibCheck: true,
	},
	entryPoints: [
		'./api/mod.ts',
		{
			name: './types',
			path: './types/mod.ts',
		},
	],
	esModule: true,
	declaration: true,
	importMap: 'deno.json',
	mappings: {
		[`https://deno.land/x/hono@v${honoVersion}/mod.ts`]: {
			name: 'hono',
			version: honoVersion,
		},
	},
	outDir,
	package: {
		name: '@gdol/api',
		version: version,
	},
	scriptModule: false,
	shims: {
		undici: true,
		deno: true,
	},
	test: false,
	typeCheck: false,
});
