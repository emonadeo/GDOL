import { useSearchParams } from '@solidjs/router';
import {
	Accessor,
	Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	Setter,
	Show,
} from 'solid-js';

import './pagination.scss';

import iconChevrons from 'src/assets/icons/chevrons.svg';

const perPageOptions = [10, 25, 50, 100];

/**
 * Create a pagination component, that allows to paginate over a given array of items
 * @param items Total array of items
 * @returns Tuple containing an {@link Accessor<Array<T>>} of the paginated array of items and a {@link Component} to control the pagination
 * @example const [itemsPaginated, ItemPagination] = createPagination(() => items())
 */
export const createPagination = function <T>(
	items: Accessor<Array<T>>
): [Accessor<Array<T>>, Component, Component] {
	const [searchParams, setSearchParams] = useSearchParams();

	const [page, setPage] = createSignal<number>(Number(searchParams['page']) || 1);
	const [perPage, setPerPage] = createSignal<number>(
		Number(searchParams['perPage'] || perPageOptions[1])
	);

	const totalPageAmount = createMemo<number>(() => Math.ceil(items().length / perPage()));

	// Update SearchParams whenever page or perPage change
	createEffect(() => setSearchParams({ page: page() }));
	createEffect(() => setSearchParams({ perPage: perPage() }));

	// Reset current page when items or perPage change to avoid out of bounds
	createEffect(() => items() && perPage() && setPage(1));

	// Items currently active in the pagination
	const paginated = createMemo<Array<T>>(() => {
		const paginationStart = (page() - 1) * perPage();
		const paginationEnd = page() * perPage();
		return items().slice(paginationStart, paginationEnd);
	});

	const PageComponent = createPageComponent(totalPageAmount, page, setPage);
	const PerPageComponent = createPerPageComponent(perPage, setPerPage);

	return [paginated, PageComponent, PerPageComponent];
};

function createPageComponent(
	perPageAmount: Accessor<number>,
	page: Accessor<number>,
	setPage: Setter<number>
): Component {
	// TODO: Code kinda ugly ngl
	const pager = createMemo<Array<number | null>>(() => {
		if (perPageAmount() <= 7) {
			return [...Array(perPageAmount()).keys()].map((k) => k + 1);
		}
		if (page() <= 3) {
			return [1, 2, 3, 4, 5, null, perPageAmount()];
		}
		if (page() >= perPageAmount() - 4) {
			return [
				1,
				null,
				perPageAmount() - 4,
				perPageAmount() - 3,
				perPageAmount() - 2,
				perPageAmount() - 1,
				perPageAmount(),
			];
		}
		return [1, null, page() - 1, page(), page() + 1, null, perPageAmount()];
	});

	return () => (
		<ol role="list" class="pagination-page">
			<li>
				<button class="icon" disabled={page() <= 1} onClick={() => setPage((p) => p - 1)}>
					<img src={iconChevrons} alt="Chevrons Left" />
				</button>
			</li>
			<For each={pager()}>
				{(p) => {
					const skip = p === null;
					return (
						<li classList={{ skip }}>
							<Show
								when={skip}
								fallback={
									<button classList={{ selected: page() === p }} onClick={() => p && setPage(p)}>
										<span class="type-label-lg">{p}</span>
									</button>
								}
							>
								<span class="type-label-lg">...</span>
							</Show>
						</li>
					);
				}}
			</For>
			<li>
				<button
					class="icon"
					disabled={page() >= perPageAmount()}
					onClick={() => setPage((p) => p + 1)}
				>
					<img src={iconChevrons} style={{ transform: 'rotate(180deg)' }} alt="Chevrons Right" />
				</button>
			</li>
		</ol>
	);
}

function createPerPageComponent(perPage: Accessor<number>, setPerPage: Setter<number>): Component {
	return () => (
		<ol role="list" class="pagination-per-page">
			<For each={perPageOptions}>
				{(option) => (
					<li>
						<button
							classList={{ selected: perPage() === option }}
							onClick={() => setPerPage(option)}
						>
							<span class="type-label-lg">{option}</span>
						</button>
					</li>
				)}
			</For>
		</ol>
	);
}
