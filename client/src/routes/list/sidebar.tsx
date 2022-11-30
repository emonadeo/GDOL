import { Component, createMemo, createSignal, For, Show } from 'solid-js';

import './sidebar.scss';

import iconChevrons from 'src/assets/icons/chevrons.svg';
import { observeHeight as _observeHeight } from 'src/directives/observeHeight';

const observeHeight = _observeHeight;

interface ListSidebarProps {
	length: number;
	scrollPosition: number;
}

const stopsHeight = 64;
const stopsMinGap = 64;
const minStopsAmount = 2;
const maxStopsAmount = 5;

export const ListSidebar: Component<ListSidebarProps> = function (props) {
	const [collapsed, setCollapsed] = createSignal(true);

	const [scrollHeight, setScrollHeight] = createSignal(0);
	const stopsAmount = createMemo(() => {
		const n = Math.trunc((scrollHeight() + stopsMinGap) / (stopsHeight + stopsMinGap));
		return Math.min(Math.max(n, minStopsAmount), maxStopsAmount);
	});

	const stops = () => {
		return Array.from({ length: stopsAmount() }, (_, i) =>
			Math.trunc(i * ((props.length - 1) / (stopsAmount() - 1)) + 1)
		);
	};

	return (
		<aside class="page-list-sidebar">
			<nav classList={{ uncollapsed: !collapsed() }}>
				<div class="scroll" use:observeHeight={setScrollHeight}>
					<ScrollIndicator position={props.scrollPosition} height={scrollHeight()} />
					<ol role="list" class="stops">
						<For each={stops()}>
							{(stop, i) => (
								<>
									<li class="stop">
										<a class="type-label-lg" href={`#${stop}`} onClick={() => setCollapsed(true)}>
											{stop}
										</a>
									</li>
									<Show when={i() < stopsAmount() - 1}>
										<div class="connector" />
									</Show>
								</>
							)}
						</For>
					</ol>
				</div>
				<div class="archive">
					<a class="type-label-lg" href="/archive">
						Archive
					</a>
				</div>
			</nav>
			<button
				class="toggle screen:lt-sm"
				classList={{ uncollapsed: !collapsed() }}
				onClick={() => setCollapsed(!collapsed())}
			>
				<img src={iconChevrons} alt="TODO" />
			</button>
		</aside>
	);
};

// Scroll Indicator
interface ScrollIndicatorProps {
	position: number;
	height: number;
}

export const ScrollIndicator: Component<ScrollIndicatorProps> = function (props) {
	const padding = 32;
	const width = 6;

	return (
		<svg
			class="scroll-indicator"
			width={width}
			height={width * 2}
			viewBox="0 0 1 2"
			style={{
				top: `${props.position * (props.height - 2 * padding) + padding - width}px`,
			}}
		>
			<polygon points="1,0 1,2 0,1" fill="#ffffff" />
		</svg>
	);
};
