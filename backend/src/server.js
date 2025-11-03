import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

const hero = {
  title: 'Unlock Your Business Potential',
  subtitle: 'Data-driven marketing campaigns that deliver measurable growth.',
  ctaPrimary: 'Get Started',
  ctaSecondary: 'View Case Studies',
  stats: [
    { label: 'Campaigns Launched', value: '1200+' },
    { label: 'Satisfied Clients', value: '500+' },
    { label: 'Average ROI', value: '340%' }
  ]
};

const advantages = [
  {
    title: 'Real-time analytics',
    description: 'Measure every click, conversion, and customer touchpoint with live dashboards.'
  },
  {
    title: 'Omni-channel strategies',
    description: 'Execute cohesive campaigns across search, social, email, and programmatic display.'
  },
  {
    title: 'Human + AI expertise',
    description: 'Blend award-winning strategists with machine learning models tuned for marketing.'
  },
  {
    title: 'Full funnel optimization',
    description: 'Drive awareness, engagement, and sales with tailored conversion journeys.'
  }
];

const differentiators = [
  {
    title: 'Industry leading onboarding',
    points: [
      'Kickoff workshop in under 48 hours',
      'Persona and messaging strategy in 1 week',
      'Launch-ready campaigns by day 14'
    ]
  },
  {
    title: 'Performance insights',
    points: [
      'Weekly growth playbooks',
      'Audience micro-segmentation',
      'Predictive lead scoring models'
    ]
  }
];

const reasons = [
  {
    title: 'Customizable technology stack',
    description: 'Integrate seamlessly with your CRM, CDP, and sales automation tools.'
  },
  {
    title: 'Transparent collaboration',
    description: 'Slack, dashboards, and quarterly business reviews keep everyone in sync.'
  },
  {
    title: 'Proven processes',
    description: 'Framework refined across SaaS, eCommerce, and enterprise clients.'
  },
  {
    title: 'Global delivery',
    description: 'Regional experts cover 30+ countries and 15 languages.'
  }
];

const products = [
  {
    name: 'DemandGen Accelerator',
    description: 'Launch multi-channel campaigns with creative, automation, and analytics included.',
    badge: 'Top Seller'
  },
  {
    name: 'Lifecycle Nurture Suite',
    description: 'Automated nurture flows tailored for trials, conversions, and retention.',
    badge: 'New'
  },
  {
    name: 'Commerce Growth Engine',
    description: 'Dynamic product ads, retargeting, and merchandising optimization for retailers.'
  }
];

const metrics = [
  { value: '12M+', label: 'Leads Generated' },
  { value: '250%', label: 'Average Pipeline Growth' },
  { value: '6.5x', label: 'Return on Ad Spend' },
  { value: '95%', label: 'Client Retention Rate' }
];

const faqs = [
  {
    question: 'What industries do you specialize in?',
    answer: 'We work with SaaS, FinTech, eCommerce, healthcare, and B2B service organizations.'
  },
  {
    question: 'How quickly can we launch?',
    answer: 'Most clients launch their first optimized campaigns within the first two weeks.'
  },
  {
    question: 'Do you offer performance guarantees?',
    answer: 'We set clear KPIs during onboarding and continuously iterate to exceed them.'
  }
];

const testimonials = [
  {
    quote: 'VEDX tripled our inbound opportunities within three months and gave us reporting our board loves.',
    author: 'Priya Shah',
    role: 'VP of Marketing, Aethon Labs'
  },
  {
    quote: 'The blend of strategy, creative, and data science is unmatched. They feel like an extension of our team.',
    author: 'Chris Douglas',
    role: 'Head of Growth, Stratus AI'
  }
];

app.get('/api/hero', (_req, res) => {
  res.json(hero);
});

app.get('/api/advantages', (_req, res) => {
  res.json(advantages);
});

app.get('/api/differentiators', (_req, res) => {
  res.json(differentiators);
});

app.get('/api/reasons', (_req, res) => {
  res.json(reasons);
});

app.get('/api/products', (_req, res) => {
  res.json(products);
});

app.get('/api/metrics', (_req, res) => {
  res.json(metrics);
});

app.get('/api/faqs', (_req, res) => {
  res.json(faqs);
});

app.get('/api/testimonials', (_req, res) => {
  res.json(testimonials);
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'VEDX Solutions marketing API' });
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});