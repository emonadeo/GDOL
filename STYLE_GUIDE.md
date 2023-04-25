# Code Style

> WIP

Unless specified otherwise the
[Deno Code Style](https://deno.land/manual/references/contributing/style_guide) applies. (Yes, for
Node Modules too)

`deno task fmt` will run [Prettier](https://prettier.io/) to lint all code. `deno task lint:web`
will run [ESLint](https://eslint.org/) to lint all frontend code.

## Programming Paradigm

Even though TypeScript supports multiple paradigms, GDOL loosely follows procedural/functional
programming principles.

**Avoid** state and mutations. Use where neccessary.

**Avoid** classes, **unless** it is public facing API. Use objects and functions instead.

## Naming conventions

Folders and Files use `snake_case`.

CSS-in-JS Constants and Variables
([`@vanilla-extract/css`](https://vanilla-extract.style/documentation/getting-started/)) use
`snake_case`.

Components (Astro, SolidJS) and Types use `PascalCase`.

Other JS/TS Constants, Variables and Functions (_except_ Components) use `camelCase`.

Naming conventions may be disregarded if required (e.g. `pnpm-workspace.yaml`).

## Imports and Exports

**Avoid** relative imports (`import { bar } from '../../foo/bar.ts'`), **unless** the module is
within the same directory. (Unfortunately in Deno relative imports have to be used)

**Do not** omit the file suffix (e.g. `.ts`, `.svg`), **unless** it is a package (e.g. `hono`,
`@gdol/api`).

**Do not** use default exports (`export default ...`). Use named exports (`export const foo = ...`,
`export function bar() { ... }`) instead.

## Pages and Routes

All pages and routes should be named `index`. For Astro Pages: `index.astro`. For Hono Routes:
`index.ts`.

Path segments are represented as folders.

For example the page/route `/foo/bar` should be resembled as `web/src/pages/foo/bar/index.astro`
(Astro) or `api/routes/foo/bar/index.ts` (Hono).
