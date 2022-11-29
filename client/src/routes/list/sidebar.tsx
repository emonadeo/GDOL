import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';

import './sidebar.scss';

import iconChevrons from 'src/assets/icons/chevrons.svg';

const stopsAmount = 7;

interface SidebarProps {
	length: number;
}

export const Sidebar: Component<SidebarProps> = function (props) {
	const [collapsed, setCollapsed] = createSignal(true);

	const stops = createMemo<number[]>(() => {
		return Array.from({ length: stopsAmount }, (_, i) =>
			Math.trunc(i * ((props.length - 1) / (stopsAmount - 1)) + 1)
		);
	});

	return (
		<aside class="sidebar">
			<Transition name="slide">
				<Show when={!collapsed()}>
					<nav class="stops">
						<ol role="list">
							<For each={stops()}>
								{(stop, i) => (
									<>
										<li>
											<a
												class="type-label-lg"
												href={`#rank-${stop}`}
												onClick={() => setCollapsed(true)}
											>
												{stop}
											</a>
										</li>
										<Show when={i() < stopsAmount - 1}>
											<div class="connector" />
										</Show>
									</>
								)}
							</For>
						</ol>
					</nav>
				</Show>
			</Transition>
			<button
				class="toggle"
				classList={{ uncollapsed: !collapsed() }}
				onClick={() => setCollapsed(!collapsed())}
			>
				<img src={iconChevrons} alt="TODO" />
			</button>
		</aside>
	);
};
