import { style } from '@vanilla-extract/css';

import { lg, lt_sm, sm, xl } from 'src/styles/screens.ts';
import { colors } from 'src/styles/theme/colors.css.ts';
import { createGridArea, createGridTemplate } from 'src/styles/util/grid.ts';

const areaNav = createGridArea();
const areaMain = createGridArea();

export const body = style([
	{
		display: 'grid',
		gridTemplate: createGridTemplate({
			areas: [[areaMain], [areaNav]],
			rows: ['minmax(0, 1fr)', '4rem'],
			columns: ['minmax(0, 1fr)'],
		}),
		backgroundColor: colors.background,
		color: colors.onBackground,
	},
	sm({
		gridTemplate: createGridTemplate({
			areas: [[areaNav], [areaMain]],
			rows: ['4rem', 'minmax(0, 1fr)'],
			columns: ['minmax(0, 1fr)'],
		}),
	}),
]);

export const main = style([
	{
		gridArea: areaMain,
	},
]);

export const nav = style([
	{
		gridArea: areaNav,
		display: 'grid',
		gridTemplateColumns: '4rem minmax(0, 1fr) 4rem 4rem',
	},
	lt_sm({
		borderTop: `1px solid ${colors.outline}`,
	}),
	sm({
		borderBottom: `1px solid ${colors.outline}`,
	}),
	lg({
		gridTemplateColumns: 'calc(8rem + 4px) 1fr 4rem 4rem',
		paddingLeft: 'calc(6rem + 1px)',
	}),
	xl({
		gridTemplateColumns: 'calc(9.5rem + 4px) 1fr 4rem 4rem',
	}),
]);

export const nav_logo = style([
	lg({
		height: 27,
		alignSelf: 'center',
	}),
]);

export const nav_links = style([
	lg({
		display: 'flex',
		gap: '4rem',
	}),
]);

export const nav_links_a = style([
	lg({
		height: '4rem',
		display: 'flex',
		alignItems: 'center',
		color: 'inherit',
		borderBottom: '1px solid transparent',
		selectors: {
			'&[aria-current="page"]': {
				borderBottomColor: colors.onSurface,
			},
		},
	}),
]);

export const nav_menu = style([
	{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sm({
		borderRight: `1px solid ${colors.outline}`,
	}),
]);

export const nav_location = style([
	{
		display: 'flex',
		alignItems: 'center',
	},
	sm({
		paddingLeft: '2rem',
	}),
]);

export const nav_search = style([
	{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderLeft: `1px solid ${colors.outline}`,
	},
]);

export const nav_user = style([
	{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderLeft: `1px solid ${colors.outline}`,
	},
]);
