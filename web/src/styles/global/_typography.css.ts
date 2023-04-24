/**
 * @file Do not import this file. Import `src/styles/global/mod.css.ts` instead.
 */

import { body_large, body_medium, body_small, mono } from 'src/styles/atomic/typography.css.ts';
import { globalStyleWithPseudos } from 'src/styles/internal/pseudos.ts';
import {
	bodyLargeMonoRule,
	bodyLargeRule,
	bodyMediumMonoRule,
	bodySmallMonoRule,
	displayLargeRule,
	displayMediumRule,
	displaySmallRule,
	titleLargeRule,
	titleMediumRule,
	titleSmallRule,
} from 'src/styles/typography.ts';

globalStyleWithPseudos('h1', displayLargeRule);
globalStyleWithPseudos('h2', displayMediumRule);
globalStyleWithPseudos('h3', displaySmallRule);
globalStyleWithPseudos('h4', titleLargeRule);
globalStyleWithPseudos('h5', titleMediumRule);
globalStyleWithPseudos('h6', titleSmallRule);

globalStyleWithPseudos('p', bodyLargeRule);

// Monospace variants
globalStyleWithPseudos(`${body_large}${mono}, p${mono}`, bodyLargeMonoRule);
globalStyleWithPseudos(`${body_medium}${mono}`, bodyMediumMonoRule);
globalStyleWithPseudos(`${body_small}${mono}`, bodySmallMonoRule);
