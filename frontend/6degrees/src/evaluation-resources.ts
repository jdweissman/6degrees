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

export const resourcesByCategory: Record<string, CategoryResources> = {
  business: {
    low: [
      {
        title: "Problem-Solution Fit: The Complete Guide",
        url: "https://www.ycombinator.com/library/4Q-problem-solution-fit",
        type: "guide",
        source: "Y Combinator"
      },
      {
        title: "Lean Canvas Template",
        url: "https://leanstack.com/leancanvas",
        type: "template",
        source: "Lean Stack"
      },
      {
        title: "How to Validate Your Startup Idea",
        url: "https://www.indiehackers.com/post/how-to-validate-your-startup-idea-before-building-anything-5d8c6b6c4a",
        type: "article",
        source: "Indie Hackers"
      }
    ],
    mid: [
      {
        title: "Business Model Canvas Explained",
        url: "https://strategyzer.com/canvas/business-model-canvas",
        type: "guide",
        source: "Strategyzer"
      },
      {
        title: "Value Proposition Design",
        url: "https://www.strategyzer.com/books/value-proposition-design",
        type: "guide",
        source: "Strategyzer"
      }
    ],
    high: [
      {
        title: "Unit Economics for SaaS",
        url: "https://www.cobloom.com/blog/unit-economics",
        type: "guide",
        source: "Bloom"
      },
      {
        title: "Scaling Business Models",
        url: "https://hbr.org/2020/06/how-to-design-a-winning-business-model",
        type: "article",
        source: "HBR"
      }
    ]
  },

  market: {
    low: [
      {
        title: "TAM SAM SOM: Market Sizing Guide",
        url: "https://www.investopedia.com/articles/investing/102115/what-total-addressable-market-tam.asp",
        type: "guide",
        source: "Investopedia"
      },
      {
        title: "Market Research for Startups",
        url: "https://www.score.org/resource/market-research-template",
        type: "template",
        source: "SCORE"
      }
    ],
    mid: [
      {
        title: "Bottom-Up Market Sizing",
        url: "https://www.forentrepreneurs.com/market-size/",
        type: "guide",
        source: "For Entrepreneurs"
      },
      {
        title: "Competitive Market Analysis Template",
        url: "https://www.smartsheet.com/competitive-analysis-templates",
        type: "template",
        source: "Smartsheet"
      }
    ],
    high: [
      {
        title: "Market Timing & Strategy",
        url: "https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/market-timing",
        type: "article",
        source: "McKinsey"
      },
      {
        title: "Category Creation Strategy",
        url: "https://www.playbook.com/blog/category-creation",
        type: "guide",
        source: "Playbook"
      }
    ]
  },

  product: {
    low: [
      {
        title: "MVP Development Guide",
        url: "https://www.ycombinator.com/library/5R-how-to-build-an-mvp",
        type: "guide",
        source: "Y Combinator"
      },
      {
        title: "Product Requirements Document Template",
        url: "https://www.productplan.com/learn/how-to-write-a-prd/",
        type: "template",
        source: "ProductPlan"
      }
    ],
    mid: [
      {
        title: "Product-Market Fit: The Only Guide You Need",
        url: "https://www.lennysnewsletter.com/p/whats-productmarket-fit-and-how-do",
        type: "guide",
        source: "Lenny's Newsletter"
      },
      {
        title: "Feature Prioritization Framework",
        url: "https://www.productboard.com/glossary/feature-prioritization/",
        type: "guide",
        source: "Productboard"
      }
    ],
    high: [
      {
        title: "Building Defensible Products",
        url: "https://a16z.com/2018/03/07/why-moats-matter/",
        type: "article",
        source: "a16z"
      },
      {
        title: "Product Strategy at Scale",
        url: "https://www.reforge.com/blog/product-strategy",
        type: "guide",
        source: "Reforge"
      }
    ]
  },

  traction: {
    low: [
      {
        title: "First 100 Customers Guide",
        url: "https://www.ycombinator.com/library/4V-how-to-get-your-first-100-customers",
        type: "guide",
        source: "Y Combinator"
      },
      {
        title: "Startup Metrics That Matter",
        url: "https://www.klipfolio.com/resources/articles/saas-metrics",
        type: "guide",
        source: "Klipfolio"
      }
    ],
    mid: [
      {
        title: "Growth Metrics Dashboard Template",
        url: "https://www.chartmogul.com/templates/growth-metrics/",
        type: "template",
        source: "ChartMogul"
      },
      {
        title: "The Traction Gap",
        url: "https://www.forentrepreneurs.com/traction-gap/",
        type: "guide",
        source: "For Entrepreneurs"
      }
    ],
    high: [
      {
        title: "Scaling Growth Engines",
        url: "https://www.reforge.com/blog/growth-engines",
        type: "guide",
        source: "Reforge"
      },
      {
        title: "SaaS Metrics 2.0",
        url: "https://www.cobloom.com/blog/saas-metrics-2",
        type: "guide",
        source: "Bloom"
      }
    ]
  },

  competition: {
    low: [
      {
        title: "Competitive Analysis for Startups",
        url: "https://www.score.org/resource/competitive-analysis-template",
        type: "template",
        source: "SCORE"
      },
      {
        title: "How to Research Your Competition",
        url: "https://www.entrepreneur.com/article/242968",
        type: "guide",
        source: "Entrepreneur"
      }
    ],
    mid: [
      {
        title: "Positioning Strategy Guide",
        url: "https://www.playbook.com/blog/positioning-strategy",
        type: "guide",
        source: "Playbook"
      },
      {
        title: "Competitive Moats Framework",
        url: "https://www.morningstar.com/articles/moat-investing",
        type: "guide",
        source: "Morningstar"
      }
    ],
    high: [
      {
        title: "Building Sustainable Competitive Advantage",
        url: "https://hbr.org/2008/07/creating-sustainable-competitive-advantage",
        type: "article",
        source: "HBR"
      },
      {
        title: "Network Effects Playbook",
        url: "https://www.nfx.com/post/network-effects-manual",
        type: "guide",
        source: "NFX"
      }
    ]
  },

  gtm: {
    low: [
      {
        title: "Go-to-Market Strategy Template",
        url: "https://www.productplan.com/learn/go-to-market-strategy/",
        type: "template",
        source: "ProductPlan"
      },
      {
        title: "Customer Acquisition 101",
        url: "https://www.hubspot.com/customer-acquisition",
        type: "guide",
        source: "HubSpot"
      }
    ],
    mid: [
      {
        title: "PLG vs Sales-Led Growth",
        url: "https://www.opentable.com/blog/plg-vs-sales-led/",
        type: "guide",
        source: "OpenView"
      },
      {
        title: "CAC Payback Period Calculator",
        url: "https://www.cobloom.com/resources/cac-payback-calculator",
        type: "tool",
        source: "Bloom"
      }
    ],
    high: [
      {
        title: "Enterprise Sales Playbook",
        url: "https://www.gong.io/resources/enterprise-sales-playbook/",
        type: "guide",
        source: "Gong"
      },
      {
        title: "Scaling Demand Generation",
        url: "https://www.demandcurve.com/playbooks",
        type: "guide",
        source: "Demand Curve"
      }
    ]
  },

  operations: {
    low: [
      {
        title: "Startup Operations Checklist",
        url: "https://www.score.org/resource/startup-operations-checklist",
        type: "template",
        source: "SCORE"
      },
      {
        title: "Building Your First Team",
        url: "https://www.ycombinator.com/library/5D-hiring-your-first-employees",
        type: "guide",
        source: "Y Combinator"
      }
    ],
    mid: [
      {
        title: "Operational Efficiency Metrics",
        url: "https://www.cobloom.com/blog/operational-efficiency",
        type: "guide",
        source: "Bloom"
      },
      {
        title: "Process Documentation Template",
        url: "https://www.notion.so/templates/sop",
        type: "template",
        source: "Notion"
      }
    ],
    high: [
      {
        title: "Scaling Operations",
        url: "https://www.mckinsey.com/capabilities/operations/our-insights/scaling-for-success",
        type: "article",
        source: "McKinsey"
      },
      {
        title: "Building High-Performance Teams",
        url: "https://rework.withgoogle.com/guides/understand-team-effectiveness/steps/learn-the-five-keys-to-a-successful-team/",
        type: "guide",
        source: "Google re:Work"
      }
    ]
  },

  team: {
    low: [
      {
        title: "Finding a Co-Founder",
        url: "https://www.ycombinator.com/library/4U-finding-a-cofounder",
        type: "guide",
        source: "Y Combinator"
      },
      {
        title: "Startup Equity Split Calculator",
        url: "https://www.slicingpie.com/",
        type: "tool",
        source: "Slicing Pie"
      }
    ],
    mid: [
      {
        title: "Building Your Advisory Board",
        url: "https://www.forentrepreneurs.com/advisory-board/",
        type: "guide",
        source: "For Entrepreneurs"
      },
      {
        title: "Hiring Plan Template",
        url: "https://www.workable.com/hr-templates/hiring-plan",
        type: "template",
        source: "Workable"
      }
    ],
    high: [
      {
        title: "Executive Compensation Benchmarks",
        url: "https://www.radford.com/",
        type: "tool",
        source: "Radford"
      },
      {
        title: "Scaling Leadership",
        url: "https://www.hbr.org/topic/subject/leadership",
        type: "article",
        source: "HBR"
      }
    ]
  },

  finances: {
    low: [
      {
        title: "Startup Financial Modeling 101",
        url: "https://www.score.org/resource/financial-projections-template",
        type: "template",
        source: "SCORE"
      },
      {
        title: "Burn Rate Calculator",
        url: "https://www.cobloom.com/resources/burn-rate-calculator",
        type: "tool",
        source: "Bloom"
      }
    ],
    mid: [
      {
        title: "Unit Economics Template",
        url: "https://www.cobloom.com/templates/unit-economics",
        type: "template",
        source: "Bloom"
      },
      {
        title: "Financial Projections for Startups",
        url: "https://www.forentrepreneurs.com/financial-projections/",
        type: "guide",
        source: "For Entrepreneurs"
      }
    ],
    high: [
      {
        title: "SaaS Financial Model 2.0",
        url: "https://www.cobloom.com/templates/saas-financial-model",
        type: "template",
        source: "Bloom"
      },
      {
        title: "Fundraising Strategy Guide",
        url: "https://www.ycombinator.com/library/4X-series-a-fundraising",
        type: "guide",
        source: "Y Combinator"
      }
    ]
  },

  ask: {
    low: [
      {
        title: "How Much Should You Raise?",
        url: "https://www.ycombinator.com/library/4Y-how-much-equity-to-give-investors",
        type: "guide",
        source: "Y Combinator"
      },
      {
        title: "Fundraising Terms Glossary",
        url: "https://www.investopedia.com/terms/v/venture-capital.asp",
        type: "guide",
        source: "Investopedia"
      }
    ],
    mid: [
      {
        title: "SAFE vs Convertible Note",
        url: "https://www.ycombinator.com/documents",
        type: "guide",
        source: "Y Combinator"
      },
      {
        title: "Pitch Deck Template",
        url: "https://www.ycombinator.com/library/4W-10-slides-to-raise-a-seed-round",
        type: "template",
        source: "Y Combinator"
      }
    ],
    high: [
      {
        title: "Term Sheet Negotiation",
        url: "https://www.gv.com/lib/the-venture-capital-term-sheet",
        type: "guide",
        source: "GV"
      },
      {
        title: "Valuation Methods for Startups",
        url: "https://www.forentrepreneurs.com/startup-valuation/",
        type: "guide",
        source: "For Entrepreneurs"
      }
    ]
  }
};

// Rubric definitions for each score tier
export const scoringRubric = {
  critical: {
    range: "1-3",
    label: "Critical Gaps",
    description: "Missing fundamental elements. High risk. Needs immediate attention.",
    color: "rose"
  },
  belowAverage: {
    range: "4-5",
    label: "Below Average",
    description: "Some elements present but weak or unclear. Significant improvement needed.",
    color: "orange"
  },
  solid: {
    range: "6-7",
    label: "Solid",
    description: "Meets expectations. Clear thinking with minor gaps. Good foundation.",
    color: "indigo"
  },
  strong: {
    range: "8-9",
    label: "Strong",
    description: "Above average. Clear differentiation and execution. Well positioned.",
    color: "emerald"
  },
  exceptional: {
    range: "10",
    label: "Exceptional",
    description: "Best-in-class. Rare combination of insight, traction, and team.",
    color: "violet"
  }
};

// Helper function to get resources based on score
export function getResourcesForScore(category: string, score: number): Resource[] {
  const categoryResources = resourcesByCategory[category.toLowerCase()];
  if (!categoryResources) return [];

  if (score <= 4) return categoryResources.low;
  if (score <= 7) return categoryResources.mid;
  return categoryResources.high;
}

// Helper function to get rubric info for a score
export function getRubricForScore(score: number) {
  if (score <= 3) return scoringRubric.critical;
  if (score <= 5) return scoringRubric.belowAverage;
  if (score <= 7) return scoringRubric.solid;
  if (score <= 9) return scoringRubric.strong;
  return scoringRubric.exceptional;
}
