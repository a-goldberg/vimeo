# 09. Accuracy Notes

This file explains how to interpret the handoff package.

## Confirmed or directly discussed current state

The following were explicitly stated in the project context:

- Vandermere Applied Dynamics is fictional.
- The STS-1000 is the Synaptic Throughput Stabilizer.
- The project is a sales-readiness / training prototype.
- v1 should stay small: 5-7 short videos, roughly 2-3 minutes each.
- Vimeo hosting is used.
- HeyGen avatar videos are used.
- The user is building static learning pages as part of a broader development project.
- Video 1 was produced and published.
- Video 2 was produced and accepted.
- Video 3 and its page in the learning environment were completed.
- Video 4 had active planning and visual development.
- A Lesson 5 package exists as a draft.
- Video 6 and Video 7 were planned as future/optional modules.
- Multiple visual assets were generated or requested, but this package does not include their binary files.

## Drafted but not confirmed as produced

Treat the following as drafted/planned unless the repo contains final files:

- Video 4 final edited video.
- Video 4 final page.
- Video 5 final video.
- Video 5 final page.
- Video 6.
- Video 7.
- HTA-700 visuals.
- Causality Baffles final diagram.
- Final course chatbot.
- Final certification module.

## Known asset-quality hazards

### Transparent PNGs

Several image iterations involved checkerboard backgrounds or green-screen removal. Do not assume an image is transparent because it visually shows a checkerboard pattern. Verify alpha transparency.

### Logo typo

At least one generated logo variant had the subtitle typo `APPLIEO DYNAMICS`. The correct subtitle is `APPLIED DYNAMICS`.

### Image text

AI-generated diagrams may contain misspellings or malformed labels. Verify all text before using images in production.

## Recommended status values

Use conservative statuses in module metadata.

Suggested meanings:

- `planned`: idea exists, no production package yet.
- `draft`: script/package exists, not produced.
- `in_production`: assets or video scenes actively being made.
- `produced`: video exists but page may not be complete.
- `published`: video uploaded to Vimeo and final.
- `implemented`: web module page is live/tested.
- `archived`: retired or superseded.

## Source hierarchy

When contradictions appear, prefer sources in this order:

1. Current repo source files and actual deployed pages.
2. Final video exports and Vimeo metadata.
3. Final transcripts.
4. User-approved image files.
5. This handoff package.
6. Older generated drafts or prompt fragments.

## How to update this package

When you complete future work:

- update `docs/03-course-status-and-history.md`;
- update `docs/04-video-module-inventory.md`;
- update `docs/05-visual-asset-inventory.md`;
- add actual filenames and paths;
- add Vimeo IDs;
- update `planning/backlog.md`;
- keep proposed future enhancements separate from current status.
