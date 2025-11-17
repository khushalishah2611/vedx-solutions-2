import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const imageLibrary = [
  {
    label: 'Team collaboration',
    value:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Developers at work',
    value:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Modern workspace',
    value:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Product presentation',
    value:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
  },
];

const imagePlaceholder =
  'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=60';

const initialServices = [
  {
    id: 'full-stack',
    category: 'Full Stack Development',
    categorySlug: 'full-stack-development',
    subcategories: [
      { name: 'Frontend', slug: 'frontend' },
      { name: 'Backend', slug: 'backend' },
      { name: 'DevOps', slug: 'devops' },
    ],
    bannerTitle: 'Launch cohesive products faster',
    bannerSubtitle: 'Unified squads that own discovery to deployment.',
    bannerImage: imageLibrary[0].value,
    createdAt: '2024-07-05',
    totalServices: 12,
    totalProjects: 120,
    totalClients: 65,
    faqs: [
      {
        id: 'faq-fs-1',
        question: 'How quickly can teams start?',
        answer: 'Most squads begin delivery within 2 weeks after scope alignment.',
      },
      {
        id: 'faq-fs-2',
        question: 'Do you handle discovery?',
        answer: 'Yes—product discovery, UX, and architecture are embedded with engineering.',
      },
    ],
    description:
      'Control your entire delivery lifecycle with pods that combine engineers, designers, and product owners ready to ship.',
  },
  {
    id: 'mobile',
    category: 'Mobile App Development',
    categorySlug: 'mobile-app-development',
    subcategories: [
      { name: 'Android', slug: 'android' },
      { name: 'iOS', slug: 'ios' },
      { name: 'Flutter', slug: 'flutter' },
      { name: 'React Native', slug: 'react-native' },
    ],
    bannerTitle: 'Build premium mobile experiences',
    bannerSubtitle: 'Native performance, consistent design systems, and automated releases.',
    bannerImage: imageLibrary[1].value,
    createdAt: '2024-07-08',
    totalServices: 9,
    totalProjects: 85,
    totalClients: 40,
    faqs: [
      {
        id: 'faq-mobile-1',
        question: 'Can you migrate existing apps?',
        answer: 'We refresh legacy apps with modern stacks and CI/CD without downtime.',
      },
    ],
    description:
      'From ideation to app store launch, keep every device covered with engineers fluent in modern mobile stacks.',
  },
];

const initialTechnologies = [
  {
    id: 'frontend-tech',
    title: 'Frontend',
    image: imageLibrary[2].value,
    items: ['React', 'Angular', 'Vue', 'Next.js', 'TypeScript'],
  },
  {
    id: 'backend-tech',
    title: 'Backend',
    image: imageLibrary[3].value,
    items: ['Node.js', 'Django', 'Laravel', 'Golang', 'PostgreSQL'],
  },
];

const initialBenefits = [
  {
    id: 'benefit-1',
    title: 'Outcome-first delivery',
    description: 'Every roadmap is mapped to measurable impact and transparent milestones.',
    image: imageLibrary[0].value,
  },
  {
    id: 'benefit-2',
    title: 'Embedded governance',
    description: 'Security, QA, and documentation are standard across every engagement.',
    image: imageLibrary[1].value,
  }
];

const initialHireDevelopers = {
  title: 'Hire dedicated developers on-demand',
  description:
    'Shape squads with the exact capabilities you need—from product discovery to release engineering—without long ramp-up times.',
  heroImage: imageLibrary[2].value,
  services: [
    { id: 'android-team', title: 'Android team', description: 'Compose-first Android engineers ready for feature pods.' },
    { id: 'ios-team', title: 'iOS team', description: 'Swift and SwiftUI experts with App Store release experience.' },
    { id: 'full-stack-team', title: 'Full stack team', description: 'API, web, and DevOps engineers aligned to your roadmap.' }
  ]
};

const emptyServiceForm = {
  id: '',
  category: '',
  categorySlug: '',
  subcategories: [],
  bannerTitle: '',
  bannerSubtitle: '',
  bannerImage: imageLibrary[0].value,
  createdAt: new Date().toISOString().split('T')[0],
  totalServices: 0,
  totalProjects: 0,
  totalClients: 0,
  description: '',
  faqs: [],
};

const emptyTechnologyForm = {
  id: '',
  title: '',
  image: imageLibrary[0].value,
  items: []
};

const emptyBenefitForm = {
  id: '',
  title: '',
  description: '',
  image: imageLibrary[1].value,
};

const emptyHireServiceForm = {
  id: '',
  title: '',
  description: ''
};

const initialWhyChoose = {
  heroTitle: 'Why choose our services',
  heroDescription:
    'Reassure visitors with outcomes, trusted delivery, and transparent engagement models backed by our teams.',
  heroImage: imageLibrary[0].value,
  tableTitle: 'Service highlights',
  tableDescription: 'Spotlight capabilities by category and sub-category so clients can pick the right path.',
  services: [
    {
      id: 'why-fs-front',
      category: 'Full Stack Development',
      subcategory: 'Frontend',
      title: 'Product-minded engineers',
      description: 'Frontend specialists who pair with UX and back-end teams to ship cohesive experiences.',
    },
    {
      id: 'why-mobile-ios',
      category: 'Mobile App Development',
      subcategory: 'iOS',
      title: 'Release-ready iOS pods',
      description: 'Swift and SwiftUI teams who manage App Store releases, QA, and observability.',
    },
  ],
};

const emptyWhyServiceForm = {
  id: '',
  category: '',
  subcategory: '',
  title: '',
  description: '',
};

const dateFilterOptions = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' },
];

const matchesDateFilter = (value, filter, range) => {
  if (filter === 'all') return true;
  const target = value ? new Date(value) : null;
  if (!target || Number.isNaN(target.getTime())) return false;

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const dateInRange = (start, end) => target >= start && target < end;

  switch (filter) {
    case 'today':
      return dateInRange(startOfToday, endOfToday);
    case 'yesterday': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 1);
      return dateInRange(start, startOfToday);
    }
    case 'week': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 7);
      return target >= start && target < endOfToday;
    }
    case 'month': {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 30);
      return target >= start && target < endOfToday;
    }
    case 'custom': {
      const start = range?.start ? new Date(range.start) : null;
      const end = range?.end ? new Date(range.end) : null;
      const normalizedEnd = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1) : null;
      if (start && target < start) return false;
      if (normalizedEnd && target >= normalizedEnd) return false;
      return true;
    }
    default:
      return true;
  }
};

const ImageUpload = ({ label, value, onChange, required }) => {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const previewSrc = value || imagePlaceholder;

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{label}</Typography>
      <Box
        sx={{
          width: '100%',
          borderRadius: 1,
          border: '1px dashed',
          borderColor: 'divider',
          p: 1,
          backgroundColor: 'background.default',
        }}
      >
        <Box
          component="img"
          src={previewSrc}
          alt={`${label} preview`}
          sx={{
            width: '100%',
            height: 220,
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />
      </Box>
      {!value && (
        <Typography variant="caption" color="text.secondary">
          A default placeholder is shown until you pick an image.
        </Typography>
      )}
      <Button variant="outlined" component="label" sx={{ alignSelf: 'flex-start' }}>
        Choose image
        <input type="file" accept="image/*" hidden required={required} onChange={handleFileChange} />
      </Button>
    </Stack>
  );
};

const AdminServicesPage = () => {
  const [activeTab, setActiveTab] = useState('services');

  const [services, setServices] = useState(initialServices);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDialogMode, setServiceDialogMode] = useState('create');
  const [activeService, setActiveService] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [viewService, setViewService] = useState(null);
  const [subcategoryDraft, setSubcategoryDraft] = useState({ name: '', slug: '' });
  const [faqDraft, setFaqDraft] = useState({ question: '', answer: '' });

  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [technologyDialogOpen, setTechnologyDialogOpen] = useState(false);
  const [technologyDialogMode, setTechnologyDialogMode] = useState('create');
  const [technologyForm, setTechnologyForm] = useState(emptyTechnologyForm);
  const [activeTechnology, setActiveTechnology] = useState(null);
  const [technologyToDelete, setTechnologyToDelete] = useState(null);

  const [benefits, setBenefits] = useState(initialBenefits);
  const [benefitDialogOpen, setBenefitDialogOpen] = useState(false);
  const [benefitDialogMode, setBenefitDialogMode] = useState('create');
  const [benefitForm, setBenefitForm] = useState(emptyBenefitForm);
  const [activeBenefit, setActiveBenefit] = useState(null);
  const [benefitToDelete, setBenefitToDelete] = useState(null);

  const [hireContent, setHireContent] = useState(initialHireDevelopers);
  const [hireServiceDialogOpen, setHireServiceDialogOpen] = useState(false);
  const [hireServiceDialogMode, setHireServiceDialogMode] = useState('create');
  const [hireServiceForm, setHireServiceForm] = useState(emptyHireServiceForm);
  const [activeHireService, setActiveHireService] = useState(null);
  const [hireServiceToDelete, setHireServiceToDelete] = useState(null);
  const [heroSaved, setHeroSaved] = useState(false);

  const [whyChoose, setWhyChoose] = useState(initialWhyChoose);
  const [whyHeroForm, setWhyHeroForm] = useState(initialWhyChoose);
  const [whyServiceDialogOpen, setWhyServiceDialogOpen] = useState(false);
  const [whyServiceDialogMode, setWhyServiceDialogMode] = useState('create');
  const [whyServiceForm, setWhyServiceForm] = useState(emptyWhyServiceForm);
  const [activeWhyService, setActiveWhyService] = useState(null);
  const [whyServiceToDelete, setWhyServiceToDelete] = useState(null);

  const rowsPerPage = 5;
  const [serviceDateFilter, setServiceDateFilter] = useState('all');
  const [serviceDateRange, setServiceDateRange] = useState({ start: '', end: '' });
  const [servicePage, setServicePage] = useState(1);
  const [technologyPage, setTechnologyPage] = useState(1);
  const [benefitPage, setBenefitPage] = useState(1);
  const [whyServicePage, setWhyServicePage] = useState(1);
  const [hireServicePage, setHireServicePage] = useState(1);

  const resetServiceForm = () =>
    setServiceForm({ ...emptyServiceForm, createdAt: new Date().toISOString().split('T')[0] });
  const resetTechnologyForm = () => setTechnologyForm(emptyTechnologyForm);
  const resetBenefitForm = () => setBenefitForm(emptyBenefitForm);
  const resetHireServiceForm = () => setHireServiceForm(emptyHireServiceForm);
  const resetWhyServiceForm = () => setWhyServiceForm(emptyWhyServiceForm);

  const handleServiceFormChange = (field, value) => {
    setServiceForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSubcategory = () => {
    if (!subcategoryDraft.name.trim() || !subcategoryDraft.slug.trim()) return;
    setServiceForm((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, { ...subcategoryDraft }],
    }));
    setSubcategoryDraft({ name: '', slug: '' });
  };

  const removeSubcategory = (slug) => {
    setServiceForm((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((item) => item.slug !== slug),
    }));
  };

  const addFaq = () => {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) return;
    setServiceForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { id: `faq-${Date.now()}`, ...faqDraft }],
    }));
    setFaqDraft({ question: '', answer: '' });
  };

  const removeFaq = (id) => {
    setServiceForm((prev) => ({ ...prev, faqs: prev.faqs.filter((faq) => faq.id !== id) }));
  };

  const handleTechnologyFormChange = (field, value) => {
    setTechnologyForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBenefitFormChange = (field, value) => {
    setBenefitForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHireServiceFormChange = (field, value) => {
    setHireServiceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHireContentChange = (field, value) => {
    setHeroSaved(false);
    setHireContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeroSave = () => {
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 3000);
  };

  const handleWhyHeroChange = (field, value) => {
    setWhyHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleWhyHeroSave = (event) => {
    event?.preventDefault();
    setWhyChoose((prev) => ({
      ...prev,
      heroTitle: whyHeroForm.heroTitle,
      heroDescription: whyHeroForm.heroDescription,
      heroImage: whyHeroForm.heroImage,
      tableTitle: whyHeroForm.tableTitle,
      tableDescription: whyHeroForm.tableDescription,
    }));
  };

  const filteredServices = useMemo(
    () => services.filter((service) => matchesDateFilter(service.createdAt, serviceDateFilter, serviceDateRange)),
    [services, serviceDateFilter, serviceDateRange]
  );

  const pagedServices = useMemo(() => {
    const start = (servicePage - 1) * rowsPerPage;
    return filteredServices.slice(start, start + rowsPerPage);
  }, [filteredServices, rowsPerPage, servicePage]);

  useEffect(() => {
    setServicePage(1);
  }, [serviceDateFilter, serviceDateRange.start, serviceDateRange.end]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredServices.length / rowsPerPage));
    setServicePage((prev) => Math.min(prev, maxPage));
  }, [filteredServices.length, rowsPerPage]);

  const pagedTechnologies = useMemo(() => {
    const start = (technologyPage - 1) * rowsPerPage;
    return technologies.slice(start, start + rowsPerPage);
  }, [technologies, rowsPerPage, technologyPage]);

  const pagedBenefits = useMemo(() => {
    const start = (benefitPage - 1) * rowsPerPage;
    return benefits.slice(start, start + rowsPerPage);
  }, [benefits, rowsPerPage, benefitPage]);

  const pagedWhyServices = useMemo(() => {
    const start = (whyServicePage - 1) * rowsPerPage;
    return whyChoose.services.slice(start, start + rowsPerPage);
  }, [whyChoose.services, rowsPerPage, whyServicePage]);

  const pagedHireServices = useMemo(() => {
    const start = (hireServicePage - 1) * rowsPerPage;
    return hireContent.services.slice(start, start + rowsPerPage);
  }, [hireContent.services, rowsPerPage, hireServicePage]);

  useEffect(() => {
    const maxTechPage = Math.max(1, Math.ceil(technologies.length / rowsPerPage));
    setTechnologyPage((prev) => Math.min(prev, maxTechPage));
  }, [rowsPerPage, technologies.length]);

  useEffect(() => {
    const maxBenefitPage = Math.max(1, Math.ceil(benefits.length / rowsPerPage));
    setBenefitPage((prev) => Math.min(prev, maxBenefitPage));
  }, [benefits.length, rowsPerPage]);

  useEffect(() => {
    const maxWhyPage = Math.max(1, Math.ceil(whyChoose.services.length / rowsPerPage));
    setWhyServicePage((prev) => Math.min(prev, maxWhyPage));
  }, [whyChoose.services.length, rowsPerPage]);

  useEffect(() => {
    const maxHireServicePage = Math.max(1, Math.ceil(hireContent.services.length / rowsPerPage));
    setHireServicePage((prev) => Math.min(prev, maxHireServicePage));
  }, [hireContent.services.length, rowsPerPage]);

  const openServiceCreateDialog = () => {
    setServiceDialogMode('create');
    setActiveService(null);
    resetServiceForm();
    setSubcategoryDraft({ name: '', slug: '' });
    setFaqDraft({ question: '', answer: '' });
    setServiceDialogOpen(true);
  };

  const openServiceEditDialog = (service) => {
    setServiceDialogMode('edit');
    setActiveService(service);
    setServiceForm({ ...service });
    setSubcategoryDraft({ name: '', slug: '' });
    setFaqDraft({ question: '', answer: '' });
    setServiceDialogOpen(true);
  };

  const closeServiceDialog = () => {
    setServiceDialogOpen(false);
    setActiveService(null);
  };

  const handleServiceSubmit = (event) => {
    event?.preventDefault();
    if (!serviceForm.category.trim()) return;

    if (serviceDialogMode === 'edit' && activeService) {
      setServices((prev) => prev.map((service) => (service.id === activeService.id ? { ...serviceForm } : service)));
    } else {
      const newService = { ...serviceForm, id: `service-${Date.now()}` };
      setServices((prev) => [newService, ...prev]);
    }

    closeServiceDialog();
  };

  const openServiceDeleteDialog = (service) => setServiceToDelete(service);
  const closeServiceDeleteDialog = () => setServiceToDelete(null);
  const handleConfirmDeleteService = () => {
    if (!serviceToDelete) return;
    setServices((prev) => prev.filter((service) => service.id !== serviceToDelete.id));
    closeServiceDeleteDialog();
  };

  const openTechnologyCreateDialog = () => {
    setTechnologyDialogMode('create');
    setActiveTechnology(null);
    resetTechnologyForm();
    setTechnologyDialogOpen(true);
  };

  const openTechnologyEditDialog = (technology) => {
    setTechnologyDialogMode('edit');
    setActiveTechnology(technology);
    setTechnologyForm({ ...technology });
    setTechnologyDialogOpen(true);
  };

  const closeTechnologyDialog = () => {
    setTechnologyDialogOpen(false);
    setActiveTechnology(null);
  };

  const handleTechnologySubmit = (event) => {
    event?.preventDefault();
    if (!technologyForm.title.trim()) return;

    if (technologyDialogMode === 'edit' && activeTechnology) {
      setTechnologies((prev) =>
        prev.map((tech) => (tech.id === activeTechnology.id ? { ...technologyForm } : tech))
      );
    } else {
      const newTech = { ...technologyForm, id: `tech-${Date.now()}` };
      setTechnologies((prev) => [newTech, ...prev]);
    }

    closeTechnologyDialog();
  };

  const openTechnologyDeleteDialog = (technology) => setTechnologyToDelete(technology);
  const closeTechnologyDeleteDialog = () => setTechnologyToDelete(null);
  const handleConfirmDeleteTechnology = () => {
    if (!technologyToDelete) return;
    setTechnologies((prev) => prev.filter((tech) => tech.id !== technologyToDelete.id));
    closeTechnologyDeleteDialog();
  };

  const openBenefitCreateDialog = () => {
    setBenefitDialogMode('create');
    setActiveBenefit(null);
    resetBenefitForm();
    setBenefitDialogOpen(true);
  };

  const openBenefitEditDialog = (benefit) => {
    setBenefitDialogMode('edit');
    setActiveBenefit(benefit);
    setBenefitForm({ ...benefit });
    setBenefitDialogOpen(true);
  };

  const closeBenefitDialog = () => {
    setBenefitDialogOpen(false);
    setActiveBenefit(null);
  };

  const handleBenefitSubmit = (event) => {
    event?.preventDefault();
    if (!benefitForm.title.trim()) return;

    if (benefitDialogMode === 'edit' && activeBenefit) {
      setBenefits((prev) => prev.map((benefit) => (benefit.id === activeBenefit.id ? { ...benefitForm } : benefit)));
    } else {
      const newBenefit = { ...benefitForm, id: `benefit-${Date.now()}` };
      setBenefits((prev) => [newBenefit, ...prev]);
    }

    closeBenefitDialog();
  };

  const openBenefitDeleteDialog = (benefit) => setBenefitToDelete(benefit);
  const closeBenefitDeleteDialog = () => setBenefitToDelete(null);
  const handleConfirmDeleteBenefit = () => {
    if (!benefitToDelete) return;
    setBenefits((prev) => prev.filter((benefit) => benefit.id !== benefitToDelete.id));
    closeBenefitDeleteDialog();
  };

  const openWhyServiceCreateDialog = () => {
    setWhyServiceDialogMode('create');
    setActiveWhyService(null);
    resetWhyServiceForm();
    setWhyServiceDialogOpen(true);
  };

  const openWhyServiceEditDialog = (service) => {
    setWhyServiceDialogMode('edit');
    setActiveWhyService(service);
    setWhyServiceForm({ ...service });
    setWhyServiceDialogOpen(true);
  };

  const closeWhyServiceDialog = () => {
    setWhyServiceDialogOpen(false);
    setActiveWhyService(null);
  };

  const handleWhyServiceSubmit = (event) => {
    event?.preventDefault();
    if (!whyServiceForm.title.trim() || !whyServiceForm.category.trim()) return;

    if (whyServiceDialogMode === 'edit' && activeWhyService) {
      setWhyChoose((prev) => ({
        ...prev,
        services: prev.services.map((service) =>
          service.id === activeWhyService.id ? { ...whyServiceForm } : service
        ),
      }));
    } else {
      const newWhyService = { ...whyServiceForm, id: `why-${Date.now()}` };
      setWhyChoose((prev) => ({ ...prev, services: [newWhyService, ...prev.services] }));
    }

    closeWhyServiceDialog();
  };

  const openWhyServiceDeleteDialog = (service) => setWhyServiceToDelete(service);
  const closeWhyServiceDeleteDialog = () => setWhyServiceToDelete(null);
  const handleConfirmDeleteWhyService = () => {
    if (!whyServiceToDelete) return;
    setWhyChoose((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== whyServiceToDelete.id),
    }));
    closeWhyServiceDeleteDialog();
  };

  const openHireServiceCreateDialog = () => {
    setHireServiceDialogMode('create');
    setActiveHireService(null);
    resetHireServiceForm();
    setHireServiceDialogOpen(true);
  };

  const openHireServiceEditDialog = (service) => {
    setHireServiceDialogMode('edit');
    setActiveHireService(service);
    setHireServiceForm({ ...service });
    setHireServiceDialogOpen(true);
  };

  const closeHireServiceDialog = () => {
    setHireServiceDialogOpen(false);
    setActiveHireService(null);
  };

  const handleHireServiceSubmit = (event) => {
    event?.preventDefault();
    if (!hireServiceForm.title.trim()) return;

    if (hireServiceDialogMode === 'edit' && activeHireService) {
      setHireContent((prev) => ({
        ...prev,
        services: prev.services.map((service) =>
          service.id === activeHireService.id ? { ...hireServiceForm } : service
        ),
      }));
    } else {
      const newHireService = { ...hireServiceForm, id: `hire-${Date.now()}` };
      setHireContent((prev) => ({ ...prev, services: [newHireService, ...prev.services] }));
    }

    closeHireServiceDialog();
  };

  const openHireServiceDeleteDialog = (service) => setHireServiceToDelete(service);
  const closeHireServiceDeleteDialog = () => setHireServiceToDelete(null);
  const handleConfirmDeleteHireService = () => {
    if (!hireServiceToDelete) return;
    setHireContent((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== hireServiceToDelete.id),
    }));
    closeHireServiceDeleteDialog();
  };

  const formattedTechnologyItems = useMemo(
    () => (technologyForm.items?.length ? technologyForm.items.join(', ') : ''),
    [technologyForm.items]
  );

  const categoryOptions = useMemo(
    () => Array.from(new Set(services.map((service) => service.category))).map((category) => ({
      value: category,
      label: category,
    })),
    [services]
  );

  const subcategoryOptions = useMemo(() => {
    const selected = services.find((service) => service.category === whyServiceForm.category);
    return selected?.subcategories || [];
  }, [services, whyServiceForm.category]);

  return (
    <Stack spacing={3}>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0.5, bgcolor: 'background.paper' }}>
        <Tabs
          value={activeTab}
          onChange={(event, value) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="services" label="Service menu" />
          <Tab value="why-choose" label="Why choose service" />
          <Tab value="technologies" label="Technologies we support" />
          <Tab value="benefits" label="Benefits" />
          <Tab value="hire" label="Hire developers" />
        </Tabs>
      </Box>

      {activeTab === 'services' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Service menu"
            subheader="Manage category wise banners, sub-categories, and project statistics."
            action={
              <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openServiceCreateDialog}>
                Add service
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Stack
              spacing={2}
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'stretch', md: 'flex-end' }}
              mb={2}
            >
              <TextField
                select
                label="Date filter"
                value={serviceDateFilter}
                onChange={(event) => setServiceDateFilter(event.target.value)}
                sx={{ minWidth: 220 }}
              >
                {dateFilterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {serviceDateFilter === 'custom' && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
                  <TextField
                    type="date"
                    label="From"
                    value={serviceDateRange.start}
                    onChange={(event) =>
                      setServiceDateRange((prev) => ({ ...prev, start: event.target.value }))
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    type="date"
                    label="To"
                    value={serviceDateRange.end}
                    onChange={(event) =>
                      setServiceDateRange((prev) => ({ ...prev, end: event.target.value }))
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>
              )}
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Sub-categories</TableCell>
                    <TableCell>Banner</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>FAQs</TableCell>
                    <TableCell>Totals</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedServices.map((service) => (
                    <TableRow key={service.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{service.category}</TableCell>
                      <TableCell>
                        <Chip label={service.categorySlug || 'Not set'} size="small" />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                          {service.subcategories.map((item) => (
                            <Chip
                              key={`${item.slug}-${item.name}`}
                              label={`${item.name} (${item.slug})`}
                              size="small"
                            />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Box
                            component="img"
                            src={service.bannerImage || imagePlaceholder}
                            alt={`${service.category} banner`}
                            sx={{ width: 140, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {service.bannerTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {service.bannerSubtitle}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{service.createdAt || '-'}</TableCell>
                      <TableCell>
                        <Chip label={`${service.faqs?.length || 0} FAQs`} size="small" />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body2">Services: {service.totalServices}</Typography>
                          <Typography variant="body2">Projects: {service.totalProjects}</Typography>
                          <Typography variant="body2">Clients: {service.totalClients}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 240 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {service.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View details">
                            <IconButton size="small" onClick={() => setViewService(service)}>
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openServiceEditDialog(service)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openServiceDeleteDialog(service)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredServices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No service categories yet. Click "Add service" to create your first entry.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(filteredServices.length / rowsPerPage))}
                page={servicePage}
                onChange={(event, page) => setServicePage(page)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'why-choose' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Why choose this service"
            subheader="Set the hero headline, supporting description, and highlight cards per category/sub-category."
          />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Box
                component="form"
                onSubmit={handleWhyHeroSave}
                sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 2 }}
              >
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                      <TextField
                        label="Hero title"
                        value={whyHeroForm.heroTitle}
                        onChange={(event) => handleWhyHeroChange('heroTitle', event.target.value)}
                        fullWidth
                        required
                      />
                      <TextField
                        label="Hero description"
                        value={whyHeroForm.heroDescription}
                        onChange={(event) => handleWhyHeroChange('heroDescription', event.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                      />
                      <TextField
                        label="Service table title"
                        value={whyHeroForm.tableTitle}
                        onChange={(event) => handleWhyHeroChange('tableTitle', event.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="Service table description"
                        value={whyHeroForm.tableDescription}
                        onChange={(event) => handleWhyHeroChange('tableDescription', event.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                      />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Button type="submit" variant="contained">
                          Save hero content
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                          This content powers the hero and highlights intro on the service detail page.
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ImageUpload
                      label="Hero image"
                      value={whyHeroForm.heroImage}
                      onChange={(value) => handleWhyHeroChange('heroImage', value)}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>

              <Stack spacing={1}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Box>
                    <Typography variant="h6">{whyChoose.tableTitle || 'Service highlights'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {whyChoose.tableDescription || 'Add category and sub-category wise proof points for this service.'}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={openWhyServiceCreateDialog}
                    sx={{ mt: { xs: 1, sm: 0 } }}
                  >
                    Add highlight
                  </Button>
                </Stack>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Sub-category</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pagedWhyServices.map((service) => (
                        <TableRow key={service.id} hover>
                          <TableCell>{service.category || '-'}</TableCell>
                          <TableCell>{service.subcategory || '-'}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{service.title}</TableCell>
                          <TableCell sx={{ maxWidth: 340 }}>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {service.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => openWhyServiceEditDialog(service)}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => openWhyServiceDeleteDialog(service)}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {whyChoose.services.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No highlights yet. Use "Add highlight" to create category-wise reasons to choose you.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack mt={2} alignItems="flex-end">
                  <Pagination
                    count={Math.max(1, Math.ceil(whyChoose.services.length / rowsPerPage))}
                    page={whyServicePage}
                    onChange={(event, page) => setWhyServicePage(page)}
                    color="primary"
                  />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'technologies' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Technologies we support"
            subheader="Organise tech stacks per category to keep the services page dynamic."
            action={
              <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openTechnologyCreateDialog}>
                Add technology block
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedTechnologies.map((tech) => (
                    <TableRow key={tech.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{tech.title}</TableCell>
                      <TableCell>
                        <Box
                          component="img"
                          src={tech.image || imagePlaceholder}
                          alt={`${tech.title} preview`}
                          sx={{ width: 140, height: 80, objectFit: 'cover', borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                          {tech.items.map((item) => (
                            <Chip key={item} label={item} size="small" color="primary" variant="outlined" />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => openTechnologyEditDialog(tech)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openTechnologyDeleteDialog(tech)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {technologies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No technology groups configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(technologies.length / rowsPerPage))}
                page={technologyPage}
                onChange={(event, page) => setTechnologyPage(page)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'benefits' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Benefits"
            subheader="Control benefit cards with images and rich descriptions."
            action={
              <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openBenefitCreateDialog}>
                Add benefit
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedBenefits.map((benefit) => (
                    <TableRow key={benefit.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{benefit.title}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Box
                          component="img"
                          src={benefit.image || imagePlaceholder}
                          alt={`${benefit.title} visual`}
                          sx={{ width: 140, height: 80, objectFit: 'cover', borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 240 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {benefit.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => openBenefitEditDialog(benefit)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openBenefitDeleteDialog(benefit)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {benefits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No benefits configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(benefits.length / rowsPerPage))}
                page={benefitPage}
                onChange={(event, page) => setBenefitPage(page)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'hire' && (
        <Stack spacing={3}>
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Hire developer hero"
              subheader="Control the title, description, and hero image used on the hire developer section."
            />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  value={hireContent.title}
                  onChange={(event) => handleHireContentChange('title', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={hireContent.description}
                  onChange={(event) => handleHireContentChange('description', event.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <ImageUpload
                  label="Hero image"
                  value={hireContent.heroImage}
                  onChange={(value) => handleHireContentChange('heroImage', value)}
                  required
                />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button variant="contained" onClick={handleHeroSave}>
                    Save hero
                  </Button>
                  {heroSaved && (
                    <Typography variant="body2" color="success.main">
                      Saved
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Hire developer services"
              subheader="Manage the service tiles shown within the hire developer menu."
              action={
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openHireServiceCreateDialog}
                >
                  Add hire service
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedHireServices.map((service) => (
                      <TableRow key={service.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{service.title}</TableCell>
                        <TableCell sx={{ maxWidth: 320 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {service.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openHireServiceEditDialog(service)}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => openHireServiceDeleteDialog(service)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {hireContent.services.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            No hire developer services configured yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(hireContent.services.length / rowsPerPage))}
                  page={hireServicePage}
                  onChange={(event, page) => setHireServicePage(page)}
                  color="primary"
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      <Dialog open={serviceDialogOpen} onClose={closeServiceDialog} maxWidth="md" fullWidth>
        <DialogTitle>{serviceDialogMode === 'edit' ? 'Edit service menu' : 'Add service menu'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleServiceSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  value={serviceForm.category}
                  onChange={(event) => handleServiceFormChange('category', event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category slug"
                  value={serviceForm.categorySlug}
                  onChange={(event) => handleServiceFormChange('categorySlug', event.target.value)}
                  fullWidth
                  helperText="Used to generate links for this category."
                />
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">Sub-categories</Typography>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField
                        label="Name"
                        value={subcategoryDraft.name}
                        onChange={(event) => setSubcategoryDraft((prev) => ({ ...prev, name: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        label="Slug"
                        value={subcategoryDraft.slug}
                        onChange={(event) => setSubcategoryDraft((prev) => ({ ...prev, slug: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Button fullWidth variant="outlined" onClick={addSubcategory} startIcon={<AddCircleOutlineIcon />}>
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                    {serviceForm.subcategories.map((item) => (
                      <Chip
                        key={`${item.slug}-${item.name}`}
                        label={`${item.name} (${item.slug})`}
                        onDelete={() => removeSubcategory(item.slug)}
                        size="small"
                      />
                    ))}
                    {!serviceForm.subcategories.length && (
                      <Typography variant="body2" color="text.secondary">
                        Add category and sub-category slugs to link services dynamically.
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Banner title"
                  value={serviceForm.bannerTitle}
                  onChange={(event) => handleServiceFormChange('bannerTitle', event.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Banner subtitle"
                  value={serviceForm.bannerSubtitle}
                  onChange={(event) => handleServiceFormChange('bannerSubtitle', event.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  label="Banner image"
                  value={serviceForm.bannerImage}
                  onChange={(value) => handleServiceFormChange('bannerImage', value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Total services"
                  value={serviceForm.totalServices}
                  onChange={(event) => handleServiceFormChange('totalServices', Number(event.target.value))}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Total projects"
                  value={serviceForm.totalProjects}
                  onChange={(event) => handleServiceFormChange('totalProjects', Number(event.target.value))}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Total clients"
                  value={serviceForm.totalClients}
                  onChange={(event) => handleServiceFormChange('totalClients', Number(event.target.value))}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">FAQs (category or sub-category wise)</Typography>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField
                        label="Question"
                        value={faqDraft.question}
                        onChange={(event) => setFaqDraft((prev) => ({ ...prev, question: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        label="Answer"
                        value={faqDraft.answer}
                        onChange={(event) => setFaqDraft((prev) => ({ ...prev, answer: event.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Button fullWidth variant="outlined" onClick={addFaq} startIcon={<AddCircleOutlineIcon />}>
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <Stack spacing={1}>
                    {serviceForm.faqs.map((faq) => (
                      <Stack key={faq.id} direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {faq.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" flex={1}>
                          {faq.answer}
                        </Typography>
                        <IconButton size="small" onClick={() => removeFaq(faq.id)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                    {!serviceForm.faqs.length && (
                      <Typography variant="body2" color="text.secondary">
                        No FAQs added yet.
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={serviceForm.description}
                  onChange={(event) => handleServiceFormChange('description', event.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeServiceDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleServiceSubmit} variant="contained">
            {serviceDialogMode === 'edit' ? 'Save changes' : 'Add service'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(viewService)} onClose={() => setViewService(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Service details</DialogTitle>
        <DialogContent dividers>
          {viewService && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                {viewService.category}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                <Chip label={viewService.categorySlug || 'No slug set'} size="small" color="primary" />
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                {viewService.subcategories.map((item) => (
                  <Chip key={`${item.slug}-${item.name}`} label={`${item.name} (${item.slug})`} size="small" />
                ))}
              </Stack>
              <Divider />
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {viewService.bannerTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {viewService.bannerSubtitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Banner image preview
                </Typography>
                {viewService.bannerImage ? (
                  <Box
                    component="img"
                    src={viewService.bannerImage}
                    alt={`${viewService.category} banner`}
                    sx={{ width: '100%', borderRadius: 1, objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not set
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={2}>
                <Chip label={`Services: ${viewService.totalServices}`} />
                <Chip label={`Projects: ${viewService.totalProjects}`} />
                <Chip label={`Clients: ${viewService.totalClients}`} />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2">FAQs</Typography>
                {viewService.faqs?.length ? (
                  viewService.faqs.map((faq) => (
                    <Stack key={faq.id} spacing={0.5}>
                      <Typography variant="body2" fontWeight={700}>
                        {faq.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </Stack>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No FAQs added for this service yet.
                  </Typography>
                )}
              </Stack>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {viewService.description || 'No description yet.'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewService(null)} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(serviceToDelete)} onClose={closeServiceDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete service</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{serviceToDelete?.category}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeServiceDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteService} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={whyServiceDialogOpen} onClose={closeWhyServiceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{whyServiceDialogMode === 'edit' ? 'Edit highlight' : 'Add highlight'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleWhyServiceSubmit}>
            <TextField
              select
              label="Category"
              value={whyServiceForm.category}
              onChange={(event) =>
                setWhyServiceForm((prev) => ({ ...prev, category: event.target.value, subcategory: '' }))
              }
              fullWidth
              required
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Sub-category"
              value={whyServiceForm.subcategory}
              onChange={(event) => setWhyServiceForm((prev) => ({ ...prev, subcategory: event.target.value }))}
              fullWidth
              disabled={!whyServiceForm.category || subcategoryOptions.length === 0}
              helperText={
                !whyServiceForm.category
                  ? 'Select a category first'
                  : subcategoryOptions.length === 0
                  ? 'No sub-categories available for this category'
                  : undefined
              }
            >
              {subcategoryOptions.map((option) => (
                <MenuItem key={option.slug} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Highlight title"
              value={whyServiceForm.title}
              onChange={(event) => setWhyServiceForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={whyServiceForm.description}
              onChange={(event) => setWhyServiceForm((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWhyServiceDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleWhyServiceSubmit} variant="contained">
            {whyServiceDialogMode === 'edit' ? 'Save changes' : 'Add highlight'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(whyServiceToDelete)} onClose={closeWhyServiceDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete highlight</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{whyServiceToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWhyServiceDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteWhyService} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={technologyDialogOpen} onClose={closeTechnologyDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{technologyDialogMode === 'edit' ? 'Edit technology block' : 'Add technology block'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleTechnologySubmit}>
            <TextField
              label="Title"
              value={technologyForm.title}
              onChange={(event) => handleTechnologyFormChange('title', event.target.value)}
              fullWidth
              required
            />
            <ImageUpload
              label="Image selection"
              value={technologyForm.image}
              onChange={(value) => handleTechnologyFormChange('image', value)}
              required
            />
            <TextField
              label="Technologies (comma separated)"
              value={formattedTechnologyItems}
              onChange={(event) =>
                handleTechnologyFormChange(
                  'items',
                  event.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                )
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTechnologyDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleTechnologySubmit} variant="contained">
            {technologyDialogMode === 'edit' ? 'Save changes' : 'Add technologies'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(technologyToDelete)} onClose={closeTechnologyDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete technology block</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{technologyToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTechnologyDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteTechnology} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={benefitDialogOpen} onClose={closeBenefitDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{benefitDialogMode === 'edit' ? 'Edit benefit' : 'Add benefit'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleBenefitSubmit}>
            <TextField
              label="Title"
              value={benefitForm.title}
              onChange={(event) => handleBenefitFormChange('title', event.target.value)}
              fullWidth
              required
            />
            <ImageUpload
              label="Image"
              value={benefitForm.image}
              onChange={(value) => handleBenefitFormChange('image', value)}
              required
            />
            <TextField
              label="Description"
              value={benefitForm.description}
              onChange={(event) => handleBenefitFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBenefitDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleBenefitSubmit} variant="contained">
            {benefitDialogMode === 'edit' ? 'Save changes' : 'Add benefit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(benefitToDelete)} onClose={closeBenefitDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete benefit</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{benefitToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBenefitDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteBenefit} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={hireServiceDialogOpen} onClose={closeHireServiceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{hireServiceDialogMode === 'edit' ? 'Edit hire service' : 'Add hire service'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleHireServiceSubmit}>
            <TextField
              label="Title"
              value={hireServiceForm.title}
              onChange={(event) => handleHireServiceFormChange('title', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={hireServiceForm.description}
              onChange={(event) => handleHireServiceFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHireServiceDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleHireServiceSubmit} variant="contained">
            {hireServiceDialogMode === 'edit' ? 'Save changes' : 'Add hire service'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(hireServiceToDelete)} onClose={closeHireServiceDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete hire service</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{hireServiceToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHireServiceDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteHireService} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AdminServicesPage;
