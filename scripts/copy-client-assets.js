import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const src = resolve('dist/client/assets');
const dest = resolve('public/assets');

await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });
console.log(`Copied client assets from ${src} to ${dest}`);
