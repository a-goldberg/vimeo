# Vandermere STS-1000 Project Handoff Package

This package summarizes the Vandermere Applied Dynamics / STS-1000 sales-readiness training project so it can be included in a GitHub repository and handed to a new contributor without requiring access to the original ChatGPT project context.

The package is intentionally split into several Markdown files so future contributors can use it either as documentation, a production checklist, or source material for scripts, page content, image generation, and chatbot retrieval.

## Package contents

- `docs/01-project-overview.md`  
  Executive summary, project purpose, current status, and known boundaries.

- `docs/02-world-and-brand-bible.md`  
  Canonical company, product, tone, visual style, product anatomy, and internal consistency rules.

- `docs/03-course-status-and-history.md`  
  Chronological status of what has been produced, implemented, drafted, or merely proposed.

- `docs/04-video-module-inventory.md`  
  Lesson-by-lesson inventory for the intended 5-7 video course, including current production status and known scene concepts.

- `docs/05-visual-asset-inventory.md`  
  Inventory of logos, product shots, diagrams, scenes, and unresolved image needs.

- `docs/06-web-learning-environment.md`  
  Notes for the broader learning-module implementation: Vimeo embeds, lesson pages, metadata, transcript handling, chatbot/search, and static resource pages.

- `docs/07-open-work-and-roadmap.md`  
  What remains unfinished, what should be tackled next, and future expansion ideas.

- `docs/08-contributor-brief.md`  
  A concise onboarding brief for a new contributor.

- `docs/09-accuracy-notes.md`  
  Important distinction between confirmed current state, planned work, and proposed future enhancements.

- `schemas/module-schema.example.json`  
  Suggested module metadata structure for lesson pages and retrieval.

- `prompts/image_prompt_reference.md`  
  Reusable visual prompts and prompt fragments for regenerating or extending the asset set.

- `planning/backlog.md`  
  Repo-friendly backlog organized by production, development, content, and design.

## Important caveat

This package does not include the actual binary image assets, HeyGen exports, Vimeo files, or web app source code. It includes references, descriptions, prompts, production notes, and expected filenames/placeholders so those assets can be attached or recreated.

Where a document says an item is "produced," "done," or "implemented," that reflects the state discussed in the project conversations. Where an item is "drafted," "planned," or "proposed," it should not be treated as already built.
