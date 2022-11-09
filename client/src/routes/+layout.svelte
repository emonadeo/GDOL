<script lang="ts">
	import 'modern-css-reset';
	import '$lib/styles/global/main.scss';
	import '$lib/styles/global/responsive.scss';
	import '$lib/styles/global/typography.scss';

	import logo from '$lib/assets/logo.svg';

	import { page } from '$app/stores';

	export const prerender = true;
	export const ssr = false;
</script>

<nav>
	<img class="logo" src={logo} alt="Logo" />
	<ul class="links" role="list">
		<li class="link" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
			<a class="type-label-lg" href="/">Home</a>
		</li>
		<li class="link" aria-current={$page.url.pathname.startsWith('/list') ? 'page' : undefined}>
			<a class="type-label-lg" href="/list">List</a>
		</li>
		<li
			class="link"
			aria-current={$page.url.pathname.startsWith('/leaderboard') ? 'page' : undefined}
		>
			<a class="type-label-lg" href="/leaderboard">Leaderboard</a>
		</li>
	</ul>
</nav>

<slot />

<style lang="scss">
	@use '$lib/styles/color';
	@use '$lib/styles/screen';

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
					}

					&[aria-current='page'] a {
						border-bottom-color: color.$on-surface;
					}
				}
			}
		}
	}
</style>
