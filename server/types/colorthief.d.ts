declare module 'colorthief' {
	type Color = [number, number, number];
	export function getColor(img: string | null): Promise<Color>;
	export function getPalette(img: string | null): Promise<Color[]>;
}
