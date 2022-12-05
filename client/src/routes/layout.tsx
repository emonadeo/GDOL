import { Outlet } from '@solidjs/router';
import { Component } from 'solid-js';
import { AppBar } from './appbar';

import './layout.scss';

const Layout: Component = function () {
	return (
		<div id="layout">
			<AppBar />
			<Outlet />
		</div>
	);
};

export default Layout;
