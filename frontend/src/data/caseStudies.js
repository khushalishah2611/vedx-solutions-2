export const caseStudiesList = [
  {
    slug: 'papa-johns-pizza-delivery-app',
    title: "Papa John's Pizza Delivery App",
    category: 'Food Delivery Platform',
    summary:
      'Revamped Papa John\'s ordering experience with location intelligence, driver tracking, and a rewards-led checkout.',
    heroImage:
      'https://images.unsplash.com/photo-1606755962773-0e7d12c0d2e8?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#FF7849',
    tags: ['Mobile App', 'Logistics', 'Customer Experience'],
  },
  {
    slug: 'astral-adhesives-resinwood-winners-circle',
    title: "Astral Adhesives – Resinwood Winner's Circle",
    category: 'Industrial Loyalty Solution',
    summary:
      'Digitized on-the-go loyalty accruals for contractors with QR validation, partner promos, and analytics dashboards.',
    heroImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#38BDF8',
    tags: ['Gamification', 'Analytics', 'CX'],
  },
  {
    slug: 'art-of-living-meditation-app',
    title: 'Art of Living Meditation App',
    category: 'Wellness & Lifestyle',
    summary:
      'A serene platform blending guided meditations, SKY journeys, and community meetups for global practitioners.',
    heroImage:
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#3E7CCE',
    tags: ['iOS', 'Android', 'Mindfulness'],
  },
];

const artOfLivingCaseStudy = {
  slug: 'art-of-living-meditation-app',
  title: 'Art of Living Meditation App',
  category: 'Mobile App Development',
  tagline: 'From Inception to Success - Watch the Whole Story!',
  heroImage:
    'https://images.unsplash.com/photo-1529676468690-6c88a0fee6ca?auto=format&fit=crop&w=1600&q=80',
  accentColor: '#3E7CCE',
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Case Studies', href: '/casestudy' },
    { label: 'Art of Living Meditation App' },
  ],
  meta: [
    { label: 'Client', value: 'The Art of Living Foundation' },
    { label: 'Industry', value: 'Health & Wellness' },
    { label: 'Platforms', value: 'iOS & Android' },
    { label: 'Services', value: 'Product Strategy, UI/UX, Mobile Engineering' },
  ],
  excerpt:
    'Gurudev Sri Sri Ravi Shankar envisioned a stress-free, violence-free society. To reach millions seeking calm amidst a digital lifestyle, we created a unified mobile experience for yoga, meditation, knowledge nuggets, and community meetups.',
  cta: {
    label: 'Plan your next product with us',
    href: '/contact',
  },
  clientRequirements: [
    'Gurudev Sri Sri Ravi Shankar established The Art of Living as an international, non-profit, educational, and humanitarian organization. His teachings unite millions of people worldwide through service projects and transformative programs.',
    'The Art of Living team recognized that a mobile application would help global practitioners sustain regular yoga and meditation habits. They partnered with us to transform their vision into an intuitive product that offers guided practices, knowledge nuggets, and community engagement within a single platform.',
    'After gathering the requirements around front-end experience and visual design, our team rapidly iterated on prototypes, planned the release roadmap, and delivered the production-ready application within the agreed timeline.',
  ],
  founderHighlight: {
    name: 'Gurudev Sri Sri Ravi Shankar',
    message:
      'Humanitarian leader, spiritual teacher, and ambassador of peace whose vision inspired a digital companion for daily wellbeing.',
  },
  coreFeatures: [
    {
      title: 'Authentication',
      description:
        'Streamlined onboarding lets seekers register with essential details or instantly sign in via Google and Facebook for frictionless access.',
    },
    {
      title: 'From Instructors',
      description:
        'High-definition video lessons connect users with world-class meditation instructors so they can learn and revisit techniques anytime.',
    },
    {
      title: 'Expeditions',
      description:
        'Guided mini-courses help reduce stress, enhance focus, and manage emotions through a blend of practical wisdom and breathing practices.',
    },
    {
      title: 'Meditations',
      description:
        'Curated 5–10 minute sessions, including bedtime talks, help users build a daily habit and unwind into deep, restorative sleep.',
    },
    {
      title: 'Home Experience',
      description:
        'The personalized home dashboard surfaces the latest journeys, featured talks, and reminders so practitioners stay on track every day.',
    },
  ],
  journeyHighlight: {
    title: 'Sky Journey',
    description:
      'We engineered a playful zig-zag progress tracker that guides practitioners through the SKY Breathing Technique. Every successful session unlocks the next level, motivating a 100-day streak without overwhelming the user.',
  },
  advancedContent: [
    {
      title: 'Wisdom from Sri Sri Ravi Shankar',
      description:
        'Bite-sized knowledge nuggets deliver timeless wisdom in a modern context, helping users integrate ancient teachings into daily life.',
    },
    {
      title: 'Meetups',
      description:
        'Location-aware meetups allow seekers to RSVP, register, and contribute payments directly in the app so they can meditate together as a community.',
    },
    {
      title: 'Workshops',
      description:
        'Participants can explore upcoming workshops, secure their seats, and manage payments digitally—keeping offline events organized and full.',
    },
  ],
  colors: [
    { label: 'Primary Blue', value: '#3E7CCE', usage: 'Buttons, highlights, and progress accents for a calm yet confident tone.' },
    { label: 'Deep Charcoal', value: '#000000', usage: 'Primary typography to ensure focus and readability.' },
    { label: 'Soft Grey', value: '#CCCCCC', usage: 'Secondary text and divider treatments across light surfaces.' },
  ],
  typography: {
    family: 'Work Sans',
    description:
      'A humanist sans-serif chosen for its balance of warmth and clarity across dense content and guided instructions.',
  },
  challenges: [
    'Designing a snake-like 100-level journey for the SKY breathing experience required custom mathematics to deliver precise zig-zag positioning while maintaining responsiveness across devices.',
    'We combined advanced canvas rendering and performance tuning so the progressive levels animate smoothly without impacting load time.',
  ],
  technologyStack: ['Android', 'iOS', 'Swift', 'Xcode', 'Heroku'],
};

export const caseStudiesBySlug = {
  [artOfLivingCaseStudy.slug]: artOfLivingCaseStudy,
};

export const featuredCaseStudies = caseStudiesList;
