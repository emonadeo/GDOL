import { style, styleVariants } from '@vanilla-extract/css';

import { lt_sm, sm } from 'src/styles/screens.ts';
import { colors } from 'src/styles/theme/colors.css.ts';

const nav_base = style([
	{
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: colors.background,
	},
	lt_sm({
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: '4rem',
		overflow: 'hidden',
		borderLeftWidth: 1,
		borderLeftStyle: 'solid',
		borderLeftColor: colors.outline,
		transitionProperty: 'width',
		transitionTimingFunction: 'ease-in-out',
		transitionDuration: '250ms',
	}),
	sm({
		height: '100%',
		borderRightWidth: 1,
		borderRightStyle: 'solid',
		borderRightColor: colors.outline,
	}),
]);

export const nav = styleVariants({
	collapsed: [
		nav_base,
		lt_sm({
			width: 0,
		}),
	],
	uncollapsed: [
		nav_base,
		lt_sm({
			width: '4rem',
		}),
	],
});

export const button_collapse = style(
	lt_sm({
		position: 'absolute',
		right: 0,
		bottom: 0,
		height: '4rem',
		width: '4rem',
		gridRow: 2,
		backgroundColor: colors.background,
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderTopStyle: 'solid',
		borderLeftStyle: 'solid',
		borderTopColor: colors.outline,
		borderLeftColor: colors.outline,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	})
);

const button_collapse_icon_base = style(
	lt_sm({
		transitionProperty: 'transform',
		transitionTimingFunction: 'ease-in-out',
		transitionDuration: '250ms',
	})
);

export const button_collapse_icon = styleVariants({
	collapsed: [button_collapse_icon_base],
	uncollapsed: [
		button_collapse_icon_base,
		{
			transform: 'rotate(180deg)',
		},
	],
});

export const minimap = style({
	width: '4rem',
	flex: 1,
	position: 'relative',
});

export const minimap_stops = style({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
});

export const minimap_stop = style({
	height: '4rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	':hover': {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.onBackground,
	},
	':focus-visible': {
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: colors.onBackground,
	},
});

export const minimap_scroll_indicator = style({
	display: 'block',
	position: 'absolute',
	right: 0,
	top: 'auto', // set dynamically by component
});

export const minimap_stop_connector = style({
	flex: 1,
	marginLeft: '2rem',
	borderLeftWidth: 1,
	borderLeftStyle: 'solid',
	borderLeftColor: colors.onBackground,
});

export const archive = style({
	width: '4rem',
	display: 'flex',
	alignItems: 'center',
	paddingInline: '1.5rem',
	paddingBlock: 0,
	writingMode: 'vertical-rl',
	borderWidth: 1,
	borderStyle: 'solid',
	borderColor: 'transparent',
	borderTopColor: colors.outline,
	':hover': {
		borderColor: colors.onBackground,
	},
	':focus-visible': {
		borderColor: colors.onBackground,
	},
});
