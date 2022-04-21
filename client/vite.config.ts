import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

import alias from './alias.js';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias,
	},
});
