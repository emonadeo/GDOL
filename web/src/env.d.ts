/// <reference types="astro/client" />

// interface needed for declaration merging
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMetaEnv {
	readonly GDOL_API_URL: string;
}

// interface needed for declaration merging
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
