# Geometry Dash Open List

![Logo](https://gist.githubusercontent.com/Emonadeo/3c3ca5d44d23ee7c9ae3c048c8f3a2c4/raw/GDOL.svg)

![Version](https://img.shields.io/github/v/tag/emonadeo/gdol?include_prereleases&label=deno.land%2Fx&sort=semver)
![License](https://img.shields.io/github/license/Emonadeo/GDOL)
![Chat](https://img.shields.io/discord/1089355940836421632)

## Getting Started

GDOL requires [Deno](https://deno.com/manual/getting_started/installation) (>= v1.32.5).

```console
deno run --unstable --allow-all https://deno.land/x/gdol/cli.ts
```

When running for the first time, it will create `gdol.db` file in the directory the command was run
in. All data (users, levels, records, etc.) gets stored inside this file, so deleting it will
subsequently delete all content.

## Extending

Rather than using the CLI, you can use GDOL as a web framework to fully customize and extend it.

```ts
// my_app.ts
import { Gdol } from 'https://deno.land/x/gdol/mod.ts';

const gdol = new Gdol();

// do stuff

// start http server
await gdol.serve();
```

Running it works the same as any other Deno application:

```console
deno run --unstable --allow-all my_app.ts
```

## Contributing

See: https://github.com/emonadeo/gdol/contribute

## Acknowledgements

### Inspiration

[Pocketbase](https://pocketbase.io/): Largerly inspired the single executable/script philosophy and
heavily influenced the codebase structure.

[Material Design 3](https://m3.material.io): Providing sensible guidelines that GDOL loosely
follows.

### Credits

#### Libraries

[Astro](https://astro.build/): State-of-the-art rendering framework for perfect lighthouse scores.

[Atlas](https://atlasgo.io/): Database schema migrations.

[Capsize](https://seek-oss.github.io/capsize/): Flipping how we define typography in CSS.

[Hono](https://hono.dev/): Performant web framework with great DX.

[SolidJS](https://solidjs.com/): Front-end framework that popularized signals.

[SQLite](https://sqlite.org/): The embedded database.

[Vanilla-Extract](https://vanilla-extract.style/): Zero-runtime Stylesheets in TypeScript.

#### Fonts

[Clash Display](https://www.fontshare.com/fonts/clash-display) by Indian Type Foundry

[Lexend](https://fonts.google.com/specimen/Lexend) by Bonnie Shaver-Troup, Thomas Jockin, Santiago
Orozco, Héctor Gómez, Superunion

[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38

[Code New Roman](https://www.cdnfonts.com/code-new-roman.font) by Sam Radian

#### Other

[Tailwind](https://tailwindcss.com/): CSS Reset adapted from Tailwind's
[preflight.css](https://github.com/tailwindlabs/tailwindcss/blob/v3.3.1/src/css/preflight.css).
