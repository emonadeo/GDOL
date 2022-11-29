import { Component, createMemo, createResource, createSignal, For } from 'solid-js';
import fzf from 'fuzzysort';

import './page.scss';

import iconFilter from 'src/assets/icons/filter.svg';

import { Level as ILevel } from 'src/openapi';
import { Level, Levels } from 'src/routes/list/levels';
import { Sidebar } from 'src/routes/list/sidebar';

async function fetchList(): Promise<ILevel[]> {
	// TODO: Use OpenAPI
	const res = await fetch(`${import.meta.env.VITE_GDOL_URL}/list`);

	if (!res.ok) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch list`);
	}

	const levels: ILevel[] = await res.json();
	return levels.map((lvl, i) => ({ ...lvl, rank: i + 1 }));
}

const Page: Component = function () {
	const [list] = createResource<ILevel[]>(fetchList);

	return (
		<div class="page page-list">
			<Sidebar length={list()?.length || 0} />
			<main>
				<p class="no-results" style={list()?.length === 0 ? undefined : { display: 'none' }}>
					No results.
				</p>
				<Levels>
					<For each={list()}>{(level) => <Level level={level} />}</For>
				</Levels>
			</main>
		</div>
	);
};

export default Page;
