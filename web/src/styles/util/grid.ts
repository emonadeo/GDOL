import { generateIdentifier } from '@vanilla-extract/css';
import { DataType, Property } from 'csstype';

type Tuple<TItem, TLength extends number> = (readonly TItem[] & { length: TLength }) | [never];

type GridTemplateArea = string;
type GridTemplateAreas<TRowCount extends number, TColumnCount extends number> = Tuple<
	Tuple<GridTemplateArea | null, TColumnCount & {}>,
	TRowCount & {}
>;
type GridTemplateDimensions<TCount extends number> = Tuple<
	DataType.TrackBreadth<string & {}>,
	TCount
>;

export function createGridTemplate<
	TRowCount extends number,
	TColumnCount extends number,
>(template: {
	areas: GridTemplateAreas<TRowCount, TColumnCount>;
	rows: GridTemplateDimensions<TRowCount>;
	columns: GridTemplateDimensions<TColumnCount>;
}): Property.GridTemplate {
	return `${template.areas
		.map((row, i) => `"${row.map((area) => area ?? '.').join(' ')}" ${template.rows[i]}`)
		.join(' ')} / ${template.columns.join(' ')}`;
}

export function createGridArea(debugId?: string): GridTemplateArea {
	return generateIdentifier(debugId);
}

export function gridTemplateAreas<TRowCount extends number, TColumnCount extends number>(
	areas: GridTemplateAreas<TRowCount, TColumnCount>
): Property.GridTemplateAreas {
	return areas.map((row) => `"${row.map((area) => area ?? '.').join(' ')}"`).join(' ');
}
