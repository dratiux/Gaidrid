# Gaidrid — Privacy Policy

**Effective date: 4 October 2026** · **Last updated: 4 October 2026**

Published at: <https://dratiux.github.io/Gaidrid/PRIVACY>

## TL;DR

- **No account, no analytics, no ads, no tracking.**
- **No Gaidrid server.** Everything runs in your browser; there is nothing for
  us to collect or see.
- Your settings, shortcuts, notes, history and theme live on your device
  (synced across your browsers via `chrome.storage.sync`).
- Network requests happen only for the features you turn on or directly use,
  and only to the third-party services listed below.

---

## 1. What we do not collect

We do not collect any personal information. We have no sign-up, no backend,
and no API that reports your usage back to us. We do **not** collect, sell,
rent, or share data for marketing or advertising.

## 2. Data processed in your browser

The following data is created by the extension while you use it and is stored
**only in your browser's local storage** (or, if sync is enabled, through your
own browser profile's sync service — governed by Google/Microsoft policies,
not ours):

- Settings, theme, language, and layout choices
- Custom shortcuts and their tile colors
- Focus-timer preferences and session notes
- Search history (used only to populate the local suggestion list)

Uninstalling Gaidrid deletes all of the above. Clearing the browser
profile's synced data also removes the synced copy.

## 3. When data leaves your device (network features)

Gaidrid talks to third-party services only when you explicitly use the
feature that needs them, and only to request the data needed for that
exact feature. We never send your local settings, shortcuts, notes,
or search history. HTTP requests include no personal identifiers added
by us; the source IP is that of your own browser, not a proxy we operate.

| When | We send | To | For what |
|---|---|---|---|
| Search / results | Your query or URL | The search engine you selected (Google, Bing, DuckDuckGo, Brave, Yahoo, Ecosia, YouTube) | Loading results or suggestions |
| Live suggestions | Partial search text while you type | The suggestion service of that same engine (Google, Bing, DuckDuckGo, Brave) | Showing autocomplete |
| Weather — custom city | City name | Open-Meteo geocoding API | Resolving coordinates |
| Weather — “current location” | Your coordinates | Open-Meteo forecast API | Fetching local weather |
| Shortcut icon search | Icon search text | Iconify API | Finding matching icons |
| Shortcut favicons | Site hostname | Google's favicon service (`s2/favicons`) | Loading the site icon |
| Sports window | League name + viewed date range | ESPN public scoreboard/standings APIs | Live scores, schedules, standings |
| RSS news dock | The feed URL you added (or its builtin default) | The RSS publisher's own endpoint | Fetching headlines and reading view |

All of the above use plain HTTPS from your own browser to the third party.
Each third party processes that data under its own privacy policy — we choose
providers with free, no-registration endpoints and send them the minimum
needed to serve the request.

## 4. Optional browser permissions

Gaidrid requests the minimum:

- **`storage`** — to save your settings across new tabs.
- **`topSites`** (optional, requested only when you enable the shortcuts row)
  — to suggest frequently-visited sites. Data is read locally; we do not send
  it anywhere.
- **Host access (`https://*/*`, `http://*/*`, optional)** — only if you opt
  in to RSS/news or shortcut favicons from arbitrary domains. Remote
  responses are rendered as data, never executed as code; Gaidrid follows the
  browser's remote-code policy and ships all of its own JavaScript locally.
- **Host access to Open-Meteo** — only for the weather widget.

Denying any optional permission simply disables that feature; the rest of
Gaidrid keeps working.

## 5. Your control

- **YouTube/News/Weather/Top Sites/Live suggestions**: each can be switched
  off in Settings at any time. Off means no network requests from that feed.
- **Sports**: only fetches ESPN when its window is open, auto-refresh can be
  set to Off, and stops entirely when window closes or tab hidden.
- **Offline mode**: everything except live data keeps working; the tab also
  shows a calm offline state.
- **Clearing your data**: uninstall Gaidrid, or clear extension storage via
  your browser settings. Because nothing is sent to a Gaidrid server, there
  is nothing for us to delete on our side.

## 6. Children's privacy

Gaidrid is not directed at children under 13. We knowingly do not collect any
personal data from anyone, including children.

## 7. Changes to this policy

If the way Gaidrid handles data changes, this page is updated and the date at
the top will change. A material change to the privacy policy will be
mentioned in the extension's release notes.

## 8. Contact

Questions about this policy, or any data concern:
open an issue at
[github.com/dratiux/Gaidrid/issues](https://github.com/dratiux/Gaidrid/issues).

---

Crafted with care by dratiux.
