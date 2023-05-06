import { style } from '@vanilla-extract/css';

import { colors } from 'src/styles/theme/colors.css.ts';

export const body = style([
	{
		backgroundColor: colors.background,
		color: colors.onBackground,
	},
]);
