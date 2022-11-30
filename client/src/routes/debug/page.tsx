import { Component } from 'solid-js';

import './page.scss';

const Page: Component = function () {
	return (
		<div class="page page-debug">
			<h1>Large Display</h1>
			<h2>Medium Display</h2>
			<h3>Small Display</h3>
			<h4>Large Title</h4>
			<h5>Medium Title</h5>
			<h6>Small Title</h6>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat.
			</p>
			<p class="type-body-md">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
				laboris nisi ut aliquip ex ea commodo consequat.
			</p>
		</div>
	);
};

export default Page;
