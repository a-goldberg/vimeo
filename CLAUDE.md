# Hub contributor guide

Node.js + Express site serving EJS-templated pages for Vimeo Sales Engineering demos.

**Local dev:** `npm run dev` uses `node --watch` — just save a file and reload the browser, no restart needed.
**Production:** PM2 (`ecosystem.config.js`) runs with `watch: false` — after `git pull`, you must run
`pm2 restart vimeo-home` for changes to take effect. See `README.md`'s deploy section.

---

## Tech stack

| Layer | Tool |
|-------|------|
| Server | Node.js + Express |
| Templates | EJS via express-ejs-layouts |
| CSS | Custom BEM, no framework |
| Process manager | PM2 (production; `watch: false`, manual restart required) |
| Hosting | AWS EC2 behind OpenLiteSpeed |

---

## Key files

```
server.js                  Express entry point; mounts all routers
data/projects.js           THE file to edit to add/update projects
data/updates.js            Recent activity feed for home page
data/vandermere-course.js  Module/lesson data for the Vandermere STS-1000 course demo (see below)
data/vimeo-spec.json       Cached Vimeo OpenAPI spec — drop a new copy here to update it
data/vimeo-private-endpoints.json  Legacy supplement; x-mill-visibility-private in the spec is now the primary source
routes/pages.js            Core HTML page routes (home, category indexes, project detail, error)
routes/api.js              JSON API — GET /api/projects, /api/projects/:slug
routes/auth-vimeo.js       Per-user Vimeo OAuth routes: /auth/vimeo/start, /callback, /logout, /status
routes/admin.js            /admin API request-log viewer routes (Vimeo-auth gated); backed by utils/request-log.js
routes/smart-card.js       API routes for the SmartCard CMS/DAM embed demo
routes/webinar-registration.js  API routes for the webinar registration demo; see VIMEO_TOKEN note below
routes/lms-demo.js         SCORM 1.2 upload/runtime simulation for the LMS Integration demo (stores uploads in /tmp)
routes/vandermere.js       Routes for the Vandermere STS-1000 course demo + its federated video search
routes/vimeo-proxy.js      Catch-all proxy → api.vimeo.com; requires user OAuth session (see VIMEO_TOKEN note below)
routes/vimeo-reference.js  Serves the cached spec from disk (no live fetch)
middleware/require-vimeo-auth.js  Returns 401 if no user OAuth session; apply to any Vimeo-touching route
utils/vimeo.js             Shared Vimeo API client; always pass token explicitly from req.session.vimeoAuth.accessToken
utils/helpers.js           formatDate(), statusClass() — attached to app.locals in server.js
utils/request-log.js       In-memory log of Vimeo API calls made through utils/vimeo.js; powers /admin
views/layouts/main.ejs     Outer HTML shell; uses <%- body %> from express-ejs-layouts
views/pages/               One EJS file per page (includes pages/vandermere/ subfolder for the course demo)
views/partials/            Shared includes (nav, footer, section-header, project-card, vimeo-auth-required, etc.)
public/css/                CSS load order: reset → tokens → base → layout → components → pages
public/js/                 Page-specific JavaScript (no build step)
projects/                  Self-contained static tools (see README.md); also holds Vandermere course
                           planning/production assets — see projects/mcp-training-course/README.md
.env                       See "Environment variables" below for the full, current list
```

**A note on server-side Vimeo tokens:** most of the app is strictly per-user-session (no admin
fallback) as described below — but `routes/webinar-registration.js` and `routes/vandermere.js` are
exceptions. They use `process.env.VIMEO_TOKEN`, a privileged personal access token, because they
need a Vimeo account-level capability (lead capture, federated search) that a standard OAuth user
token doesn't have. `webinar-registration.js` falls back to the session token if `VIMEO_TOKEN` isn't
set; `vandermere.js`'s federated search requires it (returns no results without it). Keep this in
mind before assuming "no server-side token" applies universally.

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

#### Breadcrumb — general page navigation trail
```
.breadcrumb        (e.g. Home › Demos › My Project, on project-detail.ejs)
.breadcrumb__link  .breadcrumb__sep   .breadcrumb__current
```

#### Empty state — centered placeholder (icon + heading + body)
```
.empty-state                (fills available height — used in tool panels before a selection is made)
.empty-state--framed        (modifier: dashed-border boxed look — used on category index "no items yet" states)
.empty-state__icon  .empty-state__heading  .empty-state__body
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

.api-breadcrumb        Navigation trail specific to the docs panel (e.g. Videos › Essentials › Get a video),
                        built dynamically in vimeo-api-reference.js. Not the same as the general
                        .breadcrumb block above (used statically on project-detail.ejs) — the two
                        were once accidentally merged into one class; keep them separate.
.api-breadcrumb__sep   The › separator character
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
adding auth headers server-side. **Requires an active user OAuth session** — returns 401 if the
user has not connected their Vimeo account. Client JS can call it without knowing the token:

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

`/vimeo-api-reference` — documentation browser for all Vimeo API endpoints.

### How it works
The page is a minimal EJS shell (`views/pages/vimeo-api-reference.ejs`). On load, the client JS
(`public/js/vimeo-api-reference.js`) fetches the cached OpenAPI spec and renders everything:

1. **Spec** fetched from `GET /api/vimeo-reference/spec` → served from `data/vimeo-spec.json`
2. Operations flattened and grouped by the `"Category\Subtag"` tag format; `Essentials` subtag always sorts first
3. Sidebar renders as collapsible groups with prettified `operationId` labels and a "Hide private" filter toggle
4. Clicking an endpoint renders its docs: breadcrumb, URL block, banners, param tables, response section

### Spec extension fields (read automatically from the spec)
| Field | Location | Effect in UI |
|-------|----------|--------------|
| `x-mill-visibility-private: true` | operation | Red **PRIVATE** banner on doc page; red dot in sidebar; hidden when filter is on |
| `x-mill-visibility-private: true` | parameter | Red `PRIVATE` badge next to the param name in the table |
| `x-mill-vendor-tags: ["capability:NAME"]` | operation | Amber **Required capability** banner listing the capability name |
| `security.oauth2: ["scope"]` | operation | Blue **Required scope** banner (already present for all scoped endpoints) |

### Updating the spec
The `refresh-spec` endpoint is disabled until OAuth auth is implemented. To update the spec,
drop a new `vimeo-spec.json` directly into `data/`. The full spec (with `x-mill-*` extension
fields) requires an OAuth-authenticated request — a personal access token returns a filtered
version without those fields.

### Parameter description rendering
Param descriptions in the reference are rendered as Markdown (inline `code`, `**bold**`,
`[links](url)`, and ` * bullet` lists). The renderer is a small inline function in
`vimeo-api-reference.js` — no external library.

---

## Vimeo API Playground tool

`/vimeo-api-playground` — live request sandbox. **Requires an active user OAuth session** — the
page route redirects to `/auth/vimeo/start` if not connected. Same sidebar, spec loading, and
privacy filter as the Reference, but the detail panel is a request builder instead of documentation.

- Select an endpoint → fill path params, query params (private params labelled in red), and an optional JSON body
- Click **Send request** → request goes through `/api/vimeo/*` (server adds auth from session)
- Response status, timing, and JSON appear inline; PRIVATE and capability banners shown when applicable

**Linking between tools:** "Try it out →" in the Reference passes `?op=<operationId>` to the
Playground (shown as "Connect to try it out" when not authenticated); "View documentation" does
the reverse. Both pages auto-select the matching endpoint on load.

---

## LMS Integration Demo

`/lms-demo` — simulates a customer's LMS (fictional "Meridian Learning") consuming a SCORM 1.2
package exported from Vimeo. Demonstrates Vimeo's SCORM export capability without needing a real
LMS. Route logic lives in `routes/lms-demo.js`, client runtime in `public/js/lms-demo.js`.

- Upload a SCORM 1.2 ZIP (or pick one of the bundled samples in `public/scorm-examples/`)
- The server unzips it with `adm-zip`, parses `imsmanifest.xml` to find the launch file (regex-based,
  tries the `adlcp:scormType="sco"` attribute first, falls back to the first `.html` resource), and
  extracts to a **shared, non-session-scoped** directory: `path.join('/tmp', 'lms-demo-content')`
- The page acts as the SCORM 1.2 API adapter (`LMSInitialize`, `LMSGetValue`, `LMSSetValue`,
  `LMSFinish`, etc.), capturing quiz scores/completion status into a live gradebook UI
- Since `/tmp` storage isn't session-scoped, this only really supports one active demo course at a
  time per server — fine for a live demo, would need real per-session storage for concurrent use

## Vimeo Embeds demo

`/vimeo-embeds` — shows how embedding a Vimeo video generates rich `VideoObject` JSON-LD and Open
Graph metadata (for SEO / generative answer engines), plus live Player SDK events during playback.
Also includes a simulated CMS/DAM metadata-editing panel that syncs changes back to Vimeo. Route in
`routes/pages.js`/`routes/api.js`, client logic in `public/js/vimeo-embeds.js`.

- `public/js/vimeo-embeds.js` has a `const DEBUG = true` flag gating verbose `console.debug` tracing
  of SDK events — flip to `false` to quiet it down; there's a comment at the top of the file
- Known future work (from the tool's own notes in `data/projects.js`): support for a bring-your-own
  access token, and support for standalone video IDs/aliased URLs with no ID in the URL

## Vandermere STS-1000 course demo

`/vandermere` — a scaffold e-learning course ("STS-1000 Sales Readiness") for a fictional enterprise
hardware product, built on the hub's own EJS/BEM stack with a distinct dark brand theme. This is the
largest single feature in the repo. Key files:

- `routes/vandermere.js` — page routes (`/vandermere`, `/vandermere/lesson/:number`, `/resources`,
  `/glossary`, `/readiness`) plus a federated video search endpoint that queries the Vimeo API for
  videos tagged "vandermere" and maps results back to lesson pages (results cached in-memory for 1
  hour). **Requires `VIMEO_TOKEN`** to be set — without it, search silently returns no results.
- `data/vandermere-course.js` — all module/lesson content (title, objectives, transcript, knowledge
  checks, `vimeoId`, glossary terms, static resources). A module with an empty `vimeoId` renders a
  "Video Coming Soon" placeholder on its lesson page.
- `views/pages/vandermere/` — index, lesson, resources, glossary, readiness (final assessment) pages
- `views/partials/vandermere-nav.ejs` — course-specific sidebar nav
- `public/js/vandermere-course.js` — progress tracking, knowledge-check UI, resource/glossary search

**Relationship to `projects/mcp-training-course/`:** the course's production planning (scripts,
milestone docs, brand/visual style guide) and most of its source images live in
`projects/mcp-training-course/` — a content workspace, not app code. Only the images actually
referenced by `views/partials/vandermere-nav.ejs` and `views/pages/vandermere/index.ejs` are
live-served, via the `/projects-static/` static mount (see `README.md`). See
`projects/mcp-training-course/README.md` for the full picture, including a handoff package at
`projects/mcp-training-course/planning/chatgpt_handoff/` with the course's narrative/brand bible and
production roadmap.

As of this writing: modules 1–4 are produced and published (real Vimeo IDs); modules 5–6 are
drafted/planned but not yet recorded. See the roadmap doc above for what's next.

---

## Environment variables (`.env`)

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Required — long random string for Express session signing |
| `VIMEO_CLIENT_ID` | Vimeo OAuth app client ID |
| `VIMEO_CLIENT_SECRET` | Vimeo OAuth app client secret |
| `VIMEO_REDIRECT_URI` | OAuth callback URL (e.g. `http://localhost:3000/auth/vimeo/callback`) |
| `VIMEO_SCOPES` | OAuth scopes to request (e.g. `public private`) |
| `VIMEO_EVENT_ID` | Default webinar event ID (used if no override is entered in the UI) |
| `VIMEO_TOKEN` | Privileged personal access token used by `routes/webinar-registration.js` (fallback) and `routes/vandermere.js` (required) — see the note above. Not used by the generic `/api/vimeo/*` proxy. |
| `PORT` | Express listen port |
| `FIRST_NAME` / `LAST_NAME` | Displayed in nav/footer |
| `ADMIN_SECRET`, `VIMEO_USER_ID` | Present in `.env.example` but **not currently read anywhere in the code** (confirmed by grep). Likely reserved from earlier/future work — safe to ignore, or repurpose if you build the feature they imply (an admin-secret-gated action; a non-hardcoded Vimeo account ID for `vandermere.js`'s federated search, which currently hardcodes the same ID inline). |

Most Vimeo API calls (the `/api/vimeo/*` proxy, the API Playground, SmartCard) use the token from
the user's OAuth session — there is no server-side default token for those. The exceptions are
`webinar-registration.js` and `vandermere.js`, which use `VIMEO_TOKEN` (see above). Env vars are
read at call time, so changes to `.env` take effect on the next request in local dev (`node --watch`);
in production, a PM2 restart is needed since `watch: false` (see the top of this file).

## Operational Details 

Before initiating a new planning session or, if no planning was requested by the user and the skill hasn't yet been applied to the task at hand, implementing or proposing any significant code changes, assess the available Claude skills for potential relevance or guidance.  Specifically, consider the code-standards skill for maintaining a clean, concise codebase, and always employ the project-onboarding skill when the user wants to add a new project, tool, demo, component, or page to the current "Project Hub" web site.
