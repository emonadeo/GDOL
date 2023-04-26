import { Accessor, onCleanup, Setter } from 'solid-js';

/**
 * Calls a {@link Setter<number>} whenever the user scrolls inside a given {@link Element}
 */
export const observeScroll = function (el: Element, value: Accessor<Setter<number>>): void {
	const setScrollPosition = value();

	function so() {
		setScrollPosition(el.scrollTop / (el.scrollHeight - el.clientHeight));
	}

	el.addEventListener('scroll', so);

	onCleanup(() => {
		el.removeEventListener('scroll', so);
	});
};

// Required for type checking
// See https://www.solidjs.com/docs/latest/api#use___
declare module 'solid-js' {
	namespace JSX {
		// have to use interface for declaration merging
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Directives {
			observeScroll: Setter<number>;
		}
	}
}
