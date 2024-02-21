import { Component, createMemo, createSignal, For, Show } from 'solid-js';

import {
	archive,
	button_collapse,
	button_collapse_icon,
	minimap,
	minimap_scroll_indicator,
	minimap_stop,
	minimap_stop_connector,
	minimap_stops,
	nav,
} from './sidebar.css.ts';
import { scrollPosition } from './store.ts';

import iconChevrons from 'src/assets/icons/chevrons.svg';
import { observeHeight } from 'src/directives/observeHeight.ts';
import { screens } from 'src/styles/atomic/screens.css.ts';
import { label_large } from 'src/styles/atomic/typography.css.ts';

observeHeight;

type ListSidebarProps = {
	length: number;
};

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

	const stops = createMemo(() => {
		const n = stopsAmount();
		return Array.from({ length: n }, (_, i) => Math.trunc(i * ((props.length - 1) / (n - 1)) + 1));
	});

	return (
		<aside>
			<nav class={nav[collapsed() ? 'collapsed' : 'uncollapsed']}>
				<div class={minimap} use:observeHeight={setScrollHeight}>
					<ScrollIndicator position={scrollPosition()} height={scrollHeight()} />
					<ol class={minimap_stops}>
						<For each={stops()}>
							{(stop, i) => (
								<>
									<li>
										<a
											class={[minimap_stop, label_large].join(' ')}
											href={`#${stop}`}
											onClick={() => setCollapsed(true)}
										>
											{stop}
										</a>
									</li>
									<Show when={i() < stopsAmount() - 1}>
										<div class={minimap_stop_connector} />
									</Show>
								</>
							)}
						</For>
					</ol>
				</div>
				<div>
					<a class={[archive, label_large].join(' ')} href="/archive">
						Archive
					</a>
				</div>
			</nav>
			<button
				class={[button_collapse, screens.lt_sm].join(' ')}
				onClick={() => setCollapsed(!collapsed())}
			>
				<img
					class={button_collapse_icon[collapsed() ? 'collapsed' : 'uncollapsed']}
					src={iconChevrons.src}
					alt={collapsed() ? 'uncollapse' : 'collapse'}
				/>
			</button>
		</aside>
	);
};

// Scroll Indicator
type ScrollIndicatorProps = {
	position: number;
	height: number;
};

export const ScrollIndicator: Component<ScrollIndicatorProps> = function (props) {
	const padding = 32;
	const width = 6;

	return (
		<svg
			class={minimap_scroll_indicator}
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
