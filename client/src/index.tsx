/* @refresh reload */
import { Component } from 'solid-js';
import { render } from 'solid-js/web';
import { Router, useRoutes } from '@solidjs/router';

import { routes } from 'src/routes';

import 'modern-css-reset';
import 'src/styles/global/main.scss';
import 'src/styles/global/responsive.scss';
import 'src/styles/global/typography.scss';

const App: Component = function () {
	const Routes = useRoutes(routes);

	return <Routes />;
};

render(
	() => (
		<Router>
			<App />
		</Router>
	),
	document.getElementById('root') as HTMLElement
);
