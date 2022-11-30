import {
	Accessor,
	Component,
	createResource,
	createSignal,
	For,
	onCleanup,
	Setter,
} from 'solid-js';

import './page.scss';

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

	const [scrollPosition, setScrollPosition] = createSignal(0);

	// use:observeScroll
	const observeScroll = function (el: Element, value: Accessor<Setter<number>>) {
		const setScrollPosition = value();

		function so() {
			setScrollPosition(el.scrollTop / (el.scrollHeight - el.clientHeight));
		}

		el.addEventListener('scroll', so);

		onCleanup(() => {
			el.removeEventListener('scroll', so);
		});
	};

	return (
		<div class="page page-list">
			<Sidebar length={list()?.length || 0} scrollPosition={scrollPosition()} />
			<main use:observeScroll={setScrollPosition}>
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

// Required for type checking
// See https://www.solidjs.com/docs/latest/api#use___
declare module 'solid-js' {
	namespace JSX {
		interface Directives {
			observeScroll: Setter<number>;
		}
	}
}
