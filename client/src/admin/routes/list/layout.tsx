/* @refresh reload */
import { Outlet } from '@solidjs/router';
import { Component } from 'solid-js';

import './layout.scss';

const Layout: Component = function () {
	return (
		<div class="layout">
			<nav>
				<ul role="list">
					<li>
						<a href="/admin/list" class="type-title-md">
							Levels
						</a>
					</li>
					<li>
						<a href="/admin/list/settings" class="type-title-md">
							Settings
						</a>
					</li>
				</ul>
			</nav>
			<Outlet />
		</div>
	);
};

export default Layout;
