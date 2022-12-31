import { Component } from 'solid-js';

import './sidebar.scss';

import iconLogout from 'src/assets/icons/logout.svg';
import { ariaCurrent } from 'src/util/aria';

export const Sidebar: Component = function () {
	return (
		<nav class="sidebar">
			<ul role="list" class="categories">
				<li aria-current={ariaCurrent('/admin/records/*')}>
					<a href="/admin/records" class="type-label-lg">
						Records
					</a>
				</li>
				<li aria-current={ariaCurrent('/admin/list/*')}>
					<a href="/admin/list" class="type-label-lg">
						List
					</a>
				</li>
				<li aria-current={ariaCurrent('/admin/levels/*')}>
					<a href="/admin/levels" class="type-label-lg">
						Levels
					</a>
				</li>
				<li aria-current={ariaCurrent('/admin/users/*')}>
					<a href="/admin/users" class="type-label-lg">
						Users
					</a>
				</li>
			</ul>
			<ul role="list" class="actions">
				<li>
					<button class="type-label-lg">
						<img src={iconLogout} alt="Logout" />
					</button>
				</li>
			</ul>
		</nav>
	);
};
