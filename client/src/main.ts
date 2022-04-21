import 'modern-css-reset';
import 'src/styles/global/main.scss';
import 'src/styles/global/typography.scss';

import App from 'src/App.svelte';

const app = new App({
	target: document.getElementById('app'),
});

export default app;
