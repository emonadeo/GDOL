<script lang="ts">
	import { onMount } from 'svelte';
	import { REST_URL } from 'src/env';
	import { getYoutubeIdFromUrl } from 'src/util';

	interface Level {
		id: number;
		name: string;
		userName: string;
		verifierName: string;
		video: string;
	}

	let levels: Level[] = [];

	onMount(async () => {
		const res = await fetch(new URL('/levels', REST_URL).toString());
		levels = await res.json();
	});
</script>

<div class="page-list">
	<aside>X</aside>
	<main>
		<ol role="list" class="levels">
			{#each levels as level, i}
				{@const rank = i + 1}
				<li>
					<a href="#" class="level">
						<div class="rank">
							<h2 class:outline={rank < 100}>{Math.floor((rank / 100) % 10)}</h2>
							<h2 class:outline={rank < 10}>{Math.floor((rank / 10) % 10)}</h2>
							<h2>{Math.floor(rank % 10)}</h2>
						</div>
						<img
							class="thumbnail"
							src={`https://img.youtube.com/vi/${getYoutubeIdFromUrl(
								level.video
							)}/mqdefault.jpg`}
							alt="Thumbnail"
						/>
						<div class="meta">
							<h2>{level.name}</h2>
							<p>{level.userName}</p>
						</div>
					</a>
				</li>
			{/each}
		</ol>
	</main>
</div>

<style lang="scss">
	@use 'src/styles/color';
	@use 'src/styles/screen';

	@include screen.xl {
		.page-list {
			display: grid;
			grid-template-columns: 4rem 1fr 4rem;

			.levels {
				.level {
					display: grid;
					grid-template-columns: max-content 12rem 1fr;
					gap: 2rem;
					color: inherit;
					padding: 2rem;
					border: 1px solid transparent;
					margin-bottom: -1px;

					&:hover {
						border-color: color.$on-background;
					}

					.rank {
						display: grid;
						grid-template-columns: 2rem 2rem 2rem;
						justify-items: center;
						gap: 2px;

						.outline {
							-webkit-text-stroke: 1px color.$on-background;
							color: transparent;
						}
					}

					.thumbnail {
						border-top: 1px solid color.$on-background;
						object-fit: cover;
					}

					.meta {
						display: flex;
						flex-direction: column;
						gap: 1.5rem;
					}
				}
			}
		}
	}
</style>
