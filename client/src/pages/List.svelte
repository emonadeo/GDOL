<script lang="ts">
	import { onMount } from 'svelte';
	import { REST_URL } from 'src/env';
	import { embed } from 'src/util';

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

<main>
	<ul>
		{#each levels as level}
			<li>
				<h2>{level.name}</h2>
				<iframe src={embed(level.video)} frameborder="0" title="Verification" />
				<p>{level.userName}</p>
			</li>
		{/each}
	</ul>
</main>

<style lang="scss">
	main {
		text-align: center;
		margin: 0 auto;

		ul {
			list-style: none;
		}
	}
</style>
