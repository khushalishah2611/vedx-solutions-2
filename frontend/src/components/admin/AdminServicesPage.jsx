import { useMemo, useState } from 'react';
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
        {value ? (
          <Box
            component="img"
            src={value}
            alt={`${label} preview`}
            sx={{
              width: '100%',
              height: 220,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 220,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: 'action.hover',
              borderRadius: 1,
              color: 'text.disabled',
              typography: 'body2',
            }}
          >
            No image selected
          </Box>
        )}
      </Box>
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

  const resetServiceForm = () => setServiceForm(emptyServiceForm);
  const resetTechnologyForm = () => setTechnologyForm(emptyTechnologyForm);
  const resetBenefitForm = () => setBenefitForm(emptyBenefitForm);
  const resetHireServiceForm = () => setHireServiceForm(emptyHireServiceForm);

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
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Sub-categories</TableCell>
                    <TableCell>Banner</TableCell>
                    <TableCell>FAQs</TableCell>
                    <TableCell>Totals</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service) => (
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
                          <Typography variant="body2" fontWeight={600}>
                            {service.bannerTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {service.bannerSubtitle}
                          </Typography>
                        </Stack>
                      </TableCell>
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
                  {services.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No service categories yet. Click "Add service" to create your first entry.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
                  {technologies.map((tech) => (
                    <TableRow key={tech.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{tech.title}</TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {tech.image ? 'Selected image' : 'Not set'}
                          </Typography>
                        </Stack>
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
                  {benefits.map((benefit) => (
                    <TableRow key={benefit.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{benefit.title}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {benefit.image}
                        </Typography>
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
                    {hireContent.services.map((service) => (
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
