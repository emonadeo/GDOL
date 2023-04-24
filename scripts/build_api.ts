import { dnt_build, dnt_emptyDir } from '../deps.ts';

// watch entry points
import '../api/mod.ts';
import '../types/mod.ts';

const outDir = './api/dist';

const honoVersion = '3.1.6';

await dnt_emptyDir(outDir);

await dnt_build({
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
		version: '0.1.0',
	},
	scriptModule: false,
	shims: {
		undici: true,
		deno: true,
	},
	test: false,
	typeCheck: false,
});
