import { generateIdentifier } from '@vanilla-extract/css';
import { DataType, Property } from 'csstype';

type A<T, N extends number> = (readonly T[] & { length: N }) | [never];

type GridTemplateArea = string;
type GridTemplateAreas<R extends number, C extends number> = A<
	A<GridTemplateArea, C & object>,
	R & object
>;
type GridTemplateDimensions<N extends number> = A<DataType.TrackBreadth<string & object>, N>;

export function createGridTemplate<R extends number, C extends number>(template: {
	areas: GridTemplateAreas<R, C>;
	rows: GridTemplateDimensions<R>;
	columns: GridTemplateDimensions<C>;
}): Property.GridTemplate {
	return `${template.areas
		.map((row, i) => `"${row.join(' ')}" ${template.rows[i]}`)
		.join(' ')} / ${template.columns.join(' ')}`;
}

export function createGridArea(debugId?: string): GridTemplateArea {
	return generateIdentifier(debugId);
}

export function gridTemplateAreas<R extends number, C extends number>(
	areas: GridTemplateAreas<R, C>
): Property.GridTemplateAreas {
	return areas.map((row) => `"${row.join(' ')}"`).join(' ');
}
