import { useRouteData } from '@solidjs/router';
import { Component, createMemo, createSignal, Show } from 'solid-js';
import { AdminTable } from 'src/admin/components/table';
import { LevelsData } from 'src/openapi';
import { Level } from 'src/generated/openapi';

import { AdminLevelsEdit } from './edit';

import { page, pageTable } from './page.module.scss';

import iconEdit from 'src/assets/icons/edit.svg';

const Page: Component = function () {
	const levels = useRouteData<typeof LevelsData>();

	const [selected, setSelected] = createSignal<'add' | number | undefined>();

	const selectedLevel = createMemo<Level | undefined>(() => {
		const sel = selected();
		if (sel === undefined || sel === 'add') return undefined;
		return levels()?.at(sel);
	});

	return (
		<div class={page}>
			<div class={pageTable}>
				<Show when={levels()} keyed>
					{(lvls) => (
						<AdminTable
							rows={lvls.map((lvl) => ({
								id: lvl.id,
								name: lvl.name,
								user: lvl.user.name,
								req: lvl.requirement,
							}))}
							head={{
								id: 'ID',
								name: 'Name',
								user: 'User',
								req: 'Req.',
							}}
							actions={[
								{
									label: 'Edit',
									icon: iconEdit,
									onClick: (i) => setSelected(i),
								},
							]}
						/>
					)}
				</Show>
			</div>
			<Show when={levels() && selected() !== undefined}>
				<AdminLevelsEdit level={selectedLevel()} onReset={() => setSelected()} />
			</Show>
		</div>
	);
};

export default Page;
