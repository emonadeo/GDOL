import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: {
			plugins: [autoprefixer],
		},
	}),

	kit: {
		adapter: adapter(),
	},

	vitePlugin: {
		experimental: {
			useVitePreprocess: true,
		},
	},

	onwarn(warning, defaultHandler) {
		if (warning.code === 'a11y-no-redundant-roles') return;
		defaultHandler(warning);
	},
};

export default config;
