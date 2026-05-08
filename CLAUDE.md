# Hub contributor guide

Node.js + Express site serving EJS-templated pages for Vimeo Sales Engineering demos.
PM2 runs it in watch mode — **no manual restarts needed**; just save a file and reload the browser.

---

## Tech stack

| Layer | Tool |
|-------|------|
| Server | Node.js + Express |
| Templates | EJS via express-ejs-layouts |
| CSS | Custom BEM, no framework |
| Process manager | PM2 (watch mode) |
| Hosting | AWS EC2 behind OpenLiteSpeed |

---

## Key files

```
server.js                  Express entry point; mounts all routers
data/projects.js           THE file to edit to add/update projects
data/updates.js            Recent activity feed for home page
data/vimeo-spec.json       Cached Vimeo OpenAPI spec (3 MB) — see "Vimeo API Reference" below
data/vimeo-private-endpoints.json  Manual annotation of private/internal endpoints
routes/pages.js            All HTML page routes
routes/api.js              JSON API — GET /api/projects, /api/projects/:slug
routes/vimeo-proxy.js      Catch-all authenticated proxy → api.vimeo.com
routes/vimeo-reference.js  Serves the cached spec + refresh endpoint
utils/vimeo.js             Shared Vimeo API client (always use this; never call Vimeo directly)
utils/helpers.js           formatDate(), statusClass() — attached to app.locals in server.js
views/layouts/main.ejs     Outer HTML shell; uses <%- body %> from express-ejs-layouts
views/pages/               One EJS file per page
views/partials/            Shared includes (nav, footer, section-header, project-card, etc.)
public/css/                CSS load order: reset → tokens → base → layout → components → pages
public/js/                 Page-specific JavaScript (no build step)
.env                       VIMEO_TOKEN, VIMEO_EVENT_ID, PORT, FIRST_NAME, LAST_NAME
```

---

## CSS architecture

The hub uses a custom BEM system across six ordered layers. **Check components.css before
writing any new CSS.** If a pattern is used on more than one page it belongs there, not in pages.css.

### Layer responsibilities

| File | Purpose |
|------|---------|
| `tokens.css` | CSS custom properties only |
| `reset.css` | Browser normalization |
| `base.css` | Element defaults (h1–h4, p, a, code) + `.hidden` + `.right` |
| `layout.css` | Structural layout: `.container`, `.section`, nav, footer, card-grid |
| `components.css` | All reusable UI with BEM naming (see vocabulary below) |
| `pages.css` | Page container sizing/gaps and page-unique elements **only** |

### BEM naming convention

```
Block:     .card  .panel  .form-group
Element:   .panel__header  .form-group__label
Modifier:  .btn--primary  .panel__desc--clamped
State:     .collapsible--open  .toast--visible   (JS-toggled)
Utilities: .hidden  .right  (in base.css — not BEM, small and documented)
```

### Component vocabulary (components.css)

#### Form fields
```
.form-group
.form-group__label   .form-group__optional   .form-group__input
.form-group__textarea  .form-group__error   .form-group__hint
.form-group__divider
```

#### Panel — card with structured header + body
```
.panel               (apply alongside .card to zero card padding)
.panel__header       .panel__title    .panel__subtitle
.panel__body         .panel__desc     .panel__desc--clamped
```
`panel__desc--clamped` applies a 5-line clamp. Pair with `.expand-toggle` and JS that
toggles the modifier off/on to let users expand and collapse.

#### Layout helpers
```
.col-2      2-column grid; collapses to 1-column below 860 px
.stack      flex column with gap; use for left/right column children
```

#### Collapsible — accordion/toggle pattern
```
.collapsible                         (the block; JS adds .collapsible--open)
.collapsible--open                   (modifier — JS-toggled)
.collapsible__toggle                 (clickable header row)
.collapsible__chevron                (rotates 90° when open)
.collapsible__body                   (hidden by default; shown when open)
.collapsible__content                (text inside the body)
.collapsible__content--muted         (italic muted state, e.g. "no transcript")
```

#### Embed
```
.embed           (block)
.embed--16-9     (56.25% padding-bottom aspect-ratio trick for iframes)
```

#### Chip — editable tag with remove button
```
.chip            .chip__remove
.chip-list       (flex-wrap container for chips)
.chip-input-row  (input + add-button inline)
```

#### Status block — centered post-action feedback
```
.status
.status__icon    .status__icon--success    .status__icon--info
.status__heading .status__body
```

#### Table
`.table`

#### Misc
```
.expand-toggle   "Click to Expand / Show Less" link
.external-link   outbound link styled with gap for ↗ indicator
```

#### Toast notifications
```
.toast-container      (fixed-position wrapper; add to any page template)
.toast                (base — hidden by default)
.toast--visible       (JS-toggled to show)
.toast--success   .toast--error   .toast--warning   .toast--info
```

In JS:
```js
toast.className = `toast toast--${type}`;   // type: success | error | warning | info
toast.classList.add('toast--visible');       // show
toast.classList.remove('toast--visible');    // dismiss
```

#### API Reference / Playground primitives
These are used by the two API tools but are general enough to reuse anywhere:
```
.method-badge                              HTTP method pill (inline, small)
.method-badge--get/post/patch/put/delete   color variants

.url-block                                 Dark card showing a full URL
.url-block__base  .url-block__path         Muted base + colored path
.url-block__param                          Highlighted {param} segments

.scope-badge       Tiny mono pill for an OAuth2 scope name
.cap-badge         Endpoint visibility label
.cap-badge--public / --internal / --private

.priv-tag          Inline red "PRIVATE" label for flagged params

.breadcrumb        Navigation trail  (e.g. Videos › Essentials › Get a video)
.breadcrumb__sep   The › separator character

.empty-state                               Centered placeholder (icon + heading + body)
.empty-state__icon  .empty-state__heading  .empty-state__body
```

---

## Adding a new tool page

1. **`data/projects.js`** — Add an entry with `externalUrl: '/your-tool'`
2. **`routes/pages.js`** — Add a route that renders `pages/your-tool` and passes `extraScripts`
3. **`views/pages/your-tool.ejs`** — Build the template using existing component classes
4. **`public/js/your-tool.js`** — Add only if the page needs interactivity
5. **`routes/your-tool.js`** + mount in `server.js` — Add only if the page needs API routes
6. **`public/css/pages.css`** — Add `.page--your-tool .container` for container sizing only

Use `.panel` + `.col-2` + `.stack` + `.form-group` from components.css rather than inventing
page-specific equivalents.

**Full-height tool pages** (like the API Reference and Playground) skip `.container` and use
`.api-shell` directly inside a `.page--tool-name` wrapper. See the `pages.css` section for
`.page--vimeo-api-reference` as the reference implementation.

---

## Vimeo API

All Vimeo API access goes through `utils/vimeo.js`. Never call the Vimeo API directly from
a route file without importing from this utility.

```js
const { vimeo, requireToken, handleVimeoError, VIMEO_API } = require('../utils/vimeo');
```

### Catch-all proxy

`routes/vimeo-proxy.js` is mounted at `/api/vimeo` and forwards any request to `api.vimeo.com`,
adding auth headers server-side. Client JS can call it without knowing the token:

```js
// Example: fetch the authenticated user
const res = await fetch('/api/vimeo/me');
const user = await res.json();

// Example: PATCH a video (must use the exact Vimeo content type)
const res = await fetch('/api/vimeo/videos/12345', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/vnd.vimeo.video+json' },
  body: JSON.stringify({ name: 'New Title' }),
});
```

The proxy handles **all HTTP methods** and passes through whatever `Content-Type` the client
sends — so always use the correct Vimeo content type from the spec, not just `application/json`.

---

## Vimeo API Reference tool

`/vimeo-api-reference` — documentation browser for all 380 Vimeo API endpoints.

### How it works
The page is a minimal EJS shell (`views/pages/vimeo-api-reference.ejs`). On load, the client JS
(`public/js/vimeo-api-reference.js`) fetches the cached OpenAPI spec and renders everything:

1. **Spec** is fetched from `GET /api/vimeo-reference/spec` → served from `data/vimeo-spec.json`
2. **Private list** is fetched from `GET /api/vimeo-reference/private` → from `data/vimeo-private-endpoints.json`
3. Spec operations are flattened and grouped by the `"Category\Subtag"` tag format
4. Sidebar renders as collapsible groups with prettified `operationId` labels
5. Clicking an endpoint renders its docs: URL block, scope banner, param tables, response section

### Updating the spec
```bash
curl -X POST http://localhost:3000/api/vimeo-reference/refresh-spec
# Returns: { "ok": true, "paths": 273 }
```
This re-fetches from `api.vimeo.com/?openapi=true` and overwrites `data/vimeo-spec.json`.
Only needed when Vimeo releases API updates (infrequent).

### Adding private endpoint annotations
After reviewing Vimeo's internal docs (e.g. via Gemini), populate `data/vimeo-private-endpoints.json`:
```json
[
  { "method": "GET", "path": "/videos/{video_id}/fragments" },
  { "path": "/lead_capture/{resource_type}/{resource_id}/registrants", "param": "send_email" }
]
```
- Omit `"param"` to flag the whole endpoint as private/internal
- Include `"param"` to flag only that specific parameter within an endpoint

No server restart needed — the file is read on every request.

---

## Vimeo API Playground tool

`/vimeo-api-playground` — live request sandbox. Same sidebar and spec loading as the Reference,
but the detail panel is a request builder instead of documentation.

- Select an endpoint → fill path params, query params, and an optional JSON body
- Click **Send request** → the request goes through `/api/vimeo/*` (server adds auth)
- Response status, timing, and JSON appear inline

**Linking from Reference to Playground:** The "Try it out →" button passes `?op=<operationId>`
in the URL. The Playground reads this on load and auto-selects the matching endpoint.
The reverse link ("View documentation") on each Playground panel does the same back to the Reference.

---

## Environment variables (`.env`)

| Variable | Purpose |
|----------|---------|
| `VIMEO_TOKEN` | Default Vimeo personal access token |
| `VIMEO_EVENT_ID` | Default webinar event ID |
| `PORT` | Express listen port |
| `FIRST_NAME` / `LAST_NAME` | Displayed in nav/footer |
| `ADMIN_SECRET` | Used to authenticate destructive API requests using my API token until I can properly implement OAuth for multiple users

The token is read at call time (not at startup), so updating `.env` takes effect on the next
request without restarting PM2.
