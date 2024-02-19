import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import deno from '@astrojs/deno';
import solidJs from '@astrojs/solid-js';
import { defineConfig } from 'astro/config';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: deno({
		// @ts-ignore FIXME: deno adapter provides incomplete types
		start: false,
	}),
	integrations: [solidJs()],
	vite: {
		plugins: [vanillaExtractPlugin()],
		resolve: {
			alias: [
				{
					find: '/^src/',
					replacement: resolve(__dirname, 'src'),
				},
			],
		},
	},
});
