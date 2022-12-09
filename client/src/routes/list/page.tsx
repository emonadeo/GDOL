import { Component, createSignal, For } from 'solid-js';

import './page.scss';

import { useRouteData } from '@solidjs/router';
import { observeScroll as _observeScroll } from 'src/directives/observeScroll';
import { ListData } from 'src/openapi';
import { ListLevel, ListLevels } from 'src/routes/list/levels';
import { ListSidebar } from 'src/routes/list/sidebar';

const observeScroll = _observeScroll;

const Page: Component = function () {
	const [list] = useRouteData<typeof ListData>();
	const [scrollPosition, setScrollPosition] = createSignal(0);

	return (
		<div class="page page-list">
			<ListSidebar length={list()?.length || 0} scrollPosition={scrollPosition()} />
			<main use:observeScroll={setScrollPosition}>
				<ListLevels>
					<For each={list()}>{(level) => <ListLevel level={level} />}</For>
				</ListLevels>
			</main>
		</div>
	);
};

export default Page;
