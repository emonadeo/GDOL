import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'path';

export default defineConfig({
	plugins: [solidPlugin()],
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: [
			{
				find: 'src',
				replacement: resolve(__dirname, 'src'),
			},
		],
	},
	css: {
		modules: {
			localsConvention: 'camelCaseOnly',
		},
	},
});
