import { build, emptyDir } from 'https://deno.land/x/dnt@0.40.0/mod.ts';
import { version } from '../deps.ts';

// watch entry points
import '../mod.node.ts';

const outDir = './dist/node/';

const honoVersion = '4.0.5';

await emptyDir(outDir);

await build({
	compilerOptions: {
		lib: ['DOM', 'ES2021'],
		importHelpers: true,
		skipLibCheck: true,
		target: 'ES2021',
	},
	entryPoints: ['./mod.node.ts'],
	esModule: true,
	declaration: 'inline',
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
