import { mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const routes = ['admin', 'menu', 'koty/luna', 'koty/mochi', 'koty/pixel'];
const source = join('dist', 'index.html');

for (const route of routes) {
  const target = join('dist', route, 'index.html');
  await mkdir(join('dist', route), { recursive: true });
  await copyFile(source, target);
}

console.log(`Created static entry points for: ${routes.join(', ')}`);
