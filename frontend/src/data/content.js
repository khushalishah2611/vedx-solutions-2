

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

export const servicesShowcase = {
  eyebrow: '',
  heading: 'Our Services',
  description:
    '',
};

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
        { label: 'Case Study', href: '/casestudy' },
        { label: 'Careers', href: '/careers' },

      ]
    }
  ],
  stayWithUs: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/vedx-solutions/', icon: 'linkedin' },
    { label: 'X', href: 'https://x.com/vedxsolutions', icon: 'x' },
    { label: 'Facebook', href: 'https://www.facebook.com/vedxsolutionsagency', icon: 'facebook' },
    { label: 'Instagram', href: 'https://www.instagram.com/vedx.solutions', icon: 'instagram' }
  ],
  bottomLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms and Condition', href: '/terms-and-condition' },
    { label: 'Contact Us', href: '/contact' }
  ],
  copyright: 'Copyright © 2025 VedX Solutions.'
};

export const megaMenuContent = {
  services: {
    heading: 'Our Services',
    categories: [
      {
        label: 'Mobile App Development',
        href: '/services/mobile-app-development',
        description: 'Build scalable iOS and Android apps tailored to your business.',
        subItems: [
          { label: 'iOS Development', href: '/services/mobile-app-development/ios' },
          { label: 'Android Development', href: '/services/mobile-app-development/android' }
        ]
      },
      {
        label: 'Web & CMS Development',
        href: '/services/web-cms-development',
        description: 'Modern web experiences with flexible CMS integrations.',
        subItems: [
          { label: 'Website Development', href: '/services/web-cms-development/website' },
          { label: 'CMS Solutions', href: '/services/web-cms-development/cms' }
        ]
      }
    ]
  },
  hireDevelopers: {
    heading: 'Hire Developers',
    categories: [
      {
        label: 'Hire App Developer',
        href: '/hire-developers/hire-app-developer',
        description: 'Dedicated app experts to accelerate delivery.',
        subItems: [
          { label: 'Flutter Developers', href: '/hire-developers/hire-app-developer/flutter' },
          { label: 'React Native Developers', href: '/hire-developers/hire-app-developer/react-native' }
        ]
      },
      {
        label: 'Hire Frontend Developer',
        href: '/hire-developers/hire-frontend-developer',
        description: 'UI-focused specialists for responsive experiences.',
        subItems: [
          { label: 'React Developers', href: '/hire-developers/hire-frontend-developer/react' },
          { label: 'Vue Developers', href: '/hire-developers/hire-frontend-developer/vue' }
        ]
      }
    ]
  }
};
