# Project Hub contributor guide

This is a small Node.js, Express, and EJS portfolio/demo site for Vimeo Sales Engineering work.
Keep the implementation deliberately simple: vanilla browser JavaScript, server-rendered EJS,
custom BEM CSS, and no build step.

## Working rules

- Preserve the current visual direction and page content unless a task explicitly requires changes.
- Reuse the BEM components in `public/css/components.css`; keep page-only CSS in `pages.css`.
- Route every Vimeo API call through `utils/vimeo.js`. Never expose an access token to HTML,
  browser JavaScript, logs, or API responses.
- Use `middleware/vimeo-access.js` for Vimeo access decisions. A connected OAuth session takes
  precedence over `VIMEO_TOKEN`. Anonymous requests may read with the environment token, but every
  Vimeo mutation requires OAuth and must be rejected server-side when no session is connected.
- Scope `/admin` reads to demo-token traffic for anonymous visitors or the connected Vimeo user.
  Keep log clearing and webinar attendee/registration APIs OAuth-gated.
- Do not add frameworks or dependencies when the existing Express/EJS/vanilla stack is sufficient.
- Make significant changes on a feature branch. Do not merge to `main` without explicit approval.

## Key paths

- `server.js`: application setup and router mounts
- `routes/`: page, proxy, and feature API routes
- `middleware/vimeo-access.js`: demo-read and OAuth-write policy
- `utils/vimeo.js`: shared Vimeo API client and request logging
- `views/pages/` and `views/partials/`: EJS UI
- `public/js/`: page-specific browser behavior
- `data/projects.js`: project catalog

Run `npm test` after Vimeo access changes, then smoke-test anonymous and connected behavior locally.
Production uses PM2 with watch disabled, so deployment changes require an explicit restart.
