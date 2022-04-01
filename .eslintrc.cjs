module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	overrides: [
		{ files: ['*.svelte'], processor: 'svelte3/svelte3' },
		{
			files: ['*.js', '*.jsx'],
			rules: {
				'@typescript-eslint/explicit-module-boundary-types': ['off'],
			},
		},
	],
	settings: {
		'svelte3/typescript': () => require('typescript'),
		'svelte3/ignore-styles': ({ lang }) => lang === 'scss',
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		'@typescript-eslint/no-inferrable-types': 'off',
	},
};
