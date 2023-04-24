import { style } from '@vanilla-extract/css';

import { sm } from 'src/styles/screens.ts';

export const page = style([
	{
		height: '100%',
		position: 'relative',
	},
	sm({
		display: 'grid',
		gridTemplateColumns: '4rem minmax(0, 1fr)',
		gridTemplateRows: 'minmax(0, 1fr)',
	}),
]);
