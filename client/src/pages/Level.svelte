<script lang="ts">
	import { api } from 'src/api';

	import type { Level, Record } from 'src/generated/openapi';
	import { embed, ordinal } from 'src/util';
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
			<span class="rank type-title-lg">{String(rank).padStart(3, '0')}</span>
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
			<h5>Leaderboard</h5>
			<table>
				{#each records as record, i}
					{@const rank = i + 1}
					{@const complete = record.percentage === 100}
					<tr class="record">
						<td
							class="rank"
							class:gold={i === 0}
							class:silver={i === 1}
							class:bronze={i === 2}
						>
							{#if complete}
								<p class="mono" class:type-body-md={i > 2}>
									<span>{rank}</span><span>{ordinal(rank)}</span>
								</p>
							{/if}
						</td>
						<td class="percentage">
							<p class="mono" class:bold={complete}>{record.percentage}%</p>
						</td>
						<td class="user">
							<p>{record.user.name}</p>
						</td>
						<td class="video">
							<a href={record.video} target="_blank">
								<img src="/src/assets/icons/media/youtube.svg" alt="YouTube" />
							</a>
						</td>
					</tr>
				{/each}
			</table>
		</div>
	{/if}
</div>

<style lang="scss">
	@use 'src/styles/screen';
	@use 'src/styles/color';
	@use 'src/styles/util';

	@include screen.xl {
		.page-level {
			overflow: auto;
			flex: 1 0 0;
			display: grid;
			padding-block: 6rem;
			padding-inline: calc(6rem + 1px);
			grid-template-columns: 3fr 2fr;
			column-gap: 1.5rem;
			box-sizing: content-box;

			.details {
				display: flex;
				flex-direction: column;
				gap: 1.5rem;
				position: sticky;
				bottom: 0;
				align-self: end;
				// TODO: Better way using container size?
				min-height: calc(100vh - 16rem);

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

				table {
					tr.record {
						td {
							vertical-align: bottom;
							padding-block: 0.75rem;
							white-space: nowrap;

							&:not(:first-child) {
								padding-left: 1rem;
							}
						}

						td.rank {
							text-align: right;

							p:not(.type-body-md) {
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

						td.percentage {
							text-align: right;

							p.bold {
								font-weight: 700;
							}
						}

						td.user {
							width: 100%;
						}

						td.video {
							padding-block: 0;
							vertical-align: middle;

							a {
								display: flex;
								height: 2.25rem;
								width: 2.25rem;
								border-radius: 100%;
								align-items: center;
								justify-content: center;

								&:hover,
								&:focus-visible {
									background-color: rgba(color.$on-background, 0.2);
								}

								img {
									height: 1.25rem;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
