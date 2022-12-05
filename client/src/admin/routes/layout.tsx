/* @refresh reload */
import { Outlet } from '@solidjs/router';
import { Component } from 'solid-js';
import { Sidebar } from 'src/admin/routes/sidebar';

import './layout.scss';

const Layout: Component = function () {
	return (
		<div id="layout">
			<Sidebar />
			<Outlet />
		</div>
	);
};

export default Layout;
