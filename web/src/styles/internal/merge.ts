import { StyleRule } from '@vanilla-extract/css';
import deepmerge from 'deepmerge';

export function merge(styles: StyleRule[]) {
	return deepmerge.all(styles) as StyleRule;
}
