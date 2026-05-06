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
    title: "Vimeo API Reference",
    slug: "vimeo-api-reference",
    category: "API Docs",
    status: "In Progress",
    description:
      "Browse and search all 380 Vimeo API endpoints organized by category, with full parameter tables, required scopes, and example responses.",
    tags: ["API", "Documentation", "Vimeo", "OpenAPI"],
    externalUrl: "/vimeo-api-reference",
    repoUrl: "",
    featured: true,
    visibility: "Internal",
    updatedAt: "2026-05-06",
    notes:
      "Procedurally generated from the cached Vimeo OpenAPI spec (data/vimeo-spec.json). Refresh the spec via POST /api/vimeo-reference/refresh-spec when Vimeo releases API updates. Private endpoint annotations can be added to data/vimeo-private-endpoints.json after reviewing Vimeo's internal documentation.",
  },
  {
    title: "Vimeo API Playground",
    slug: "vimeo-api-playground",
    category: "Testing",
    status: "In Progress",
    description:
      "A sandbox for sending authenticated Vimeo API requests and inspecting responses in real time.",
    tags: ["Node", "Express", "API", "Vimeo"],
    externalUrl: "/vimeo-api-playground",
    repoUrl: "",
    featured: true,
    visibility: "Internal",
    updatedAt: "2026-05-06",
    notes:
      "Select any endpoint from the sidebar, fill in path/query/body parameters, and send a real request. Auth is handled server-side — the Vimeo token never reaches the browser. Links to the API Reference for documentation on each endpoint.",
  },
  {
    title: "Webinar Registration", // displayed on the card and detail page
    slug: "webinar-registration", // used in /projects/my-new-tool URL
    category: "Customer Projects", // Tools | Customer Projects | API Docs | Testing
    status: "Live", // Live | In Progress | Planned | Archived
    description: "Remote registration of Vimeo webinar attendees.", // short text shown on the card
    tags: ["Live Events", "Registration", "Vimeo API"], // short labels shown on the card
    externalUrl: "/webinar-registration", // optional: link to a live version
    repoUrl: "", // optional: GitHub link
    featured: true,
    visibility: "Customer", // Internal | Customer | Public
    updatedAt: "2026-05-05",
    notes:
      'Simulating a customer registration form on their own website for an upcoming Vimeo-powered webinar.  Uses the Vimeo API to check if the user is already registered and to submit new registrations.<br><br>Note:  As of 5/5/2026, the "register a new attendee" API endpoint seems to be broken.  I am investigating this with engineering today.',
  },
  {
    title: "SmartCard CMS Embed", // displayed on the card and detail page
    slug: "smart-card", // used in /projects/my-new-tool URL
    category: "Customer Projects", // Tools | Customer Projects | API Docs | Testing
    status: "Live", // Live | In Progress | Planned | Archived
    description:
      "Demonstrating dynamic player embed plus CMS/DAM functionality using the Vimeo API.", // short text shown on the card
    tags: ["Player", "Metadata", "Vimeo API"], // short labels shown on the card
    externalUrl: "/smart-card", // optional: link to a live version
    repoUrl: "", // optional: GitHub link
    featured: true,
    visibility: "Customer", // Internal | Customer | Public
    updatedAt: "2026-05-01",
    notes:
      "Enter a Vimeo video link (really, any Vimeo video URL that has an ID in it), and we display an embedded player preview and fetch metadata to display alongside the player.  To simulate a custom integration with CMS or DAM type tools, an interface is also provided for viewing and updating video metadata, with the ability to sync changes back to Vimeo via standard API endpoints. <br><br> Future updates will include support for providing your own access token to test with different Vimeo accounts.  I also need to add support for standalone video IDs and links with a custom alias (i.e., no vimeo ID in the URL).",
  },

  {
    title: "Webhook Tester",
    slug: "webhook-tester",
    category: "Testing",
    status: "Planned",
    description:
      "Accepts inbound webhook payloads and displays a live log of received events for debugging integrations.",
    tags: ["Node", "Express", "Webhooks", "Debug"],
    externalUrl: "",
    repoUrl: "",
    featured: false,
    visibility: "Internal",
    updatedAt: "2026-04-20",
    notes: "",
  },
  {
    title: "JSON Formatter",
    slug: "json-formatter",
    category: "Tools",
    status: "Live",
    description:
      "Paste raw JSON and get it back cleanly formatted, validated, and syntax-highlighted.",
    tags: ["Utility", "JSON", "Formatting"],
    externalUrl: "",
    repoUrl: "",
    featured: false,
    visibility: "Internal",
    updatedAt: "2026-04-15",
    notes: "",
  },
];

// Maps each category to its index page URL.
// Used by the breadcrumb on detail pages — no need to edit this.
const categoryUrls = {
  Tools: "/tools",
  "Customer Projects": "/customer-projects",
  "API Docs": "/api-docs",
  Testing: "/testing",
};

// Auto-derive href and categoryUrl so templates don't have to construct them.
projects.forEach((p) => {
  p.href = `/projects/${p.slug}`;
  p.categoryUrl = categoryUrls[p.category] || "/";
});

module.exports = projects;
