export const heroContent = {
  eyebrow: 'We Are',
  slides: [
    {
      title: 'Creative Digital Agency Working For',
      highlight: 'Enterprise',
      subtitle:
        "We're made up of top product experts and engineers who are capable in the development and deployment of the industry's most advanced technologies including web, mobile apps, eCommerce, mCommerce, IoT, AI/ML, enterprise mobility, on-demand, cross-platform, cloud integration and alike.",
      description:
        'If your organization is looking for assistance on an upcoming software project or would like access to our talent, feel free to get in touch and begin a conversation.',
      ctaPrimary: 'Get Started',
      ctaSecondary: 'View Our Services',
      insights: ['Product strategy & roadmapping', 'Cloud integration & automation'],
      image:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Full-Stack Teams Designing Impactful',
      highlight: 'Experiences',
      subtitle:
        'From brand discovery to launch, our cross-functional squads align product, marketing, and engineering to deliver journeys your customers love.',
      description:
        'Partner with design systems experts, UX researchers, and senior engineers to modernise legacy products or launch new digital flagships in record time.',
      ctaPrimary: 'Book a Consultation',
      ctaSecondary: 'See Case Studies',
      insights: ['Experience-led product delivery', 'Integrated growth marketing'],
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80'
    },
    {
      title: 'Dedicated Remote Squads Accelerating',
      highlight: 'Innovation',
      subtitle:
        'Augment your capability with agile pods of architects, developers, analysts, and marketers orchestrated through a single VedX partner.',
      description:
        'Deploy sprint-ready teams that embed with your workflows, uphold enterprise governance, and keep initiatives measurable from day one.',
      ctaPrimary: 'Launch a Project',
      ctaSecondary: 'Meet the Team',
      insights: ['Enterprise-grade security', 'Outcome-based engagements'],
      image:
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80'
    }
  ],
  stats: [
    { value: '340%', label: 'Average ROI' },
    { value: '500+', label: 'Clients partnered' },
    { value: '1200+', label: 'Campaigns launched' }
  ]
};

export const navigationLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services', menu: 'services' },
  { label: 'Hire Developer +', path: '/hire-developers', menu: 'hireDevelopers' },

  // { label: 'Our Projects', path: '/ourprojects' },
  { label: 'Case Study', path: '/casestudy' },
  { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about', menu: 'about' },
  { label: 'Contact', path: '/contact' }
];

export const megaMenuContent = {
  about: {
    heading: 'Get to know the people and principles behind VedX',
    categories: [
      {
        label: 'About VedX Solutions',
        href: '/about',
        description: 'Discover our mission, culture, and the impact our teams deliver for partners around the globe.',
        subItems: [
          { label: 'Who we are', href: '/about' },
          { label: 'Culture & values', href: '/about#culture' },
          { label: 'Milestones', href: '/about#milestones' }
        ],
        image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Careers at VedX',
        href: '/careers',
        description: 'Join remote-first squads crafting digital products, growth programs, and customer experiences.',
        subItems: [
          { label: 'Open roles', href: '/careers#open-roles' },
          { label: 'Benefits & perks', href: '/careers#benefits' },
          { label: 'Hiring journey', href: '/careers#journey' }
        ],
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80'
      }
    ]
  }
};

export const servicesShowcase = {
  eyebrow: '',
  heading: 'Our Services',
  description:
    '',
  services: [
    {
      title: 'Mobile App Development',
      image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80',
      blurb:
        'Strategise, design, and build native or cross-platform experiences with agile pods that align to your roadmap.',
      capabilities: ['Android App', 'iPhone App', 'Flutter', 'React Native', 'Kotlin', 'Hybrid App']
    },
    {
      title: 'Web App Development',
      image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80',
      blurb:
        'Composable architectures, modern frontends, and secure backends engineered for scale across web properties.',
      capabilities: ['Enterprise Portals', 'Progressive Web Apps', 'Headless CMS', 'Next.js', 'Laravel', 'Maintenance']
    },
    {
      title: 'Digital Marketing',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80',
      blurb:
        'Full-funnel growth teams orchestrating performance marketing, lifecycle automation, and content excellence.',
      capabilities: ['SEO & ASO', 'Paid Media', 'Marketing Automation', 'Content Strategy', 'Analytics', 'Campaign Ops']
    },
    {
      title: 'Blockchain Development',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      blurb:
        'Secure ledgers, smart contracts, and DeFi solutions architected by specialists with proven domain experience.',
      capabilities: ['DApps', 'Smart Contracts', 'NFT Platforms', 'Wallet Development', 'DeFi Solutions', 'Security Audits']
    },
    {
      title: 'Ecommerce Development',
      image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80',
      blurb:
        'Conversion-first storefronts and marketplace integrations that deliver smooth customer journeys end to end.',
      capabilities: ['Shopify Plus', 'Magento', 'BigCommerce', 'Headless Commerce', 'Marketplace Apps', 'CRO Audits']
    },
    {
      title: 'Salesforce Solutions',
      image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80',
      blurb:
        'Certified consultants unlocking Sales, Service, and Marketing Cloud value with tailored implementations.',
      capabilities: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Revenue Intelligence', 'CPQ', 'Admin Support']
    }
  ]
};

export const advantages = [
  {
    icon: 'insights',
    title: 'Actionable intelligence',
    description:
      'Real-time dashboards and predictive models give you clarity on every marketing investment.'
  },
  {
    icon: 'auto_graph',
    title: 'AI-assisted optimization',
    description:
      'Machine learning accelerates testing velocity and uncovers compounding growth opportunities.'
  },
  {
    icon: 'hub',
    title: 'Omni-channel orchestration',
    description:
      'Integrated strategies keep your brand consistent across paid, organic, lifecycle, and experiential touchpoints.'
  },
  {
    icon: 'security',
    title: 'Enterprise-grade governance',
    description:
      'Privacy-first measurement, SOC2-compliant processes, and transparent collaboration at every step.'
  }
];

export const differentiators = [
  {
    title: 'The VEDX advantage',
    subtitle: 'Why ambitious teams choose us',
    bullets: [
      '14-day launch framework with orchestrated sprints and aligned milestones.',
      'Cross-functional squads that embed with your marketing and revenue teams.',
      'Automation library spanning 120+ playbooks for nurture, lifecycle, and retention.'
    ]
  },
  {
    title: 'Platform-ready delivery',
    subtitle: 'Certified across leading stacks',
    bullets: [
      'HubSpot, Marketo, Pardot, and Customer.io automation specialists.',
      'Attribution experts for Segment, Rudderstack, and CDP ecosystems.',
      'Deep partnerships with Meta, Google, LinkedIn, and TikTok ad platforms.'
    ]
  }
];

export const reasons = [
  {
    title: 'Growth pods',
    description: 'Modular teams of strategists, creatives, analysts, and developers with domain-specific expertise.'
  },
  {
    title: 'Precision storytelling',
    description: 'Narratives anchored in customer insights, brand voice, and data-backed testing roadmaps.'
  },
  {
    title: 'Full-funnel mastery',
    description: 'From acquisition to advocacy, we design journeys that compound loyalty and revenue.'
  },
  {
    title: 'Always-on innovation',
    description: 'Dedicated R&D guild tracks emerging formats, algorithms, and creative trends for your advantage.'
  }
];

export const products = [
  {
    title: 'DemandGen Accelerator',
    description: 'Launch integrated campaigns with programmatic creative, paid media, and marketing ops in 30 days.',
    tag: 'Top pick'
  },
  {
    title: 'Revenue Engine Ops',
    description: 'Engineer scalable automation, lead routing, and lifecycle nurture across your go-to-market stack.',
    tag: 'Ops'
  },
  {
    title: 'Commerce Growth Lab',
    description: 'Dynamic merchandising, retargeting, and LTV optimization tailored for DTC and marketplace brands.',
    tag: 'Ecommerce'
  }
];

export const metrics = [
  { value: '12M+', label: 'Qualified leads sourced' },
  { value: '6.5x', label: 'Return on ad spend' },
  { value: '95%', label: 'Client retention' },
  { value: '250%', label: 'Pipeline growth' }
];

export const faqEntries = [
  {
    question: 'How does onboarding work?',
    answer:
      'We begin with a 360° growth audit, align on KPIs, and build a roadmap with prioritized experiments and launch plans.'
  },
  {
    question: 'Can you integrate with our existing stack?',
    answer:
      'Yes. We have certified specialists across the major CRM, CDP, and marketing automation platforms to accelerate integration.'
  },
  {
    question: 'Do you support global campaigns?',
    answer:
      'Our multilingual strategists and localized creative partners execute region-specific initiatives across 30+ markets.'
  }
];

export const testimonials = [
  {
    quote:
      'VEDX became an extension of our team—our CAC dropped 42% while scaling pipeline velocity quarter over quarter.',
    name: 'Jordan Patel',
    title: 'Chief Revenue Officer, ElevateIQ'
  },
  {
    quote:
      'The automation library and experimentation cadence delivered predictable growth far beyond our previous agencies.',
    name: 'Elena García',
    title: 'VP Growth, NovaCloud'
  }
];

export const footerContent = {
  heading: 'Transform Your Business Growth with Us',
  description:
    'Partner with VedX Solutions to accelerate product delivery, modernise platforms, and amplify digital growth with dedicated experts.',
  columns: [
    {
      title: 'Services',
      links: [
        'Mobile App Development',
        'Web & CMS Development',
        'Digital Marketing',
        'Blockchain Development',
        'Ecommerce Development',
        'Salesforce Solutions',
        'AI & ML'
      ]
    },
    {
      title: 'Hire Developers',
      links: [
        'Hire App Developer',
        'Hire Frontend Developer',
        'Hire Backend Developer',
        'Hire Ecommerce Developer',
        'Hire Dedicated Developers Team',
        'Hire UI/UX Designer'
      ]
    },
    {
      title: 'About Us',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'Blog', href: '/blog' },
        'Case Study',
        { label: 'Careers', href: '/careers' },
        'Support'
      ]
    }
  ],
  stayWithUs: [
    { label: 'LinkedIn', href: '#', icon: 'linkedin' },
    { label: 'Twitter', href: '#', icon: 'twitter' },
    { label: 'Instagram', href: '#', icon: 'instagram' }
  ],
  bottomLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms and Condition', href: '#' },
    { label: 'Contact Us', href: '/contact' }
  ],
  copyright: 'Copyright © 2025 VedX Solutions.'
};
