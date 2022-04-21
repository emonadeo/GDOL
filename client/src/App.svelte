<script lang="ts">
	import { Route } from 'tinro';

	import Home from 'src/pages/Home.svelte';
	import Leaderboard from 'src/pages/Leaderboard.svelte';
	import List from 'src/pages/List.svelte';
</script>

<nav>
	<img src="src/assets/logo.svg" alt="Logo" />
</nav>

<Route path="/">
	<Home />
</Route>
<Route path="/list">
	<List />
</Route>
<Route path="/leaderboard">
	<Leaderboard />
</Route>

<style lang="scss">
	@use 'src/styles/color';

	nav {
		background-color: color.$background;
	}
</style>
