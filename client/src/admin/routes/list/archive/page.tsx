import { useRouteData } from '@solidjs/router';
import { Component, For } from 'solid-js';
import { ListArchiveData } from 'src/openapi';

import './page.scss';

const Page: Component = function () {
	const levels = useRouteData<typeof ListArchiveData>();

	return (
		<div class="page-admin-list-archive">
			{/* TODO */}
			<ol role="list">
				<For each={levels()}>
					{(level) => (
						<li>
							<p>
								{new Date(level.timestamp).toLocaleString()}
								{level.name}
							</p>
						</li>
					)}
				</For>
			</ol>
		</div>
	);
};

export default Page;
