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
): [Accessor<Array<T>>, Component] {
	const [searchParams, setSearchParams] = useSearchParams();

	const [page, setPage] = createSignal<number>(Number(searchParams['page']) || 1);
	const [perPage, setPerPage] = createSignal<number>(
		Number(searchParams['perPage'] || perPageOptions[1])
	);

	// Update SearchParams whenever
	createEffect(() => setSearchParams({ page: page() }));
	createEffect(() => setSearchParams({ perPage: perPage() }));

	// Items currently active in the pagination
	const paginated = createMemo<Array<T>>(() => {
		const paginationStart = (page() - 1) * perPage();
		const paginationEnd = page() * perPage();
		return items().slice(paginationStart, paginationEnd);
	});

	const PaginationComponent = createPaginationComponent<T>(
		items,
		page,
		setPage,
		perPage,
		setPerPage
	);

	return [paginated, PaginationComponent];
};

//
function createPaginationComponent<T>(
	items: Accessor<Array<T>>,
	page: Accessor<number>,
	setPage: Setter<number>,
	perPage: Accessor<number>,
	setPerPage: Setter<number>
): Component {
	const pageAmount = createMemo<number>(() => Math.ceil(items().length / perPage()));

	// TODO: Code kinda ugly ngl
	const pager = createMemo<Array<number | null>>(() => {
		if (pageAmount() <= 7) {
			return [...Array(pageAmount()).keys()].map((k) => k + 1);
		}
		if (page() <= 3) {
			return [1, 2, 3, 4, 5, null, pageAmount()];
		}
		if (page() >= pageAmount() - 4) {
			return [
				1,
				null,
				pageAmount() - 4,
				pageAmount() - 3,
				pageAmount() - 2,
				pageAmount() - 1,
				pageAmount(),
			];
		}
		return [1, null, page() - 1, page(), page() + 1, null, pageAmount()];
	});

	return function () {
		return (
			<nav class="pagination">
				<ol role="list">
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
											<button
												classList={{ selected: page() === p }}
												onClick={() => p && setPage(p)}
											>
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
							disabled={page() >= pageAmount()}
							onClick={() => setPage((p) => p + 1)}
						>
							<img
								src={iconChevrons}
								style={{ transform: 'rotate(180deg)' }}
								alt="Chevrons Right"
							/>
						</button>
					</li>
				</ol>
				<ol role="list">
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
			</nav>
		);
	};
}
