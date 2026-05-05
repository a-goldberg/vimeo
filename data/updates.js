// Recent site updates shown in the feed on the home page.
// Add new entries at the TOP of the array to keep them in reverse-chronological order.
//
// Fields:
//   date        — YYYY-MM-DD
//   text        — One sentence describing the update
//   projectSlug — Optional: slug of a related project (creates a link). Use null if none.

const updates = [
  {
    date: '2026-05-04',
    text: 'Published the first project: SmartCard CMS Embed Demo, a tool to demonstrate API-based video embedding and metadata management.',
    projectSlug: 'smart-card',
  },
  {
    date: '2026-05-01',
    text: 'Launched project hub scaffold — routing, templates, and design system in place.',
    projectSlug: null,
  },
  
];

module.exports = updates;
