// Course data for the STS-1000 Sales Readiness e-learning demo.
// Each module maps to a Vimeo-hosted video lesson.
// vimeoId fields are empty until videos are uploaded; localVideoPath is set
// for modules that have a pre-production video file available.

const course = {
  id: "sts-1000-sales-readiness",
  title: "STS-1000 Sales Readiness",
  fullTitle:
    "STS-1000 Sales Readiness: Stabilizing the Enterprise Workflow Stream",
  company: "Vandermere Applied Dynamics",
  tagline: "Where logic flows, enterprise grows.",
  description:
    "STS-1000 Sales Readiness teaches Vandermere sales professionals how to understand, explain, position, and sell the Synaptic Throughput Stabilizer STS-1000 — the world's first kinetic enterprise ballast for physicalized workflow architecture.",

  modules: [
    {
      id: "module-01",
      number: 1,
      status: "completed",
      title: "STS-1000 Market Readiness Overview",
      duration: "2:39",
      summary:
        "Course overview, introduction to the Physicalized Workflow Architecture category, and the core premise that enterprise friction is a physical condition requiring physical solutions.",
      objectives: [
        "Describe Vandermere's core market category: Physicalized Workflow Architecture.",
        "Explain the basic premise that enterprise friction has measurable physical properties.",
        "Distinguish Vandermere's approach from software-only workflow tools.",
        "Understand why Vandermere treats enterprise inefficiency as a physical condition.",
      ],
      vimeoId: "1201520350:0d71f6c97c",
      localVideoPath: "",
      transcript:
        "Welcome to STS-1000 Sales Readiness. This course is designed for Vandermeer sales professionals preparing to support the broader market introduction of the Synaptic Throughput Stabilizer, STS-1000. As the flagship product in our physicalized workflow architecture portfolio, the STS-1000 represents a major opportunity for customers whose operational environments have become too complex to stabilize with software alone. Across medium to large businesses, internal workflows are becoming faster, denser, and more interdependent. Customers have invested heavily in dashboards, automation platforms, and process improvement programs. Yet many still experience approval delays, handoff decay, meeting proliferation, and operational drift. These problems are not always caused by a lack of software. Often, they are caused by unstable operating conditions around the workflow itself. This course will not turn you into a Vandermeer field engineer. It will give you the sales-ready understanding needed to position the STS-1000 clearly and confidently. You will learn the product story, the core business problems it addresses, the major operating concepts, the primary buyer personas, and the language required to distinguish physical workflow stabilization from traditional software automation. The goal is not technical memorization. The goal is market readiness. As we begin, one distinction matters more than any other. The STS-1000 should not be positioned as another       workflow application, dashboard, or AI tool. It is capital infrastructure for enterprise workflow stabilization. Software can observe work. Automation can route work. The STS-1000 is designed to stabilize the physical conditions that allow work to move safely through the organization. That is the foundation for every customer conversation in this course. In the next lesson, we will introduce the STS-1000 itself, what it is, what it is designed to stabilize, and how to explain its value without reducing it to ordinary software language. For now, remember the core principle. Vandermeer does not simply help customers observe operational friction. Vandermeer stabilizes it.",
      keyTerms: [
        "Physicalized Workflow Architecture",
        "Enterprise Workflow Stabilization",
      ],
      knowledgeCheck: {
        id: "kc-m1-01",
        question:
          "What differentiates Vandermere's approach from traditional workflow software?",
        answers: [
          {
            text: "Vandermere offers cheaper subscription pricing than competing workflow platforms.",
            correct: false,
          },
          {
            text: "Vandermere positions workflow friction as a physical condition that must be stabilized through machinery, not merely observed or routed by software.",
            correct: true,
          },
          {
            text: "Vandermere focuses exclusively on automating procurement and finance workflows.",
            correct: false,
          },
          {
            text: "Vandermere's platform requires no onboarding or calibration before deployment.",
            correct: false,
          },
        ],
        explanation:
          "Vandermere's core differentiation is treating enterprise friction as a physical condition. Most software observes or routes workflow problems; Vandermere builds machinery that stabilizes the physical conditions in which workflow occurs.",
      },
      relatedResourceIds: [
        "resource-company-profile",
        "resource-pwa-overview",
        "resource-keb-primer",
        "resource-software-observes",
      ],
    },
    {
      id: "module-02",
      number: 2,
      status: "completed",
      title: "What Is the STS-1000?",
      duration: "3:52",
      summary:
        "Provide the core product explanation and establish the STS-1000 as a kinetic enterprise ballast — physical infrastructure that stabilizes workflow pressure, decision temperature, and operational drift.",
      objectives: [
        "Give a simple 30-second explanation of the STS-1000.",
        "Explain the difference between workflow automation and workflow stabilization.",
        "Identify the three business conditions the STS-1000 addresses: friction, latency, and operational drift.",
        "Position the STS-1000 as capital infrastructure, not a software platform.",
        "Avoid describing the STS-1000 as a dashboard, automation tool, AI product, or productivity appliance.",
      ],
      vimeoId: "1200478444:14b45f4105",
      localVideoPath: "",
      transcript:
        "Welcome back. In the previous lesson, we introduced Vandermeer Applied Dynamics and the category of physicalized workflow architecture. Now we will turn to Vandermeer's flagship product, the Synaptic Throughput Stabilizer STS-1000. <br>For sales professionals, this is the most important product in the portfolio. It is also the product most likely to be misunderstood if it is described using ordinary software language. The STS-1000 is not a dashboard. It is not workflow automation. It is not an AI assistant. It is a physical enterprise stabilizer. <br>The STS-1000 is a kinetic enterprise ballast designed for organizations experiencing high levels of procedural turbulence. Installed inside a headquarters, operations center, finance floor, or logistics hub, the unit provides a physical layer of stability beneath the customer's existing business systems. <br>Its purpose is simple. When an organization becomes too complex for decisions to move cleanly, the STS-1000 helps restore safe workflow pressure. It does this by stabilizing institutional logic, cooling overheated decisions, and preventing small inefficiencies from becoming enterprise-wide delays. The STS-1000 is designed for a specific kind of customer. These customers usually have capable people, mature systems, and well-documented processes, but work still slows down. <br>Approvals stall. Handoffs decay. Sales and legal apply pressure from opposite directions. Finance waits for operations. Operations waits for procurement. Procurement waits for a spreadsheet no one remembers creating. This is not always a software failure. <br>At Vandermeer, we describe this condition as procedural turbulence, the unstable movement of work through a complex organization. The STS-1000 gives that turbulence somewhere to go. <br>In technical terms, the STS-1000 is not attempting to accelerate every process. That is a common misunderstanding. Acceleration without stabilization often increases cavitation, heat, and accountability voids. The STS-1000, instead, maintains the workflow stream inside its safe operating band. The unit monitors pressure, temperature, viscosity, and institutional drift, then mechanically conditions the environment so work can continue moving without destabilizing the organization. <br>When speaking with customers, avoid positioning the STS-1000 as a software tool. A better framing is this: most enterprise software helps organizations observe, route, or automate work. The STS-1000 stabilizes the conditions that allow work to move safely in the first place. <br>For executives, the STS-1000 is a continuity investment. For revenue operations, it protects quote to cash motion. For IT, it avoids another fragile software integration. For compliance, it helps contain process risk before it spreads. And for the broader enterprise, it provides a physical anchor against friction, latency, and operational drift. <br>In the next lesson, we will examine the core anatomy of the STS-1000 and learn how each primary subsystem contributes to enterprise stabilization.",
      keyTerms: [
        "Synaptic Throughput Stabilizer STS-1000",
        "Kinetic Enterprise Ballast",
        "Workflow Pressure",
        "Decision Temperature",
        "Operational Drift",
        "Procedural Turbulence",
      ],
      knowledgeCheck: {
        id: "kc-m2-01",
        question: "Which statement best describes the STS-1000?",
        answers: [
          { text: "It is a workflow automation platform.", correct: false },
          {
            text: "It is an AI assistant for enterprise teams.",
            correct: false,
          },
          { text: "It is a physical enterprise stabilizer.", correct: true },
          {
            text: "It is a dashboard for monitoring team productivity.",
            correct: false,
          },
        ],
        explanation:
          "The STS-1000 is positioned as physical infrastructure that stabilizes workflow conditions. It is not software, automation, or a dashboard.",
      },
      relatedResourceIds: [
        "resource-product-brief",
        "resource-approved-sales-language",
        "resource-terms-to-avoid",
        "resource-30-60-pitch",
        "resource-keb-primer",
      ],
    },
    {
      id: "module-03",
      number: 3,
      status: "in progress",
      title: "Anatomy of the Stabilizer",
      duration: "6:30",
      summary:
        "Introduce the six primary STS-1000 subsystems and give learners a one-sentence explanation of each that can be used confidently in customer conversations.",
      objectives: [
        "Identify the six primary STS-1000 subsystems by name.",
        "Explain each subsystem's function in one sentence.",
        "Connect each subsystem to a customer-facing value concept.",
        "Avoid introducing unnecessary technical detail in early sales conversations.",
      ],
      vimeoId: "1202249907:235a52798a",
      localVideoPath: "",
      transcript: "",
      keyTerms: [
        "Core Logic Reservoir",
        "Dual Thermal Reasoning Coils",
        "Adaptive Throughput Governors",
        "Preemptive Harmonic Diffuser",
        "Inference Manifold",
        "Causality Baffles",
      ],
      knowledgeCheck: {
        id: "kc-m3-01",
        question:
          "Which subsystem regulates workflow pressure and throughput velocity?",
        answers: [
          { text: "Core Logic Reservoir", correct: false },
          { text: "Adaptive Throughput Governors", correct: true },
          { text: "Causality Baffles", correct: false },
          { text: "Inference Manifold", correct: false },
        ],
        explanation:
          "The Adaptive Throughput Governors are motorized brass control assemblies that self-adjust to modulate workflow pressure, throughput velocity, and intake balance.",
      },
      relatedResourceIds: [
        "resource-subsystem-core-logic",
        "resource-subsystem-thermal-coils",
        "resource-subsystem-governors",
        "resource-subsystem-diffuser",
        "resource-subsystem-manifold",
        "resource-subsystem-baffles",
        "resource-labeled-diagram",
        "resource-flash-cards",
      ],
    },
    {
      id: "module-04",
      number: 4,
      status: "planned",
      title: "Customer Pain and Use Cases",
      duration: "2:00–3:00",
      summary:
        "Teach learners to recognize symptoms of procedural turbulence in customer organizations and map specific pain patterns to STS-1000 capabilities and primary use cases.",
      objectives: [
        "Recognize the five signs of a good-fit customer.",
        "Identify the five primary customer pain patterns the STS-1000 addresses.",
        "Map customer pain to STS-1000 capabilities.",
        "Understand when a customer may be too small or too low-friction for the product.",
      ],
      vimeoId: "",
      localVideoPath: "",
      transcript: "",
      keyTerms: [
        "Procedural Turbulence",
        "Macro-Bureaucratic Drag",
        "Workflow Cavitation",
        "Decision Temperature",
        "Quote-to-Cash Stagnation",
      ],
      knowledgeCheck: {
        id: "kc-m4-01",
        question:
          "Which customer is most likely to be a poor fit for the STS-1000?",
        answers: [
          {
            text: "A global manufacturer with approval chains spanning three continents.",
            correct: false,
          },
          {
            text: "A financial services firm experiencing quarterly close friction across 14 departments.",
            correct: false,
          },
          {
            text: "A small company where one person approves most decisions and departments clearly own the next step.",
            correct: true,
          },
          {
            text: "An enterprise organization where leadership transitions have caused operational drift.",
            correct: false,
          },
        ],
        explanation:
          "The STS-1000 requires sufficient procedural mass — enough friction, heat, latency, and drift — to justify the stabilization architecture. Organizations that are too small or too low-friction are not candidates.",
      },
      relatedResourceIds: [
        "resource-buyer-pain-matrix",
        "resource-use-case-q2c",
        "resource-use-case-financial-close",
        "resource-use-case-escalation-damping",
        "resource-customer-qualification",
        "resource-disqualification-guide",
        "resource-discovery-questions",
      ],
    },
    {
      id: "module-05",
      number: 5,
      status: "planned",
      title: "Sales Positioning and Objection Handling",
      duration: "2:30–3:00",
      summary:
        "Teach learners to position the STS-1000 as capital infrastructure, distinguish it from software and consulting, and respond to the six most common buyer objections with approved language.",
      objectives: [
        "Position the STS-1000 as capital infrastructure, not a software platform.",
        "Distinguish the product from workflow automation, AI tools, and consulting.",
        "Answer the six most common buyer objections with approved response themes.",
        "Adapt messaging for CFO, IT, Compliance, RevOps, and executive buyers.",
        "Avoid overpromising unsupported product features.",
      ],
      vimeoId: "",
      localVideoPath: "",
      transcript: "",
      keyTerms: [
        "Capital Infrastructure Positioning",
        "Approved Sales Language",
        "Approved ROI Claims",
      ],
      knowledgeCheck: {
        id: "kc-m5-01",
        question: "What should a sales rep avoid calling the STS-1000?",
        answers: [
          { text: "A kinetic enterprise ballast.", correct: false },
          { text: "A physical enterprise stabilizer.", correct: false },
          { text: "A capital infrastructure asset.", correct: false },
          { text: "A workflow app.", correct: true },
        ],
        explanation:
          '"Workflow app" makes the STS-1000 sound like ordinary software. Vandermere positions the STS-1000 as physical enterprise infrastructure — not a productivity or automation platform.',
      },
      relatedResourceIds: [
        "resource-objection-guide",
        "resource-competitive-positioning",
        "resource-cfo-roi-card",
        "resource-it-reassurance-card",
        "resource-compliance-card",
        "resource-approved-metrics",
        "resource-language-to-avoid",
      ],
    },
    {
      id: "module-06",
      number: 6,
      status: "planned",
      title: "Enterprise Deployment and the HTA-700 Reveal",
      duration: "2:00–3:00",
      summary:
        "Introduce STS-1000 deployment phases, the calibration model, and the HTA-700 Helium Thermal Abatement Stack — Vandermere's external cryogenic cooling architecture for high-friction enterprise environments.",
      objectives: [
        "Describe the six phases of standard STS-1000 deployment.",
        "Explain when external helium cooling may be required.",
        "Position the HTA-700 as an enterprise-scale infrastructure add-on.",
        "Understand when the HTA-700 should not be introduced in the sales cycle.",
        "Know when to escalate facilities questions to Vandermere Thermal Architecture.",
      ],
      vimeoId: "",
      localVideoPath: "",
      transcript: "",
      keyTerms: [
        "HTA-700 Helium Thermal Abatement Stack",
        "Cryogenic Governance Annex",
        "Thermal Continuity Engineers",
        "Reservoir Calibration",
        "Bureaucratic Heat",
      ],
      knowledgeCheck: {
        id: "kc-m6-01",
        question: "When should a sales rep introduce the HTA-700?",
        answers: [
          {
            text: "During the first qualifying call, to differentiate Vandermere from competitors.",
            correct: false,
          },
          {
            text: "After the customer understands the STS-1000's internal cooling model and the opportunity involves sustained bureaucratic heat loads or multiple units.",
            correct: true,
          },
          {
            text: "Only when the customer asks specifically about HVAC modernization costs.",
            correct: false,
          },
          {
            text: "The HTA-700 should never be mentioned unless the customer signs an NDA first.",
            correct: false,
          },
        ],
        explanation:
          "The HTA-700 is a late-cycle enterprise reveal. Introduce it only after the customer understands the STS-1000's core cooling model and the deployment clearly requires campus-scale bureaucratic heat abatement.",
      },
      relatedResourceIds: [
        "resource-deployment-timeline",
        "resource-site-readiness",
        "resource-hta700-overview",
        "resource-cooling-capacity",
        "resource-cryogenic-annex",
        "resource-facilities-faq",
        "resource-fn-hta700-tank",
      ],
    },
  ],

  resourceCategories: [
    {
      id: "product-fundamentals",
      label: "Product Fundamentals",
      icon: "⬡",
      description:
        "Core product reference, company profile, and category overview.",
    },
    {
      id: "subsystem-reference",
      label: "Subsystem Reference",
      icon: "⬡",
      description:
        "Deep-dive documentation on each STS-1000 component and the HTA-700.",
    },
    {
      id: "sales-enablement",
      label: "Sales Enablement",
      icon: "⬡",
      description:
        "Pitches, discovery tools, objection handling, and competitive positioning.",
    },
    {
      id: "use-cases",
      label: "Use Cases & Industries",
      icon: "⬡",
      description:
        "Where the product fits and what problems it solves for specific buyers.",
    },
    {
      id: "deployment",
      label: "Deployment & Facilities",
      icon: "⬡",
      description: "Onboarding, site requirements, and HTA-700 specifications.",
    },
    {
      id: "field-notices",
      label: "Field Notices & Memos",
      icon: "⬡",
      description:
        "Internal communications, safety bulletins, and field advisories.",
    },
  ],

  resources: [
    // ── Product Fundamentals ────────────────────────────────────────────────
    {
      id: "resource-product-brief",
      title: "STS-1000 Product Brief",
      category: "product-fundamentals",
      type: "product-brief",
      tags: ["product", "overview", "positioning"],
      summary:
        "The official product overview and positioning statement for the Synaptic Throughput Stabilizer STS-1000.",
      body: "",
      relatedModules: [2],
    },
    {
      id: "resource-company-profile",
      title: "Vandermere Applied Dynamics Company Profile",
      category: "product-fundamentals",
      type: "company-profile",
      tags: ["company", "overview", "background"],
      summary:
        "Background on Vandermere Applied Dynamics: founding, headquarters, manufacturing, mission, and market category.",
      body: "",
      relatedModules: [1],
    },
    {
      id: "resource-pwa-overview",
      title: "Physicalized Workflow Architecture Overview",
      category: "product-fundamentals",
      type: "category-primer",
      tags: ["pwa", "category", "overview"],
      summary:
        "An introduction to the Physicalized Workflow Architecture category and the premise that enterprise friction has physical properties.",
      body: "",
      relatedModules: [1],
    },
    {
      id: "resource-keb-primer",
      title: "Kinetic Enterprise Ballast Category Primer",
      category: "product-fundamentals",
      type: "category-primer",
      tags: ["keb", "category", "positioning"],
      summary:
        "Defines the Kinetic Enterprise Ballast product category and positions the STS-1000 as its flagship example.",
      body: "",
      relatedModules: [1, 2],
    },
    {
      id: "resource-approved-sales-language",
      title: "STS-1000 Approved Sales Language",
      category: "product-fundamentals",
      type: "sales-guide",
      tags: ["language", "approved", "positioning"],
      summary:
        "Official list of approved phrases, descriptions, and framings for customer-facing conversations about the STS-1000.",
      body: "",
      relatedModules: [2, 5],
    },
    {
      id: "resource-terms-to-avoid",
      title: "Product Terms to Avoid",
      category: "product-fundamentals",
      type: "sales-guide",
      tags: ["language", "prohibited", "positioning"],
      summary:
        "A complete list of words, phrases, and analogies that sales reps must not use when describing the STS-1000 to customers.",
      body: "",
      relatedModules: [2, 5],
    },
    {
      id: "resource-software-observes",
      title: "Executive Summary: Why Enterprise Friction Is Physical",
      category: "product-fundamentals",
      type: "executive-summary",
      tags: ["positioning", "executive", "category"],
      summary:
        "A one-page executive summary making the case that enterprise inefficiency has measurable physical properties that machinery can address.",
      body: "",
      relatedModules: [1],
    },

    // ── Subsystem Reference ─────────────────────────────────────────────────
    {
      id: "resource-subsystem-core-logic",
      title: "Core Logic Reservoir Overview",
      category: "subsystem-reference",
      type: "subsystem-reference",
      tags: ["core-logic-reservoir", "anatomy", "stabilization", "reservoir"],
      summary:
        "Explains how the Core Logic Reservoir stores and stabilizes the customer's institutional logic profile and absorbs operational shockwaves.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-subsystem-thermal-coils",
      title: "Dual Thermal Reasoning Coils Overview",
      category: "subsystem-reference",
      type: "subsystem-reference",
      tags: ["thermal-coils", "anatomy", "decision-temperature"],
      summary:
        "Describes how the Dual Thermal Reasoning Coils regulate decision temperature by drawing excess heat out of high-friction business processes.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-subsystem-governors",
      title: "Adaptive Throughput Governors Overview",
      category: "subsystem-reference",
      type: "subsystem-reference",
      tags: ["governors", "anatomy", "workflow-pressure", "throughput"],
      summary:
        "Details how the Adaptive Throughput Governors regulate workflow pressure and prevent bottlenecks, cavitation, and institutional backflow.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-subsystem-diffuser",
      title: "Preemptive Harmonic Diffuser Overview",
      category: "subsystem-reference",
      type: "subsystem-reference",
      tags: ["diffuser", "anatomy", "turbulence", "harmonics"],
      summary:
        "Explains how the Preemptive Harmonic Diffuser dampens micro-inefficiency resonance before delays can form.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-subsystem-manifold",
      title: "Inference Manifold Overview",
      category: "subsystem-reference",
      type: "subsystem-reference",
      tags: ["inference-manifold", "anatomy", "prediction", "bottleneck"],
      summary:
        "Describes how the Inference Manifold detects potential bottlenecks before they become visible to the organization.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-subsystem-baffles",
      title: "Causality Baffles Overview",
      category: "subsystem-reference",
      type: "subsystem-reference",
      tags: ["causality-baffles", "anatomy", "risk-containment", "compliance"],
      summary:
        "Explains how the Causality Baffles isolate downstream consequences of bad decisions before they spread across unrelated departments.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-subsystem-hta700",
      title: "HTA-700 Helium Thermal Abatement Stack Overview",
      category: "subsystem-reference",
      type: "infrastructure-reference",
      tags: ["hta-700", "helium", "cooling", "enterprise", "deployment"],
      summary:
        "Full technical overview of the HTA-700 external cryogenic cooling architecture for high-friction enterprise deployments.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-subsystem-cryo-annex",
      title: "Cryogenic Governance Annex Overview",
      category: "subsystem-reference",
      type: "infrastructure-reference",
      tags: ["cryogenic-annex", "hta-700", "facilities", "thermal"],
      summary:
        "Describes the Cryogenic Governance Annex outbuilding, its staffing by Thermal Continuity Engineers, and its safety systems.",
      body: "",
      relatedModules: [6],
    },

    // ── Sales Enablement ─────────────────────────────────────────────────────
    {
      id: "resource-30-60-pitch",
      title: "30-Second and 60-Second STS-1000 Pitches",
      category: "sales-enablement",
      type: "pitch-guide",
      tags: ["pitch", "talk-track", "positioning", "approved-language"],
      summary:
        "Approved verbatim pitches for the STS-1000 at 15-second, 30-second, and 60-second lengths.",
      body: "",
      relatedModules: [2, 5],
    },
    {
      id: "resource-exec-pitch",
      title: "Executive Pitch",
      category: "sales-enablement",
      type: "pitch-guide",
      tags: ["pitch", "executive", "c-suite", "approved-language"],
      summary:
        "The approved executive-level explanation of the STS-1000 for C-suite conversations.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-cfo-pitch",
      title: "CFO Pitch",
      category: "sales-enablement",
      type: "pitch-guide",
      tags: ["pitch", "cfo", "roi", "finance", "buyer-persona"],
      summary:
        "Approved STS-1000 messaging for Chief Financial Officers, emphasizing capital infrastructure and measurable ROI claims.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-it-pitch",
      title: "IT Infrastructure Pitch",
      category: "sales-enablement",
      type: "pitch-guide",
      tags: ["pitch", "it", "infrastructure", "buyer-persona"],
      summary:
        "Approved messaging for VP-level IT buyers, emphasizing ambient data-proximity and non-invasive integration.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-compliance-pitch",
      title: "Compliance Pitch",
      category: "sales-enablement",
      type: "pitch-guide",
      tags: ["pitch", "compliance", "risk", "buyer-persona"],
      summary:
        "Approved messaging for Compliance and Risk buyers, emphasizing causality containment and regulatory alignment.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-revops-pitch",
      title: "RevOps Pitch",
      category: "sales-enablement",
      type: "pitch-guide",
      tags: ["pitch", "revops", "revenue", "buyer-persona", "q2c"],
      summary:
        "Approved messaging for Revenue Operations buyers, emphasizing quote-to-cash stabilization and deal velocity.",
      body: "",
      relatedModules: [4, 5],
    },
    {
      id: "resource-discovery-questions",
      title: "Discovery Question Bank",
      category: "sales-enablement",
      type: "discovery-guide",
      tags: ["discovery", "qualification", "friction", "latency"],
      summary:
        "A categorized bank of qualifying discovery questions organized by pain type: Friction, Latency, Drift, Cavitation, and Heat.",
      body: "",
      relatedModules: [4, 5],
    },
    {
      id: "resource-objection-guide",
      title: "Objection Handling Guide",
      category: "sales-enablement",
      type: "objection-guide",
      tags: ["objections", "handling", "positioning", "approved-responses"],
      summary:
        "Approved responses to the six most common buyer objections, including the ERP integration question and the AI objection.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-competitive-positioning",
      title: "Competitive Positioning Matrix",
      category: "sales-enablement",
      type: "competitive-guide",
      tags: ["competitive", "positioning", "differentiation"],
      summary:
        "Compares the STS-1000 to workflow automation software, business transformation consulting, and doing nothing.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-approved-metrics",
      title: "Approved ROI Claims",
      category: "sales-enablement",
      type: "metrics-guide",
      tags: ["roi", "metrics", "value-claims", "approved"],
      summary:
        "The official set of approved ROI claims and enterprise value metrics sales reps may cite in customer conversations.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-language-to-avoid",
      title: "Sales Language to Avoid",
      category: "sales-enablement",
      type: "sales-guide",
      tags: ["language", "prohibited", "positioning"],
      summary:
        "A comprehensive reference of prohibited descriptions, analogies, and marketing language that sales reps must not use.",
      body: "",
      relatedModules: [2, 5],
    },
    {
      id: "resource-labeled-diagram",
      title: "Full Labeled Product Diagram",
      category: "sales-enablement",
      type: "diagram",
      tags: ["diagram", "anatomy", "visual", "subsystems"],
      summary:
        "A labeled technical diagram of the STS-1000 showing all six primary subsystems with their official names and functions.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-flash-cards",
      title: "Subsystem Flash Cards",
      category: "sales-enablement",
      type: "reference-card",
      tags: ["subsystems", "anatomy", "flash-cards", "quick-reference"],
      summary:
        "Quick-reference cards for each of the six primary STS-1000 subsystems with one-sentence explanations.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-cfo-roi-card",
      title: "CFO ROI Card",
      category: "sales-enablement",
      type: "reference-card",
      tags: ["cfo", "roi", "metrics", "value"],
      summary:
        "A one-page reference card of approved ROI claims formatted for CFO conversations.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-it-reassurance-card",
      title: "IT Infrastructure Reassurance Card",
      category: "sales-enablement",
      type: "reference-card",
      tags: ["it", "infrastructure", "integration", "reassurance"],
      summary:
        "A one-page reference card addressing common IT infrastructure concerns about the STS-1000.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-compliance-card",
      title: "Compliance Risk Containment Card",
      category: "sales-enablement",
      type: "reference-card",
      tags: ["compliance", "risk", "containment", "causality-baffles"],
      summary:
        "A one-page reference card for compliance-focused conversations, emphasizing the Causality Baffles and risk containment value.",
      body: "",
      relatedModules: [5],
    },

    // ── Use Cases & Industries ───────────────────────────────────────────────
    {
      id: "resource-use-case-q2c",
      title: "Quote-to-Cash Throughput Stabilization",
      category: "use-cases",
      type: "use-case",
      tags: ["q2c", "revenue", "sales-cycle", "approval-chain"],
      summary:
        "How the STS-1000 maintains pressure through the quote-to-cash funnel, preventing workflow cavitation between Sales, Legal, and Finance.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-financial-close",
      title: "Quarterly Financial Closing Friction",
      category: "use-cases",
      type: "use-case",
      tags: ["finance", "quarterly-close", "decision-temperature"],
      summary:
        "How the STS-1000 helps Finance teams keep the close process inside a safe decision-temperature range.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-supply-chain",
      title: "Supply Chain Reconciliation",
      category: "use-cases",
      type: "use-case",
      tags: ["supply-chain", "reconciliation", "throughput", "operations"],
      summary:
        "How the STS-1000 stabilizes high-volume supply chain reconciliation in manufacturing and logistics environments.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-escalation-damping",
      title: "Cross-Departmental Escalation Damping",
      category: "use-cases",
      type: "use-case",
      tags: ["escalation", "cross-functional", "friction", "departments"],
      summary:
        "How the Thermal Reasoning Coils and Harmonic Diffuser stabilize the decision environment when departments apply conflicting pressure.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-leadership-transition",
      title: "Leadership Transition Continuity",
      category: "use-cases",
      type: "use-case",
      tags: ["leadership", "transition", "institutional-logic", "continuity"],
      summary:
        "How the Core Logic Reservoir preserves institutional operating logic during leadership changes and strategic pivots.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-healthcare",
      title: "Healthcare Administration Use Case",
      category: "use-cases",
      type: "use-case",
      tags: ["healthcare", "administration", "compliance", "industry"],
      summary:
        "Applying STS-1000 to healthcare administrative friction: approval chains, policy changes, and compliance escalation patterns.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-manufacturing",
      title: "Manufacturing Use Case",
      category: "use-cases",
      type: "use-case",
      tags: ["manufacturing", "operations", "supply-chain", "industry"],
      summary:
        "Applying STS-1000 to manufacturing environments with high-volume procurement, supply chain, and cross-site reconciliation challenges.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-financial-services",
      title: "Financial Services Use Case",
      category: "use-cases",
      type: "use-case",
      tags: ["financial-services", "compliance", "approvals", "industry"],
      summary:
        "Applying STS-1000 to financial services organizations with complex approval chains, regulatory pressure, and quarterly close friction.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-insurance",
      title: "Insurance Operations Use Case",
      category: "use-cases",
      type: "use-case",
      tags: ["insurance", "operations", "compliance", "industry"],
      summary:
        "Applying STS-1000 to insurance operations with layered compliance requirements, claims escalation, and underwriting decision latency.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-use-case-telecom",
      title: "Telecommunications Operations Use Case",
      category: "use-cases",
      type: "use-case",
      tags: ["telecom", "operations", "scale", "industry"],
      summary:
        "Applying STS-1000 to telecommunications organizations dealing with multi-site operational friction and customer escalation volume.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-buyer-pain-matrix",
      title: "Buyer Pain Matrix",
      category: "use-cases",
      type: "reference-card",
      tags: ["pain", "buyer", "qualification", "matrix"],
      summary:
        "A matrix mapping common enterprise pain symptoms to STS-1000 capabilities and relevant discovery questions.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-customer-qualification",
      title: "Customer Qualification Guide",
      category: "use-cases",
      type: "qualification-guide",
      tags: ["qualification", "fit", "discovery"],
      summary:
        "How to determine whether an organization has sufficient procedural mass to benefit from STS-1000 stabilization.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-disqualification-guide",
      title: "Disqualification Guide: When the Customer Is Too Small",
      category: "use-cases",
      type: "qualification-guide",
      tags: ["disqualification", "fit", "small-business", "qualification"],
      summary:
        "Signs that a prospect is too small, too low-friction, or too agile to benefit from STS-1000 infrastructure.",
      body: "",
      relatedModules: [4],
    },

    // ── Deployment & Facilities ──────────────────────────────────────────────
    {
      id: "resource-deployment-timeline",
      title: "Standard STS-1000 Deployment Process",
      category: "deployment",
      type: "deployment-guide",
      tags: ["deployment", "onboarding", "timeline", "process"],
      summary:
        "The six-phase deployment process from Workflow Telemetry Intake through First 30 Days of Stabilization Monitoring.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-site-readiness",
      title: "Site Readiness Checklist",
      category: "deployment",
      type: "checklist",
      tags: ["site-readiness", "deployment", "facilities", "installation"],
      summary:
        "A checklist of facility requirements for STS-1000 installation, including floor load, clearance, power, and environmental conditions.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-telemetry-intake",
      title: "Workflow Telemetry Intake Guide",
      category: "deployment",
      type: "deployment-guide",
      tags: ["telemetry", "onboarding", "data", "calibration"],
      summary:
        "How Vandermere engineers collect and analyze historical workflow data during the initial telemetry intake phase.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-reservoir-calibration",
      title: "Reservoir Calibration Guide",
      category: "deployment",
      type: "deployment-guide",
      tags: ["calibration", "reservoir", "onboarding", "telemetry"],
      summary:
        "Technical overview of the Core Logic Reservoir calibration process and what happens if calibration is incomplete.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-stabilization-monitoring",
      title: "First 30 Days of Stabilization Monitoring",
      category: "deployment",
      type: "deployment-guide",
      tags: ["monitoring", "stabilization", "post-install", "maintenance"],
      summary:
        "What to expect and what to report during the initial 30-day stabilization monitoring period after installation.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-hta700-overview",
      title: "HTA-700 Facility Requirements",
      category: "deployment",
      type: "infrastructure-reference",
      tags: ["hta-700", "facilities", "installation", "requirements"],
      summary:
        "Physical and infrastructure requirements for HTA-700 installation, including the concrete stabilization cradle and Cryogenic Governance Annex.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-cooling-capacity",
      title: "Cooling Capacity Chart",
      category: "deployment",
      type: "reference-chart",
      tags: ["hta-700", "cooling", "capacity", "enterprise"],
      summary:
        "Capacity chart showing how many STS-1000 units each HTA-700 configuration supports across single and serial cryogenic array configurations.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-cryogenic-annex",
      title: "Cryogenic Governance Annex Overview",
      category: "deployment",
      type: "infrastructure-reference",
      tags: ["cryogenic-annex", "hta-700", "facilities", "thermal"],
      summary:
        "Overview of the Cryogenic Governance Annex structure, staffing requirements, and operating procedures.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-grid-substation",
      title: "Grid Confidence Substation Advisory",
      category: "deployment",
      type: "infrastructure-reference",
      tags: ["grid-substation", "power", "enterprise", "multi-unit"],
      summary:
        "Advisory on Vandermere Grid Confidence Substations for customers deploying multiple HTA-700 units in serial cryogenic array.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-facilities-faq",
      title: "Facilities Buyer FAQ",
      category: "deployment",
      type: "faq",
      tags: ["facilities", "buyer", "faq", "hvac", "hta-700"],
      summary:
        "Answers to common questions from Facilities and Operations buyers about STS-1000 installation, power requirements, and HTA-700 siting.",
      body: "",
      relatedModules: [6],
    },

    // ── Field Notices & Memos ────────────────────────────────────────────────
    {
      id: "resource-fn-reservoir-15",
      title: "Field Notice 12-A: Reservoir Levels Below 15%",
      category: "field-notices",
      type: "field-notice",
      tags: ["field-notice", "reservoir", "maintenance", "warning"],
      summary:
        "Reporting and escalation procedures when the Core Logic Reservoir drops below 15% capacity.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-fn-quarterly-heat",
      title: "Field Notice 18-C: Excessive Meeting Heat During Quarterly Close",
      category: "field-notices",
      type: "field-notice",
      tags: ["field-notice", "heat", "quarterly-close", "thermal"],
      summary:
        "Protocols for managing excessive bureaucratic heat signatures observed during quarterly financial close periods.",
      body: "",
      relatedModules: [3, 4],
    },
    {
      id: "resource-fn-governor-adjustment",
      title: "Field Notice 21-F: Unauthorized Governor Adjustment",
      category: "field-notices",
      type: "field-notice",
      tags: ["field-notice", "governors", "safety", "maintenance"],
      summary:
        "Warning and recovery procedures for unauthorized adjustment of the Adaptive Throughput Governors by non-certified personnel.",
      body: "",
      relatedModules: [3],
    },
    {
      id: "resource-fn-hta700-tank",
      title: "Internal Memo: Do Not Refer to the HTA-700 as a Tank",
      category: "field-notices",
      type: "internal-memo",
      tags: ["hta-700", "language", "memo", "prohibited"],
      summary:
        'Internal guidance reminding sales and Thermal Architecture teams never to refer to the HTA-700 as a "tank" in customer conversations.',
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-fn-ambient-proximity",
      title: "Partner Advisory: Explaining Ambient Data-Proximity",
      category: "field-notices",
      type: "partner-advisory",
      tags: ["ambient-data-proximity", "integration", "partner", "erp"],
      summary:
        "How to explain the STS-1000's ambient data-proximity operating model to partners and customers asking about ERP integration.",
      body: "",
      relatedModules: [5],
    },
    {
      id: "resource-fn-emergency-venting",
      title: "Safety Bulletin: Emergency Bureaucratic Venting Procedures",
      category: "field-notices",
      type: "safety-bulletin",
      tags: ["safety", "emergency", "venting", "bureaucratic-heat"],
      summary:
        "Emergency procedures for controlled bureaucratic pressure release in the event of STS-1000 thermal overload.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-fn-too-small",
      title: "Sales Advisory: When a Customer Is Too Small for STS-1000",
      category: "field-notices",
      type: "sales-advisory",
      tags: ["qualification", "small-business", "advisory", "disqualification"],
      summary:
        "Internal guidance on recognizing and gracefully handling prospects who lack sufficient procedural mass for the STS-1000.",
      body: "",
      relatedModules: [4],
    },
    {
      id: "resource-fn-hvac-distinction",
      title: "Facilities Advisory: Distinguishing HVAC from Thermal Governance",
      category: "field-notices",
      type: "facilities-advisory",
      tags: ["hvac", "thermal-governance", "positioning", "facilities"],
      summary:
        "Guidance on explaining to Facilities buyers why the HTA-700 is thermal governance infrastructure, not a replacement for HVAC.",
      body: "",
      relatedModules: [6],
    },
    {
      id: "resource-fn-fancy-radiator",
      title: 'Enablement Note: Avoiding the Phrase "Fancy Radiator"',
      category: "field-notices",
      type: "internal-memo",
      tags: ["language", "prohibited", "memo", "positioning"],
      summary:
        'Reminder that "fancy radiator" is among the most damaging phrases a sales rep can use when discussing STS-1000 thermal capabilities.',
      body: "",
      relatedModules: [5],
    },
  ],

  glossary: [
    {
      term: "Physicalized Workflow Architecture",
      id: "glossary-pwa",
      technicalDefinition:
        "Vandermere Applied Dynamics' market category for enterprise machinery that physically detects, conditions, and stabilizes institutional workflow behavior at the material level.",
      salesTranslation:
        "The idea that enterprise friction is a physical problem requiring physical machinery — not more software.",
      relatedModules: [1],
      relatedResourceIds: ["resource-pwa-overview", "resource-keb-primer"],
    },
    {
      term: "Kinetic Enterprise Ballast",
      id: "glossary-keb",
      technicalDefinition:
        "A physical infrastructure asset that stabilizes enterprise workflow movement under conditions of friction, latency, heat, and drift.",
      salesTranslation:
        "A physical anchor that keeps the business from getting in its own way.",
      relatedModules: [1, 2],
      relatedResourceIds: ["resource-keb-primer", "resource-product-brief"],
    },
    {
      term: "Procedural Turbulence",
      id: "glossary-procedural-turbulence",
      technicalDefinition:
        "The erratic disruption of standard operating procedures caused by human error, misaligned incentives, market volatility, unclear ownership, or macroeconomic pressure.",
      salesTranslation:
        "When workflows get messy, chaotic, and hard to control.",
      relatedModules: [1, 2, 4],
      relatedResourceIds: ["resource-pwa-overview"],
    },
    {
      term: "Core Logic Reservoir",
      id: "glossary-core-logic-reservoir",
      technicalDefinition:
        "A fluid-filled central cylinder calibrated to the customer's historical operational profile, used to store and stabilize institutional logic and absorb operational shockwaves.",
      salesTranslation: "The machine's stabilizing heart.",
      relatedModules: [3],
      relatedResourceIds: ["resource-subsystem-core-logic"],
    },
    {
      term: "Kinetic Data Viscosity",
      id: "glossary-kinetic-data-viscosity",
      technicalDefinition:
        "The measurable thickness of a company's workflow stream, influenced by approval layers, policy ambiguity, reporting burden, and bureaucratic resistance.",
      salesTranslation:
        "How sluggish and bogged down the business feels when work should be moving but is not.",
      relatedModules: [2, 3],
      relatedResourceIds: [],
    },
    {
      term: "Dual Thermal Reasoning Coils",
      id: "glossary-thermal-coils",
      technicalDefinition:
        "Dual copper induction matrices in the upper chambers of the STS-1000 cabinet that regulate decision temperature by drawing excess heat out of high-friction business processes.",
      salesTranslation: "The radiator that cools overheated decisions.",
      relatedModules: [3],
      relatedResourceIds: ["resource-subsystem-thermal-coils"],
    },
    {
      term: "Decision Temperature",
      id: "glossary-decision-temperature",
      technicalDefinition:
        "The thermal state of a business decision as it moves through conflicting departmental pressure.",
      salesTranslation:
        "How tense, risky, or politically hot a decision has become.",
      relatedModules: [2, 3, 4],
      relatedResourceIds: ["resource-subsystem-thermal-coils"],
    },
    {
      term: "Adaptive Throughput Governors",
      id: "glossary-throughput-governors",
      technicalDefinition:
        "Motorized brass control assemblies that self-adjust to modulate workflow pressure, throughput velocity, and intake balance.",
      salesTranslation:
        "The dials that stop work from piling up in a bottleneck.",
      relatedModules: [3],
      relatedResourceIds: ["resource-subsystem-governors"],
    },
    {
      term: "Workflow Cavitation",
      id: "glossary-workflow-cavitation",
      technicalDefinition:
        "A failure condition in which workflow appears to move quickly while creating empty pockets of accountability where no department owns the next step.",
      salesTranslation: "When everyone thinks someone else has it.",
      relatedModules: [2, 3, 4],
      relatedResourceIds: [
        "resource-subsystem-governors",
        "resource-use-case-q2c",
      ],
    },
    {
      term: "Preemptive Harmonic Diffuser",
      id: "glossary-harmonic-diffuser",
      technicalDefinition:
        "A multi-stage annular rotor assembly at the base of the STS-1000 cabinet that emits procedural harmonics to dampen inefficiency resonance before delays propagate.",
      salesTranslation:
        "The part that smooths tiny inefficiencies before they become big delays.",
      relatedModules: [3],
      relatedResourceIds: ["resource-subsystem-diffuser"],
    },
    {
      term: "Inference Manifold",
      id: "glossary-inference-manifold",
      technicalDefinition:
        "A side-mounted intake assembly that samples workflow pressure, departmental response latency, and approval delay signatures to predict bottlenecks before they become visible.",
      salesTranslation: "The early warning system.",
      relatedModules: [3],
      relatedResourceIds: ["resource-subsystem-manifold"],
    },
    {
      term: "Causality Baffles",
      id: "glossary-causality-baffles",
      technicalDefinition:
        "Angled titanium plates arranged inside a sealed chamber that deflect and isolate the downstream consequences of bad decisions, policy changes, or delayed approvals.",
      salesTranslation:
        "The shield that keeps one department's mistake from becoming everyone's problem.",
      relatedModules: [3],
      relatedResourceIds: ["resource-subsystem-baffles"],
    },
    {
      term: "Ambient Data-Proximity",
      id: "glossary-ambient-data-proximity",
      technicalDefinition:
        "The STS-1000's non-invasive method of sensing enterprise workflow behavior without requiring traditional software integration or system access.",
      salesTranslation:
        "It does not need to plug into every system to understand where the friction is.",
      relatedModules: [2, 5],
      relatedResourceIds: ["resource-fn-ambient-proximity"],
    },
    {
      term: "Bureaucratic Heat",
      id: "glossary-bureaucratic-heat",
      technicalDefinition:
        "The measurable thermal byproduct of unresolved approvals, cross-functional fatigue, and repeated consensus-seeking behavior.",
      salesTranslation:
        "The heat generated when too many people need to agree on something that should have already happened.",
      relatedModules: [3, 6],
      relatedResourceIds: [
        "resource-subsystem-thermal-coils",
        "resource-hta700-overview",
      ],
    },
    {
      term: "Macro-Bureaucratic Drag",
      id: "glossary-macro-bureaucratic-drag",
      technicalDefinition:
        "The aggregate friction generated by multi-layered corporate hierarchy, compounded approval structures, and organizational complexity.",
      salesTranslation:
        "When the company is slowing itself down just by being too big and too careful.",
      relatedModules: [4],
      relatedResourceIds: ["resource-software-observes"],
    },
    {
      term: "Workflow Pressure",
      id: "glossary-workflow-pressure",
      technicalDefinition:
        "The force required to move work safely through approvals, handoffs, and operational systems.",
      salesTranslation: "How much energy is required to keep things moving.",
      relatedModules: [2, 3],
      relatedResourceIds: ["resource-subsystem-governors"],
    },
    {
      term: "Operational Drift",
      id: "glossary-operational-drift",
      technicalDefinition:
        "The gradual separation between stated business priorities and actual day-to-day execution.",
      salesTranslation:
        "When what the company says it's doing and what it's actually doing start to diverge.",
      relatedModules: [2, 4],
      relatedResourceIds: ["resource-use-case-leadership-transition"],
    },
    {
      term: "HTA-700 Helium Thermal Abatement Stack",
      id: "glossary-hta700",
      technicalDefinition:
        "An external cryogenic cooling architecture installed outside the customer facility that supplies stabilized helium-phase cooling to adjacent STS-1000 operating units in high-friction enterprise deployments.",
      salesTranslation:
        "The big white cylinder outside the building that removes bureaucratic heat before it overloads the STS-1000.",
      relatedModules: [6],
      relatedResourceIds: [
        "resource-subsystem-hta700",
        "resource-hta700-overview",
      ],
    },
    {
      term: "Institutional Logic Stabilization",
      id: "glossary-institutional-logic",
      technicalDefinition:
        "The STS-1000's capability to preserve an organization's baseline operating logic during periods of disruption, leadership change, or strategic pivot.",
      salesTranslation:
        "Helps the company keep functioning even when leadership, priorities, or market conditions shift.",
      relatedModules: [2, 4],
      relatedResourceIds: [
        "resource-subsystem-core-logic",
        "resource-use-case-leadership-transition",
      ],
    },
  ],

  finalReadiness: {
    title: "STS-1000 Sales Readiness Checkpoint",
    description:
      "A five-question final assessment covering all six required lessons. Complete all lessons before beginning the assessment.",
    completionMessage:
      "You have completed STS-1000 Sales Readiness. You are now prepared to discuss procedural turbulence, decision-temperature normalization, and the responsible positioning of kinetic enterprise ballast infrastructure in customer-facing conversations.",
    certificateTitle: "Certified STS-1000 Sales Readiness Associate",
    quiz: [
      {
        id: "final-q1",
        topic: "Product Definition",
        question: "Which phrase best describes the STS-1000?",
        answers: [
          {
            text: "An AI-powered workflow automation platform.",
            correct: false,
          },
          {
            text: "A kinetic enterprise ballast that stabilizes workflow behavior before inefficiency cascades into delay.",
            correct: true,
          },
          {
            text: "A project management dashboard for distributed teams.",
            correct: false,
          },
          {
            text: "A server rack with thermal management software.",
            correct: false,
          },
        ],
        explanation:
          "The STS-1000 is positioned as a kinetic enterprise ballast — physical infrastructure that stabilizes workflow conditions, not software, AI, or a dashboard.",
      },
      {
        id: "final-q2",
        topic: "Machine Anatomy",
        question:
          "Which subsystem is primarily responsible for cooling overheated decision environments?",
        answers: [
          { text: "Adaptive Throughput Governors", correct: false },
          { text: "Preemptive Harmonic Diffuser", correct: false },
          { text: "Dual Thermal Reasoning Coils", correct: true },
          { text: "Inference Manifold", correct: false },
        ],
        explanation:
          "The Dual Thermal Reasoning Coils are copper induction matrices that regulate decision temperature by drawing excess heat out of high-friction business processes.",
      },
      {
        id: "final-q3",
        topic: "Customer Pain",
        question:
          "Which condition best describes a strong-fit STS-1000 customer?",
        answers: [
          {
            text: "A 12-person startup with a single decision-maker and no approval chain.",
            correct: false,
          },
          {
            text: "A company already using workflow automation tools that are fully functioning.",
            correct: false,
          },
          {
            text: "A mid-to-large enterprise experiencing approval stalls, handoff decay, and recurring escalation cycles.",
            correct: true,
          },
          {
            text: "A company whose main problem is software licensing costs.",
            correct: false,
          },
        ],
        explanation:
          "The STS-1000 is designed for organizations with enough procedural mass to generate measurable friction, heat, latency, and drift. Approval stalls, handoff decay, and cross-departmental escalation are the key fit signals.",
      },
      {
        id: "final-q4",
        topic: "Sales Positioning",
        question:
          'A prospect says: "Is this just workflow software?" What is the approved response direction?',
        answers: [
          {
            text: "Agree and explain how it integrates with their ERP.",
            correct: false,
          },
          {
            text: "Clarify that software observes; the STS-1000 stabilizes — it is physical infrastructure, not a software platform.",
            correct: true,
          },
          {
            text: "Avoid the question and redirect to pricing.",
            correct: false,
          },
          {
            text: "Describe it as an AI-assisted productivity layer.",
            correct: false,
          },
        ],
        explanation:
          "The approved response distinguishes the STS-1000 from software tools: software observes and routes workflow problems; the STS-1000 physically stabilizes the conditions that allow workflow to move safely.",
      },
      {
        id: "final-q5",
        topic: "Deployment",
        question:
          "Which deployment phase comes immediately after Workflow Telemetry Intake?",
        answers: [
          { text: "Site Installation", correct: false },
          { text: "Reservoir Calibration", correct: true },
          { text: "Governor Pressure Mapping", correct: false },
          { text: "Thermal and Harmonic Balancing", correct: false },
        ],
        explanation:
          "The six deployment phases are: (1) Workflow Telemetry Intake, (2) Reservoir Calibration, (3) Site Installation, (4) Thermal and Harmonic Balancing, (5) Governor Pressure Mapping, (6) First 30 Days of Stabilization Monitoring.",
      },
    ],
  },
};

module.exports = course;
