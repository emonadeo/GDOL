import { styleVariants } from '@vanilla-extract/css';

import { lt_lg, lt_md, lt_sm, lt_xl, lt_xxl, sm, md, lg, xl, xxl } from 'src/styles/screens.ts';

const ruleDisplayNone = { display: 'none !important' };

export const screens = styleVariants({
	sm: lt_sm(ruleDisplayNone),
	md: lt_md(ruleDisplayNone),
	lg: lt_lg(ruleDisplayNone),
	xl: lt_xl(ruleDisplayNone),
	xxl: lt_xxl(ruleDisplayNone),

	lt_sm: sm(ruleDisplayNone),
	lt_md: md(ruleDisplayNone),
	lt_lg: lg(ruleDisplayNone),
	lt_xl: xl(ruleDisplayNone),
	lt_xxl: xxl(ruleDisplayNone),
});
