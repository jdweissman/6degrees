// Curated resources for startup evaluation categories
// Organized by score tier: low (1-4), mid (5-7), high (8-10)

export interface Resource {
  title: string;
  url: string;
  type: 'guide' | 'template' | 'video' | 'tool' | 'article';
  source: string;
}

export interface CategoryResources {
  low: Resource[];    // Score 1-4: Foundational fixes needed
  mid: Resource[];    // Score 5-7: Improvement opportunities
  high: Resource[];   // Score 8-10: Optimization & scaling
}

export interface CategoryGuidance {
  label: string;
  description: string;
  whatToInclude: string[];
  example: string;
  investorLens: string;
}

export const resourcesByCategory: Record<string, CategoryResources> = {
  business: {
    low: [
      { title: "Problem-Solution Fit: The Complete Guide", url: "https://www.ycombinator.com/library/4Q-problem-solution-fit", type: "guide", source: "Y Combinator" },
      { title: "Lean Canvas Template", url: "https://leanstack.com/leancanvas", type: "template", source: "Lean Stack" },
      { title: "How to Validate Your Startup Idea", url: "https://www.indiehackers.com/post/how-to-validate-your-startup-idea-before-building-anything-5d8c6b6c4a", type: "article", source: "Indie Hackers" }
    ],
    mid: [
      { title: "Business Model Canvas Explained", url: "https://strategyzer.com/canvas/business-model-canvas", type: "guide", source: "Strategyzer" },
      { title: "Value Proposition Design", url: "https://www.strategyzer.com/books/value-proposition-design", type: "guide", source: "Strategyzer" }
    ],
    high: [
      { title: "Unit Economics for SaaS", url: "https://www.cobloom.com/blog/unit-economics", type: "guide", source: "Bloom" },
      { title: "Scaling Business Models", url: "https://hbr.org/2020/06/how-to-design-a-winning-business-model", type: "article", source: "HBR" }
    ]
  },

  market: {
    low: [
      { title: "TAM SAM SOM: Market Sizing Guide", url: "https://www.investopedia.com/articles/investing/102115/what-total-addressable-market-tam.asp", type: "guide", source: "Investopedia" },
      { title: "Market Research for Startups", url: "https://www.score.org/resource/market-research-template", type: "template", source: "SCORE" }
    ],
    mid: [
      { title: "Bottom-Up Market Sizing", url: "https://www.forentrepreneurs.com/market-size/", type: "guide", source: "For Entrepreneurs" },
      { title: "Competitive Market Analysis Template", url: "https://www.smartsheet.com/competitive-analysis-templates", type: "template", source: "Smartsheet" }
    ],
    high: [
      { title: "Market Timing & Strategy", url: "https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/market-timing", type: "article", source: "McKinsey" },
      { title: "Category Creation Strategy", url: "https://www.playbook.com/blog/category-creation", type: "guide", source: "Playbook" }
    ]
  },

  product: {
    low: [
      { title: "MVP Development Guide", url: "https://www.ycombinator.com/library/5R-how-to-build-an-mvp", type: "guide", source: "Y Combinator" },
      { title: "Product Requirements Document Template", url: "https://www.productplan.com/learn/how-to-write-a-prd/", type: "template", source: "ProductPlan" }
    ],
    mid: [
      { title: "Product-Market Fit: The Only Guide You Need", url: "https://www.lennysnewsletter.com/p/whats-productmarket-fit-and-how-do", type: "guide", source: "Lenny's Newsletter" },
      { title: "Feature Prioritization Framework", url: "https://www.productboard.com/glossary/feature-prioritization/", type: "guide", source: "Productboard" }
    ],
    high: [
      { title: "Building Defensible Products", url: "https://a16z.com/2018/03/07/why-moats-matter/", type: "article", source: "a16z" },
      { title: "Product Strategy at Scale", url: "https://www.reforge.com/blog/product-strategy", type: "guide", source: "Reforge" }
    ]
  },

  traction: {
    low: [
      { title: "First 100 Customers Guide", url: "https://www.ycombinator.com/library/4V-how-to-get-your-first-100-customers", type: "guide", source: "Y Combinator" },
      { title: "Startup Metrics That Matter", url: "https://www.klipfolio.com/resources/articles/saas-metrics", type: "guide", source: "Klipfolio" }
    ],
    mid: [
      { title: "Growth Metrics Dashboard Template", url: "https://www.chartmogul.com/templates/growth-metrics/", type: "template", source: "ChartMogul" },
      { title: "The Traction Gap", url: "https://www.forentrepreneurs.com/traction-gap/", type: "guide", source: "For Entrepreneurs" }
    ],
    high: [
      { title: "Scaling Growth Engines", url: "https://www.reforge.com/blog/growth-engines", type: "guide", source: "Reforge" },
      { title: "SaaS Metrics 2.0", url: "https://www.cobloom.com/blog/saas-metrics-2", type: "guide", source: "Bloom" }
    ]
  },

  competition: {
    low: [
      { title: "Competitive Analysis for Startups", url: "https://www.score.org/resource/competitive-analysis-template", type: "template", source: "SCORE" },
      { title: "How to Research Your Competition", url: "https://www.entrepreneur.com/article/242968", type: "guide", source: "Entrepreneur" }
    ],
    mid: [
      { title: "Positioning Strategy Guide", url: "https://www.playbook.com/blog/positioning-strategy", type: "guide", source: "Playbook" },
      { title: "Competitive Moats Framework", url: "https://www.morningstar.com/articles/moat-investing", type: "guide", source: "Morningstar" }
    ],
    high: [
      { title: "Building Sustainable Competitive Advantage", url: "https://hbr.org/2008/07/creating-sustainable-competitive-advantage", type: "article", source: "HBR" },
      { title: "Network Effects Playbook", url: "https://www.nfx.com/post/network-effects-manual", type: "guide", source: "NFX" }
    ]
  },

  gtm: {
    low: [
      { title: "Go-to-Market Strategy Template", url: "https://www.productplan.com/learn/go-to-market-strategy/", type: "template", source: "ProductPlan" },
      { title: "Customer Acquisition 101", url: "https://www.hubspot.com/customer-acquisition", type: "guide", source: "HubSpot" }
    ],
    mid: [
      { title: "PLG vs Sales-Led Growth", url: "https://www.opentable.com/blog/plg-vs-sales-led/", type: "guide", source: "OpenView" },
      { title: "CAC Payback Period Calculator", url: "https://www.cobloom.com/resources/cac-payback-calculator", type: "tool", source: "Bloom" }
    ],
    high: [
      { title: "Enterprise Sales Playbook", url: "https://www.gong.io/resources/enterprise-sales-playbook/", type: "guide", source: "Gong" },
      { title: "Scaling Demand Generation", url: "https://www.demandcurve.com/playbooks", type: "guide", source: "Demand Curve" }
    ]
  },

  operations: {
    low: [
      { title: "Startup Operations Checklist", url: "https://www.score.org/resource/startup-operations-checklist", type: "template", source: "SCORE" },
      { title: "Building Your First Team", url: "https://www.ycombinator.com/library/5D-hiring-your-first-employees", type: "guide", source: "Y Combinator" }
    ],
    mid: [
      { title: "Operational Efficiency Metrics", url: "https://www.cobloom.com/blog/operational-efficiency", type: "guide", source: "Bloom" },
      { title: "Process Documentation Template", url: "https://www.notion.so/templates/sop", type: "template", source: "Notion" }
    ],
    high: [
      { title: "Scaling Operations", url: "https://www.mckinsey.com/capabilities/operations/our-insights/scaling-for-success", type: "article", source: "McKinsey" },
      { title: "Building High-Performance Teams", url: "https://rework.withgoogle.com/guides/understand-team-effectiveness/steps/learn-the-five-keys-to-a-successful-team/", type: "guide", source: "Google re:Work" }
    ]
  },

  team: {
    low: [
      { title: "Finding a Co-Founder", url: "https://www.ycombinator.com/library/4U-finding-a-cofounder", type: "guide", source: "Y Combinator" },
      { title: "Startup Equity Split Calculator", url: "https://www.slicingpie.com/", type: "tool", source: "Slicing Pie" }
    ],
    mid: [
      { title: "Building Your Advisory Board", url: "https://www.forentrepreneurs.com/advisory-board/", type: "guide", source: "For Entrepreneurs" },
      { title: "Hiring Plan Template", url: "https://www.workable.com/hr-templates/hiring-plan", type: "template", source: "Workable" }
    ],
    high: [
      { title: "Executive Compensation Benchmarks", url: "https://www.radford.com/", type: "tool", source: "Radford" },
      { title: "Scaling Leadership", url: "https://www.hbr.org/topic/subject/leadership", type: "article", source: "HBR" }
    ]
  },

  finances: {
    low: [
      { title: "Startup Financial Modeling 101", url: "https://www.score.org/resource/financial-projections-template", type: "template", source: "SCORE" },
      { title: "Burn Rate Calculator", url: "https://www.cobloom.com/resources/burn-rate-calculator", type: "tool", source: "Bloom" }
    ],
    mid: [
      { title: "Unit Economics Template", url: "https://www.cobloom.com/templates/unit-economics", type: "template", source: "Bloom" },
      { title: "Financial Projections for Startups", url: "https://www.forentrepreneurs.com/financial-projections/", type: "guide", source: "For Entrepreneurs" }
    ],
    high: [
      { title: "SaaS Financial Model 2.0", url: "https://www.cobloom.com/templates/saas-financial-model", type: "template", source: "Bloom" },
      { title: "Fundraising Strategy Guide", url: "https://www.ycombinator.com/library/4X-series-a-fundraising", type: "guide", source: "Y Combinator" }
    ]
  },

  ask: {
    low: [
      { title: "How Much Should You Raise?", url: "https://www.ycombinator.com/library/4Y-how-much-equity-to-give-investors", type: "guide", source: "Y Combinator" },
      { title: "Fundraising Terms Glossary", url: "https://www.investopedia.com/terms/v/venture-capital.asp", type: "guide", source: "Investopedia" }
    ],
    mid: [
      { title: "SAFE vs Convertible Note", url: "https://www.ycombinator.com/documents", type: "guide", source: "Y Combinator" },
      { title: "Pitch Deck Template", url: "https://www.ycombinator.com/library/4W-10-slides-to-raise-a-seed-round", type: "template", source: "Y Combinator" }
    ],
    high: [
      { title: "Term Sheet Negotiation", url: "https://www.gv.com/lib/the-venture-capital-term-sheet", type: "guide", source: "GV" },
      { title: "Valuation Methods for Startups", url: "https://www.forentrepreneurs.com/startup-valuation/", type: "guide", source: "For Entrepreneurs" }
    ]
  }
};

// Category guidance for wizard input help
export const categoryGuidance: Record<string, CategoryGuidance> = {
  business: {
    label: "Business Description",
    description: "What problem are you solving and for whom?",
    whatToInclude: [
      "The specific customer pain point you're addressing",
      "Your solution and how it works",
      "Your business model (how you make money)",
      "Why now is the right time"
    ],
    example: "We help SMBs reduce payment processing fees by 40% through intelligent routing. Our API integrates with existing checkout flows in <1 day. We charge 0.5% per transaction.",
    investorLens: "Is the problem real, urgent, and valuable enough that customers will pay?"
  },
  market: {
    label: "Market Analysis",
    description: "How big is the opportunity and why now?",
    whatToInclude: [
      "TAM/SAM/SOM with bottom-up calculations",
      "Market trends driving growth",
      "Your specific target segment",
      "Why timing matters"
    ],
    example: "$47B TAM (all SMB payments), $8B SAM (US e-commerce SMBs), $400M SOM (Year 3 target). Market growing 23% YoY as shift to online accelerates.",
    investorLens: "Is this market big enough to support a VC-scale outcome?"
  },
  product: {
    label: "Product / Service",
    description: "What have you built and what makes it defensible?",
    whatToInclude: [
      "Current state (idea, MVP, launched)",
      "Key features and differentiation",
      "Technology or IP advantages",
      "Product roadmap"
    ],
    example: "Live MVP with 12 beta users. Proprietary routing algorithm (patent pending). 99.9% uptime. Roadmap: international expansion Q2, enterprise features Q3.",
    investorLens: "Is this product meaningfully better than alternatives? Can it be copied?"
  },
  traction: {
    label: "Traction",
    description: "What evidence do you have that customers want this?",
    whatToInclude: [
      "Revenue, users, or engagement metrics",
      "Growth rate (MoM or YoY)",
      "Key customers or partnerships",
      "Retention or NPS if available"
    ],
    example: "$8K MRR, growing 25% MoM. 47 paying customers, 3 enterprise pilots. 95% retention, NPS of 72. Organic referral rate: 40%.",
    investorLens: "Is there real demand? Is growth sustainable or paid?"
  },
  competition: {
    label: "Competition",
    description: "Who else is in this space and why will you win?",
    whatToInclude: [
      "Direct and indirect competitors",
      "Your positioning vs. alternatives",
      "Sustainable competitive advantages",
      "Barriers to entry you're building"
    ],
    example: "Competing with Stripe (generalist) and manual ACH (status quo). We're 60% cheaper for SMBs >$50K/mo. Moat: network effects from routing data.",
    investorLens: "Do they understand the landscape? Can they actually win?"
  },
  gtm: {
    label: "Go-to-Market",
    description: "How will you acquire customers?",
    whatToInclude: [
      "Primary acquisition channels",
      "CAC and payback period",
      "Sales cycle length",
      "Distribution partnerships"
    ],
    example: "Inbound content (40% of leads), outbound SDRs (35%), partnerships (25%). CAC: $1,200. Payback: 8 months. Sales cycle: 45 days avg.",
    investorLens: "Is there a repeatable, scalable acquisition model?"
  },
  ops: {
    label: "Operations",
    description: "Can you execute and scale?",
    whatToInclude: [
      "Team structure and key hires",
      "Operational processes",
      "Technology infrastructure",
      "Scaling plans and bottlenecks"
    ],
    example: "8-person team (4 engineering, 2 sales, 2 ops). Automated onboarding. Scaling to 20 by Q4. Key hire: VP Sales (in process).",
    investorLens: "Can this team execute? What breaks as they 10x?"
  },
  team: {
    label: "Management / Team",
    description: "Why is this the right team to win?",
    whatToInclude: [
      "Founder backgrounds and relevant experience",
      "Key team members and their expertise",
      "Advisors or notable supporters",
      "Gaps and hiring plans"
    ],
    example: "CEO: ex-Stripe, led payments integration team. CTO: 10 yrs fintech, 2 exits. Advisor: former Visa SVP. Hiring: Head of Sales (Q1), 3 engineers (Q2).",
    investorLens: "Does this team have unique insight or advantage in this market?"
  },
  finances: {
    label: "Finances",
    description: "Where are you financially and where are you going?",
    whatToInclude: [
      "Current revenue and burn rate",
      "Runway with current capital",
      "Financial projections (12-24 months)",
      "Key assumptions behind projections"
    ],
    example: "$95K ARR, $15K/mo burn. 14 months runway. Projecting $600K ARR by EOY (conservative: 3 new customers/mo, 5% churn).",
    investorLens: "Are projections realistic? Do they understand unit economics?"
  },
  ask: {
    label: "The Ask",
    description: "What are you raising and what will it achieve?",
    whatToInclude: [
      "Amount raising and instrument (SAFE, equity, etc.)",
      "Use of funds breakdown",
      "Milestones to next round",
      "Current investor commitments"
    ],
    example: "Raising $2M on post-money SAFE. 50% engineering, 30% sales, 20% ops. Milestones: $50K MRR, 200 customers, Series A ready in 18 months. $400K committed.",
    investorLens: "Is this enough to reach meaningful milestones? What's the path to Series A?"
  }
};

// Rubric definitions for each score tier
export const scoringRubric = {
  critical: { range: "1-3", label: "Critical Gaps", description: "Missing fundamental elements. High risk. Needs immediate attention.", color: "rose" },
  belowAverage: { range: "4-5", label: "Below Average", description: "Some elements present but weak or unclear. Significant improvement needed.", color: "orange" },
  solid: { range: "6-7", label: "Solid", description: "Meets expectations. Clear thinking with minor gaps. Good foundation.", color: "indigo" },
  strong: { range: "8-9", label: "Strong", description: "Above average. Clear differentiation and execution. Well positioned.", color: "emerald" },
  exceptional: { range: "10", label: "Exceptional", description: "Best-in-class. Rare combination of insight, traction, and team.", color: "violet" }
};

// Helper functions
export function getResourcesForScore(category: string, score: number): Resource[] {
  const categoryResources = resourcesByCategory[category.toLowerCase()];
  if (!categoryResources) return [];
  if (score <= 4) return categoryResources.low;
  if (score <= 7) return categoryResources.mid;
  return categoryResources.high;
}

export function getRubricForScore(score: number) {
  if (score <= 3) return scoringRubric.critical;
  if (score <= 5) return scoringRubric.belowAverage;
  if (score <= 7) return scoringRubric.solid;
  if (score <= 9) return scoringRubric.strong;
  return scoringRubric.exceptional;
}

export function getGuidanceForCategory(categoryId: string): CategoryGuidance | null {
  return categoryGuidance[categoryId] || null;
}
