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
  services: {
    heading: 'Transform Your Business Growth with Us',
    categories: [
      {
        label: 'Mobile App Development',
        description: 'Native and cross-platform squads building high-performance apps.',
        subItems: [
          { label: 'Android App', href: '/services/mobile-app-development/android-app' },
          { label: 'iOS App', href: '/services/mobile-app-development/ios-app' },
          { label: 'React Native', href: '/services/mobile-app-development/react-native' },
          { label: 'Hybrid App', href: '/services/mobile-app-development/hybrid-app' },
          { label: 'Flutter App', href: '/services/mobile-app-development/flutter-app' },
          { label: 'Kotlin', href: '/services/mobile-app-development/kotlin' }
        ],
        image:
          'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Web & CMS Development',
        description: 'Composable websites, portals, and CMS ecosystems that scale.',
        subItems: [
          { label: 'Enterprise Websites', href: '/services/web-cms-development/enterprise-websites' },
          { label: 'Headless CMS', href: '/services/web-cms-development/headless-cms' },
          { label: 'WordPress & Drupal', href: '/services/web-cms-development/wordpress-drupal' },
          { label: 'Sitecore', href: '/services/web-cms-development/sitecore' },
          { label: 'JAMStack Builds', href: '/services/web-cms-development/jamstack-builds' },
          { label: 'Support & Maintenance', href: '/services/web-cms-development/support-maintenance' }
        ],
        image:
          'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Digital Marketing',
        description: 'Performance-driven lifecycle, SEO, and paid media acceleration.',
        subItems: [
          { label: 'SEO & ASO', href: '/services/digital-marketing/seo-aso' },
          { label: 'Paid Media', href: '/services/digital-marketing/paid-media' },
          { label: 'Marketing Automation', href: '/services/digital-marketing/marketing-automation' },
          { label: 'Content Strategy', href: '/services/digital-marketing/content-strategy' },
          { label: 'Growth Analytics', href: '/services/digital-marketing/growth-analytics' },
          { label: 'Campaign Operations', href: '/services/digital-marketing/campaign-operations' }
        ],
        image:
          'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Blockchain Development',
        description: 'Secure ledgers, DeFi platforms, and tokenized ecosystems.',
        subItems: [
          { label: 'DApp Development', href: '/services/blockchain-development/dapp-development' },
          { label: 'Smart Contracts', href: '/services/blockchain-development/smart-contracts' },
          { label: 'NFT Platforms', href: '/services/blockchain-development/nft-platforms' },
          { label: 'DeFi Solutions', href: '/services/blockchain-development/defi-solutions' },
          { label: 'Wallet Development', href: '/services/blockchain-development/wallet-development' },
          { label: 'Audit & Security', href: '/services/blockchain-development/audit-security' }
        ],
        image:
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Ecommerce Development',
        description: 'Conversion-first storefronts for B2B, B2C, and D2C brands.',
        subItems: [
          { label: 'Shopify Plus', href: '/services/ecommerce-development/shopify-plus' },
          { label: 'Magento', href: '/services/ecommerce-development/magento' },
          { label: 'BigCommerce', href: '/services/ecommerce-development/bigcommerce' },
          { label: 'Headless Commerce', href: '/services/ecommerce-development/headless-commerce' },
          { label: 'Marketplace Integrations', href: '/services/ecommerce-development/marketplace-integrations' },
          { label: 'Growth Optimization', href: '/services/ecommerce-development/growth-optimization' }
        ],
        image:
          'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Salesforce Solutions',
        description: 'Certified squads optimising Sales, Service, and Marketing Cloud.',
        subItems: [
          { label: 'Sales Cloud', href: '/services/salesforce-solutions/sales-cloud' },
          { label: 'Service Cloud', href: '/services/salesforce-solutions/service-cloud' },
          { label: 'Marketing Cloud', href: '/services/salesforce-solutions/marketing-cloud' },
          { label: 'Revenue Intelligence', href: '/services/salesforce-solutions/revenue-intelligence' },
          { label: 'CPQ Implementation', href: '/services/salesforce-solutions/cpq-implementation' },
          { label: 'Ongoing Administration', href: '/services/salesforce-solutions/ongoing-administration' }
        ],
        image:
          'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'AI & ML',
        description: 'Intelligent automation, forecasting, and decision-making engines.',
        subItems: [
          { label: 'ML Model Development', href: '/services/ai-ml/ml-model-development' },
          { label: 'Generative AI', href: '/services/ai-ml/generative-ai' },
          { label: 'Computer Vision', href: '/services/ai-ml/computer-vision' },
          { label: 'Predictive Analytics', href: '/services/ai-ml/predictive-analytics' },
          { label: 'MLOps', href: '/services/ai-ml/mlops' },
          { label: 'Data Engineering', href: '/services/ai-ml/data-engineering' }
        ],
        image:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80'
      }
    ]
  },
  hireDevelopers: {
    heading: 'Build High-Performing Remote Teams on Demand',
    categories: [
      {
        label: 'Hire App Developer',
        description: 'Dedicated mobile engineers aligned to your release cadences.',
        subItems: [
          { label: 'Android Developer', href: '/hire-developers/mobile/android' },
          { label: 'iOS Developer', href: '/hire-developers/mobile/ios' },
          { label: 'React Native Developer', href: '/hire-developers/mobile/react-native' },
          { label: 'Flutter Developer', href: '/hire-developers/mobile/flutter' },
          { label: 'Kotlin Developer', href: '/hire-developers/mobile/kotlin' },
          { label: 'Xamarin Developer', href: '/hire-developers/mobile/xamarin' }
        ],
        image:
          'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Hire Frontend Developer',
        description: 'Pixel-perfect UI specialists across modern frameworks.',
        subItems: [
          { label: 'React.js Developer', href: '/hire-developers/frontend/react' },
          { label: 'Vue.js Developer', href: '/hire-developers/frontend/vue' },
          { label: 'Angular Developer', href: '/hire-developers/frontend/angular' },
          { label: 'Next.js Developer', href: '/hire-developers/frontend/nextjs' },
          { label: 'Svelte Developer', href: '/hire-developers/frontend/svelte' },
          { label: 'UI Engineering Team', href: '/hire-developers/frontend/ui-engineering-team' }
        ],
        image:
          'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Hire Backend Developer',
        description: 'API-first architectures, integrations, and cloud-native delivery.',
        subItems: [
          { label: 'Node.js Developer', href: '/hire-developers/backend/nodejs' },
          { label: 'Python Developer', href: '/hire-developers/backend/python' },
          { label: 'Java Developer', href: '/hire-developers/backend/java' },
          { label: 'Golang Developer', href: '/hire-developers/backend/golang' },
          { label: 'PHP/Laravel Developer', href: '/hire-developers/backend/php-laravel' },
          { label: 'Microservices Team', href: '/hire-developers/backend/microservices-team' }
        ],
        image:
          'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Hire Ecommerce Developer',
        description: 'Conversion specialists optimising storefront experiences.',
        subItems: [
          { label: 'Shopify Developer', href: '/hire-developers/ecommerce/shopify' },
          { label: 'Magento Developer', href: '/hire-developers/ecommerce/magento' },
          { label: 'WooCommerce Developer', href: '/hire-developers/ecommerce/woocommerce' },
          { label: 'BigCommerce Developer', href: '/hire-developers/ecommerce/bigcommerce' },
          { label: 'Headless Commerce Team', href: '/hire-developers/ecommerce/headless-commerce-team' },
          { label: 'CRO Specialist', href: '/hire-developers/ecommerce/cro-specialist' }
        ],
        image:
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
      },
      {
        label: 'Hire Dedicated Developers Team',
        description: 'Assemble pods that plug directly into your product squads.',
        subItems: [
          { label: 'Scrum Team', href: '/hire-developers/dedicated-teams/scrum-team' },
          { label: 'Full-Stack Engineers', href: '/hire-developers/dedicated-teams/full-stack-engineers' },
          { label: 'QA & Automation', href: '/hire-developers/dedicated-teams/qa-automation' },
          { label: 'Product Designers', href: '/hire-developers/dedicated-teams/product-designers' },
          { label: 'DevOps Engineers', href: '/hire-developers/dedicated-teams/devops-engineers' },
          { label: 'Solution Architects', href: '/hire-developers/dedicated-teams/solution-architects' }
        ],
        image:
          'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=900&q=80'
      }
    ]
  },
  about: {
    heading: 'Get to know the people and principles behind VedX',
    categories: [
      {
        label: 'About VedX Solutions',
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
