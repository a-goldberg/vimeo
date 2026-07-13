# Vandermere STS-1000 course — planning & asset workspace

This folder is **not** a self-contained static tool like its sibling `projects/example-static-tool/`
(see `../README.md`). It's a content/planning workspace for the "Vandermere STS-1000 Sales
Readiness" course, a fictional-enterprise-hardware sales-training demo whose actual working app
lives in the main Express hub — see `routes/vandermere.js`, `data/vandermere-course.js`, and
`views/pages/vandermere/` (documented in `CLAUDE.md`).

## What's actually live

Almost nothing in this folder is served by the app. The one exception: two images are referenced
directly by the live site via the `/projects-static/` static mount —

- `assets/images/vandermere_logo_full_light.png` — used in `views/partials/vandermere-nav.ejs`
- `assets/images/sts-1000_panel_closeup.png` — used in `views/pages/vandermere/index.ejs`

Everything else here (planning docs, video scripts, the rest of `assets/images/`) is production
reference material — it doesn't get rendered or read by the app at runtime.

## Folder structure

```
planning/                     Milestone-by-milestone planning docs (world-building, course
                               architecture, per-video scripts). Named vandermere_sts1000_milestoneN*.
planning/chatgpt_handoff/     A repo-friendly handoff package — see below.
videos/Video 1/ .. Video 4/   Per-video script + supporting concept images, once a video moves
                               from "planning" to "produced." (Video 5 is still in planning/ only —
                               no HeyGen production has started yet.)
assets/images/                Generated logo, product, and diagram images. Some are checkerboard/
                               green-screen intermediates, NOT final transparent assets — verify
                               alpha transparency before reusing anything here in production.
assets/vandermere_visual_style_guide.md   Brand/visual reference (Severe Industrial Elegance style).
```

## Where to start if you're picking this back up

Read `planning/chatgpt_handoff/README.md` first — it's a 9-document handoff package (project
overview, brand bible, course status/history, video/asset inventories, web-learning-environment
notes, open work & roadmap, a contributor brief, and its own accuracy notes) written specifically so
this course can be resumed without access to the original ChatGPT planning conversation. It includes
its own source-hierarchy rule worth repeating here: **when the handoff package and the actual repo
disagree, trust the repo** — the package reflects a point in time, not necessarily today's state.

As of this writing: Video 4 is fully produced and live (`data/vandermere-course.js` has a real Vimeo
ID for module 4). Video 5 has a complete drafted script/production package
(`planning/vandermere_sts1000_milestone3e_video5_sales_positioning_objections.md`) but HeyGen
production hasn't started. Video 6 is conceptually planned only. See
`planning/chatgpt_handoff/docs/07-open-work-and-roadmap.md` for the full backlog, and the main
`README.md`'s "Known issues, open items & ideas" section for a short pointer back here.

## Known asset hazards (from the handoff package)

- At least one generated logo variant has a typo in the subtitle (`APPLIEO` instead of `APPLIED
  DYNAMICS`) — double-check any logo file before using it.
- Several images went through checkerboard/green-screen background removal — don't assume an image
  is transparent just because it looks that way; verify alpha transparency before use.
