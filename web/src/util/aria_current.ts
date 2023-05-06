import { AstroGlobal } from 'astro';

/**
 * Checks if the active route matches {@link path}. Returns 'page' if it does, false otherwise
 * See {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current}
 */
export function ariaCurrent(astro: AstroGlobal, matcher: RegExp): 'page' | false {
    return matcher.test(astro.url.pathname) && 'page';
}
