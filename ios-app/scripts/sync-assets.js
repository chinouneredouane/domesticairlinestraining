// Copies the UPRT website's media (images/ and audio/ at the repository root) into
// the app bundle so the website stays the single source of truth for content.
// Missing folders are skipped: the app hides any image or audio it cannot find.
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const www = path.resolve(__dirname, '..', 'www', 'media', 'uprt');

for (const dir of ['images', 'audio']) {
  const src = path.join(repoRoot, dir);
  const dest = path.join(www, dir);
  if (!fs.existsSync(src)) {
    console.warn(`[sync-assets] ${dir}/ not found at repo root – skipping (media will be hidden in the app).`);
    continue;
  }
  fs.mkdirSync(www, { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`[sync-assets] copied ${dir}/ -> www/media/uprt/${dir}/`);
}
