# Contributing to Gaidrid

## Setup

1. Open `chrome://extensions` (or `edge://extensions`), enable **Developer mode**.
2. **Load unpacked** → select this folder (the repository root).
3. Open a new tab (`Ctrl+T`).
4. Install dev dependencies: `npm install` (needed only for the CSS build + store zip).

## Workflow

- Branch off the default branch. Use a short, descriptive name (`fix/sports-refresh`, `feat/rss-filter`).
- Keep commits small and focused: one logical change per commit.
- One change per pull request. Split unrelated work into separate PRs.
- Do not bump versions. Releases handle that.

## Where things live

- `manifest.json` — MV3: newtab override, storage + optional topSites.
- `newtab.html` — new-tab page (no inline code; scripts reference `js/` files).
- `css/` — tokens, fonts, base, brand layer (built from `build/input.css` via Tailwind).
- `js/` — config, app, theme pre-paint.
- `assets/` — icons, engine marks, logotypes, fonts.
- `vendor/` — FontAwesome + Readability (local, no CDN).

No-code customization: `js/config.js` (defaults, cities, engine/icon overrides), `assets/engines/*.svg` (same-name reskin), `css/tokens.css` (brand tokens).

## Before pushing

```sh
node --check js/app.js
npm run build
```

Then reload the unpacked extension (🔄 on the extension card) and refresh the tab. The CI runs the same checks on every push/PR.

## Pull Requests

- Describe what changed and why. The diff already shows how.
- Link related issues (`Closes #___`, `Refs #___`).
- For UI changes, attach before/after screenshots or a short recording.
- No personal data in screenshots, recordings, or logs.

## Bugs and Features

- Bugs: use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md). Include reproduction steps and environment details.
- Features: use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md). Describe the problem first, then the proposed solution.

## Security

See [SECURITY.md](SECURITY.md). Never report vulnerabilities as public issues.
