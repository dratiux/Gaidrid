const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ext = path.resolve(__dirname, '..');
const dist = path.join(ext, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(ext, 'manifest.json'), 'utf8'));
fs.mkdirSync(dist, { recursive: true });
const zipPath = path.join(dist, `gaidrid-${manifest.version}.zip`);
fs.rmSync(zipPath, { force: true });

execSync(`tar -a -c -f "${zipPath}" -C "${ext}" --exclude=.git --exclude=.github --exclude=dist --exclude=node_modules --exclude=_config.yml --exclude=build --exclude=tailwind.config.cjs --exclude=package.json --exclude=package-lock.json --exclude=tests --exclude=docs .`, { stdio: 'inherit' });

const raw = execSync(`tar -tf "${zipPath}"`).toString().split(/\r?\n/).filter(Boolean);
const entry = raw.map((e) => e.replace(/\\/g, '/').replace(/^\.\//, ''));
const bad = entry.filter((e) => /(^|\/)(dist|\.git|\.github|node_modules|tests|docs)(\/|$)/.test(e) || /package(-lock)?\.json$|tailwind\.config\.cjs$|^_config\.yml$/.test(e));
if (bad.length) throw new Error('zip contains excluded paths: ' + bad.join(', '));
for (const req of ['manifest.json', 'newtab.html', 'js/app.js', 'PRIVACY.md', 'NOTICE', 'offline-game.html', 'dino-scripts/s8.js', 'css/app.css']) {
  if (!entry.includes(req)) throw new Error('zip missing ' + req);
}
const size = Math.round(fs.statSync(zipPath).size / 1024);
console.log(`packed ${zipPath}  (${size} KB, ${entry.length} entries)`);
console.log('CHECK OK');
