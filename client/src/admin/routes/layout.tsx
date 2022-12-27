/* @refresh reload */
import { Outlet } from '@solidjs/router';
import { Component } from 'solid-js';
import { Sidebar } from 'src/admin/routes/sidebar';

import { layout } from './layout.module.scss';

const Layout: Component = function () {
	return (
		<div class={layout}>
			<Sidebar />
			<Outlet />
		</div>
	);
};

export default Layout;
