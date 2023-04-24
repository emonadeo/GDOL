import { style } from '@vanilla-extract/css';

import {
	bodyLargeRule,
	bodyMediumRule,
	bodySmallRule,
	displayLargeRule,
	displayMediumRule,
	displaySmallRule,
	labelLargeRule,
	labelMediumRule,
	labelSmallRule,
	titleLargeRule,
	titleMediumRule,
	titleSmallRule,
} from 'src/styles/typography.ts';

/**
 * Mono Modifier
 */
export const mono = style({});

export const display_large = style(displayLargeRule);
export const display_medium = style(displayMediumRule);
export const display_small = style(displaySmallRule);

export const title_large = style(titleLargeRule);
export const title_medium = style(titleMediumRule);
export const title_small = style(titleSmallRule);

export const label_large = style(labelLargeRule);
export const label_medium = style(labelMediumRule);
export const label_small = style(labelSmallRule);

export const body_large = style(bodyLargeRule);
export const body_medium = style(bodyMediumRule);
export const body_small = style(bodySmallRule);
