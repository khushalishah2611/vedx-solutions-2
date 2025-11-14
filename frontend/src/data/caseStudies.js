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

const papaJohnsCaseStudy = {
  slug: 'papa-johns-pizza-delivery-app',
  title: "Papa John's Pizza Delivery App",
  category: 'Food Delivery Platform',
  tagline: 'Delivering crave-worthy pizza experiences without the wait.',
  heroImage:
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
  accentColor: '#FF7849',
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Case Studies', href: '/casestudy' },
    { label: "Papa John's Pizza Delivery App" },
  ],
  meta: [
    { label: 'Client', value: "Papa John's International" },
    { label: 'Industry', value: 'Quick Service Restaurant' },
    { label: 'Platforms', value: 'iOS, Android & Web' },
    { label: 'Services', value: 'CX Strategy, Mobile Engineering, Cloud Ops' },
  ],
  excerpt:
    "Rebuilt Papa John's digital ordering stack to reward loyalists, track couriers in real-time, and shrink delivery ETA across 4,500+ stores.",
  cta: {
    label: 'Build your commerce platform',
    href: '/contact',
  },
  clientRequirements: [
    "Papa John's needed a unified ordering journey across native apps, mobile web, and in-store kiosks while keeping loyalty redemptions front and center.",
    'Marketing teams wanted richer personalization and the ability to launch national offers in minutes without waiting on app store approvals.',
    'Operations required precise courier handoffs, automated heat maps for kitchen load, and consistent reliability during peak sports events.',
  ],
  founderHighlight: {
    name: 'Leadership Team, Papa John\'s',
    message:
      '“VedX compressed our release cycle from months to sprints while keeping the brand’s hospitality alive in every interaction.”',
  },
  coreFeatures: [
    {
      title: 'Unified Ordering Cart',
      description:
        'A shared cart across web and native surfaces syncs toppings, coupons, and addresses instantly via GraphQL streaming.',
    },
    {
      title: 'Delivery Command Center',
      description:
        'Operations dashboards blend telematics, kitchen queueing, and driver ETAs to predict late deliveries before they happen.',
    },
    {
      title: 'Rewards Wallet',
      description:
        'Loyalty points, surprise-and-delight offers, and birthday perks live in a gamified wallet that nudges repeat orders.',
    },
    {
      title: 'Fraud-Resistant Payments',
      description:
        'Tokenized cards, 3DS, and wallet integrations secure payments across high-volume campaigns without slowing checkout.',
    },
    {
      title: 'Kitchen Load Balancing',
      description:
        'AI-assisted throttling staggers new orders when ovens hit capacity, routing customers to nearby stores automatically.',
    },
  ],
  journeyHighlight: {
    title: 'From Craving to Curbside in 20 Minutes',
    description:
      'Location intelligence clusters customers, predicts prep time, and sequences drivers so pizzas leave the oven exactly when riders arrive.',
  },
  screenshots: [
    {
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      alt: 'Pizza delivery app showing featured offers and deal carousel',
      caption: 'Personalised home feed surfaces lunchtime bundles, live offers, and nearby store hours.',
    },
    {
      src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
      alt: 'Mobile checkout flow with multiple payment methods',
      caption: 'Checkout consolidates saved addresses, wallets, and gift cards with a single confirmation step.',
    },
    {
      src: 'https://images.unsplash.com/photo-1533777419517-3e4017e2e15b?auto=format&fit=crop&w=1200&q=80',
      alt: 'Courier tracking screen with live map view',
      caption: 'Customers watch their courier on a live map complete with ETA confidence intervals.',
    },
    {
      src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      alt: 'Analytics dashboard with delivery performance metrics',
      caption: 'Executive dashboards highlight order spikes, kitchen load, and driver productivity in real time.',
    },
    {
      src: 'https://images.unsplash.com/photo-1533025781654-97f23cb85748?auto=format&fit=crop&w=1200&q=80',
      alt: 'Loyalty rewards wallet interface',
      caption: 'The Papa Rewards wallet turns every slice into progress toward freebies and limited-time drops.',
    },
  ],
  advancedContent: [
    {
      title: 'Smart Coupons',
      description:
        'Dynamic offers test creative, track incremental revenue, and auto-expire when margins dip below guardrails.',
    },
    {
      title: 'Stadium Mode',
      description:
        'Geo-fenced bundles trigger when fans enter arenas, syncing with kitchens closest to the venue.',
    },
    {
      title: 'Operator Assist',
      description:
        'An AI co-pilot suggests staffing levels, oven temps, and delivery batching based on historical demand.',
    },
  ],
  colors: [
    { label: 'Papa Red', value: '#C8102E', usage: 'Primary call-to-action buttons and accents.' },
    { label: 'Fresh Basil', value: '#3CA55C', usage: 'Positive states, savings callouts, and loyalty progress.' },
    { label: 'Crust Charcoal', value: '#2E2A27', usage: 'Foundational typography and background gradients.' },
  ],
  typography: {
    family: 'Source Sans Pro',
    description:
      'Friendly curves and high legibility keep ingredient-heavy menus delightful on mobile screens.',
  },
  challenges: [
    'Black Friday volumes required resilient auto-scaling that kept p95 latency under 300 ms.',
    'Legacy POS integrations demanded a phased rollout with blue/green deployments per store cluster.',
  ],
  technologyStack: ['React Native', 'Next.js', 'GraphQL', 'AWS Lambda', 'Datadog'],
};

const astralAdhesivesCaseStudy = {
  slug: 'astral-adhesives-resinwood-winners-circle',
  title: "Astral Adhesives – Resinwood Winner's Circle",
  category: 'Channel Loyalty Platform',
  tagline: 'Rewarding contractors the moment materials hit the job site.',
  heroImage:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
  accentColor: '#38BDF8',
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Case Studies', href: '/casestudy' },
    { label: "Astral Adhesives – Resinwood Winner's Circle" },
  ],
  meta: [
    { label: 'Client', value: 'Astral Adhesives' },
    { label: 'Industry', value: 'Building Materials' },
    { label: 'Platforms', value: 'Android, iOS, Web' },
    { label: 'Services', value: 'Product Design, Gamification, Martech Integrations' },
  ],
  excerpt:
    'Astral needed a digitised loyalty program that motivated contractors to scan product QR codes, join workshops, and unlock tiered benefits in every region.',
  cta: {
    label: 'Design your loyalty engine',
    href: '/contact',
  },
  clientRequirements: [
    'Create a simplified onboarding flow for dealers and contractors in tier-2 cities with patchy connectivity.',
    'Enable offline QR capture that syncs automatically when the device regains network access.',
    'Introduce a narrative-led rewards journey that mixes contests, training, and cashback without overwhelming users.',
  ],
  founderHighlight: {
    name: 'Channel Excellence Office, Astral',
    message:
      '“From the first scan to mega rewards, VedX helped us celebrate every partner while capturing data we never had access to before.”',
  },
  coreFeatures: [
    {
      title: 'QR Scan & Earn',
      description:
        'Offline-first scanning captures batch IDs, photos, and geo-stamps so authenticity is verified instantly.',
    },
    {
      title: 'Tiered Leaderboards',
      description:
        'Regional leaderboards showcase top performers and encourage healthy competition within dealer circles.',
    },
    {
      title: 'Workshop Academy',
      description:
        'In-app micro-learning unlocks bonus points, certifications, and product launch previews.',
    },
    {
      title: 'Claims & Payouts',
      description:
        'Automated claim workflows route high-value rewards for review while small wins trigger instant payouts.',
    },
    {
      title: 'Insights Hub',
      description:
        'Head office dashboards merge scan velocity, lead submissions, and redemption health into a single view.',
    },
  ],
  journeyHighlight: {
    title: 'Level Up from Rookie to Resinwood Champion',
    description:
      'A playful ladder guides partners through milestone badges, partner events, and exclusive experiences as they progress.',
  },
  screenshots: [
    {
      src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      alt: 'Contractor loyalty app onboarding screens',
      caption: 'Two-step onboarding helps dealers choose their business type and regional language instantly.',
    },
    {
      src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
      alt: 'Loyalty dashboard with progress indicators',
      caption: 'Dashboard tiles celebrate weekly scans, contest invites, and upcoming workshops.',
    },
    {
      src: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&w=1200&q=80',
      alt: 'QR scanning interface capturing product code',
      caption: 'Offline QR capture stores a proof-of-purchase pack until signal is restored.',
    },
    {
      src: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Leaderboard view with rewards tiers',
      caption: 'Gamified leaderboards highlight badges, streaks, and next-tier incentives.',
    },
    {
      src: 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&q=80',
      alt: 'Claims approval workflow on tablet',
      caption: 'Supervisors review high-value claims with photo evidence before triggering payouts.',
    },
  ],
  advancedContent: [
    {
      title: 'Partner Directory',
      description:
        'Dealers discover nearby applicators, architects, and retailers to collaborate on bids and referrals.',
    },
    {
      title: 'Event RSVP',
      description:
        'Push notifications nudge partners to RSVP for launch events, webinars, and roadshows with one tap.',
    },
    {
      title: 'Campaign Studio',
      description:
        'Marketing teams launch contests, spin-the-wheel games, and surveys without engineering support.',
    },
  ],
  colors: [
    { label: 'Astral Blue', value: '#1F6FEB', usage: 'Primary brand moments and CTA buttons.' },
    { label: 'Resin Gold', value: '#F5A524', usage: 'Reward milestones, confetti, and special unlocks.' },
    { label: 'Concrete Slate', value: '#1F2933', usage: 'Typography, iconography, and data visualisations.' },
  ],
  typography: {
    family: 'Poppins',
    description:
      'Rounded forms with generous spacing make multilingual content approachable for field partners.',
  },
  challenges: [
    'Designing for intermittent connectivity meant architecting sync-safe queues across Android device variants.',
    'We localised the experience in six Indian languages without bloating bundle size or impacting performance.',
  ],
  technologyStack: ['Flutter', 'Node.js', 'PostgreSQL', 'Firebase', 'AWS S3'],
};

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
  screenshots: [
    {
      src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      alt: 'Meditation app onboarding screens displayed on two phones',
      caption: 'Guided onboarding screens welcome seekers and tailor breathing journeys to their pace.',
    },
    {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      alt: 'Calming blue meditation timer interface on a smartphone',
      caption: 'Session timers keep practitioners focused while surface-level analytics highlight streaks.',
    },
    {
      src: 'https://images.unsplash.com/photo-1604117559201-51ac38e34d35?auto=format&fit=crop&w=1200&q=80',
      alt: 'Community meetup list inside the wellness application',
      caption: 'Location-aware meetups showcase nearby community gatherings with RSVP and contribution flows.',
    },
    {
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      alt: 'In-app lessons featuring meditation instructors',
      caption: 'High-definition instructor videos make it effortless to revisit SKY breathing techniques.',
    },
    {
      src: 'https://images.unsplash.com/photo-1520322082799-20c1288346da?auto=format&fit=crop&w=1200&q=80',
      alt: 'Mobile dashboard summarising progress and featured programs',
      caption: 'A personalised home dashboard curates journeys, wisdom drops, and upcoming workshops.',
    },
  ],
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
  [papaJohnsCaseStudy.slug]: papaJohnsCaseStudy,
  [astralAdhesivesCaseStudy.slug]: astralAdhesivesCaseStudy,
  [artOfLivingCaseStudy.slug]: artOfLivingCaseStudy,
};

export const featuredCaseStudies = caseStudiesList;
