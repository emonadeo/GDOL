<script lang="ts">
	import fzf from 'fuzzysort';
	import type { PageData } from './$types';

	import medal from '$lib/assets/medal.svg';

	import { ordinal } from '$lib/util';

	import Pagination from '$lib/components/Pagination.svelte';

	export let data: PageData;

	let search: string = '';

	// Pagination
	let paginationStart: number;
	let paginationEnd: number;

	// TODO: clean up
	$: fUsers = search
		? fzf.go(search, data.users, { key: 'fzfp' }).map((res) => res.obj)
		: data.users;
</script>

<div class="page-leaderboard">
	<aside class="filter">
		<input class="textfield type-label-lg" type="text" placeholder="Search" bind:value={search} />
		<div class="pagination">
			<Pagination
				items={fUsers.length}
				bind:paginationStart
				bind:paginationEnd
				paginationPage={data.pagination.page}
				paginationPerPage={data.pagination.perPage}
			/>
		</div>
	</aside>
	<aside class="medal" style:display={fUsers.length < 8 ? 'none' : null}>
		<img src={medal} alt="Medal" />
	</aside>
	<main>
		<table>
			<tr class="thr">
				<th class="rank">
					<p class="type-title-md">Rank</p>
				</th>
				<th class="score">
					<p class="type-title-md">Score</p>
				</th>
				<th class="player">
					<p class="type-title-md">Player</p>
				</th>
			</tr>
			<!-- TODO: Pagination -->
			{#each fUsers.slice(paginationStart, paginationEnd) as user (user.id)}
				<tr>
					<td
						class="rank"
						class:gold={user.rank === 1}
						class:silver={user.rank === 2}
						class:bronze={user.rank === 3}
					>
						<p class="mono">
							<span>{user.rank}</span><span>{ordinal(user.rank)}</span>
						</p>
					</td>
					<td class="score">
						<p class="mono">{user.score.toFixed(2)}</p>
					</td>
					<td class="player">
						<a href={`/users/${user.name}`}>
							<p>{user.name}</p>
						</a>
					</td>
				</tr>
			{/each}
		</table>
	</main>
	<aside class="filter">
		<div class="pagination">
			<Pagination
				items={fUsers.length}
				bind:paginationStart
				bind:paginationEnd
				paginationPage={data.pagination.page}
				paginationPerPage={data.pagination.perPage}
			/>
		</div>
	</aside>
</div>

<style lang="scss">
	@use '$lib/styles/screen';
	@use '$lib/styles/color';
	@use '$lib/styles/util';

	@include screen.xl {
		.page-leaderboard {
			overflow-y: scroll;
			flex: 1 0 0;
			display: grid;
			grid-template-columns: calc(6.5rem + 4px) 1fr 8rem;
			grid-template-rows: max-content 1fr;
			padding-left: calc(6rem + 1px);
			padding-right: calc(6rem + 1px);
			column-gap: 1.5rem;

			&:last-child {
				padding-bottom: 6rem;
			}

			aside.medal {
				position: sticky;
				top: 8rem;
				margin-top: 8rem;
				justify-self: end;
				align-self: start;
				grid-column: 1;

				img {
					height: 14.25rem;
				}
			}

			aside.filter {
				grid-column: 1 / 4;
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 1.5rem;
				align-items: center;
				padding-top: 1.5rem;
				padding-left: calc(8rem + 4px);
				padding-right: 9.5rem;
				background-color: color.$background;

				.pagination {
					grid-column: 1 / 3;
				}
			}

			main {
				grid-row: 2;
				grid-column: 2;

				table {
					tr {
						&:hover td {
							border-top-color: color.$on-background;
							border-bottom-color: color.$on-background;

							&:first-child {
								border-left-color: color.$on-background;
							}

							&:last-child {
								border-right-color: color.$on-background;
							}
						}

						th,
						td {
							text-align: start;
							vertical-align: middle;
							padding-inline: 0.75rem;
							height: 42px;
							white-space: nowrap;
						}

						th {
							position: sticky;
							top: 0;
							background-color: color.$background;
							height: 4rem;
							padding-block: 1.25rem;
							border-bottom: 1px solid rgba(color.$on-background, 0.2);
						}

						td {
							border-top: 1px solid transparent;
							border-bottom: 1px solid rgba(color.$on-background, 0.2);
							border-left: 1px solid rgba(color.$on-background, 0.2);

							&:last-child {
								border-right: 1px solid rgba(color.$on-background, 0.2);
							}
						}

						th.rank,
						td.rank {
							text-align: right;
						}

						td.rank {
							p {
								font-weight: 700;
							}

							&.gold p {
								@include util.text-gradient(#ffd700, #e89e00, #ffd700);
							}

							&.silver p {
								@include util.text-gradient(#ffffff, #c0c0c0, #c0c0c0);
							}

							&.bronze p {
								@include util.text-gradient(#ff8e31, #d45d00, #e8721d);
							}
						}

						th.score,
						td.score {
							text-align: right;
							width: 30%;
						}

						th.player,
						td.player {
							width: 70%;

							a {
								color: inherit;
							}
						}
					}
				}
			}
		}
	}
</style>
