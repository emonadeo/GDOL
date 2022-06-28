<script lang="ts">
	import { onMount } from 'svelte';
	import { REST_URL } from 'src/env';
	import iconAdd from 'src/assets/icons/changelog/add.svg';
	import iconDelete from 'src/assets/icons/changelog/delete.svg';
	import iconLower from 'src/assets/icons/changelog/lower.svg';
	import iconRaise from 'src/assets/icons/changelog/raise.svg';

	// TODO: Use OpenAPI generation

	interface Log {
		action: string;
		from?: number;
		to?: number;
		timestamp: string;
		level: any;
		list: any[];
	}

	const dict = {
		ADD: 'Added',
		MOVE: 'Moved',
		DELETE: 'Deleted',
	};

	let changelog: Log[] = [];

	onMount(async () => {
		const res = await fetch(new URL('/changelog', REST_URL).toString());
		changelog = await res.json();
	});

	// Undo the log changes to restore list before changes
	// TODO: Maybe store this in the database changelog instead of recalculating every time?
	function calcBefore(entry: Log): any[] {
		const list = entry.list.slice();
		list.splice(entry.to - 1, 1);
		list.splice(entry.from - 1, 0, entry.level);
		return list;
	}

	function getIcon(entry: Log): string {
		switch (entry.action) {
			case 'ADD':
				return iconAdd;
			case 'DELETE':
				return iconDelete;
			case 'MOVE':
				return entry.to > entry.from ? iconLower : iconRaise;
		}
		return '';
	}
</script>

<div class="page-changelog">
	<h1>Changelog</h1>
	<ol role="list" class="log">
		{#each changelog as entry}
			{@const before = calcBefore(entry)}
			<li class="entry">
				<p class="date mono">
					{new Date(entry.timestamp).toLocaleDateString()}
				</p>
				<div class="summary">
					<p>
						{dict[entry.action]}
						<a href={`/level/${entry.level.id}`}>{entry.level.name}</a>
					</p>
				</div>
				<div class="changes">
					{#each before.slice(entry.from - 2, entry.from + 1) as level, index}
						<div class="before" class:self={index === 1}>
							<p>{level.name}</p>
						</div>
						<p class="before-rank" class:self={index === 1}>
							#{index + entry.from - 1}
						</p>
					{/each}
					<div class="icon">
						<img src={getIcon(entry)} alt="change" />
					</div>
					{#each entry.list.slice(entry.to - 2, entry.to + 1) as level, index}
						<p class="after-rank" class:self={index === 1}>
							#{index + entry.to - 1}
						</p>
						<div class="after" class:self={index === 1}>
							<p>{level.name}</p>
						</div>
					{/each}
				</div>
			</li>
		{/each}
	</ol>
</div>

<style lang="scss">
	@use 'src/styles/color';
	@use 'src/styles/screen';

	@include screen.xl {
		.page-changelog {
			display: grid;
			overflow: auto;
			flex: 1;
			grid-template-columns: calc(8rem + 4px) 1fr calc(8rem + 4px);
			padding-inline: calc(6rem + 1px);

			h1,
			.log {
				grid-column: 2 / span 1;
			}

			h1 {
				margin-block: 6rem;
			}

			.log {
				display: flex;
				flex-direction: column;
				gap: 3rem;

				.entry {
					max-width: 72rem;
					display: grid;
					grid-template-columns: 1fr 2fr 3fr;
					align-items: start;

					.date {
						color: rgba(color.$on-background, 0.4);
					}

					.summary {
						display: flex;

						&::after {
							content: '';
							flex: 1;
							border-top: 1px solid color.$on-background;
							position: relative;
							margin-left: 1.25rem;
							align-self: center;
						}

						a {
							color: inherit;
							border-bottom: 1px solid color.$on-background;
						}
					}

					.changes {
						display: grid;
						grid-template-columns: 1fr max-content 1.5rem max-content 1fr;
						grid-auto-rows: max-content;
						grid-auto-flow: column;
						align-items: center;
						gap: 1rem 0.5rem;
						color: rgba(color.$on-background, 0.4);
						border-color: rgba(color.$on-background, 0.4);

						.before,
						.after {
							white-space: nowrap;
						}

						.before {
							grid-column: 1;
							display: flex;
							justify-content: end;
							position: relative;

							&::before {
								content: '';
								flex: 1;
								border-top: 1px solid;
								position: relative;
								margin-right: 1.25rem;
								align-self: center;
							}
						}

						.before:not(:first-child) {
							&::after {
								content: '';
								border-left: 1px solid;
								position: absolute;
								left: 0;
								bottom: 50%;
								top: calc(-50% - 1rem);
							}
						}

						.before-rank {
							grid-column: 2;
						}

						.icon {
							grid-column: 3;
							grid-row: span 3;
							align-self: center; // TODO: edge-case: changes at rank 1
						}

						.after-rank {
							grid-column: 4;
							text-align: end;
						}

						.after {
							grid-column: 5;
						}

						.self {
							color: color.$on-background;
							border-color: color.$on-background;
						}
					}
				}
			}
		}
	}
</style>
