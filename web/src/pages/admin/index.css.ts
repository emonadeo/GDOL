import { style } from '@vanilla-extract/css';

import { lg } from 'src/styles/screens.ts';
import { colors } from 'src/styles/theme/colors.css.ts';
import { createGridArea, createGridTemplate } from 'src/styles/util/grid.ts';

export const container = style([
	lg({
		display: 'grid',
		gridTemplateRows: 'max-content 12rem',
		rowGap: '2rem',
		padding: '4rem',
	}),
]);

const areaTitle = createGridArea();
const areaStatus = createGridArea();
const areaCta = createGridArea();

export const review = style([
	lg({
		display: 'grid',
		gridTemplate: createGridTemplate({
			columns: ['minmax(0, 1fr)', '8rem'],
			rows: ['minmax(0, 1fr)', '3rem'],
			areas: [
				[areaTitle, areaTitle],
				[areaStatus, areaCta],
			],
		}),
		padding: '2rem',
		borderRadius: 4,
		backgroundColor: colors.surface,
		color: colors.onSurface,
	}),
]);

export const title = style([
	lg({
		gridArea: areaTitle,
	}),
]);

export const status = style([
	lg({
		gridArea: areaStatus,
		alignSelf: 'end',
	}),
]);

export const cta = style([
	lg({
		gridArea: areaCta,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		backgroundColor: colors.primary,
		color: colors.onPrimary,
	}),
]);
