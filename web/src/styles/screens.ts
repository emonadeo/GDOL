import { createScreens } from 'src/styles/internal/screens.ts';

const breakpoints = {
	sm: 480,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1600,
} as const;

export const screens = createScreens(breakpoints);
export const { sm, md, lg, xl, xxl, lt_sm, lt_md, lt_lg, lt_xl, lt_xxl } = screens;
