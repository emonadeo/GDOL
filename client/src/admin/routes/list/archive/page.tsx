import { useRouteData } from '@solidjs/router';
import { Component, For } from 'solid-js';
import { ListArchiveData } from 'src/openapi';

import './page.scss';

import { table } from 'src/admin/components/table.module.scss';

const Page: Component = function () {
	const levels = useRouteData<typeof ListArchiveData>();

	return (
		<div class="page-admin-list-archive">
			{/* TODO */}
			<table class={table}>
				<thead>
					<tr>
						<th class="timestamp">
							<p class="type-title-sm">Date</p>
						</th>
						<th class="name">
							<p class="type-title-sm">Name</p>
						</th>
					</tr>
				</thead>
				<tbody>
					<For each={levels()}>
						{(level) => (
							<tr>
								<td>
									<p>{new Date(level.timestamp).toLocaleDateString()}</p>
								</td>
								<td>
									<p>{level.name}</p>
								</td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
};

export default Page;
