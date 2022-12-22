/* @refresh reload */
import { Outlet } from '@solidjs/router';
import { Component } from 'solid-js';
import { ariaCurrent } from 'src/util/aria';

import './layout.scss';

const Layout: Component = function () {
	return (
		<div class="layout">
			<nav>
				<ul role="list">
					<li aria-current={ariaCurrent('/admin/list')}>
						<a href="/admin/list" class="type-title-md">
							Levels
						</a>
					</li>
					<li aria-current={ariaCurrent('/admin/list/archive')}>
						<a href="/admin/list/archive" class="type-title-md">
							Archive
						</a>
					</li>
					<li aria-current={ariaCurrent('/admin/list/settings')}>
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
