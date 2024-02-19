import { globalStyle, StyleRule } from '@vanilla-extract/css';
import { SimplePseudos } from 'csstype';

import { mapObject } from 'src/util/map_object.ts';

type QueryType = '@media' | '@layer' | '@supports' | '@container';

// Extracted from @vanilla-extract/css/src/simplePseudos.ts
export const simplePseudos: SimplePseudos[] = [
	':-moz-any-link',
	':-moz-full-screen',
	':-moz-placeholder',
	':-moz-read-only',
	':-moz-read-write',
	':-ms-fullscreen',
	':-ms-input-placeholder',
	':-webkit-any-link',
	':-webkit-full-screen',
	'::-moz-placeholder',
	'::-moz-progress-bar',
	'::-moz-range-progress',
	'::-moz-range-thumb',
	'::-moz-range-track',
	'::-moz-selection',
	'::-ms-backdrop',
	'::-ms-browse',
	'::-ms-check',
	'::-ms-clear',
	'::-ms-fill',
	'::-ms-fill-lower',
	'::-ms-fill-upper',
	'::-ms-reveal',
	'::-ms-thumb',
	'::-ms-ticks-after',
	'::-ms-ticks-before',
	'::-ms-tooltip',
	'::-ms-track',
	'::-ms-value',
	'::-webkit-backdrop',
	'::-webkit-input-placeholder',
	'::-webkit-progress-bar',
	'::-webkit-progress-inner-value',
	'::-webkit-progress-value',
	'::-webkit-slider-runnable-track',
	'::-webkit-slider-thumb',
	'::after',
	'::backdrop',
	'::before',
	'::cue',
	'::first-letter',
	'::first-line',
	'::grammar-error',
	'::placeholder',
	'::selection',
	'::spelling-error',
	':active',
	':after',
	':any-link',
	':before',
	':blank',
	':checked',
	':default',
	':defined',
	':disabled',
	':empty',
	':enabled',
	':first',
	':first-child',
	':first-letter',
	':first-line',
	':first-of-type',
	':focus',
	':focus-visible',
	':focus-within',
	':fullscreen',
	':hover',
	':in-range',
	':indeterminate',
	':invalid',
	':last-child',
	':last-of-type',
	':left',
	':link',
	':only-child',
	':only-of-type',
	':optional',
	':out-of-range',
	':placeholder-shown',
	':read-only',
	':read-write',
	':required',
	':right',
	':root',
	':scope',
	':target',
	':valid',
	':visited',
];

const queryTypes = ['@media', '@layer', '@supports', '@container'] as const;

interface QueryContext {
	type: string;
	query: string;
}

function buildStyleRule(queryContexts: QueryContext[], rule: StyleRule): StyleRule {
	const ctx = queryContexts.at(0);
	if (!ctx) return rule;
	return {
		[ctx.type]: {
			[ctx.query]: buildStyleRule(queryContexts.slice(1), rule),
		},
	};
}

function globalStyleWithPseudosRecursive(
	queries: QueryContext[],
	selector: string,
	rule: StyleRule
): StyleRule {
	const ruleEntries = Object.entries(rule);
	const ruleEntriesWithPseudoNulls = ruleEntries.map(([key, value]) => {
		if (simplePseudos.includes(key as SimplePseudos)) {
			globalStyleWithPseudosRecursive(queries, `${selector}${key}`, value);
			// map pseudos to null, to filter out later
			return null;
		}
		if (queryTypes.includes(key as QueryType)) {
			return [
				key,
				mapObject(value, (queryRule, query) =>
					globalStyleWithPseudosRecursive(
						[...queries, { type: key, query }],
						selector,
						queryRule as StyleRule
					)
				),
			] as const;
		}
		return [key, value as string] as const;
	});

	const ruleEntriesWithoutPseudos = ruleEntriesWithPseudoNulls.filter(
		(entry) => entry !== null
	) as (readonly [string, Record<string, StyleRule>] | readonly [string, string])[];

	const ruleWithoutPseudos = Object.fromEntries(ruleEntriesWithoutPseudos);
	globalStyle(selector, buildStyleRule(queries, ruleWithoutPseudos));
	return ruleWithoutPseudos;
}

/**
 * Wrapper for globalStyle that allows for pseudos
 */
export function globalStyleWithPseudos(selector: string, rule: StyleRule): void {
	globalStyleWithPseudosRecursive([], selector, rule);
}
