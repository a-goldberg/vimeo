// ─────────────────────────────────────────────────────────────────────────────
// THIS IS THE MAIN FILE TO EDIT when adding or updating a project.
//
// Each object in the array below becomes:
//   • A card on the matching category index page (/tools, /testing, etc.)
//   • A detail page at /projects/<slug>
//   • An entry in the JSON API at /api/projects
//
// You do not need to touch any other file just to add a project.
// ─────────────────────────────────────────────────────────────────────────────
//
// Field reference:
//   title       — Display name shown on cards and detail pages
//   slug        — URL-safe ID, no spaces (becomes /projects/<slug>)
//   category    — Must be one of: "Tools" | "Customer Projects" | "API Docs" | "Testing"
//   status      — Must be one of: "Live" | "In Progress" | "Planned" | "Archived"
//   description — One or two sentences shown on the card
//   tags        — Short labels, e.g. ["Node", "API", "Vimeo"]
//   externalUrl — Optional: link to a live demo. Leave "" if none.
//   repoUrl     — Optional: GitHub link. Leave "" if none.
//   featured    — true = shown in the Featured section on the home page
//   visibility  — "Internal" | "Customer" | "Public"
//   updatedAt   — Date in YYYY-MM-DD format
//   notes       — Optional longer text shown on the detail page

const projects = [
{
  title: "SmartCard CMS Embed Demo", // displayed on the card and detail page
  slug: "smart-card",           // used in /projects/my-new-tool URL
  category: "Customer Projects",             // Tools | Customer Projects | API Docs | Testing
  status: "In Progress",         // Live | In Progress | Planned | Archived
  description: "User supplies a Vimeo video link or ID, and we display an embedded player preview, plus ability to fetch and update metadata via Vimeo API",
  tags: ["Player", "Metadata", "Vimeo API"],  // short labels shown on the card
  externalUrl: "",               // optional: link to a live version
  repoUrl: "",                   // optional: GitHub link
  featured: true,
  visibility: "Customer",        // Internal | Customer | Public
  updatedAt: "2026-05-01",
  notes: "",
},
  {
    title: 'Vimeo API Playground',
    slug: 'vimeo-api-playground',
    category: 'Testing',
    status: 'Planned',
    description: 'A sandbox for testing authenticated Vimeo API requests and inspecting responses in real time.',
    tags: ['Node', 'Express', 'API', 'Vimeo'],
    externalUrl: '',
    repoUrl: '',
    featured: true,
    visibility: 'Internal',
    updatedAt: '2026-05-01',
    notes: 'Will support OAuth token input and a simple request builder for common Vimeo API endpoints.',
  },
  {
    title: 'Customer Demo Template',
    slug: 'customer-demo-template',
    category: 'Customer Projects',
    status: 'In Progress',
    description: 'A polished, reusable demo portal shell that can be quickly customized for specific customer scenarios.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Demo'],
    externalUrl: '',
    repoUrl: '',
    featured: false,
    visibility: 'Customer',
    updatedAt: '2026-04-28',
    notes: 'Built to be self-contained so it can be deployed as a static page or embedded.',
  },
  {
    title: 'Webhook Tester',
    slug: 'webhook-tester',
    category: 'Testing',
    status: 'Planned',
    description: 'Accepts inbound webhook payloads and displays a live log of received events for debugging integrations.',
    tags: ['Node', 'Express', 'Webhooks', 'Debug'],
    externalUrl: '',
    repoUrl: '',
    featured: false,
    visibility: 'Internal',
    updatedAt: '2026-04-20',
    notes: '',
  },
  {
    title: 'JSON Formatter',
    slug: 'json-formatter',
    category: 'Tools',
    status: 'Live',
    description: 'Paste raw JSON and get it back cleanly formatted, validated, and syntax-highlighted.',
    tags: ['Utility', 'JSON', 'Formatting'],
    externalUrl: '',
    repoUrl: '',
    featured: false,
    visibility: 'Internal',
    updatedAt: '2026-04-15',
    notes: '',
  },
  {
    title: 'Video Portal Prototype',
    slug: 'video-portal-prototype',
    category: 'Customer Projects',
    status: 'In Progress',
    description: 'Mock customer-facing video portal powered by the Vimeo API. Demonstrates custom branding, playlist organization, and gated content.',
    tags: ['Vimeo API', 'Portal', 'Demo', 'Node'],
    externalUrl: '',
    repoUrl: '',
    featured: true,
    visibility: 'Customer',
    updatedAt: '2026-04-30',
    notes: 'Uses server-side Vimeo API calls only — no access token is exposed to the browser.',
  },
  {
    title: 'API Notes Library',
    slug: 'api-notes-library',
    category: 'API Docs',
    status: 'In Progress',
    description: 'Running reference notes for Vimeo API endpoints, auth flows, and common integration patterns.',
    tags: ['Documentation', 'Vimeo API', 'Reference'],
    externalUrl: '',
    repoUrl: '',
    featured: false,
    visibility: 'Internal',
    updatedAt: '2026-05-01',
    notes: '',
  },
];

// Maps each category to its index page URL.
// Used by the breadcrumb on detail pages — no need to edit this.
const categoryUrls = {
  'Tools': '/tools',
  'Customer Projects': '/customer-projects',
  'API Docs': '/api-docs',
  'Testing': '/testing',
};

// Auto-derive href and categoryUrl so templates don't have to construct them.
projects.forEach((p) => {
  p.href = `/projects/${p.slug}`;
  p.categoryUrl = categoryUrls[p.category] || '/';
});

module.exports = projects;
