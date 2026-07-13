# 06. Web Learning Environment Notes

This document summarizes expected implementation patterns for the STS-1000 course inside the broader development project. It does not assume exact repo paths.

## Intended experience

The learning environment should feel like a polished internal training module for Vandermere sales professionals.

Expected user experience:

1. User opens STS-1000 course.
2. User sees a module list or course dashboard.
3. User opens a module page.
4. Module page includes Vimeo video embed.
5. Page provides learning objectives, summary, key terms, diagrams, transcript, related resources, and a knowledge check.
6. User can search or ask a chatbot questions grounded in lesson content and static supporting resources.

## Suggested tech assumptions

Based on the broader development context, likely stack:

- Node.js.
- Express.
- EJS templates.
- Vanilla JavaScript.
- SQLite.
- Static assets served from project/public directory.
- PM2 for process management.
- OpenLiteSpeed reverse proxy.
- HTTPS via Certbot.
- GitHub source control.
- Vimeo video hosting.

Verify actual repo structure before editing.

## Suggested routes

These are suggestions, not confirmed existing paths:

- `/vandermere`
- `/vandermere/modules`
- `/vandermere/modules/:moduleId`
- `/vandermere/resources`
- `/vandermere/glossary`
- `/vandermere/search`
- `/vandermere/chat`

## Suggested module page sections

Each module page should support:

1. Vimeo embed.
2. Module title and status.
3. Lesson summary.
4. Learning objectives.
5. Key terms.
6. Supporting visual or diagram.
7. Scene summary or chapter list.
8. Transcript panel.
9. Related resources.
10. Knowledge check.
11. Suggested chatbot prompts.

## Module data model

Use `schemas/module-schema.example.json` as a starting point.

Recommended fields:

- `id`
- `number`
- `title`
- `status`
- `duration`
- `durationSeconds`
- `summary`
- `llmSummary`
- `objectives`
- `vimeoId`
- `localVideoPath`
- `thumbnail`
- `transcript`
- `transcriptSegments`
- `keyTerms`
- `searchTags`
- `relatedResourceIds`
- `knowledgeCheck`

Status values should be conservative:

- `planned`
- `draft`
- `in_production`
- `produced`
- `published`
- `implemented`
- `archived`

Recommended rule:

A module should not be marked `published` unless the final video exists and has a Vimeo ID.

A module should not be marked `implemented` unless the page exists, video works, transcript is available, and knowledge check works.

## Vimeo notes

Vimeo is used for hosting the training videos. The project has involved retrieving transcript chunks and VTT closed-caption files from Vimeo-related APIs.

Recommended handling:

- Store final transcript text in module metadata or a separate transcript file.
- Store transcript segments if needed for search highlighting.
- Preserve Vimeo ID in module JSON.
- Do not rely only on live Vimeo API access for the page to render.
- Use stored/cached metadata for stable course behavior.

## Transcript handling

The user has previously needed to concatenate transcript fragments from JSON and VTT caption files. Build small utilities or scripts for this if the repo will continue producing videos.

Recommended files:

- `scripts/concat-vimeo-lines.js`
- `scripts/concat-vtt-captions.js`
- `data/transcripts/module-01.txt`
- `data/transcripts/module-02.txt`
- `data/transcripts/module-03.txt`

Suggested transcript segment object:

```json
{
  "start": 0.0,
  "end": 6.2,
  "text": "At Vandermere, we look for five signals of procedural turbulence..."
}
```

## Search and chatbot layer

The course-aware chatbot should answer from:

- lesson transcripts;
- module summaries;
- key terms;
- static resource pages;
- positioning guides;
- objection-handling guide;
- buyer messaging matrix;
- language discipline card;
- technical escalation guide.

For answers, the chatbot should:

1. identify the relevant lesson or resource;
2. give the approved Vandermere framing;
3. avoid inventing new product capabilities;
4. preserve the dry enterprise tone;
5. cite or link to the relevant internal page if the app supports citations.

## Example chatbot response pattern for positioning questions

When a user asks a positioning or objection question:

1. identify the buyer or objection;
2. provide approved positioning language;
3. explain why the framing matters;
4. suggest one follow-up discovery question;
5. cite the relevant lesson and static resource.

Example:

> For a workflow-software objection, the approved distinction is: software observes, automation routes, and the STS-1000 stabilizes. The follow-up question should move the buyer from category confusion to recurring business consequence: "Where are you already observing workflow problems, but still struggling to keep them from recurring?"

## Static resource pages to create

Recommended resources:

- STS-1000 Positioning Guide.
- Objection Handling Guide.
- Buyer Messaging Matrix.
- Language Discipline Card.
- Component Anatomy Reference.
- Procedural Turbulence Diagnostic Guide.
- Workflow Cavitation Explainer.
- Operational Drift Explainer.
- Causality Baffles Explainer.
- Deployment Escalation Guide.
- HTA-700 Infrastructure Overview.
- Final Certification Prep Guide.

## Knowledge checks

Each module should include one or more low-friction checks:

- multiple choice;
- match term to definition;
- choose approved language;
- identify diagnostic signal;
- choose the best discovery question;
- recognize when to escalate.

Avoid making the quizzes too complicated. They are part of a polished sales-readiness prototype, not a full LMS.

## Page design notes

Pages should match the brand:

- dark background;
- premium industrial cards;
- restrained blue lines;
- muted amber warnings;
- crisp white text;
- minimal animation;
- no playful SaaS illustration style;
- diagrams and visual cards should feel like internal briefing materials.

## Integration caution

The STS-1000 course is adjacent to other prototype work in the broader repo. Keep its routes, assets, data, and styling namespaced so it does not pollute other apps.

Suggested namespace:
- route prefix: `/vandermere`
- asset prefix: `/assets/vandermere/`
- data prefix: `vandermere_`
- CSS prefix: `.vad-` or `.sts-`
