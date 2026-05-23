import { mkdir, cp, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

function safeResolve(...p) {
  return resolve(process.cwd(), ...p);
}

async function main() {
  const serverAssetsDir = safeResolve('dist', 'server', 'assets');
  const clientAssetsDir = safeResolve('dist', 'client', 'assets');
  const manifestPath = safeResolve('dist', 'server', '.vite', 'manifest.json');

  if (!existsSync(manifestPath)) {
    console.log('No manifest found at', manifestPath);
    return;
  }

  // Ensure client assets dir exists and copy server assets there
  await mkdir(clientAssetsDir, { recursive: true });
  if (existsSync(serverAssetsDir)) {
    await cp(serverAssetsDir, clientAssetsDir, { recursive: true });
    console.log('Copied server assets to client assets');
  } else {
    console.log('No server assets to copy');
  }

  const manifestRaw = await import('fs').then(fs => fs.promises.readFile(manifestPath, 'utf8'));
  const manifest = JSON.parse(manifestRaw);

  // Find start script entry
  let startFile = manifest['src/start.ts']?.file || manifest['src/start.tsx']?.file;
  if (!startFile) {
    for (const key of Object.keys(manifest)) {
      const val = manifest[key];
      if (val && (val.name === 'start' || key.endsWith('/src/start.ts') || key === 'src/start.ts')) {
        startFile = val.file;
        break;
      }
    }
  }

  // Find styles file
  let styleFile;
  for (const key of Object.keys(manifest)) {
    const val = manifest[key];
    if (!val) continue;
    if (val.src && typeof val.src === 'string' && val.src.endsWith('src/styles.css')) {
      styleFile = val.file;
      break;
    }
    if (val.assets && Array.isArray(val.assets)) {
      const found = val.assets.find(a => a.includes('styles--'));
      if (found) { styleFile = found; break; }
    }
  }

  // Fallback: try to read existing client assets for styles
  if (!styleFile) {
    try {
      const clientFiles = await import('node:fs').then(fs => fs.promises.readdir(clientAssetsDir));
      const css = clientFiles.find(f => f.startsWith('styles-') || f.startsWith('styles--'));
      if (css) styleFile = `assets/${css}`;
    } catch (err) {
      // ignore
    }
  }

  if (!startFile) {
    console.log('Could not find start entry in manifest; aborting index generation.');
    return;
  }

  // Normalize asset file names (strip leading "assets/" if present)
  const normalize = (p) => p ? p.replace(/^assets[\/]/, '') : p;
  const startFileName = normalize(startFile);
  const styleFileName = normalize(styleFile);

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Focus Flow</title>
    ${styleFileName ? `<link rel="stylesheet" href="/assets/${styleFileName}" />` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${startFileName}"></script>
  </body>
</html>`;

  const outPath = safeResolve('dist', 'client', 'index.html');
  await writeFile(outPath, indexHtml, 'utf8');
  console.log('Generated', outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
