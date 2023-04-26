import { style } from '@vanilla-extract/css';

import { colors } from 'src/styles/theme/colors.css.ts';

export const overview = style([
	{
		// TODO: Predictable vertical size (aka don't use max-content for grid-auto-rows)
		display: 'grid',
		gridTemplateColumns: 'minmax(0, 1fr) 1.5rem minmax(0, 1fr)',
		gridAutoRows: 'max-content',
		gridAutoFlow: 'column',
		alignItems: 'stretch',
		gap: '1rem 0.5rem',
		color: colors.outline,
		borderColor: colors.outline,
		overflow: 'hidden',
		position: 'relative',
		paddingBlock: '0.5rem',
		marginBlock: '-0.5rem',
	},
]);

const end = style({
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
	'::before': {
		content: '',
		flex: 1,
		height: '50%',
		borderLeftWidth: 1,
		borderLeftStyle: 'solid',
		borderLeftColor: colors.outline,
	},
	'::after': {
		content: '',
		flex: 1,
		height: '50%',
		borderRightWidth: 1,
		borderRightStyle: 'solid',
		borderRightColor: colors.outline,
	},
});

export const top = style([
	end,
	{
		'::before': {
			alignSelf: 'flex-end',
			borderTopWidth: 1,
			borderTopStyle: 'solid',
			borderTopColor: colors.outline,
		},
		'::after': {
			alignSelf: 'flex-end',
			borderTopWidth: 1,
			borderTopStyle: 'solid',
			borderTopColor: colors.outline,
		},
	},
]);

export const bottom = style([
	end,
	{
		'::before': {
			alignSelf: 'flex-start',
			borderBottomWidth: 1,
			borderBottomStyle: 'solid',
			borderBottomColor: colors.outline,
		},
		'::after': {
			alignSelf: 'flex-start',
			borderBottomWidth: 1,
			borderBottomStyle: 'solid',
			borderBottomColor: colors.outline,
		},
	},
]);

export const row = style({
	display: 'flex',
	gap: '0.5rem',
});

export const before = style({
	gridColumn: 1,
	justifyContent: 'end',
	position: 'relative',
});

export const after = style({
	gridColumn: 3,
	selectors: {
		[`&:not(${top}):not(${bottom})`]: {
			flexDirection: 'row-reverse',
		},
	},
});

export const leap = style({
	alignSelf: 'stretch',
	selectors: {
		[`&${before}`]: {
			backgroundImage: 'linear-gradient(90deg, transparent, #00ff00)',
		},
		[`&${after}`]: {
			backgroundImage: 'linear-gradient(90deg, transparent, #ff0000)',
		},
	},
});

export const self = style({
	color: colors.onBackground,
	borderColor: colors.onBackground,
});

const stripe_dot_size = '1px';
export const stripe = style([
	{
		flex: 1,
		position: 'relative',
		backgroundSize: '5px 5px',
		selectors: {
			[`${before} &`]: {
				backgroundImage: `radial-gradient(
					circle at top ${stripe_dot_size} left ${stripe_dot_size},
					${colors.outline} ${stripe_dot_size},
					${colors.background} ${stripe_dot_size}
				)`,
			},
			[`${before}${self} &`]: {
				backgroundImage: `radial-gradient(
					circle at top ${stripe_dot_size} left ${stripe_dot_size},
					${colors.onBackground} ${stripe_dot_size},
					${colors.background} ${stripe_dot_size}
				)`,
			},
			[`${after} &`]: {
				backgroundImage: `radial-gradient(
					circle at top ${stripe_dot_size} right ${stripe_dot_size},
					${colors.outline} ${stripe_dot_size},
					${colors.background} ${stripe_dot_size}
				)`,
			},
			[`${after}${self} &`]: {
				backgroundImage: `radial-gradient(
					circle at top ${stripe_dot_size} right ${stripe_dot_size},
					${colors.onBackground} ${stripe_dot_size},
					${colors.background} ${stripe_dot_size}
				)`,
			},
		},
	},
]);

export const rank = style([]);

export const level_name = style({
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	marginBlock: '-0.5rem',
	paddingBlock: '0.5rem',
	textOverflow: 'ellipsis',
});

export const overview_icon = style({
	gridColumn: 2,
	gridRow: 2,
	marginBlock: '-0.5rem',
});
