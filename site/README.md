# site/

The static website. Files are served as-is; there is no build step.

## Purpose

Show the page. Content that can change between versions comes from `variants/*.json`. The markup keeps fallback text so the page works if the JSON fails to load.

## Public API

- `index.html` – the page.
- `hero.js` – exports `applyHero(doc, data)`; on load it fetches `../variants/hero.json` and sets the hero text with `textContent` (never `innerHTML`).

No tracking yet; the tracker is added in a later phase via `@pms/tracker`.

## Allowed dependencies

- Browser built-ins only.
- May read `variants/*.json` over HTTP.
- Never imports `@pms/server` or any `node:*` module (checked by `npm run lint`).

## Run locally

```sh
node scripts/serve.mjs
# open http://localhost:8080/site/
```
