import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { defaultData, textFor } from '../src/data/adminData.js';

const origin = 'https://niebieski-kot.vercel.app';
const source = join('dist', 'index.html');
const template = await readFile(source, 'utf8');
const seoByPath = new Map(defaultData.seo.pages.map(page => [page.path, page]));
const routes = ['/', '/menu', '/koty/luna', '/koty/mochi', '/koty/pixel', '/admin'];
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function pageHtml(path) {
  const seo = seoByPath.get(path);
  const rawTitle = path === '/admin' ? 'Panel administracyjny' : textFor(seo?.title, 'pl');
  const rawDescription = path === '/admin' ? 'Panel zarządzania kawiarnią Niebieski Kot.' : textFor(seo?.description, 'pl');
  const title = `${rawTitle} | Niebieski Kot`;
  const canonical = `${origin}${path === '/' ? '/' : path}`;
  const robots = path === '/admin' ? 'noindex, nofollow' : 'index, follow';
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(rawDescription)}" />`)
    .replace(/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(rawDescription)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(rawDescription)}" />`);
}

for (const path of routes) {
  const target = path === '/' ? source : join('dist', path.slice(1), 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, pageHtml(path));
}

const notFound = template
  .replace(/<title>[^<]*<\/title>/, '<title>Nie znaleziono strony | Niebieski Kot</title>')
  .replace(/<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="Ta strona nie istnieje." />')
  .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${origin}/404" />`);
await writeFile(join('dist', '404.html'), notFound);

console.log(`Created route-specific HTML for: ${routes.join(', ')} and 404`);
