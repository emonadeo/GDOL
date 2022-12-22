import { useMatch } from '@solidjs/router';

/**
 * Checks if the active route matches {@link path}. Returns 'page' if it does, false otherwise
 * See {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current}
 */
export function ariaCurrent(path: string): 'page' | false {
	return !!useMatch(() => path)() && 'page';
}
