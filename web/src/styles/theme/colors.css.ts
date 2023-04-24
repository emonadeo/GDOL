import { createGlobalTheme } from '@vanilla-extract/css';

// https://m3.material.io/styles/color/the-color-system/color-roles
export const colors = createGlobalTheme(':root', {
	primary: '#00ffff',
	onPrimary: '#000000',

	background: '#000000',
	onBackground: '#ffffff',

	surface: '#333333',
	onSurface: '#ffffff',

	error: '#de0000',
	onError: '#ffffff',

	outline: '#333333',
});
