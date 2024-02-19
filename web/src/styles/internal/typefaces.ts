import { createStyleObject, FontMetrics } from '@capsizecss/core';
import metricsLexend from '@capsizecss/metrics/lexend';
import { StyleRule } from '@vanilla-extract/css';

import { typography } from './layers.css.ts';
import { merge } from './merge.ts';
import { MediaQueries } from './screens.ts';

interface FontOptions {
	capHeight: number;
	lineGap: number;
}

type StyleRuleWithFontOptions = { fontOptions?: FontOptions } & StyleRule;

export type FontRule = StyleRuleWithFontOptions & MediaQueries<StyleRuleWithFontOptions>;

// TODO: Support `FontRule | Array<FontRule>`
type ComplexFontRule = FontRule[];

const mapCategoryToGeneric = new Map([
	['serif', 'serif'],
	['sans-serif', 'sans-serif'],
	['monospace', 'monospace'],
	['display', 'sans-serif'],
	['handwriting', 'cursive'],
]);

// TODO: Clean up
function createTypeface(metrics: FontMetrics): (rule: ComplexFontRule) => StyleRule {
	return function (rules) {
		const styleRules: StyleRule[] = [
			{
				display: 'block',
				fontFamily: `"${metrics.familyName}", ${
					metrics.category && (mapCategoryToGeneric.get(metrics.category) || 'sans-serif')
				}`,
			},
		];

		rules.forEach((rule) => {
			if ('@media' in rule) {
				const queries = rule['@media'];
				Object.entries(queries).forEach(([query, queryRule]) => {
					const { fontOptions, ...queryRuleWithoutFontOptions } = queryRule;
					if (fontOptions !== undefined) {
						styleRules.push({
							'@media': {
								[query]: createStyleObject({
									capHeight: fontOptions.capHeight,
									lineGap: fontOptions.lineGap,
									fontMetrics: metrics,
								}),
							},
						});
					}
					styleRules.push({
						'@media': {
							[query]: queryRuleWithoutFontOptions,
						},
					});
				});
			}

			if ('fontOptions' in rule) {
				const { fontOptions, ...ruleWithoutFontOptions } = rule;
				styleRules.push({
					...ruleWithoutFontOptions,
					...createStyleObject({
						capHeight: fontOptions.capHeight,
						lineGap: fontOptions.lineGap,
						fontMetrics: metrics,
					}),
				});
			}
		});

		return { '@layer': { [typography]: merge(styleRules) } };
	};
}

const metricsClashDisplay: FontMetrics = {
	familyName: 'Clash Display',
	category: 'display',
	capHeight: 670,
	ascent: 890,
	descent: -250,
	lineGap: 90,
	unitsPerEm: 1000,
	xHeight: 504,
	xWidthAvg: 494,
};

const metricsCodeNewRoman: FontMetrics = {
	familyName: 'Code New Roman',
	category: 'monospace',
	capHeight: 1307,
	ascent: 1521,
	descent: -527,
	lineGap: 350,
	unitsPerEm: 2048,
	xHeight: 1004,
	xWidthAvg: 1115,
};

const metricsPressStart: FontMetrics = {
	familyName: 'Press Start 2P',
	category: 'display',
	capHeight: 1000,
	ascent: 875,
	descent: -125,
	lineGap: 0,
	unitsPerEm: 1000,
	xHeight: 750,
	xWidthAvg: 1000,
};

export const clashDisplay = createTypeface(metricsClashDisplay);
export const codeNewRoman = createTypeface(metricsCodeNewRoman);
export const lexend = createTypeface(metricsLexend);
export const pressStart = createTypeface(metricsPressStart);
