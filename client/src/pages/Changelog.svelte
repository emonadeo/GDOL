<script lang="ts">
	import { onMount } from 'svelte';
	import { REST_URL } from 'src/env';
	import iconAdd from 'src/assets/icons/changelog/add.svg';
	import iconDelete from 'src/assets/icons/changelog/delete.svg';
	import iconLower from 'src/assets/icons/changelog/lower.svg';
	import iconRaise from 'src/assets/icons/changelog/raise.svg';
	import List from 'src/pages/List.svelte';

	// TODO: Use OpenAPI generation

	interface Log {
		action: string;
		from?: number;
		to?: number;
		timestamp: string;
		level: Level;
		list: Level[];
		reason?: string;
	}

	interface Level {
		name: string;
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
		if (entry.to) list.splice(entry.to - 1, 1);
		if (entry.from) list.splice(entry.from - 1, 0, entry.level);
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

	type ChangeDetailsEntry = Level | 'begin' | 'end' | 'gradient';
	function listChangeDetails(
		list: Level[],
		rank: number,
		addOrDelete: boolean
	): ChangeDetailsEntry[] {
		// Rank is assumed to be withing list bounds
		const sublist: ChangeDetailsEntry[] = list.slice(Math.max(rank - 2, 0), rank + 1);
		if (rank === 1) sublist.unshift('begin');
		else if (rank === list.length) sublist.push('end');

		if (addOrDelete) sublist.splice(1, 1, 'gradient');

		return sublist;
	}
</script>

<div class="page-changelog">
	<h1>Changelog</h1>
	<ol role="list" class="log">
		{#each changelog as entry}
			{@const before = calcBefore(entry)}
			{@const isAdd = entry.action === 'ADD'}
			{@const isDelete = entry.action === 'DELETE'}
			<li class="entry">
				<div class="date">
					<p class="mono">
						{new Date(entry.timestamp).toLocaleDateString()}
					</p>
				</div>
				<div class="summary">
					<p>
						{dict[entry.action]}
						<a href={`/level/${entry.level.id}`}>{entry.level.name}</a>
					</p>
				</div>
				<div class="changes">
					{#if entry.from !== undefined}
						<p class="from">#{entry.from}</p>
					{/if}
					<div class="icon">
						<img src={getIcon(entry)} alt="change" />
					</div>
					{#if entry.to !== undefined}
						<p class="to">#{entry.to}</p>
					{/if}
				</div>
				<div class="actions">
					<p />
				</div>
				{#if entry.reason || !isAdd}
					<div class="details">
						{#if entry.reason}
							<p>
								<span>Reason: </span>
								<span>{entry.reason}</span>
							</p>
						{:else}
							<p class="no-reason">No Reason specified</p>
						{/if}
					</div>
				{/if}
				<div class="details-changes">
					{#each isAdd ? listChangeDetails(entry.list, entry.to, true) : listChangeDetails(before, entry.from, false) as level, index}
						{#if level === 'gradient'}
							<div class="before gradient" />
						{:else if level === 'begin'}
							<div class="before begin">
								<p class="type-label-md">Top of List</p>
							</div>
						{:else if level === 'end'}
							<div class="before end">
								<p class="type-label-md">End of List</p>
							</div>
						{:else}
							<div class="before" class:self={index === 1}>
								<div class="stripe" />
								<p class="level">{level.name}</p>
								<p class="rank" class:self={index === 1}>
									#{index + (isAdd ? entry.to - 1 : entry.from) - 1}
								</p>
							</div>
						{/if}
					{/each}
					<div class="icon">
						<img src={getIcon(entry)} alt="change" />
					</div>
					{#each isDelete ? listChangeDetails(before, entry.from, true) : listChangeDetails(entry.list, entry.to, false) as level, index}
						{#if level === 'gradient'}
							<div class="after gradient" />
						{:else if level === 'begin'}
							<div class="after begin">
								<p class="type-label-md">Top of List</p>
							</div>
						{:else if level === 'end'}
							<div class="after end">
								<p class="type-label-md">End of List</p>
							</div>
						{:else}
							<div class="after" class:self={index === 1}>
								<p class="rank" class:self={index === 1}>
									#{index + (isDelete ? entry.from - 1 : entry.to) - 1}
								</p>
								<p class="level">{level.name}</p>
								<div class="stripe" />
							</div>
						{/if}
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
				gap: 6rem;
				margin-bottom: 6rem;

				.entry {
					display: grid;
					grid-template-columns: 25% 1fr max-content;
					grid-auto-rows: max-content;
					align-items: center;
					justify-items: start;
					gap: 2rem 1rem;

					&:hover {
						.date::after,
						.summary::after {
							content: '';
							flex: 1;
							border-top: 1px solid;
							position: relative;
							margin-left: 1rem;
							align-self: center;
						}
					}

					.date {
						justify-self: stretch;
						display: flex;
						color: rgba(color.$on-background, 0.4);
						border-color: rgba(color.$on-background, 0.4);
					}

					.summary {
						justify-self: stretch;
						display: flex;

						a {
							color: inherit;
							border-bottom: 1px solid color.$on-background;
						}
					}

					.changes {
						display: grid;
						grid-template-columns: max-content max-content max-content;
						gap: 0.5rem;
						align-items: center;

						.from {
							grid-column: 1;
							justify-self: end;
						}

						.icon {
							grid-column: 2;
							margin-block: -0.5rem;
						}

						.to {
							grid-column: 3;
							justify-self: start;
						}
					}

					.details {
						align-self: start;

						.no-reason {
							color: rgba(color.$on-background, 0.4);
						}
					}

					.details-changes {
						grid-column: 2 / span 2;
						align-self: start;
						justify-self: stretch;
						display: grid;
						grid-template-columns: 1fr 1.5rem 1fr;
						grid-auto-rows: max-content;
						grid-auto-flow: column;
						align-items: center;
						gap: 1rem 0.5rem;
						color: rgba(color.$on-background, 0.4);
						border-color: rgba(color.$on-background, 0.4);
						overflow: hidden;
						position: relative;
						padding-block: 0.5rem;
						margin-block: -0.5rem;

						$dot-size: 1px;

						.before,
						.after {
							display: flex;

							&.begin,
							&.end {
								display: flex;
								align-items: center;
								gap: 0.5rem;

								&::before,
								&::after {
									content: '';
									flex: 1;
									height: 5px;
								}

								&::before {
									border-left: 1px solid rgba(color.$on-background, 0.4);
								}

								&::after {
									border-right: 1px solid rgba(color.$on-background, 0.4);
								}
							}

							&.begin::before,
							&.begin::after {
								align-self: flex-end;
								border-top: 1px solid rgba(color.$on-background, 0.4);
							}

							&.end::before,
							&.end::after {
								align-self: flex-start;
								border-bottom: 1px solid rgba(color.$on-background, 0.4);
							}

							.stripe {
								flex: 1;
								position: relative;

								&::before {
									content: '';
									display: block;
									position: absolute;
									top: 0;
									right: 0;
									bottom: 0;
									left: 0;
									background-size: 5px 5px;
								}
							}

							.level {
								overflow: hidden;
								white-space: nowrap;
								margin-block: -0.5rem;
								padding-block: 0.5rem;
								text-overflow: ellipsis;
							}
						}

						.before {
							grid-column: 1;
							justify-content: end;
							position: relative;

							&.gradient {
								background-image: linear-gradient(90deg, transparent, #00ff00);
								align-self: stretch;
							}

							.stripe::before {
								right: 0.5rem;
								background-image: radial-gradient(
									circle at top 1px left 1px,
									color.$on-background $dot-size,
									color.$background $dot-size
								);
							}

							.rank {
								margin-left: 0.5rem;
							}
						}

						.icon {
							grid-column: 2;
							grid-row: 2;
							margin-block: -0.5rem;
						}

						.after {
							grid-column: 3;

							&.gradient {
								background-image: linear-gradient(90deg, transparent, #ff0000);
								align-self: stretch;
							}

							.rank {
								margin-right: 0.5rem;
							}

							.stripe::before {
								left: 0.5rem;
								background-image: radial-gradient(
									circle at top 1px right 1px,
									color.$on-background $dot-size,
									color.$background $dot-size
								);
								background-position: top right;
							}
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
