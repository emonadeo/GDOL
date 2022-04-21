import { resolve } from 'path';

/**
 * @file Contains path aliases used by Vite and Svelte
 */

export default [{ find: 'src', replacement: resolve(process.cwd(), 'src') }];
