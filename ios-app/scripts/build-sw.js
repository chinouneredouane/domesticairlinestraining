// Generates www/sw.js: a service worker that stores every file of the app on the
// device so DAL TRAINING works offline once it has been opened.
// The version is a hash of all files, so pilots get updates automatically.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const www = path.resolve(__dirname, '..', 'www');
const skip = new Set(['sw.js']);
const files = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    const rel = path.relative(www, full).split(path.sep).join('/');
    if (name.startsWith('.') || skip.has(rel)) continue;
    if (fs.statSync(full).isDirectory()) walk(full);
    else files.push(rel);
  }
})(www);

const hash = crypto.createHash('sha256');
for (const f of files) hash.update(f).update(fs.readFileSync(path.join(www, f)));
const version = hash.digest('hex').slice(0, 12);

const template = fs.readFileSync(path.join(__dirname, 'sw-template.js'), 'utf8');
const out = template
  .replace('__VERSION__', version)
  .replace('__FILES__', JSON.stringify(['./', ...files.filter((f) => f !== 'index.html')], null, 2));
fs.writeFileSync(path.join(www, 'sw.js'), out);
console.log(`[build-sw] ${files.length} files, version ${version}`);
