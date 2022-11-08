<script lang="ts">
	const perPageOptions = [10, 25, 50, 100];

	export let paginationPage: number = 1;
	export let paginationPerPage: number = perPageOptions[1];
	export let items: number;
	export let paginationStart: number = 0;
	$: paginationStart = (paginationPage - 1) * paginationPerPage;
	export let paginationEnd: number = 25;
	$: paginationEnd = paginationPage * paginationPerPage;

	let pageAmount: number;
	$: pageAmount = Math.ceil(items / paginationPerPage);
	let pager: Array<number | null>;
	$: pager = buildPager(paginationPage, paginationPerPage, items);

	// TODO: Code kinda ugly ngl
	function buildPager(page: number, perPage: number, items: number): Array<number | null> {
		const last = Math.ceil(items / perPage);
		if (pageAmount <= 7) {
			return [...Array(pageAmount).keys()].map((k) => k + 1);
		}
		if (page <= 3) {
			return [1, 2, 3, 4, 5, null, last];
		}
		if (page >= last - 4) {
			return [1, null, last - 4, last - 3, last - 2, last - 1, last];
		}
		return [1, null, page - 1, page, page + 1, null, last];
	}
</script>

<nav class="pagination">
	<ol role="list">
		<li>
			<a
				class="icon"
				class:disabled={paginationPage <= 1}
				href={paginationPage <= 1 ? '' : `?page=${paginationPage - 1}&perPage=${paginationPerPage}`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#FFFFFF"
					><path d="M0 0h24v24H0V0z" fill="none" /><path
						d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"
					/></svg
				>
			</a>
		</li>
		{#each pager as p}
			{@const skip = p === null}
			<li class:skip>
				{#if skip}
					<span class="type-label-lg">...</span>
				{:else}
					<a href={`?page=${p}&perPage=${paginationPerPage}`} class:selected={paginationPage === p}>
						<span class="type-label-lg">{p}</span>
					</a>
				{/if}
			</li>
		{/each}
		<li>
			<a
				class="icon"
				class:disabled={paginationPage >= pageAmount - 1}
				href={paginationPage >= pageAmount - 1
					? ''
					: `?page=${paginationPage + 1}&perPage=${paginationPerPage}`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#FFFFFF"
					><path d="M0 0h24v24H0V0z" fill="none" /><path
						d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"
					/></svg
				>
			</a>
		</li>
	</ol>
	<ol role="list">
		{#each perPageOptions as option}
			<li>
				<a href={`?page=1&perPage=${option}`} class:selected={paginationPerPage === option}>
					<span class="type-label-lg">{option}</span>
				</a>
			</li>
		{/each}
	</ol>
</nav>

<style lang="scss">
	@use '$lib/styles/color';

	.pagination {
		display: flex;
		justify-content: space-between;

		ol {
			display: flex;
			height: 42px;
			border: 1px solid rgba(color.$on-background, 0.2);

			li {
				display: flex;
				justify-content: center;
				align-items: center;
				min-width: 42px;

				&.skip {
					color: rgba(color.$on-background, 0.2);
				}

				a {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					padding-inline: 1rem;
					height: 42px;
					color: inherit;

					&.selected {
						border: 1px solid color.$on-background;
					}

					&.disabled svg {
						fill: rgba(color.$on-background, 0.2);
					}

					&:hover {
						background-color: color.$surface;
					}
				}
			}
		}
	}
</style>
