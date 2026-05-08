# Project Hub

A personal project hub for internal tools, customer demos, API documentation, and experimental utilities — built for a Vimeo Sales Engineering workflow.

Runs on Node.js + Express + EJS. No build step required. Deploy with git pull + PM2.

---

## Folder structure

```
vimeo-home/
  server.js              — Express app entry point
  ecosystem.config.js    — PM2 config
  .env.example           — Environment variable template
  CLAUDE.md              — Developer guide (naming conventions, component vocab, tool architecture)

  data/
    projects.js          — All project metadata (edit this to add/update projects)
    updates.js           — Recent site updates for the home page feed
    vimeo-spec.json      — Cached Vimeo OpenAPI spec (drop a new file here to update)

  routes/
    pages.js             — HTML page routes (/, /tools, /projects/:slug, etc.)
    api.js               — JSON API routes (/api/projects)
    vimeo-proxy.js       — Catch-all authenticated proxy → api.vimeo.com
    vimeo-reference.js   — Serves the cached OpenAPI spec
    smart-card.js        — API routes for the SmartCard CMS Embed tool
    webinar-registration.js  — API routes for the Webinar Registration tool

  utils/
    helpers.js           — Shared view helpers (formatDate, statusClass)
    vimeo.js             — Shared Vimeo API client (always import this; never call Vimeo directly)

  views/
    layouts/
      main.ejs           — Outer HTML shell (head, nav, footer)
    pages/               — One EJS file per page route
    partials/            — Reusable EJS snippets (cards, pills, tags, etc.)

  public/
    css/                 — Six ordered layers: reset → tokens → base → layout → components → pages
    js/                  — One file per page; no build step

  projects/              — Self-contained static tools/demos (served at /projects-static/)
```

---

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Then open http://localhost:3000

`npm run dev` uses `node --watch` (Node 18+) — no nodemon needed.

---

## Production deployment (EC2 + PM2)

OpenLiteSpeed is already configured to reverse-proxy public traffic (port 80/443)
to the local Node app on port 3000. You don't need to touch DNS, TLS, vhosts,
or listeners — just keep Node running on port 3000.

```bash
# On the server:
git pull
npm install --omit=dev

# First deploy:
pm2 start ecosystem.config.js --env production
pm2 save

# Subsequent deploys:
pm2 restart vimeo-home
```

Check status: `pm2 status` / `pm2 logs vimeo-home`

---

## How to add a new project

1. Open `data/projects.js`
2. Add a new object to the array:

```js
{
  title: "My New Tool",
  slug: "my-new-tool",           // used in /projects/my-new-tool URL
  category: "Tools",             // Tools | Customer Projects | API Docs | Testing
  status: "In Progress",         // Live | In Progress | Planned | Archived
  description: "One or two sentences.",
  tags: ["Node", "Express"],
  externalUrl: "",               // optional: link to a live version
  repoUrl: "",                   // optional: GitHub link
  featured: false,
  visibility: "Internal",        // Internal | Customer | Public
  updatedAt: "2026-05-01",
  notes: "Optional longer notes visible on the detail page.",
}
```

The project will automatically appear on the correct category index page
and get a detail page at `/projects/my-new-tool`.

---

## How to add a new route

1. Add the route handler in `routes/pages.js` (HTML pages) or `routes/api.js` (JSON endpoints)
2. Create a matching EJS template in `views/pages/` if needed
3. No other wiring required — routes are already imported in `server.js`

See `CLAUDE.md` for the full step-by-step guide to adding a new tool page, including how to handle tool-specific API routes and full-height layouts.

---

## How to update the visual theme

All design tokens are in `public/css/tokens.css`. Change CSS variables there
to retheme the entire site. Key variables:

- `--color-bg` / `--color-surface` — background layers
- `--color-accent` — primary green accent
- `--color-text` / `--color-text-muted` — typography
- `--radius-md` / `--radius-lg` — corner rounding
- `--font-sans` / `--font-mono` — typefaces

Components are in `components.css`. Page-specific styles are in `pages.css`.

---

## Static project files

Each subdirectory under `projects/` is a self-contained HTML/CSS/JS tool.
They are served at `/projects-static/<directory-name>/`.

Example: `projects/my-tool/index.html` → `http://localhost:3000/projects-static/my-tool/`

These are good for:
- Simple demos that don't need server-side rendering
- Tools that can be dropped in without touching the Express app
- Static pages to share with customers (no auth, no secrets)

---

## How future API-backed tools should be structured

If a tool needs to call an external API (e.g. Vimeo API):

1. Add a server-side route in `src/routes/api.js`
2. Store credentials in `.env` only (never in front-end JS)
3. Have the browser call your local Express endpoint, not the external API directly
4. The Express route fetches from the external API using the secret from `process.env`

Example pattern:
```
Browser → GET /api/my-tool/results
       → server.js reads VIMEO_ACCESS_TOKEN from process.env
       → fetches from api.vimeo.com with the token
       → returns JSON to browser
```

---

## Adding authentication later

Authentication is not included in this scaffold. When you're ready to add it:

- Consider `express-session` + a simple username/password for internal tools
- Consider Vimeo OAuth for customer-facing demos
- Add auth middleware in `src/routes/pages.js` before protected routes
- Store session secrets in `.env`, never in source code

---

## Security notes

- Never commit `.env` to GitHub — it's in `.gitignore`
- Never put API tokens, passwords, or customer data in front-end JS files
- Anything customer-specific should stay behind server-side routes in `src/routes/api.js`
- Files in `projects/` are publicly accessible — don't store anything sensitive there
- The `/api/projects` endpoint returns project metadata — keep `repoUrl` and `externalUrl`
  fields clean before sharing the site publicly

---

## Health check

```
GET /health
→ { "status": "ok", "app": "vimeo-home", "timestamp": "..." }
```

Useful for uptime monitors and confirming a successful deploy.
