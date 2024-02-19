import { style } from '@vanilla-extract/css';

import { colors } from 'src/styles/theme/colors.css.ts';

const [z_index_table_head, z_index_first_row_add] = [1, 2];

export const table = style([
	{
		width: '100%',
	},
]);

export const table_head = style([
	{
		position: 'sticky',
		top: 0,
		backgroundColor: colors.background,
		backdropFilter: 'blur(0.5rem)',
		zIndex: z_index_table_head,
	},
]);

const table_row = style([]);

export const table_head_row = table_row;

export const table_body_row = table_row;

const table_cell = style([
	{
		height: '2.5rem',
		paddingInline: '1rem',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: 'transparent',
		// borderBottomWidth: 1, (implicit)
		// borderBottomStyle: 'solid', (implicit)
		borderBottomColor: colors.surface,
		textAlign: 'start',
		whiteSpace: 'nowrap',
	},
]);

export const table_head_cell = table_cell;

export const table_body_cell = style([
	table_cell,
	{
		selectors: {
			[`${table_body_row}:hover &`]: {
				borderBlockColor: colors.onBackground,
			},
			[`${table_body_row}:hover &:first-child`]: {
				borderLeftColor: colors.onBackground,
			},
			[`${table_body_row}:hover &:last-child`]: {
				borderRightColor: colors.onBackground,
			},
		},
	},
]);

export const table_body_cell_action = style([
	table_body_cell,
	{
		width: 0,
		padding: 0,
	},
]);

export const table_body_cell_rank = style([
	table_body_cell,
	{
		width: 0,
		textAlign: 'right',
	},
]);

export const table_body_row_add = style([
	{
		height: 1,
	},
]);

export const table_body_cell_add = style([
	{
		height: 1,
		position: 'relative',
		padding: 0,
	},
]);

export const table_add = style([
	{
		height: '0.5rem',
		position: 'absolute',
		left: 0,
		right: 0,
		top: '-0.25rem',
		cursor: 'url(/cursor_add.svg) 12 12, pointer',
		':hover': {
			backgroundColor: colors.primary,
		},
		selectors: {
			[`${table_body_row_add}:first-child ${table_body_cell_add} &`]: {
				zIndex: z_index_first_row_add,
			},
		},
	},
]);

export const table_action = style([
	{
		height: '100%',
		aspectRatio: '1',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		':hover': {
			backgroundColor: colors.surface,
		},
	},
]);

export const table_number = style([
	{
		textAlign: 'end',
	},
]);
