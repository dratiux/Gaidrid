# Gaidrid

<p align="center">
  <a href="https://github.com/dratiux/Gaidrid/actions/workflows/validate.yml"><img src="https://github.com/dratiux/Gaidrid/actions/workflows/validate.yml/badge.svg" alt="Validate"></a>
  <a href="https://github.com/dratiux/Gaidrid/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
</p>

> Privacy-first MV3 new-tab page: multi-engine search, shortcuts, weather, sports, RSS news, and extras — offline-first, no accounts or trackers.

## Features

- **Multi-engine search** — Google, YouTube, Bing, DuckDuckGo, Brave, Yahoo,
  Ecosia with result-type modes (All, News, Maps, Images, Videos), live
  suggestions, history and an offline calculator (`12*45` → `540`). Engine
  bangs (`!yt cats`, `!b …`, `!dd …`) run one search on another engine —
  type `!` to see all shortcuts.
- **Clock, date & greeting** — 12/24-hour, seconds toggle, optional name.
- **Live weather** — city or browser geolocation (cached, permission asked
  only on explicit action), °C/°F.
- **Shortcuts drawer** — add, edit, delete, drag-reorder, tile colors, icon
  search (Iconify), custom tile art.
- **Frequently visited** — optional top-sites row (permission requested
  only when enabled).
- **Sports** — optional scores, live status and standings for 10 leagues
  (UCL, EPL, La Liga, Serie A, Bundesliga, Ligue 1, NBA, NFL, MLB, NHL) from
  ESPN's public endpoints (no key, no account). Day navigation ±7 days,
  multiple favorite teams per league with a quick list inside the Sports
  window, a next-match chip on the home page, a live count badge on the
  toolbar for your favorite teams only, per-sport card styling, and an
  optional 60-second auto-refresh that pauses while the tab is hidden.
- **RSS news** — built-in feeds (Hacker News, BBC, Ars Technica, NPR by
  default) with your own extra feeds (verified on add, auto-named), per-feed
  filter chips, text search, unread dots with mark-all-read and a toolbar
  unread-count badge, lazy-loaded thumbnails, and a Readability-extracted
  reading view with font size, read-time estimate and progress bar.
  Network call only when you open the dock.
- **Extras** — Pomodoro timer, quick notes, daily quote, keyboard shortcuts
  (`/`, `1–8`, arrows, `Enter`, `Esc`), Light/Dark/Auto theme, accent color
  picker, night schedule (force dark in a time window), JSON backup,
  first-run onboarding, splash screen.
- **Side panel** — open the same workspace in the browser's side panel;
  search and shortcuts there open results in a new tab. Keyboard shortcut
  `Ctrl+Shift+K` (`Cmd+Shift+K` on Mac).
- **Privacy-first** — fully offline bundle (Tailwind, FontAwesome, fonts
  vendored); sync storage with local fallback; no accounts, ads or trackers.
  See [PRIVACY.md](PRIVACY.md).

## Project layout

```
./
├── manifest.json      # MV3: newtab override, storage + optional topSites
├── newtab.html        # New-tab page (no inline code)
├── css/               # tokens, fonts, base, brand layer
├── js/                # config, app, theme pre-paint
├── assets/            # icons, engine marks, logotypes, Albert Sans (+OFL)
└── vendor/            # FontAwesome + Readability (local, no CDN)
```

## Install (developer mode)

1. Open `chrome://extensions` (or `edge://extensions`), enable **Developer mode**.
2. **Load unpacked** → select this folder (the repository root).
3. Open a new tab (`Ctrl+T`).
4. **After every change**: press 🔄 on the extension card, then refresh the tab.

## Customize (no code changes)

- `js/config.js` — default engine/mode/city/theme, extra cities,
  engine overrides, icon overrides.
- `assets/engines/*.svg` — drop same-name files to reskin
  engine marks (square viewBox).
- `css/tokens.css` — brand tokens (`#212832` / `#EEEEEE`).

## Validate

Run manifest/reference checks with Node 18+:

```sh
node --check js/app.js
node -e "JSON.parse(require('fs').readFileSync('manifest.json'))"
```

## Publishing

See [Edge Add-ons publishing](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension).
Build the store `.zip` with `npm run build` (rebuilds CSS + packs a self-checking zip).
Required store assets not in
this repo: promo tile (440×280), screenshots (1280×800 or 640×400),
listing description, and the hosted [`PRIVACY.md`](PRIVACY.md) URL.

## License

[MIT](LICENSE) © 2026 dratiux. Third-party components keep their own
licenses — see [NOTICE](NOTICE).

---

<p align="center">
  <br>
  <sub>CRAFTED WITH CARE BY DRATIUX</sub>
  <br><br>
  <a href="https://paypal.me/dratiux"><img src="https://img.shields.io/badge/PayPal-F2F2F2?logo=paypal&logoColor=003087&style=flat" alt="PayPal"></a>
  <a href="https://ko-fi.com/dratiux"><img src="https://img.shields.io/badge/Ko--fi-F2F2F2?logo=ko-fi&logoColor=FF5E5B&style=flat" alt="Ko-fi"></a>
</p>
