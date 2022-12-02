/* @refresh reload */
import { Component, lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router, Routes } from '@solidjs/router';

import 'modern-css-reset';
import 'src/styles/global/main.scss';
import 'src/styles/global/responsive.scss';
import 'src/styles/global/typography.scss';

import './index.scss';

import { AppBar } from 'src/appbar';
import { ListData, UsersData } from 'src/openapi';

const App: Component = function () {
	return (
		<div id="app">
			<AppBar />
			<Routes>
				<Route path="/" />
				<Route
					path="/list"
					component={lazy(() => import('src/routes/list/page'))}
					data={ListData}
				/>
				<Route
					path="/leaderboard"
					component={lazy(() => import('src/routes/leaderboard/page'))}
					data={UsersData}
				/>
				<Route path="/debug" component={lazy(() => import('src/routes/debug/page'))} />
			</Routes>
		</div>
	);
};

render(
	() => (
		<Router>
			<App />
		</Router>
	),
	document.getElementById('root') as HTMLElement
);
