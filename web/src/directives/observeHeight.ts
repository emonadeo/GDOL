import { Accessor, Setter } from 'solid-js';

/**
 * Attaches a {@link ResizeObserver} to a given {@link Element} and calls
 * a given {@link Setter<number>} whenever the height changes.
 */
export const observeHeight = function (el: Element, value: Accessor<Setter<number>>) {
	const setHeight = value();
	const ro = new ResizeObserver((es) => {
		const height = es.at(0)?.borderBoxSize.at(0)?.blockSize;
		if (!height) return;
		setHeight(height);
	});
	ro.observe(el, { box: 'border-box' });
};

// Required for type checking
// See https://www.solidjs.com/docs/latest/api#use___
declare module 'solid-js' {
	namespace JSX {
		// have to use interface for declaration merging
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Directives {
			observeHeight: Setter<number>;
		}
	}
}
