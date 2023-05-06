import { style } from '@vanilla-extract/css';

import { colors } from 'src/styles/theme/colors.css.ts';

export const container = style([
	{
		display: 'grid',
		gridTemplateRows: '4rem minmax(0, 1fr)',
	},
]);

export const nav = style([
	{
		display: 'flex',
		paddingInline: '4rem',
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: colors.surface,
	},
]);

export const tabs = style([
	{
		display: 'flex',
		gap: '4rem',
		marginBottom: -1,
	},
]);

export const tab = style([
	{
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		borderBottomColor: 'transparent',
		selectors: {
			'&[aria-current="page"]': {
				borderBottomColor: colors.onSurface,
			},
		},
	},
]);
