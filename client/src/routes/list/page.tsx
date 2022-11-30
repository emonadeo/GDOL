import { Component, createResource, createSignal, For } from 'solid-js';

import './page.scss';

import { Level as ILevel } from 'src/openapi';
import { ListLevel, ListLevels } from 'src/routes/list/levels';
import { ListSidebar } from 'src/routes/list/sidebar';
import { observeScroll as _observeScroll } from 'src/directives/observeScroll';

const observeScroll = _observeScroll;

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

	const [scrollPosition, setScrollPosition] = createSignal(0);

	return (
		<div class="page page-list">
			<ListSidebar length={list()?.length || 0} scrollPosition={scrollPosition()} />
			<main use:observeScroll={setScrollPosition}>
				<p class="no-results" style={list()?.length === 0 ? undefined : { display: 'none' }}>
					No results.
				</p>
				<ListLevels>
					<For each={list()}>{(level) => <ListLevel level={level} />}</For>
				</ListLevels>
			</main>
		</div>
	);
};

export default Page;
