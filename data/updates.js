// Recent site updates shown in the feed on the home page.
// Add new entries at the TOP of the array to keep them in reverse-chronological order.
//
// Fields:
//   date        — YYYY-MM-DD
//   text        — One sentence describing the update
//   projectSlug — Optional: slug of a related project (creates a link). Use null if none.

const updates = [
  {
    date: '2026-05-01',
    text: 'Launched project hub scaffold — routing, templates, and design system in place.',
    projectSlug: null,
  },
  {
    date: '2026-04-30',
    text: 'Started Video Portal Prototype — Vimeo API integration underway.',
    projectSlug: 'video-portal-prototype',
  },
  {
    date: '2026-04-28',
    text: 'Customer Demo Template: initial layout and component structure done.',
    projectSlug: 'customer-demo-template',
  },
  {
    date: '2026-04-15',
    text: 'JSON Formatter shipped — available under Tools.',
    projectSlug: 'json-formatter',
  },
  {
    date: '2026-04-10',
    text: 'Site stood up on EC2 with OpenLiteSpeed reverse proxy and PM2.',
    projectSlug: null,
  },
];

module.exports = updates;
