import { style } from '@vanilla-extract/css';

import { colors } from 'src/styles/theme/colors.css.ts';

export const container = style([
    {
        display: 'grid',
        gridTemplateColumns: '16rem minmax(0, 1fr)',
        gridTemplateRows: 'minmax(0, 1fr)',
    },
]);

export const sidebar = style([
    {
        display: 'flex',
        flexDirection: 'column',
        paddingBlock: '4rem',
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: colors.outline,
    },
]);

export const categories = style([
    {
        marginBottom: '2rem',
    },
]);

export const category = style([
    {
        display: 'flex',
        alignItems: 'center',
        height: '2.5rem',
        paddingInline: '1rem',
        ':hover': {
            backgroundColor: colors.surface,
            color: colors.onSurface,
        },
        selectors: {
            '&[aria-current="page"]': {
                borderLeftWidth: 1,
                borderLeftStyle: 'solid',
                borderLeftColor: colors.onSurface,
            },
        },
    },
]);

export const actions = style([
    {
        flex: 1,
        marginBottom: 0,
        display: 'flex',
        alignItems: 'flex-end',
        paddingInline: '1rem',
    },
]);

export const action = style([
    {
        height: '2.5rem',
        paddingInline: '1rem',
        borderRadius: 4,
        backgroundColor: colors.surface,
    },
]);
