<script lang="ts">
	import { api } from 'src/api';

	import type { Level, Record } from 'src/generated/openapi';
	import { embed } from 'src/util';
	import { onMount } from 'svelte';

	export let rank: number;

	let level: Level;
	let records: Record[] = [];

	onMount(async () => {
		const res = await api.list.getListLevel(rank);
		level = res.data;

		const res2 = await api.levels.getLevelRecords(level.id);
		records = res2.data;
	});
</script>

<div class="page-level">
	{#if level}
		<div class="details">
			<p class="rank">{String(rank).padStart(3, '0')}</p>
			<h2 class="name">{level.name}</h2>
			<iframe
				class="video"
				src={embed(level.video)}
				title="youtube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			/>
		</div>
		<div class="records">
			<p>Leaderboard</p>
			<!-- TODO: Table -->
			<ol role="list">
				{#each records as record}
					<li class="record">
						<p>{record.percentage}%</p>
						<p>{record.user.name}</p>
					</li>
				{/each}
			</ol>
		</div>
	{/if}
</div>

<style lang="scss">
	@use 'src/styles/screen';
	@use 'src/styles/color';

	@include screen.xl {
		.page-level {
			display: grid;
			padding-block: 6rem;
			padding-inline: calc(6rem + 1px);
			grid-template-columns: 3fr 2fr;
			gap: 1.5rem;

			.details {
				display: flex;
				flex-direction: column;
				gap: 1.5rem;

				.video {
					border-top: 1px solid color.$on-background;
					width: 100%;
					aspect-ratio: 16 / 9;
				}
			}

			.records {
				display: flex;
				flex-direction: column;
				gap: 1.5rem;

				ol {
					display: flex;
					flex-direction: column;
					gap: 1rem;

					.record {
						display: flex;
						gap: 1rem;
					}
				}
			}
		}
	}
</style>
