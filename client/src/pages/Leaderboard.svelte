<script lang="ts">
	import fzf from 'fuzzysort';
	import { api } from 'src/api';

	import type { UserWithRecords } from 'src/generated/openapi';
	import { ordinal } from 'src/util';

	import { onMount } from 'svelte';

	type UserAndRank = UserWithRecords & { rank: number; fzfp: Fuzzysort.Prepared };

	let users: UserAndRank[] = [];
	let search: string = '';

	// TODO: clean up
	$: fUsers = search
		? fzf.go(search, users, { key: 'fzfp', limit: 25 }).map((res) => res.obj)
		: users;

	onMount(async () => {
		const res = await api.users.getUsers();
		users = res.data.map((u, i) => ({
			...u,
			rank: i + 1,
			fzfp: fzf.prepare(u.name), // Prepare for Fuzzysort (Better Performance)
		}));
	});
</script>

<div class="page-leaderboard">
	<aside class="medal" style:display={fUsers.length < 8 ? 'none' : null}>
		<img src="/src/assets/medal.svg" alt="" />
	</aside>
	<aside class="filter">
		<input
			class="textfield type-label-lg"
			type="text"
			placeholder="Search"
			bind:value={search}
		/>
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
				<th class="stats" />
			</tr>
			<!-- TODO: Pagination -->
			{#each fUsers as user (user.id)}
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
						<p class="mono">{user.score}</p>
					</td>
					<td class="player">
						<a href={`/users/${user.id}`}>
							<p>{user.name}</p>
						</a>
					</td>
					<td class="stats">
						<p>{user.records.length} Records</p>
					</td>
				</tr>
			{/each}
		</table>
	</main>
</div>

<style lang="scss">
	@use 'src/styles/screen';
	@use 'src/styles/color';
	@use 'src/styles/util';

	@include screen.xl {
		.page-leaderboard {
			overflow-y: scroll;
			flex: 1 0 0;
			display: grid;
			grid-template-columns: calc(6rem + 1px) calc(8rem + 4px) 1fr 8rem calc(6rem + 1px);
			grid-template-rows: max-content 1fr;

			aside.medal {
				position: sticky;
				top: 8rem;
				margin-top: 8rem;
				padding-right: 0.75rem;
				justify-self: end;
				align-self: start;
				grid-column: 2;

				img {
					height: 14.25rem;
				}
			}

			aside.filter {
				grid-column: 1 / 6;
				grid-row: 1;
				height: 4rem;
				display: grid;
				grid-template-columns: 1fr 1fr;
				column-gap: 2rem;
				align-items: center;
				padding-left: calc(14rem + 4px);
				background-color: color.$background;
				border-bottom: 1px solid rgba(color.$on-background, 0.2);
			}

			main {
				grid-row: 2;
				grid-column: 3;

				table {
					padding-bottom: 6rem;

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
							vertical-align: bottom;
							padding: 0.75rem 1rem;
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
							width: 20%;
						}

						th.player,
						td.player {
							width: 40%;

							a {
								color: inherit;
							}
						}

						th.stats,
						td.stats {
							width: 40%;
							border-left: none;
							color: rgba(color.$on-background, 0.2);
						}
					}
				}
			}
		}
	}
</style>
