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
routes/pages.js            All HTML page routes
routes/api.js              JSON API — GET /api/projects, /api/projects/:slug
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
.table

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

---

## Vimeo API

All Vimeo API access goes through `utils/vimeo.js`. Never call the Vimeo API directly from
a route file without importing from this utility.

```js
const { vimeo, requireToken, handleVimeoError, VIMEO_API } = require('../utils/vimeo');
```

---

## Environment variables (`.env`)

| Variable | Purpose |
|----------|---------|
| `VIMEO_TOKEN` | Default Vimeo personal access token |
| `VIMEO_EVENT_ID` | Default webinar event ID |
| `PORT` | Express listen port |
| `FIRST_NAME` / `LAST_NAME` | Displayed in nav/footer |
