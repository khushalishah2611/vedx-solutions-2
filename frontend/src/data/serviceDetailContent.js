import { megaMenuContent } from './content.js';

const fillPlaceholders = (template, replacements) =>
  template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? '');

const categoryMeta = {
  'mobile-app-development': {
    menuLabel: 'Mobile App Development',
    heroTitle: 'Mobile App Development',
    heroDescription:
      'Design, build, and evolve native and cross-platform experiences with squads that blend research, UX, engineering, and QA.',
    summaryTemplate:
      'VedX Solutions delivers {service} engagements that combine strategic product thinking, platform expertise, and measurable delivery.',
    outcomes: [
      'Launch {service} experiences faster with iterative release cycles and sprint-based validation.',
      'Embed analytics, crash reporting, and performance insights tailored to your {service}.',
      'Harden security, compliance, and store-readiness for every {service} release.'
    ],
    capabilities: [
      'Product discovery, journey mapping, and UX sprints',
      'Cross-functional pods covering native, cross-platform, and backend services',
      'Automated testing, CI/CD pipelines, and ongoing optimisation'
    ],
    deliverables: [
      {
        title: 'Solution architecture blueprint',
        description:
          'Documented technical backlog, milestone roadmap, and integration sequencing tailored to your mobile initiative.'
      },
      {
        title: 'Experience design system',
        description:
          'Reusable UI kit, accessibility guidelines, and interaction patterns that accelerate consistent delivery across apps.'
      },
      {
        title: 'Quality and release operations',
        description:
          'Automated test suites, deployment playbooks, and post-launch optimisation support to keep releases resilient.'
      }
    ]
  },
  'web-cms-development': {
    menuLabel: 'Web & CMS Development',
    heroTitle: 'Web & CMS Development',
    heroDescription:
      'Ship composable websites, portals, and digital platforms that empower editors and deliver premium user journeys.',
    summaryTemplate:
      'Our {service} specialists orchestrate architecture, content workflows, and performance tuning to deliver adaptable web ecosystems.',
    outcomes: [
      'Modernise your {service} footprint with scalable, headless-friendly architecture.',
      'Establish governance, content workflows, and localisation tailored to your {service}.',
      'Optimise Core Web Vitals, accessibility, and observability across every {service} release.'
    ],
    capabilities: [
      'Information architecture & experience strategy',
      'Composable CMS implementation & integration',
      'Performance engineering, automation, and managed services'
    ],
    deliverables: [
      {
        title: 'Experience & content strategy',
        description:
          'Audience journeys, governance models, and localisation workflows enabling editors to publish with confidence.'
      },
      {
        title: 'Composable implementation assets',
        description:
          'Reusable templates, component catalogues, and integration connectors for your preferred CMS stack.'
      },
      {
        title: 'Enablement & operations',
        description:
          'Migration runbooks, DevOps automation, and team training that keep your platform future-ready.'
      }
    ]
  },
  'digital-marketing': {
    menuLabel: 'Digital Marketing',
    heroTitle: 'Digital Marketing Acceleration',
    heroDescription:
      'Drive acquisition, retention, and revenue with full-funnel performance marketing and lifecycle automation.',
    summaryTemplate:
      'VedX strategists build {service} programs that align growth goals, creative, and analytics into one operating rhythm.',
    outcomes: [
      'Construct multi-channel journeys that fuel your {service} KPIs.',
      'Activate test-and-learn experimentation to scale {service} wins sustainably.',
      'Create transparent dashboards and attribution for every {service} initiative.'
    ],
    capabilities: [
      'Audience research, messaging, and creative experimentation',
      'Campaign operations, marketing automation, and CRO',
      'Analytics engineering, attribution modelling, and reporting'
    ],
    deliverables: [
      {
        title: 'Growth roadmap & KPI model',
        description:
          'Channel prioritisation, budget modelling, and testing hypotheses aligned to your revenue targets.'
      },
      {
        title: 'Campaign & lifecycle assets',
        description:
          'Creative variations, nurture flows, and automation sequences ready for activation across every touchpoint.'
      },
      {
        title: 'Insight & optimisation cadence',
        description:
          'Dashboarding, attribution, and experiment backlogs to institutionalise learning and continuous improvement.'
      }
    ]
  },
  'blockchain-development': {
    menuLabel: 'Blockchain Development',
    heroTitle: 'Blockchain & Web3 Engineering',
    heroDescription:
      'Architect secure, scalable blockchain ecosystems backed by rigorous audits and enterprise-grade delivery.',
    summaryTemplate:
      'Our {service} teams bring protocol expertise, secure smart contract engineering, and compliant deployment practices.',
    outcomes: [
      'Translate tokenomics and governance models into production-ready {service} solutions.',
      'Implement layered security reviews to protect your {service} from exploits.',
      'Deliver observability and upgrade pathways to evolve your {service} as markets shift.'
    ],
    capabilities: [
      'Solution discovery, token design, and ecosystem strategy',
      'Smart contract development, integration, and testing',
      'Infrastructure operations, monitoring, and incident response'
    ],
    deliverables: [
      {
        title: 'Technical & economic architecture',
        description:
          'Protocol evaluation, tokenomics modelling, and roadmap alignment for compliant blockchain ecosystems.'
      },
      {
        title: 'Secure smart contract packages',
        description:
          'Audited contract code, integration adapters, and automated testing to safeguard your decentralised products.'
      },
      {
        title: 'Operations & compliance toolkit',
        description:
          'Monitoring dashboards, incident response playbooks, and regulatory documentation for long-term resilience.'
      }
    ]
  },
  'ecommerce-development': {
    menuLabel: 'Ecommerce Development',
    heroTitle: 'Ecommerce Engineering',
    heroDescription:
      'Launch conversion-first storefronts and marketplaces tailored to B2B, B2C, and D2C growth.',
    summaryTemplate:
      'VedX delivers {service} experiences that unify storefront UX, commerce platforms, and lifecycle optimisation.',
    outcomes: [
      'Craft personalised journeys and merchandising for every {service} channel.',
      'Integrate OMS, ERP, CRM, and fulfilment systems powering your {service}.',
      'Optimise performance, SEO, and AOV with continuous {service} testing.'
    ],
    capabilities: [
      'Experience design, CRO, and digital merchandising',
      'Composable commerce architecture and platform implementation',
      'Data, analytics, and automation for growth operations'
    ],
    deliverables: [
      {
        title: 'Experience & merchandising blueprint',
        description:
          'Customer journey mapping, content strategy, and conversion tactics that elevate every storefront touchpoint.'
      },
      {
        title: 'Platform implementation & integrations',
        description:
          'Configuration assets, API connectors, and automation scripts tying commerce, inventory, and fulfilment together.'
      },
      {
        title: 'Growth optimisation playbook',
        description:
          'Analytics dashboards, testing backlogs, and operational training to increase lifetime value and AOV.'
      }
    ]
  },
  'salesforce-solutions': {
    menuLabel: 'Salesforce Solutions',
    heroTitle: 'Salesforce Platform Services',
    heroDescription:
      'Unlock Sales, Service, and Marketing Cloud value with certified squads focused on measurable outcomes.',
    summaryTemplate:
      'Our {service} specialists combine discovery, configuration, and automation to streamline customer operations.',
    outcomes: [
      'Implement data models, automations, and integrations specific to your {service}.',
      'Drive adoption through guided enablement programs for every {service}.',
      'Maintain compliance, security, and governance within each {service} rollout.'
    ],
    capabilities: [
      'Process discovery and solution architecture',
      'Configuration, custom development, and integration',
      'Training, change management, and managed services'
    ],
    deliverables: [
      {
        title: 'Process & solution blueprint',
        description:
          'Discovery findings, data models, and phased rollout plan across Sales, Service, and Marketing Cloud.'
      },
      {
        title: 'Configured cloud environment',
        description:
          'Declarative configuration, custom components, and integration accelerators ready for user onboarding.'
      },
      {
        title: 'Adoption & governance program',
        description:
          'Change management toolkits, security controls, and optimisation roadmap for sustained Salesforce value.'
      }
    ]
  },
  'ai-ml': {
    menuLabel: 'AI & ML',
    heroTitle: 'AI & Machine Learning',
    heroDescription:
      'Operationalise machine learning, predictive analytics, and generative AI safely and responsibly.',
    summaryTemplate:
      'VedX crafts {service} solutions that unite data foundations, model engineering, and responsible AI practices.',
    outcomes: [
      'Establish data pipelines and governance tailored to your {service}.',
      'Build, train, and evaluate models powering your {service} outcomes.',
      'Deploy monitoring and human-in-the-loop feedback to evolve each {service} release.'
    ],
    capabilities: [
      'Data engineering, ingestion, and feature store design',
      'Model experimentation, evaluation, and optimisation',
      'MLOps, deployment automation, and responsible AI frameworks'
    ],
    deliverables: [
      {
        title: 'Responsible AI charter & metrics',
        description:
          'Use-case discovery, feasibility analysis, and ethical guardrails aligned to measurable business outcomes.'
      },
      {
        title: 'Model pipeline assets',
        description:
          'Feature stores, experiment logs, and reproducible training pipelines orchestrated for your data stack.'
      },
      {
        title: 'Monitoring & feedback loops',
        description:
          'In-production observability, human-in-the-loop review, and optimisation playbooks for ongoing accuracy.'
      }
    ]
  }
};

const buildServiceDetailContent = () => {
  const categories = megaMenuContent.services.categories;

  return categories.reduce((acc, category) => {
    const { label, subItems } = category;
    const categorySlug = subItems[0]?.href.split('/')[2];
    const meta = categoryMeta[categorySlug];

    if (!categorySlug || !meta) {
      return acc;
    }

    const services = subItems.reduce((serviceAcc, subItem) => {
      const parts = subItem.href.split('/').filter(Boolean);
      const serviceSlug = parts[2];
      if (!serviceSlug) {
        return serviceAcc;
      }

      const replacements = {
        service: subItem.label,
        category: meta.menuLabel
      };

      serviceAcc[serviceSlug] = {
        name: subItem.label,
        summary: fillPlaceholders(meta.summaryTemplate, replacements),
        outcomes: meta.outcomes.map((item) => fillPlaceholders(item, replacements)),
        capabilities: meta.capabilities,
        deliverables: meta.deliverables
      };

      return serviceAcc;
    }, {});

    acc[categorySlug] = {
      menuLabel: meta.menuLabel,
      title: meta.heroTitle,
      description: meta.heroDescription,
      services
    };

    return acc;
  }, {});
};

export const serviceDetailContent = buildServiceDetailContent();
