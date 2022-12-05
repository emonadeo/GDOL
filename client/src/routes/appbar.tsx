import { useMatch } from '@solidjs/router';
import { Component } from 'solid-js';

import logo from 'src/assets/logo.svg';

import iconMenu from 'src/assets/icons/menu.svg';
import iconSearch from 'src/assets/icons/search.svg';
import iconUser from 'src/assets/icons/user.svg';

import './appbar.scss';

/**
 * Checks if the active route matches {@link path}. Returns 'page' if it does, false otherwise
 * See {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current}
 */
function ariaCurrent(path: string): 'page' | false {
	return !!useMatch(() => path)() && 'page';
}

export const AppBar: Component = function () {
	return (
		<nav class="appbar">
			{/* Logo */}
			<img class="logo screen:lg" src={logo} alt="Logo" />
			{/* Pages */}
			<ul class="links screen:lg" role="list">
				<li class="link" aria-current={ariaCurrent('/')}>
					<a class="type-title-md" href="/">
						Home
					</a>
				</li>
				<li class="link" aria-current={ariaCurrent('/list/*')}>
					<a class="type-title-md" href="/list">
						List
					</a>
				</li>
				<li class="link" aria-current={ariaCurrent('/leaderboard/*')}>
					<a class="type-title-md" href="/leaderboard">
						Leaderboard
					</a>
				</li>
				<li class="link" aria-current={ariaCurrent('/more/*')}>
					<a class="type-title-md" href="/more">
						More
					</a>
				</li>
			</ul>
			{/* Menu */}
			<a class="menu screen:lt-lg" href="">
				<img src={iconMenu} alt="Menu" width={24} height={24} />
			</a>
			{/* Location */}
			<div class="location screen:lt-lg">
				<p class="type-title-md">List</p>
			</div>
			{/* Search */}
			<a class="search" href="">
				<img src={iconSearch} alt="Search" width={24} height={24} />
			</a>
			{/* User */}
			<a class="user" href="">
				<img src={iconUser} alt="User" width={24} height={24} />
			</a>
		</nav>
	);
};
