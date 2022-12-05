import { Component } from 'solid-js';
import './page.scss';

const Page: Component = function () {
	return (
		<div class="page page-dashboard">
			<p>Hello Username</p>
			<div class="review">
				<h3 class="title">13 New Submissions</h3>
				<div class="status">
					<p>Currently Reviewing: 0 other users</p>
				</div>
				<a class="cta type-label-lg">Review</a>
			</div>
		</div>
	);
};

export default Page;
