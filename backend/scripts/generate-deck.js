// Generate 6degrees Pitch Deck
import pptxgen from 'pptxgenjs';

const pres = new pptxgen();

// Design System
const COLORS = {
  navy: '1E2761',
  iceBlue: 'CADCFC',
  white: 'FFFFFF',
  coral: 'F96167',
  charcoal: '36454F',
  teal: '028090',
  lightGray: 'F5F5F5'
};

const FONTS = {
  header: 'Arial Black',
  body: 'Calibri',
  accent: 'Georgia'
};

// Slide Master
pres.defineSlideMaster({
  title: 'MASTER',
  background: { color: COLORS.white },
  objects: [
    { rect: { x: 0, y: 0, w: '100%', h: 0.5 }, fill: { color: COLORS.navy } },
    { text: { text: '6degrees', options: { x: 0.5, y: 0.15, fontSize: 18, color: COLORS.white, bold: true, fontFace: FONTS.header } } }
  ]
});

// ============ SLIDE 1: Title ============
{
  const slide = pres.addSlide({ background: { color: COLORS.navy } });
  slide.addText('6degrees', {
    x: 0.5, y: 2, w: 9, h: 1.5,
    fontSize: 72, bold: true, color: COLORS.white, fontFace: FONTS.header,
    align: 'center'
  });
  slide.addText('AI-Powered Fundraising Intelligence', {
    x: 0.5, y: 3.5, w: 9, h: 0.5,
    fontSize: 24, color: COLORS.iceBlue, fontFace: FONTS.body,
    align: 'center'
  });
  slide.addText('Seed Investment Opportunity', {
    x: 0.5, y: 6.5, w: 9, h: 0.3,
    fontSize: 14, color: COLORS.iceBlue, fontFace: FONTS.body,
    align: 'center'
  });
}

// ============ SLIDE 2: Problem ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('The Problem', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  slide.addText('Fundraising is broken for founders', {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 18, color: COLORS.charcoal, fontFace: FONTS.body, italic: true
  });
  
  const problems = [
    'Founders manage 50-100+ investor conversations across email, spreadsheets, and Calendly',
    'No visibility into which investors are the best fit for their startup',
    'Generic pitch feedback — "needs more traction" without actionable specifics',
    'Warm intros are invisible — founders don\'t know who they know at target firms',
    'Result: 6-12 month fundraising cycles with 2-5% success rates'
  ];
  
  problems.forEach((p, idx) => {
    slide.addText(p, {
      x: 0.7, y: 2 + (idx * 0.55), w: 8.5, h: 0.45,
      fontSize: 16, color: COLORS.charcoal, fontFace: FONTS.body,
      bullet: idx > 0
    });
  });
}

// ============ SLIDE 3: Solution ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('The Solution', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  slide.addText('Three products in one platform', {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 18, color: COLORS.charcoal, fontFace: FONTS.body, italic: true
  });
  
  const features = [
    { icon: '📊', title: 'Startup Evaluation', desc: 'AI-powered pitch analysis using the same 10 categories Bay Area angels use' },
    { icon: '🎯', title: 'Investor Matching', desc: 'Score investors by fit — stage, sector, check size, and portfolio overlap' },
    { icon: '💼', title: 'Fundraising CRM', desc: 'Track every interaction, never miss a followup, manage your pipeline' }
  ];
  
  features.forEach((f, idx) => {
    const y = 2.2 + (idx * 1.2);
    slide.addText(f.icon, { x: 0.7, y, w: 0.5, h: 0.5, fontSize: 28 });
    slide.addText(f.title, {
      x: 1.3, y, w: 3.5, h: 0.4,
      fontSize: 18, bold: true, color: COLORS.navy, fontFace: FONTS.header
    });
    slide.addText(f.desc, {
      x: 1.3, y: y + 0.4, w: 3.5, h: 0.6,
      fontSize: 14, color: COLORS.charcoal, fontFace: FONTS.body
    });
  });
}

// ============ SLIDE 4: The 10 Categories ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('The Secret Sauce', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  slide.addText('10 categories from Bay Area angel investors', {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 18, color: COLORS.charcoal, fontFace: FONTS.body, italic: true
  });
  
  const categories = [
    ['Business', 'Problem-solution fit, value prop'],
    ['Market', 'TAM/SAM/SOM, timing, trends'],
    ['Product', 'Differentiation, roadmap, moat'],
    ['Traction', 'Revenue, users, growth, retention'],
    ['Competition', 'Landscape, positioning, defensibility'],
    ['Go-to-Market', 'Channels, CAC, sales process'],
    ['Operations', 'Execution capability, scalability'],
    ['Team', 'Experience, gaps, advisors'],
    ['Finances', 'Projections, unit economics, runway'],
    ['The Ask', 'Amount, milestones, use of funds']
  ];
  
  categories.forEach((cat, idx) => {
    const col = idx < 5 ? 0 : 1;
    const row = idx % 5;
    const x = col === 0 ? 0.5 : 5.2;
    const y = 2 + (row * 0.75);
    
    slide.addText(cat[0], {
      x, y, w: 4, h: 0.35,
      fontSize: 16, bold: true, color: COLORS.teal, fontFace: FONTS.header
    });
    slide.addText(cat[1], {
      x, y: y + 0.35, w: 4, h: 0.3,
      fontSize: 13, color: COLORS.charcoal, fontFace: FONTS.body
    });
  });
}

// ============ SLIDE 5: Product Demo ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('Live Product', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  slide.addText('Evaluation is working now', {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 18, color: COLORS.charcoal, fontFace: FONTS.body, italic: true
  });
  
  slide.addText('What founders get:', {
    x: 0.5, y: 2, w: 4, h: 0.4,
    fontSize: 16, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  
  const features = [
    'Score for each of 10 categories (1-10)',
    'Specific feedback: "You stated $100B TAM but didn\'t show calculation"',
    'Actionable improvements: "Add bottom-up TAM: # customers × price/year"',
    'Curated resources based on weak areas',
    'Overall assessment + recommended next steps'
  ];
  
  features.forEach((f, idx) => {
    slide.addText(f, {
      x: 0.7, y: 2.5 + (idx * 0.55), w: 4, h: 0.45,
      fontSize: 14, color: COLORS.charcoal, fontFace: FONTS.body,
      bullet: true
    });
  });
}

// ============ SLIDE 6: CRM Feature ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('Coming Next: Fundraising CRM', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  slide.addText('Manage your pipeline, not a spreadsheet', {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 18, color: COLORS.charcoal, fontFace: FONTS.body, italic: true
  });
  
  const crmFeatures = [
    { title: 'Pipeline View', desc: 'Kanban board: researching → contacted → meeting → DD → term sheet' },
    { title: 'Interaction Logging', desc: 'Track every email, call, meeting with notes and followups' },
    { title: 'Smart Reminders', desc: 'Never forget to follow up — alerts for stalled conversations' },
    { title: 'Outreach Templates', desc: 'Pre-written emails for cold outreach, followups, intro requests' },
    { title: 'Meeting Prep', desc: 'Auto-generated brief: investor thesis, portfolio, prior interactions' }
  ];
  
  crmFeatures.forEach((f, idx) => {
    const y = 2 + (idx * 0.75);
    slide.addText(f.title, {
      x: 0.7, y, w: 8.5, h: 0.3,
      fontSize: 14, bold: true, color: COLORS.teal, fontFace: FONTS.header
    });
    slide.addText(f.desc, {
      x: 0.7, y: y + 0.3, w: 8.5, h: 0.35,
      fontSize: 13, color: COLORS.charcoal, fontFace: FONTS.body
    });
  });
  
  slide.addText('Phase 1 MVP: 4 weeks to launch', {
    x: 0.5, y: 5.8, w: 4, h: 0.3,
    fontSize: 12, color: COLORS.navy, fontFace: FONTS.body, italic: true
  });
}

// ============ SLIDE 7: Market ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('Market Opportunity', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  
  const stats = [
    { label: 'Startups raising annually (US)', value: '500,000+', color: COLORS.navy },
    { label: 'Active angel investors', value: '300,000+', color: COLORS.teal },
    { label: 'VC-backed deals/year', value: '~12,000', color: COLORS.coral }
  ];
  
  stats.forEach((stat, idx) => {
    const x = 0.5 + (idx * 3);
    slide.addText(stat.value, {
      x, y: 2, w: 2.8, h: 0.6,
      fontSize: 36, bold: true, color: stat.color, fontFace: FONTS.header, align: 'center'
    });
    slide.addText(stat.label, {
      x, y: 2.7, w: 2.8, h: 0.4,
      fontSize: 14, color: COLORS.charcoal, fontFace: FONTS.body, align: 'center'
    });
  });
  
  slide.addText('TAM: $2.5B (fundraising software + investor intelligence)', {
    x: 0.5, y: 4, w: 9, h: 0.4,
    fontSize: 16, bold: true, color: COLORS.navy, fontFace: FONTS.header, align: 'center'
  });
}

// ============ SLIDE 8: Business Model ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('Business Model', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  slide.addText('Freemium → Premium → Enterprise', {
    x: 0.5, y: 1.4, w: 9, h: 0.4,
    fontSize: 18, color: COLORS.charcoal, fontFace: FONTS.body, italic: true
  });
  
  const tiers = [
    { name: 'Free', price: '$0', features: ['1 evaluation/month', 'Basic investor search', '5 CRM contacts'] },
    { name: 'Founder Pro', price: '$49/mo', features: ['Unlimited evaluations', 'Full investor matching', 'Unlimited CRM'] },
    { name: 'Investor', price: '$199/mo', features: ['Deal flow alerts', 'Curated startups (8+ score)', 'Portfolio tracking'] }
  ];
  
  tiers.forEach((tier, idx) => {
    const x = 0.5 + (idx * 3.2);
    const isPro = idx === 1;
    
    slide.addShape(pres.ShapeType.rect, {
      x, y: 2, w: 3, h: 3.2,
      fill: { color: isPro ? COLORS.navy : COLORS.lightGray },
      line: { color: COLORS.navy, width: 2 }
    });
    
    slide.addText(tier.name, {
      x: x + 0.2, y: 2.2, w: 2.6, h: 0.4,
      fontSize: 18, bold: true, color: isPro ? COLORS.white : COLORS.navy, fontFace: FONTS.header, align: 'center'
    });
    slide.addText(tier.price, {
      x: x + 0.2, y: 2.7, w: 2.6, h: 0.5,
      fontSize: 28, bold: true, color: isPro ? COLORS.coral : COLORS.charcoal, fontFace: FONTS.header, align: 'center'
    });
    
    tier.features.forEach((f, fidx) => {
      slide.addText(f, {
        x: x + 0.2, y: 3.3 + (fidx * 0.5), w: 2.6, h: 0.35,
        fontSize: 12, color: isPro ? COLORS.iceBlue : COLORS.charcoal, fontFace: FONTS.body,
        bullet: true
      });
    });
  });
}

// ============ SLIDE 9: Go-to-Market ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('Go-to-Market', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  
  const channels = [
    { channel: 'Content Marketing', tactic: 'Build-in-public series on LinkedIn/X (3-5 posts/week)' },
    { channel: 'Accelerator Partnerships', tactic: 'Free tier for YC, Techstars, a16z Speedrun cohorts' },
    { channel: 'Angel Syndicates', tactic: 'Investor tier for AngelList syndicate leads' },
    { channel: 'Product-Led Growth', tactic: 'Free evaluation → viral sharing → upgrade' }
  ];
  
  channels.forEach((c, idx) => {
    const y = 2 + (idx * 0.9);
    slide.addText(c.channel, {
      x: 0.7, y, w: 8.5, h: 0.35,
      fontSize: 14, bold: true, color: COLORS.navy, fontFace: FONTS.header
    });
    slide.addText(c.tactic, {
      x: 0.7, y: y + 0.35, w: 8.5, h: 0.45,
      fontSize: 13, color: COLORS.charcoal, fontFace: FONTS.body
    });
  });
  
  slide.addText('Goal: 1,000 active founders in 90 days → $2,500 MRR', {
    x: 0.5, y: 5.8, w: 9, h: 0.4,
    fontSize: 16, bold: true, color: COLORS.coral, fontFace: FONTS.header, align: 'center'
  });
}

// ============ SLIDE 10: Competition ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('Competitive Landscape', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  
  const headers = ['Product', 'Strength', 'Weakness'];
  headers.forEach((h, idx) => {
    const x = [0.5, 3, 6][idx];
    slide.addText(h, {
      x, y: 1.6, w: 2.5, h: 0.3,
      fontSize: 12, bold: true, color: COLORS.navy, fontFace: FONTS.header
    });
  });
  
  const competitors = [
    { name: 'Affinity', strength: 'Enterprise CRM', weakness: '$100+/mo, no evaluation' },
    { name: 'DocSend', strength: 'Deck tracking', weakness: 'No CRM, no investor intel' },
    { name: 'Crunchbase', strength: 'Investor database', weakness: 'No workflow tools' },
    { name: '6degrees', strength: 'All-in-one + AI evaluation', weakness: 'New, unproven' }
  ];
  
  competitors.forEach((c, idx) => {
    const y = 2 + (idx * 0.6);
    const is6degrees = idx === 3;
    
    slide.addText(c.name, {
      x: 0.5, y, w: 2.5, h: 0.3,
      fontSize: 13, bold: true, color: is6degrees ? COLORS.teal : COLORS.charcoal, fontFace: FONTS.header
    });
    slide.addText(c.strength, {
      x: 3, y, w: 3, h: 0.3,
      fontSize: 12, color: COLORS.charcoal, fontFace: FONTS.body
    });
    slide.addText(c.weakness, {
      x: 6, y, w: 3, h: 0.3,
      fontSize: 12, color: is6degrees ? COLORS.coral : COLORS.charcoal, fontFace: FONTS.body
    });
  });
}

// ============ SLIDE 11: Roadmap ============
{
  const slide = pres.addSlide({ masterName: 'MASTER' });
  slide.addText('Roadmap', {
    x: 0.5, y: 0.7, w: 9, h: 0.8,
    fontSize: 36, bold: true, color: COLORS.navy, fontFace: FONTS.header
  });
  
  const quarters = [
    { q: 'Q1 2026', items: ['Evaluation live', 'CRM MVP launch', '100 beta users'] },
    { q: 'Q2 2026', items: ['Outreach templates', 'Accelerator partnerships', '1,000 users'] },
    { q: 'Q3 2026', items: ['Investor tier launch', 'Email integrations', '5,000 users'] },
    { q: 'Q4 2026', items: ['Analytics dashboard', 'Mobile app', 'Series A prep'] }
  ];
  
  quarters.forEach((q, idx) => {
    const x = 0.5 + (idx * 2.4);
    slide.addShape(pres.ShapeType.rect, {
      x, y: 2, w: 2.2, h: 3.2,
      fill: { color: COLORS.lightGray },
      line: { color: COLORS.navy, width: 1 }
    });
    
    slide.addText(q.q, {
      x: x + 0.2, y: 2.2, w: 1.8, h: 0.4,
      fontSize: 16, bold: true, color: COLORS.navy, fontFace: FONTS.header, align: 'center'
    });
    
    q.items.forEach((item, iidx) => {
      slide.addText(item, {
        x: x + 0.2, y: 2.7 + (iidx * 0.55), w: 1.8, h: 0.35,
        fontSize: 12, color: COLORS.charcoal, fontFace: FONTS.body,
        bullet: true
      });
    });
  });
}

// ============ SLIDE 12: The Ask ============
{
  const slide = pres.addSlide({ background: { color: COLORS.navy } });
  
  slide.addText('The Ask', {
    x: 0.5, y: 1, w: 9, h: 1,
    fontSize: 48, bold: true, color: COLORS.white, fontFace: FONTS.header, align: 'center'
  });
  
  slide.addText('$500K Seed', {
    x: 0.5, y: 2.2, w: 9, h: 0.8,
    fontSize: 56, bold: true, color: COLORS.coral, fontFace: FONTS.header, align: 'center'
  });
  
  slide.addText('18 months runway to Series A', {
    x: 0.5, y: 3.2, w: 9, h: 0.4,
    fontSize: 18, color: COLORS.iceBlue, fontFace: FONTS.body, align: 'center'
  });
  
  const useOfFunds = [
    { item: 'Engineering (2 FTEs)', pct: '60%' },
    { item: 'GTM + Marketing', pct: '25%' },
    { item: 'Operations + Legal', pct: '15%' }
  ];
  
  useOfFunds.forEach((u, idx) => {
    const y = 4 + (idx * 0.6);
    slide.addText(u.item, {
      x: 2, y, w: 5, h: 0.4,
      fontSize: 16, color: COLORS.white, fontFace: FONTS.body
    });
    slide.addText(u.pct, {
      x: 7.5, y, w: 1.5, h: 0.4,
      fontSize: 16, bold: true, color: COLORS.coral, fontFace: FONTS.header, align: 'right'
    });
  });
  
  slide.addText('Milestone: $50K MRR, 5,000 active users', {
    x: 0.5, y: 6, w: 9, h: 0.4,
    fontSize: 14, color: COLORS.iceBlue, fontFace: FONTS.body, align: 'center', italic: true
  });
}

// ============ SLIDE 13: Contact ============
{
  const slide = pres.addSlide({ background: { color: COLORS.navy } });
  
  slide.addText('Let\'s Build', {
    x: 0.5, y: 2.5, w: 9, h: 1,
    fontSize: 48, bold: true, color: COLORS.white, fontFace: FONTS.header, align: 'center'
  });
  
  slide.addText('6degrees.ai', {
    x: 0.5, y: 3.8, w: 9, h: 0.5,
    fontSize: 24, color: COLORS.iceBlue, fontFace: FONTS.body, align: 'center'
  });
  
  slide.addText('Jesse Weissman | jdweissman@gmail.com', {
    x: 0.5, y: 6.5, w: 9, h: 0.3,
    fontSize: 14, color: COLORS.iceBlue, fontFace: FONTS.body, align: 'center'
  });
}

// Save the presentation
pres.writeFile({ fileName: '6degrees-Pitch-Deck.pptx' })
  .then(() => console.log('✅ Deck generated: 6degrees-Pitch-Deck.pptx'))
  .catch(err => console.error('❌ Error:', err));
