/* @refresh reload */
import { useRouteData } from '@solidjs/router';
import { Component, createSignal, Show } from 'solid-js';
import {
	createListEditStateAdd,
	createListEditStateArchive,
	createListEditStateMove,
	ListEdit,
	ListEditState,
} from 'src/admin/routes/list/edit';
import { ListData } from 'src/openapi';

import iconArchive from 'src/assets/icons/admin/archive.svg';
import iconMove from 'src/assets/icons/admin/move.svg';

import './page.scss';

import { AdminTable } from 'src/admin/components/table';

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
				<Show when={list()} keyed>
					{(l) => (
						<AdminTable
							rows={l.map((lvl) => ({
								rank: lvl.rank,
								name: lvl.name,
								user: lvl.user.name,
								req: lvl.requirement,
							}))}
							head={{
								rank: 'Rank',
								name: 'Name',
								user: 'User',
								req: 'Requirement',
							}}
							actions={[
								{
									label: 'Archive',
									icon: iconArchive,
									onClick: (i) => setEditState(createListEditStateArchive(i + 1)),
								},
								{
									label: 'Move',
									icon: iconMove,
									onClick: (i) => setEditState(createListEditStateMove(i + 1)),
								},
							]}
							onAdd={(i) => setEditState(createListEditStateAdd(i + 1))}
						/>
					)}
				</Show>
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
