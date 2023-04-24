import { style } from '@vanilla-extract/css';

import { lg, md, sm, xl } from 'src/styles/screens.ts';
import { colors } from 'src/styles/theme/colors.css.ts';
import { createGridArea, createGridTemplate } from 'src/styles/util/grid.ts';

const area_rank = createGridArea();
const area_thumbnail = createGridArea();
const area_meta = createGridArea();

export const levels = style([
	{
		height: '100%',
		overflowY: 'auto',
		scrollBehavior: 'smooth',
	},
	sm({
		marginLeft: -1, // collapse border
	}),
]);

export const level = style([
	{
		display: 'flex',
		flexDirection: 'column',
		paddingBlock: 25,
		paddingInline: 20,
		gap: 20,
		marginBottom: -1,
	},
	sm({
		padding: '2rem',
		gap: '1rem',
		border: '1px solid transparent',
		// TODO: How to combine ':hover' and ':focus-visible' into one selector?
		':hover': {
			borderColor: colors.onBackground,
		},
		':focus-visible': {
			borderColor: colors.onBackground,
		},
	}),
	md({
		display: 'grid',
		gridTemplate: createGridTemplate({
			rows: ['max-content', 'max-content'],
			columns: ['minmax(0, 2fr)', 'minmax(0, 3fr)'],
			areas: [
				[area_rank, ''],
				[area_thumbnail, area_meta],
			],
		}),
	}),
	lg({
		gridTemplate: createGridTemplate({
			rows: ['max-content'],
			columns: ['max-content', 'minmax(0, 1fr)', 'minmax(0, 2fr)'],
			areas: [[area_rank, area_thumbnail, area_meta]],
		}),
	}),
	xl({
		gridTemplate: createGridTemplate({
			rows: ['max-content'],
			columns: ['max-content', '20rem', 'minmax(0, 1fr)'],
			areas: [[area_rank, area_thumbnail, area_meta]],
		}),
	}),
]);

export const rank = style([
	{
		gridArea: area_rank,
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1.75rem)',
		justifyItems: 'center',
		gap: 2,
	},
	sm({
		gridTemplateColumns: 'repeat(3, 2rem)',
	}),
	xl({
		gridTemplateColumns: 'repeat(3, 2.5rem)',
	}),
]);

export const thumbnail = style([
	{
		gridArea: area_thumbnail,
		borderTop: `1px solid ${colors.onBackground}`,
		objectFit: 'cover',
		width: '100%',
		maxHeight: '12rem',
	},
	sm({
		maxHeight: '16rem',
	}),
	md({
		maxHeight: 'none',
	}),
]);

export const meta = style({
	gridArea: area_meta,
	display: 'flex',
	flexDirection: 'column',
	gap: '1rem',
});

export const meta_name = style([
	{
		width: '100%',
		hyphens: 'auto',
		overflowWrap: 'break-word',
	},
]);

export const outline = style({
	WebkitTextStrokeWidth: 1,
	WebkitTextStrokeColor: colors.onBackground,
	color: 'transparent',
});
