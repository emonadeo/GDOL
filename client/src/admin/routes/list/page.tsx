/* @refresh reload */
import { useRouteData } from '@solidjs/router';
import { Component, createSignal, For, Show } from 'solid-js';
import {
	ListEdit,
	ListEditState,
	ListEditStateAdd,
	ListEditStateArchive,
	ListEditStateMove,
} from 'src/admin/routes/list/edit';
import { ListData } from 'src/openapi';

import iconArchive from 'src/assets/icons/admin/archive.svg';
import iconMove from 'src/assets/icons/admin/move.svg';

import './page.scss';

const Page: Component = function () {
	const [list, { refetch }] = useRouteData<typeof ListData>();

	const [editState, setEditState] = createSignal<ListEditState>();

	function onReset() {
		setEditState(); // clear state
	}

	function onSubmit() {
		setEditState(); // clear state
		refetch();
	}

	return (
		<div class="page-admin-list">
			<div class="list">
				<table>
					<thead>
						<tr>
							<th class="actions" colspan={2}></th>
							<th class="rank">
								<p class="type-title-sm">Rank</p>
							</th>
							<th class="name">
								<p class="type-title-sm">Name</p>
							</th>
							<th class="user">
								<p class="type-title-sm">User</p>
							</th>
							<th class="requirement">
								<p class="type-title-sm">Req.</p>
							</th>
						</tr>
					</thead>
					<tbody>
						<For each={list()}>
							{(level, i) => (
								<>
									<tr class="add" onClick={() => setEditState(new ListEditStateAdd(i()))}>
										<td colspan={5} />
									</tr>
									<tr>
										<td class="actions move">
											<button
												class="type-label-lg"
												onClick={() => setEditState(new ListEditStateMove(i()))}
											>
												<img src={iconMove} alt="Move" />
											</button>
										</td>
										<td class="actions archive">
											<button
												class="type-label-lg"
												onClick={() => setEditState(new ListEditStateArchive(i()))}
											>
												<img src={iconArchive} alt="Archive" />
											</button>
										</td>
										<td class="rank">
											<p class="mono">{level.rank}</p>
										</td>
										<td class="name">
											<p>{level.name}</p>
										</td>
										<td class="user">
											<p>{level.user.name}</p>
										</td>
										<td class="requirement">
											<p class="mono">{level.requirement}%</p>
										</td>
									</tr>
								</>
							)}
						</For>
					</tbody>
				</table>
			</div>
			<Show when={editState()} keyed>
				{(state) => (
					<ListEdit list={list() || []} state={state} onReset={onReset} onSubmit={onSubmit} />
				)}
			</Show>
		</div>
	);
};

export default Page;
