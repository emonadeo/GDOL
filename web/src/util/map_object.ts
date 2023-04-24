export function mapObject<T, U>(obj: Record<string, T>, mapFn: (value: T, key: string) => U) {
	return mapObjectWithKeys(obj, (value, key) => [key, mapFn(value, key)]);
}

export function mapObjectWithKeys<T, U>(
	obj: Record<string, T>,
	mapFn: (value: T, key: string) => [string, U]
) {
	return Object.fromEntries(Object.entries(obj).map(([key, value]) => mapFn(value, key)));
}
