# 08. Contributor Brief

## One-paragraph summary

Vandermere Applied Dynamics is a fictional enterprise hardware company selling the Synaptic Throughput Stabilizer STS-1000, a large industrial cabinet that treats corporate workflow dysfunction as a physical thermodynamic problem. The project is a polished internal sales-readiness course made of short HeyGen/Vimeo videos, static module pages, diagrams, glossary resources, knowledge checks, and eventually a course-aware chatbot. The tone is serious enterprise enablement with controlled absurdity: the content should sound like premium corporate training for a machine that absolutely should not exist.

## What you are probably here to do

Depending on repo state, you may need to:

- finish Video 4;
- produce Video 5 from the drafted package;
- build missing module pages;
- add or clean image assets;
- create transcript utilities;
- implement module metadata;
- build static resources;
- add search/chatbot retrieval;
- clean up repo documentation.

## Current status in plain English

Do not assume every planned module exists.

Known from project discussions:

- World/brand/product foundation exists.
- Video 1 is produced and published.
- Video 2 is produced.
- Video 3 and its page are done.
- Video 4 is in progress/planned with several visuals and concepts.
- Video 5 has a complete draft package but is not confirmed produced.
- Videos 6 and 7 are planned future modules.
- Many images were generated or specified, but this handoff package only references them.

## The brand rule

Make everything feel like it belongs in a luxury industrial enterprise briefing.

Good:
- matte charcoal;
- brushed steel;
- copper/brass;
- restrained blue glow;
- amber warning markers;
- severe typography;
- precise labels;
- deadpan confidence.

Bad:
- neon sci-fi;
- cartoon equipment;
- wink-wink parody;
- memes;
- magical AI core;
- goofy characters;
- intentionally bad design.

## The product rule

The STS-1000 is not software.

It is not:

- a dashboard;
- a workflow app;
- an AI assistant;
- a meeting reducer;
- a fancy server rack;
- an HVAC replacement;
- a generic automation platform.

Approved distinction:

> Software observes. Automation routes. The STS-1000 stabilizes.

## The course rule

Videos should stay short. Supporting pages can carry detail.

Do not cram every concept into the video scripts. Use the lesson pages, glossary, and chatbot resources for deeper worldbuilding.

## Recommended first repo inspection

Look for:

```text
routes/
views/
public/
assets/
data/
scripts/
docs/
```

Then find:

- Vandermere routes or pages.
- Existing module data.
- Vimeo IDs.
- Transcript files.
- STS-1000 image assets.
- Logo files.
- Any existing CSS namespace.

## Immediate risks

1. Planned work may be mistaken for completed work.
2. Generated image assets may have typos or fake transparency.
3. Course terminology may drift if new contributors invent too many components.
4. Video 4 is conceptually important and may need completion before Video 5 makes sense.
5. If the chatbot is built without source constraints, it may invent product claims that break the controlled tone.

## Recommended next action

Create an `assets/vandermere/asset-manifest.json` and verify actual image files. Then inspect module pages and identify whether Video 4 or Video 5 is the next blocked production step.
