import { style } from '@vanilla-extract/css';

export const container = style([
	{
		display: 'grid',
		gridAutoFlow: 'column',
		gridAutoColumns: 'minmax(0, 1fr)',
		gridTemplateRows: 'minmax(0, 1fr)',
		transition: 'all 1s ease',
		overflow: 'auto',
	},
]);
