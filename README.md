# Gaidrid

A Manifest V3 browser extension that turns every new tab into a focused,
visually refined workspace. Minimal interface, quick access, zero clutter.

## Features

- **Multi-engine search** — Google, YouTube, Bing, DuckDuckGo, Brave, Yahoo,
  Ecosia with result-type modes (All, News, Maps, Images, Videos), live
  suggestions, history and an offline calculator (`12*45` → `540`).
- **Clock, date & greeting** — 12/24-hour, seconds toggle, optional name.
- **Live weather** — city or browser geolocation (cached, permission asked
  only on explicit action), °C/°F.
- **Shortcuts drawer** — add, edit, delete, drag-reorder, tile colors, icon
  search (Iconify), custom tile art.
- **Frequently visited** — optional top-sites row (permission requested
  only when enabled).
- **Sports** — optional scores, live status and standings for UCL, EPL, NBA
  and NFL from ESPN's public endpoints (no key, no account). Day navigation
  ±7 days, one favorite team per league, and an optional 60-second
  auto-refresh that pauses while the tab is hidden.
- **RSS news** — built-in feeds (Hacker News, BBC, Ars Technica, NPR by
  default) with your own extra feeds, lazy-loaded thumbnails, and Readability-
  extracted reading view. Network call only when you open the dock.
- **Extras** — Pomodoro timer, quick notes, daily quote, keyboard shortcuts
  (`/`, `1–8`, arrows, `Enter`, `Esc`), Light/Dark/Auto theme, JSON backup,
  first-run onboarding, splash screen.
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

Brand sources (`01_Brand-Guidelines` … `05_Design-System`) stay outside the
repo (local only) and are not published to the store.

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

## Credits

Crafted with care by **dratiux**.
