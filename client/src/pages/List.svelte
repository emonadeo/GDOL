<script lang="ts">
	import { onMount } from 'svelte';
	import fzf from 'fuzzysort';
	import { REST_URL } from 'src/env';
	import { getYoutubeIdFromUrl } from 'src/util';

	interface Level {
		rank: number;
		id: number;
		name: string;
		userName: string;
		verifierName: string;
		video: string;
	}

	let levels: Level[] = [];

	onMount(async () => {
		const res = await fetch(new URL('/levels', REST_URL).toString());
		const rlevels: any[] = await res.json();
		levels = rlevels.map((lvl, i) => ({ ...lvl, rank: i + 1 }));
	});

	let search: string = '';

	// TODO: clean up
	$: fLevels = search ? fzf.go(search, levels, { key: 'name' }).map((res) => res.obj) : levels;
</script>

<div class="page-list">
	<header class="search">
		<input
			class="textfield type-label-lg"
			type="text"
			placeholder="Search"
			bind:value={search}
		/>
	</header>
	<div class="toggle">
		<button href="">
			<img src="src/assets/icons/filter.svg" alt="Filter" />
		</button>
	</div>
	<aside>
		<ul class="sections" role="list">
			<li>
				<a href="" class="type-label-lg">Main</a>
			</li>
			<li>
				<a href="" class="type-label-lg">Extended</a>
			</li>
		</ul>
		<div class="archive">
			<a href="" class="archive type-label-lg">Archive</a>
		</div>
	</aside>
	<main>
		<ol role="list" class="levels">
			{#each fLevels as level}
				<li>
					<a href="#" class="level">
						<div class="rank">
							<h2 class:outline={level.rank < 100}>
								{Math.floor((level.rank / 100) % 10)}
							</h2>
							<h2 class:outline={level.rank < 10}>
								{Math.floor((level.rank / 10) % 10)}
							</h2>
							<h2>{Math.floor(level.rank % 10)}</h2>
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
			flex: 1;
			overflow: auto;
			display: grid;
			grid-template-columns: 4rem 1fr 4rem;
			grid-template-rows: max-content minmax(0, 1fr) max-content;
			grid-template-areas:
				'toggle search search'
				'aside main .'
				'. main .';

			aside {
				grid-area: aside;
				position: sticky;
				top: 0;
				writing-mode: vertical-rl;
				display: flex;
				padding-inline: 2rem;

				.sections {
					display: flex;
					gap: 1rem;
					align-items: center;

					> li {
						display: flex;
						align-items: center;
						gap: 1rem;

						a {
							color: inherit;
						}
					}

					> li::after {
						content: '';
						height: 6rem;
						display: block;
						border-left: 1px solid white;
					}
				}

				.archive {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					color: inherit;
				}
			}

			.search {
				grid-area: search;
				height: 4rem;
				display: grid;
				border-bottom: 1px solid color.$surface;
				padding-left: 2rem;
				align-items: center;
				grid-template-columns: calc(6rem + 4px) 1fr 1fr;
				column-gap: 2rem;

				.textfield {
					grid-column: 2;
				}
			}

			.toggle {
				border-bottom: 1px solid color.$surface;

				button {
					background-color: transparent;
					border: none;
					height: 100%;
					width: 100%;
					padding: 0;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			main {
				grid-area: main;
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
	}
</style>
