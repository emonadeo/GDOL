<script lang="ts">
	import { api } from 'src/api';

	import type { Record, UserFull } from 'src/generated/openapi';
	import { onMount } from 'svelte';

	const listLength = 50; // TODO: Configurable

	export let id: number;

	let user: UserFull;
	let recordsAndVerifications: Record[];

	onMount(async () => {
		const res = await api.users.getUser(id);
		user = res.data;
		recordsAndVerifications = [
			...user.records,
			...user.levelsVerified.map((lvl) => ({
				user: lvl.verifier,
				level: lvl,
				percentage: 100,
				timestamp: null,
			})),
		];
	});
</script>

<div class="page-user">
	{#if user}
		<main>
			<h2>{user.name}</h2>
			<div class="chart">
				{#each recordsAndVerifications as record}
					<div
						style:left={`${(record.level.rank - 1) * (100 / listLength)}%`}
						style:width={`${100 / listLength}%`}
						class:incomplete={record.percentage !== 100}
						title={`${record.level.name}: ${record.percentage}%`}
					/>
				{/each}
			</div>
		</main>
	{/if}
</div>

<style lang="scss">
	@use 'src/styles/color';
	@use 'src/styles/screen';

	.page-user {
		display: grid;
		padding: calc(6rem + 1px);
		grid-template-columns: calc(8rem + 4px) 1fr 8rem;

		main {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			grid-column: 2;

			.chart {
				height: 3rem;
				border: 1px solid color.$on-background;
				position: relative;

				div {
					position: absolute;
					background-color: #a7e372;
					height: 100%;

					&.incomplete {
						background-color: #ffc757;
					}
				}
			}
		}
	}
</style>
