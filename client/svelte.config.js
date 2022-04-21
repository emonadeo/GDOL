import { resolve } from 'path';
import { pathToFileURL } from 'url';
import sass from 'sass';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

import aliases from './alias.js';

export default {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess({
		postcss: {
			plugins: [autoprefixer],
		},
		scss({ content }) {
			// Update to new SASS API (unconfigured svelte-preprocess uses legacy code)
			const res = sass.compileString(content, {
				sourceMap: true,
				// Add ./client loadPath as VSCode bug workaround
				loadPaths: [resolve('./client')],
				// Add support for vite aliases
				importers: [
					{
						findFileUrl(url) {
							for (const alias of aliases) {
								if (url.startsWith(alias[0])) {
									const path = resolve(url.replace(alias[0], alias[1]));
									return pathToFileURL(path);
								}
							}
							return null;
						},
					},
				],
			});
			return {
				code: res.css,
				map: res.sourceMap,
			};
		},
	}),
};
