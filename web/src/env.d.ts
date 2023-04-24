/// <reference types="astro/client" />

// declare global {
// 	interface Array<T> {
// 		map<This extends Array<T>, U>(this: This, fn: (v: T) => U): { [K in keyof This]: U };
// 	}
//
// 	interface ReadonlyArray<T> {
// 		map<This extends ReadonlyArray<T>, U>(this: This, fn: (v: T) => U): { [K in keyof This]: U };
// 	}
// }

interface ImportMetaEnv {
	readonly GDOL_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
