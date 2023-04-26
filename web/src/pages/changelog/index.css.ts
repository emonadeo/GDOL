import { style } from '@vanilla-extract/css';

import { xl } from 'src/styles/screens.ts';
import { colors } from 'src/styles/theme/colors.css.ts';

export const page = style([
	{
		height: '100%',
	},
	xl({
		flex: 1,
		overflow: 'auto',
		paddingInline: 'calc(15.5rem + 1px)',
		columnGap: '1.5rem',
	}),
]);

export const h1 = style([
	xl({
		marginBlock: '6rem',
	}),
]);

export const changelogs = style([
	xl({
		display: 'flex',
		flexDirection: 'column',
		gap: '6rem',
		marginBottom: '6rem',
	}),
]);

export const changelog = style([
	xl({
		display: 'grid',
		gridTemplateColumns: '25% 1fr max-content',
		gridAutoRows: 'max-content',
		alignItems: 'center',
		justifyItems: 'start',
		gap: '2rem 1rem',
	}),
]);

const horizontal = style([
	xl({
		selectors: {
			[`${changelog}:hover &::after`]: {
				content: '',
				flex: 1,
				borderTopWidth: 1,
				borderTopStyle: 'solid',
				borderTopColor: colors.outline,
				position: 'relative',
				marginLeft: '1rem',
				alignSelf: 'center',
			},
		},
	}),
]);

export const date = style([
	horizontal,
	xl({
		selectors: {},
		justifySelf: 'stretch',
		display: 'flex',
		borderColor: colors.outline,
	}),
]);

export const summary = style([
	horizontal,
	xl({
		selectors: {
			[`${changelog}:hover &::after`]: {
				content: '',
				flex: 1,
				borderTopWidth: 1,
				borderTopStyle: 'solid',
				borderTopColor: colors.outline,
				position: 'relative',
				marginLeft: '1rem',
				alignSelf: 'center',
			},
		},
		justifySelf: 'stretch',
		display: 'flex',
	}),
]);

export const changes = style([
	xl({
		display: 'grid',
		gridTemplateColumns: 'max-content max-content max-content',
		gap: '0.5rem',
		alignItems: 'center',
	}),
]);

export const from = style([
	xl({
		justifySelf: 'end',
	}),
]);

export const icon = style([
	xl({
		marginBlock: '-0.5rem',
	}),
]);

export const to = style([
	xl({
		justifySelf: 'start',
	}),
]);

export const details = style([
	xl({
		gridColumn: '2 / span 2',
		alignSelf: 'start',
	}),
]);

export const no_reason = style([
	xl({
		color: colors.outline,
	}),
]);

export const overview = style([
	xl({
		gridColumn: '2 / span 2',
		alignSelf: 'start',
		justifySelf: 'stretch',
	}),
]);
