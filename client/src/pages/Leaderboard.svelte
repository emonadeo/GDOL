<script lang="ts">
	import { api } from 'src/api';

	import type { UserWithRecords } from 'src/generated/openapi';
	import { ordinal } from 'src/util';

	import { onMount } from 'svelte';

	let users: UserWithRecords[] = [];

	onMount(async () => {
		const res = await api.users.getUsers();
		users = res.data;
	});
</script>

<div class="page-leaderboard">
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
		{#each users as user, i}
			{@const rank = i + 1}
			<tr>
				<td class="rank" class:gold={i === 0} class:silver={i === 1} class:bronze={i === 2}>
					<p class="mono">
						<span>{rank}</span><span>{ordinal(rank)}</span>
					</p>
				</td>
				<td class="score">
					<p class="mono">
						{user.score}
					</p>
				</td>
				<td class="player">
					<a href={`/users/${user.id}`}>
						<p>
							{user.name}
						</p>
					</a>
				</td>
				<td class="stats">
					<p>
						{user.records.length} Records
					</p>
				</td>
			</tr>
		{/each}
	</table>
</div>

<style lang="scss">
	@use 'src/styles/screen';
	@use 'src/styles/color';
	@use 'src/styles/util';

	@include screen.xl {
		.page-leaderboard {
			overflow: auto;
			flex: 1 0 0;
			padding-inline: calc(6rem + 1px);
			display: grid;
			grid-template-columns: calc(8rem + 4px) 1fr 8rem;

			table {
				padding-top: 6rem;
				grid-column: 2;

				tr {
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
						border-style: none none solid solid;
						border-width: 1px;
						border-color: rgba(color.$on-background, 0.2);

						&:last-child {
							border-right-style: solid;
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
</style>
