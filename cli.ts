import { seed } from './cmd/seed.ts';
import { Command, version } from './deps.ts';

import { Gdol } from './mod.ts';

await new Command()
	.name('GDOL')
	.version(version)
	.description('Geometry Dash Open List')
	.option('--port <port:integer>', 'Port the webserver runs on.', {
		default: 80,
	})
	.option('--no-web', 'Disable the user interface and only serve API.', {
		default: true,
	})
	.action(({ port, web }) => {
		const gdol = new Gdol();
		gdol.serve({ port, web });
	})
	.command('seed', seed)
	.parse(Deno.args);
