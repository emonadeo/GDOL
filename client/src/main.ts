import 'modern-css-reset';
import 'src/styles/main.scss';
import 'src/styles/typography.scss';

import App from './App.svelte';

const app = new App({
	target: document.getElementById('app'),
});

export default app;
