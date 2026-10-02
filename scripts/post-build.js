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

  // Generate static stubs for localized paths (/fr/, /de/, /ja/)
  const locales = ['fr', 'de', 'ja'];
  for (const loc of locales) {
    const locDir = path.join(distDir, loc);
    if (!fs.existsSync(locDir)) {
      fs.mkdirSync(locDir, { recursive: true });
    }
    const locHtml = html.replace(/<html lang="[^"]*"/, `<html lang="${loc}"`);
    fs.writeFileSync(path.join(locDir, 'index.html'), locHtml, 'utf8');
    console.log(`[post-build] Generated static stub for /${loc}/index.html`);
  }
}
