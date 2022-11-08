<script lang="ts">
	import { Route, active } from 'tinro';

	import Home from 'src/pages/Home.svelte';
	import Leaderboard from 'src/pages/Leaderboard.svelte';
	import List from 'src/pages/List.svelte';
	import Level from 'src/pages/Level.svelte';
	import User from 'src/pages/User.svelte';
	import Changelog from 'src/pages/Changelog.svelte';
</script>

<nav>
	<img class="logo" src="/src/assets/logo.svg" alt="Logo" />
	<ul class="links" role="list">
		<li class="link">
			<a class="type-label-lg" href="/" use:active data-exact>Home</a>
		</li>
		<li class="link">
			<a class="type-label-lg" href="/list" use:active>List</a>
		</li>
		<li class="link">
			<a class="type-label-lg" href="/leaderboard" use:active>Leaderboard</a>
		</li>
	</ul>
</nav>

<Route path="/">
	<Home />
</Route>
<Route path="/list/*" firstmatch>
	<Route path="/:rank" let:meta>
		<Level rank={Number(meta.params.rank)} />
	</Route>
	<Route path="/">
		<List />
	</Route>
</Route>
<Route path="/leaderboard" let:meta>
	<Leaderboard
		paginationPage={Number(meta.query.page || 1)}
		paginationPerPage={Number(meta.query.perPage || 25)}
	/>
</Route>
<Route path="/users/:name" let:meta>
	<User name={meta.params.name} />
</Route>
<Route path="/changelog">
	<Changelog />
</Route>

<style lang="scss">
	@use 'src/styles/color';
	@use 'src/styles/screen';

	$height: 4rem;

	nav {
		border-bottom: 1px solid color.$surface;
		height: $height;
	}

	@include screen.xl {
		nav {
			// TODO: Unify Grid Layout
			display: grid;
			padding-inline: calc(6rem + 1px);
			grid-template-columns: calc(6.5rem + 4px) 1fr max-content;
			column-gap: 1.5rem;

			.logo {
				height: 27px;
				align-self: center;
			}

			.links {
				display: flex;
				gap: 4rem;

				.link {
					a {
						height: $height;
						display: flex;
						align-items: center;
						color: inherit;
						border-bottom: 1px solid transparent;

						&:global(.active) {
							border-bottom-color: color.$on-surface;
						}
					}
				}
			}
		}
	}
</style>
