import {
	clashDisplay,
	codeNewRoman,
	FontRule,
	lexend,
	pressStart,
} from 'src/styles/internal/typefaces.ts';
import { sm, xl } from 'src/styles/screens.ts';

export const displayLargeRule = clashDisplay([
	{
		fontWeight: 600,
		fontOptions: {
			capHeight: 44,
			lineGap: 24,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 56,
			lineGap: 24,
		},
	}),
	xl<FontRule>({
		fontOptions: {
			capHeight: 64,
			lineGap: 32,
		},
	}),
]);

export const displayMediumRule = clashDisplay([
	{
		fontWeight: 600,
		fontOptions: {
			capHeight: 28,
			lineGap: 16,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 32,
			lineGap: 16,
		},
	}),
	xl<FontRule>({
		fontOptions: {
			capHeight: 40,
			lineGap: 16,
		},
	}),
]);

export const displaySmallRule = clashDisplay([
	{
		fontWeight: 600,
		fontOptions: {
			capHeight: 20,
			lineGap: 12,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 24,
			lineGap: 12,
		},
	}),
	xl<FontRule>({
		fontOptions: {
			capHeight: 28,
			lineGap: 12,
		},
	}),
]);

export const titleLargeRule = pressStart([
	{
		textTransform: 'uppercase',
		fontOptions: {
			capHeight: 14,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 16,
			lineGap: 8,
		},
	}),
]);

export const titleMediumRule = pressStart([
	{
		textTransform: 'uppercase',
		fontOptions: {
			capHeight: 10,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 12,
			lineGap: 8,
		},
	}),
]);

export const titleSmallRule = pressStart([
	{
		textTransform: 'uppercase',
		fontOptions: {
			capHeight: 8,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 10,
			lineGap: 8,
		},
	}),
]);

export const labelLargeRule = lexend([
	{
		fontWeight: 500,
		fontOptions: {
			capHeight: 12,
			lineGap: 8,
		},
	},
]);

export const labelMediumRule = lexend([
	{
		fontWeight: 500,
		fontOptions: {
			capHeight: 10,
			lineGap: 8,
		},
	},
]);

export const labelSmallRule = lexend([
	{
		fontWeight: 500,
		fontOptions: {
			capHeight: 8,
			lineGap: 8,
		},
	},
]);

export const bodyLargeRule = lexend([
	{
		fontWeight: 500,
		fontOptions: {
			capHeight: 10,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 12,
			lineGap: 12,
		},
	}),
]);

export const bodyLargeMonoRule = codeNewRoman([
	{
		fontOptions: {
			capHeight: 10,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 12,
			lineGap: 12,
		},
	}),
]);

export const bodyMediumRule = lexend([
	{
		fontWeight: 500,
		fontOptions: {
			capHeight: 8,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 10,
			lineGap: 8,
		},
	}),
]);

export const bodyMediumMonoRule = codeNewRoman([
	{
		fontOptions: {
			capHeight: 8,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 10,
			lineGap: 8,
		},
	}),
]);

export const bodySmallRule = lexend([
	{
		fontWeight: 500,
		fontOptions: {
			capHeight: 6,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 8,
			lineGap: 8,
		},
	}),
]);

export const bodySmallMonoRule = codeNewRoman([
	{
		fontOptions: {
			capHeight: 6,
			lineGap: 8,
		},
	},
	sm<FontRule>({
		fontOptions: {
			capHeight: 8,
			lineGap: 8,
		},
	}),
]);
