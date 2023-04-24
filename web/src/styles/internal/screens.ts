import { StyleRule } from '@vanilla-extract/css';

import { mapObject, mapObjectWithKeys } from 'src/util/map_object.ts';

// Extracted from @vanilla-extract/css/src/types.ts
type Query<TKey extends string, TStyle> = {
	[key in TKey]?: Record<string, Omit<TStyle, TKey>>;
};

// Extracted from @vanilla-extract/css/src/types.ts
export type MediaQueries<TStyle> = Query<'@media', TStyle>;

export type MediaQueryMiddleware = <TStyle extends StyleRule>(
	rule: Omit<TStyle, '@media'>
) => MediaQueries<TStyle>;

function createMediaQueryMiddleware(property: string, value: number): MediaQueryMiddleware {
	return (rule) => ({
		'@media': {
			[`screen and (${property}: ${value}px)`]: rule,
		},
	});
}

// Type Assertions necessary because Array#map does not preserve length:
// https://github.com/microsoft/TypeScript/issues/29841
// https://stackoverflow.com/questions/66091118/mapping-tuple-typed-value-to-different-tuple-typed-value-without-casts
// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions

export function createScreens<const T extends Record<string, number>>(
	screens: T
): Record<keyof T | `lt_${Extract<keyof T, string>}`, MediaQueryMiddleware> {
	const minMediaQueryMiddlewares = mapObject(screens, (size) =>
		createMediaQueryMiddleware('min-width', size)
	) as Record<keyof T, MediaQueryMiddleware>;

	const maxMediaQueryMiddlewares = mapObjectWithKeys(screens, (size, name) => [
		`lt_${name}`,
		createMediaQueryMiddleware('max-width', size - 0.2),
	]) as Record<`lt_${Extract<keyof T, string>}`, MediaQueryMiddleware>;

	return { ...minMediaQueryMiddlewares, ...maxMediaQueryMiddlewares };
}
