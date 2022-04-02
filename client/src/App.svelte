<script lang="ts">
	import { onMount } from 'svelte';
	import { REST_URL } from 'src/env';
	import { getYoutubeIdFromUrl } from 'src/util';

	let levels = [];

	onMount(async () => {
		const res = await fetch(new URL('/levels', REST_URL).toString());
		levels = await res.json();
	});

	function embed(video: string): string {
		return `https://www.youtube.com/embed/${getYoutubeIdFromUrl(video)}`;
	}
</script>

<main>
	<h1>GD Open List</h1>
	<p>Welcome to the GD Open List!</p>
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
