import { readFile } from 'node:fs/promises';

const [main, app, menu, admin, vercel] = await Promise.all([
  readFile('main.jsx', 'utf8'),
  readFile('App.jsx', 'utf8'),
  readFile('MenuPage.jsx', 'utf8'),
  readFile('AdminPage.jsx', 'utf8'),
  readFile('vercel.json', 'utf8'),
]);

const checks = [
  ['admin route', main.includes("normalizedPath === '/admin'"), 'main.jsx'],
  ['menu route', main.includes("normalizedPath === '/menu'"), 'main.jsx'],
  ['cat route', main.includes("/^\\/koty\\/([^/]+)$/"), 'main.jsx'],
  ['menu page content', menu.includes('Kocia<br/>') && menu.includes('karta.'), 'MenuPage.jsx'],
  ['booking form', app.includes('Zarezerwuj stolik'), 'App.jsx'],
  ['events section', app.includes('id="events"'), 'App.jsx'],
  ['admin editor', admin.includes('Сохранить изменения'), 'AdminPage.jsx'],
  ['Vercel menu rewrite', vercel.includes('"source": "/menu"'), 'vercel.json'],
];

const failed = checks.filter(([, passed]) => !passed);
checks.forEach(([name, passed]) => console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`));
if (failed.length) {
  console.error(`\n${failed.length} smoke check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`\n${checks.length} smoke checks passed.`);
}
