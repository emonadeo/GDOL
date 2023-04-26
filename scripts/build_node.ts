import { build, emptyDir } from 'https://deno.land/x/dnt@0.34.0/mod.ts';
import { version } from '../deps.ts';

// watch entry points
import '../mod_node.ts';

const outDir = './node';

const honoVersion = '3.1.6';

await emptyDir(outDir);

await build({
	compilerOptions: {
		lib: ['dom', 'es2021'],
		importHelpers: true,
		skipLibCheck: true,
		target: 'ES2021',
	},
	entryPoints: ['./mod_node.ts'],
	esModule: true,
	declaration: true,
	skipSourceOutput: true,
	importMap: 'deno.json',
	mappings: {
		[`https://deno.land/x/hono@v${honoVersion}/mod.ts`]: {
			name: 'hono',
			version: honoVersion,
			peerDependency: true,
		},
	},
	outDir,
	package: {
		name: '@gdol/node',
		version: version,
	},
	scriptModule: false,
	shims: {
		deno: true,
	},
	test: false,
	typeCheck: false,
});
