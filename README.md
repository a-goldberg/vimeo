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
    admin.js             — Realtime API call logs (usage & rate limits)
    auth-vimeo.js        — Per-user Vimeo OAuth routes (/auth/vimeo/*)
    pages.js             — HTML page routes (/, /tools, /projects/:slug, etc.)
    api.js               — JSON API routes (/api/projects)
    vimeo-proxy.js       — Catch-all authenticated proxy → api.vimeo.com
    vimeo-reference.js   — Serves the cached OpenAPI spec
    smart-card.js        — API routes for the SmartCard CMS Embed tool
    webinar-registration.js  — API routes for the Webinar Registration tool
    lms-demo.js          — SCORM 1.2 upload/runtime simulation for the LMS Integration demo
    vandermere.js        — Routes + federated video search for the Vandermere STS-1000 course demo

  middleware/
    require-vimeo-auth.js  — Middleware: 401 if no user Vimeo session token

  utils/
    helpers.js           — Shared view helpers (formatDate, statusClass)
    vimeo.js             — Shared Vimeo API client (always import this; never call Vimeo directly)
    request-log.js       — In-memory log of Vimeo API calls; powers the /admin page

  views/
    layouts/
      main.ejs           — Outer HTML shell (head, nav, footer)
    pages/               — One EJS file per page route (includes a vandermere/ subfolder)
    partials/            — Reusable EJS snippets (cards, pills, tags, etc.)

  public/
    css/                 — Six ordered layers: reset → tokens → base → layout → components → pages
    js/                  — One file per page; no build step

  projects/              — Self-contained static tools/demos (served at /projects-static/);
                            also holds Vandermere course planning docs and source images —
                            see projects/mcp-training-course/README.md
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
  category: "Tools",             // Tools | Demos | API Docs | Testing
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

If a tool needs to call the Vimeo API:

1. Add a server-side route file in `routes/` and mount it in `server.js`
2. Apply `requireVimeoRead` or `requireVimeoWrite` from `middleware/vimeo-access.js`
3. Use `req.vimeoAccess.token` as the token in each `vimeo()` call
4. Have the browser call your local Express endpoint; the token never touches the browser

Example pattern:
```
Browser → GET /api/my-tool/results  (session cookie sent automatically)
       → requireVimeoRead resolves the OAuth session or VIMEO_TOKEN fallback
       → handler calls vimeo('GET', '/endpoint', { token: req.vimeoAccess.token })
       → returns JSON to browser
```

Show the tool whenever either demo or OAuth read access is available:

```ejs
<% if (locals.vimeoAccess.canRead) { %>
  <!-- tool UI here -->
<% } else { %>
  <%- include('../partials/vimeo-auth-required') %>
<% } %>
```

---

## Vimeo OAuth — per-user session auth

Visitors can connect their own Vimeo account. The access token is stored server-side in their Express session — it never touches the browser.

### Setup

1. Create a Vimeo app at [developer.vimeo.com/apps](https://developer.vimeo.com/apps).
2. Add a redirect URI in the app settings:
   - **Local dev:** `http://localhost:3000/auth/vimeo/callback`
   - **Production:** `https://yourdomain.com/auth/vimeo/callback`
3. Fill in `.env`:

```env
SESSION_SECRET=<long random string>
VIMEO_CLIENT_ID=your_client_id
VIMEO_CLIENT_SECRET=your_client_secret
VIMEO_REDIRECT_URI=http://localhost:3000/auth/vimeo/callback
VIMEO_SCOPES=public private
```

Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

### OAuth routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/auth/vimeo/start` | GET | Redirects to Vimeo's authorization page |
| `/auth/vimeo/callback` | GET | Exchanges auth code for token; stores in session |
| `/auth/vimeo/logout` | POST | Removes Vimeo token from session |
| `/auth/vimeo/status` | GET | Returns `{ connected, userName, userUri }` — never the token |

### How it works

- After connecting, `req.session.vimeoAuth` holds `{ accessToken, userUri, userName, userProfileLink }`.
- All EJS templates get `vimeoAuth` (minus the token) via `res.locals`.
- Connected visitors use their OAuth token for reads and writes. Anonymous GET/HEAD requests use
  `VIMEO_TOKEN`; anonymous Vimeo mutations are rejected by both the browser and server.
- Sessions expire after 8 hours. A PM2 restart clears all sessions (memorystore is in-process).

### Adding a Vimeo write route

All Vimeo mutations must require a user token, even when the browser also suppresses the action:

```js
const { requireVimeoWrite } = require('../middleware/vimeo-access');
router.patch('/my-endpoint', requireVimeoWrite, handler);
```

---

## Security notes

- Never commit `.env` to GitHub — it's in `.gitignore`
- Never put API tokens, passwords, or customer data in front-end JS files
- Vimeo access tokens are stored server-side only; the browser only sees a session cookie
- Anonymous Vimeo GET/HEAD requests use `VIMEO_TOKEN`. Any data readable with that token must be
  treated as public while demo mode is enabled.
- The generic anonymous Vimeo proxy allows 60 requests per IP per minute.
- Anonymous Vimeo POST/PUT/PATCH/DELETE requests are rejected with `403` and never forwarded.
- Anonymous `/admin` reads show demo-token traffic; connected visitors see their account's traffic.
  Clearing logs and all webinar registration/attendee APIs remain OAuth-gated.
- Logout uses POST (not GET) to prevent CSRF; the `returnTo` redirect param is validated to block open redirects
- Session IDs are regenerated after OAuth login to prevent session fixation
- OAuth state includes an expiry timestamp; stale or tampered states are rejected with a 400
- Files in `projects/` are publicly accessible — don't store anything sensitive there

---

## Health check

```
GET /health
→ { "status": "ok", "app": "vimeo-home", "timestamp": "..." }
```

Useful for uptime monitors and confirming a successful deploy.

---

## Known issues, open items & ideas

There's no GitHub issue tracker in use for this repo — this section is the durable home for
follow-up work. Update it as things get done or superseded.

- **No automated tests.** `npm test` is a stub. The only safety net is manual smoke-testing —
  click through the key pages after any change (see each tool's section in `CLAUDE.md`).
- **Vandermere course:** modules 5–6 ("Sales Positioning and Objection Handling", "Enterprise
  Deployment and the HTA-700 Reveal") are drafted/planned but not yet recorded — they show "Video
  Coming Soon." A course-aware chatbot Q&A layer over transcripts/glossary/resources is the main
  future phase after that. Full roadmap, production backlog, and brand/world reference:
  `projects/mcp-training-course/README.md` → `planning/chatgpt_handoff/`.
- **Vimeo Embeds demo:** planned support for a bring-your-own access token, and for standalone
  video IDs/aliased URLs with no ID present in the URL.
- **Tools/Demos search-filter UI** on the category index pages is a permanent "coming soon"
  placeholder (disabled input) — not a bug, just unbuilt.
- **`ADMIN_SECRET` and `VIMEO_USER_ID`** env vars exist in `.env.example` but aren't read anywhere
  in the code today — either build the feature they imply, or drop them next time you're in there.
- **`VIMEO_USER_ID` vs. hardcoded ID:** `routes/vandermere.js`'s federated search hardcodes the
  Vimeo account ID inline rather than reading it from `VIMEO_USER_ID` — low priority, but worth
  wiring up if this pattern gets reused elsewhere.
