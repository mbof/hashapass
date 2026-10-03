const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist/hashapass/browser');
const indexPath = path.join(distDir, 'index.html');
const fallbackPath = path.join(distDir, '404.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  const websiteId = process.env.UMAMI_WEBSITE_ID?.trim();

  if (websiteId && websiteId !== 'UMAMI_WEBSITE_ID') {
    console.log(`[post-build] Injecting Umami tracking tag for website ID: ${websiteId}`);
    const scriptTag = `    <script defer src="https://cloud.umami.is/script.js" data-website-id="${websiteId}"></script>\n  </head>`;
    html = html.replace('</head>', scriptTag);
  } else {
    console.log('[post-build] UMAMI_WEBSITE_ID not provided; skipping tracking tag.');
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  fs.writeFileSync(fallbackPath, html, 'utf8');
  console.log('[post-build] Output index.html and 404.html ready.');

  // Generate static stubs for localized paths (/fr/, /de/, /ja/, /pt-BR/, /pt-br/, /pt/)
  const locales = [
    { dir: 'fr', lang: 'fr' },
    { dir: 'de', lang: 'de' },
    { dir: 'ja', lang: 'ja' },
    { dir: 'pt-BR', lang: 'pt-BR' },
    { dir: 'pt-br', lang: 'pt-BR' },
    { dir: 'pt', lang: 'pt-BR' },
  ];
  for (const { dir, lang } of locales) {
    const locDir = path.join(distDir, dir);
    if (!fs.existsSync(locDir)) {
      fs.mkdirSync(locDir, { recursive: true });
    }
    const locHtml = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
    fs.writeFileSync(path.join(locDir, 'index.html'), locHtml, 'utf8');
    console.log(`[post-build] Generated static stub for /${dir}/index.html`);
  }
}
