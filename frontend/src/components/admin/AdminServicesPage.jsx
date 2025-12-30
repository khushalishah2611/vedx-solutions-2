import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiUrl } from '../../utils/const.js';
import {
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AdminSectionTabs from './AdminSectionTabs.jsx';

const imagePlaceholder = '';

const initialServices = [];
const initialTechnologies = [];
const initialBenefits = [];
const initialBenefitHero = {
  id: '',
  title: '',
  description: '',
  categoryId: '',
  subcategoryId: '',
  categoryName: '',
  subcategoryName: '',
};
const initialHireDevelopers = { title: '', description: '', heroImage: imagePlaceholder, services: [] };
const initialWhyChoose = {
  id: '',
  category: '',
  subcategory: '',
  heroTitle: '',
  heroDescription: '',
  heroImage: imagePlaceholder,
  tableTitle: '',
  tableDescription: '',
  services: [],
};
const initialProcess = [];
const emptyWhyVedxHero = {
  id: '',
  category: '',
  subcategory: '',
  categoryId: '',
  subcategoryId: '',
  categoryName: '',
  subcategoryName: '',
  heroTitle: '',
  heroDescription: '',
  heroImage: imagePlaceholder,
  reasons: [],
};
const initialOurServices = { sliderTitle: '', sliderDescription: '', sliderImage: imagePlaceholder, services: [] };
const initialIndustries = [];
const initialTechSolutions = [];
const initialExpertise = [];

const emptyServiceForm = {
  id: '',
  category: '',
  subcategories: [],
  bannerTitle: '',
  bannerSubtitle: '',
  bannerImage: imagePlaceholder,
  createdAt: new Date().toISOString().split('T')[0],
  totalServices: 0,
  totalProjects: 0,
  totalClients: 0,
  description: '',
  faqs: [],
};

const emptyTechnologyForm = {
  id: '',
  category: '',
  subcategory: '',
  title: '',
  image: imagePlaceholder,
  items: [],
};

const emptyBenefitForm = {
  id: '',
  title: '',
  category: '',
  subcategory: '',
  description: '',
  image: imagePlaceholder,
};

const emptyHireServiceForm = {
  id: '',
  category: '',
  subcategory: '',
  title: '',
  description: '',
  image: imagePlaceholder,
};

const emptyContactButtonForm = {
  id: '',
  title: '',
  description: '',
  image: imagePlaceholder,
  category: '',
  subcategory: '',
};

const emptyProcessForm = {
  id: '',
  title: '',
  description: '',
  image: imagePlaceholder,
};

const emptyWhyVedxForm = {
  id: '',
  title: '',
  description: '',
  image: imagePlaceholder,
  whyVedxId: '',
};

const emptyOurServiceForm = {
  id: '',
  title: '',
  image: imagePlaceholder,
};

const emptyIndustryForm = {
  id: '',
  title: '',
  description: '',
  image: imagePlaceholder,
};

const emptyTechSolutionForm = {
  id: '',
  title: '',
  description: '',
};

const emptyExpertiseHero = {
  title: '',
  description: '',
};

const emptyExpertiseForm = {
  id: '',
  title: '',
  description: '',
  image: imagePlaceholder,
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
          minHeight: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {value ? (
          <Box
            component="img"
            src={value}
            alt={`${label} preview`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" px={2}>
            Banner preview will appear here once you add a title and choose an image.
          </Typography>
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
  const [serviceCategories, setServiceCategories] = useState([]);
  const [serviceSubcategories, setServiceSubcategories] = useState([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDialogMode, setServiceDialogMode] = useState('create');
  const [activeService, setActiveService] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [viewService, setViewService] = useState(null);
  const [faqDraft, setFaqDraft] = useState({ question: '', answer: '' });

  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [technologyDialogOpen, setTechnologyDialogOpen] = useState(false);
  const [technologyDialogMode, setTechnologyDialogMode] = useState('create');
  const [technologyForm, setTechnologyForm] = useState(emptyTechnologyForm);
  const [technologyItemsInput, setTechnologyItemsInput] = useState('');
  const [activeTechnology, setActiveTechnology] = useState(null);
  const [technologyToDelete, setTechnologyToDelete] = useState(null);

  const [benefits, setBenefits] = useState(initialBenefits);
  const [benefitHero, setBenefitHero] = useState(initialBenefitHero);
  const [benefitConfigs, setBenefitConfigs] = useState([]);
  const [selectedBenefitConfigId, setSelectedBenefitConfigId] = useState('');
  const [benefitHeroSaved, setBenefitHeroSaved] = useState(false);
  const [benefitDialogOpen, setBenefitDialogOpen] = useState(false);
  const [benefitDialogMode, setBenefitDialogMode] = useState('create');
  const [benefitForm, setBenefitForm] = useState(emptyBenefitForm);
  const [activeBenefit, setActiveBenefit] = useState(null);
  const [benefitToDelete, setBenefitToDelete] = useState(null);
  const benefitConfigClearedRef = useRef(false);

  const [hireContent, setHireContent] = useState(initialHireDevelopers);
  const [hireServiceDialogOpen, setHireServiceDialogOpen] = useState(false);
  const [hireServiceDialogMode, setHireServiceDialogMode] = useState('create');
  const [hireServiceForm, setHireServiceForm] = useState(emptyHireServiceForm);
  const [activeHireService, setActiveHireService] = useState(null);
  const [hireServiceToDelete, setHireServiceToDelete] = useState(null);
  const [heroSaved, setHeroSaved] = useState(false);

  const [contactButtons, setContactButtons] = useState([]);
  const [contactButtonDialogOpen, setContactButtonDialogOpen] = useState(false);
  const [contactButtonDialogMode, setContactButtonDialogMode] = useState('create');
  const [contactButtonForm, setContactButtonForm] = useState(emptyContactButtonForm);
  const [activeContactButton, setActiveContactButton] = useState(null);
  const [contactButtonToDelete, setContactButtonToDelete] = useState(null);

  const [whyChooseList, setWhyChooseList] = useState([]);
  const [selectedWhyChooseId, setSelectedWhyChooseId] = useState('');
  const [whyChoose, setWhyChoose] = useState(initialWhyChoose);
  const [whyHeroForm, setWhyHeroForm] = useState(initialWhyChoose);
  const [whyServiceDialogOpen, setWhyServiceDialogOpen] = useState(false);
  const [whyServiceDialogMode, setWhyServiceDialogMode] = useState('create');
  const [whyServiceForm, setWhyServiceForm] = useState(emptyWhyServiceForm);
  const [activeWhyService, setActiveWhyService] = useState(null);
  const [whyServiceToDelete, setWhyServiceToDelete] = useState(null);

  const [processList, setProcessList] = useState(initialProcess);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [processDialogMode, setProcessDialogMode] = useState('create');
  const [processForm, setProcessForm] = useState(emptyProcessForm);
  const [activeProcess, setActiveProcess] = useState(null);
  const [processToDelete, setProcessToDelete] = useState(null);

  const [whyVedxList, setWhyVedxList] = useState([]);
  const [selectedWhyVedxId, setSelectedWhyVedxId] = useState('');
  const [whyVedxHeroForm, setWhyVedxHeroForm] = useState(emptyWhyVedxHero);
  const [whyVedxReasons, setWhyVedxReasons] = useState([]);
  const [whyVedxDialogOpen, setWhyVedxDialogOpen] = useState(false);
  const [whyVedxDialogMode, setWhyVedxDialogMode] = useState('create');
  const [whyVedxForm, setWhyVedxForm] = useState(emptyWhyVedxForm);
  const [activeWhyVedx, setActiveWhyVedx] = useState(null);
  const [whyVedxToDelete, setWhyVedxToDelete] = useState(null);

  const [ourServices, setOurServices] = useState(initialOurServices);
  const [ourServicesHeroForm, setOurServicesHeroForm] = useState(initialOurServices);
  const [ourServiceDialogOpen, setOurServiceDialogOpen] = useState(false);
  const [ourServiceDialogMode, setOurServiceDialogMode] = useState('create');
  const [ourServiceForm, setOurServiceForm] = useState(emptyOurServiceForm);
  const [activeOurService, setActiveOurService] = useState(null);
  const [ourServiceToDelete, setOurServiceToDelete] = useState(null);

  const [industries, setIndustries] = useState(initialIndustries);
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false);
  const [industryDialogMode, setIndustryDialogMode] = useState('create');
  const [industryForm, setIndustryForm] = useState(emptyIndustryForm);
  const [activeIndustry, setActiveIndustry] = useState(null);
  const [industryToDelete, setIndustryToDelete] = useState(null);

  const [techSolutions, setTechSolutions] = useState(initialTechSolutions);
  const [techSolutionDialogOpen, setTechSolutionDialogOpen] = useState(false);
  const [techSolutionDialogMode, setTechSolutionDialogMode] = useState('create');
  const [techSolutionForm, setTechSolutionForm] = useState(emptyTechSolutionForm);
  const [activeTechSolution, setActiveTechSolution] = useState(null);
  const [techSolutionToDelete, setTechSolutionToDelete] = useState(null);

  const [expertise, setExpertise] = useState(initialExpertise);
  const [expertiseHeroForm, setExpertiseHeroForm] = useState(initialExpertise);
  const [expertiseDialogOpen, setExpertiseDialogOpen] = useState(false);
  const [expertiseDialogMode, setExpertiseDialogMode] = useState('create');
  const [expertiseForm, setExpertiseForm] = useState(emptyExpertiseForm);
  const [activeExpertise, setActiveExpertise] = useState(null);
  const [expertiseToDelete, setExpertiseToDelete] = useState(null);

  const rowsPerPage = 5;
  const [serviceDateFilter, setServiceDateFilter] = useState('all');
  const [serviceDateRange, setServiceDateRange] = useState({ start: '', end: '' });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [servicePage, setServicePage] = useState(1);
  const [benefitPage, setBenefitPage] = useState(1);
  const [whyServicePage, setWhyServicePage] = useState(1);
  const [hireServicePage, setHireServicePage] = useState(1);
  const [processPage, setProcessPage] = useState(1);
  const [whyVedxPage, setWhyVedxPage] = useState(1);
  const [industryPage, setIndustryPage] = useState(1);
  const [techSolutionPage, setTechSolutionPage] = useState(1);
  const [expertisePage, setExpertisePage] = useState(1);
  const [contactButtonPage, setContactButtonPage] = useState(1);

  const normalizeDate = (value) => (value ? String(value).split('T')[0] : '');

  const requireToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Your session expired. Please log in again.');
    }
    return token;
  };

  const authHeaders = () => ({
    Authorization: `Bearer ${requireToken()}`,
    'Content-Type': 'application/json',
  });

  const handleRequestError = (err, fallback) => {
    console.error(fallback, err);
    alert(err?.message || fallback);
  };

  const normalizeServiceMenu = (menu) => ({
    ...menu,
    createdAt: normalizeDate(menu.createdAt),
    subcategories: menu.subcategories || [],
    faqs: menu.faqs || [],
  });

  const normalizeTechnology = (tech) => ({
    ...tech,
    items: tech.items || [],
    category: tech.category || '',
    subcategory: tech.subcategory || '',
  });

  const normalizeBenefit = (benefit) => ({
    ...benefit,
    category: benefit.category || '',
    subcategory: benefit.subcategory || '',
  });

  const normalizeBenefitConfig = (config) => ({
    id: config?.id || '',
    title: config?.title || '',
    description: config?.description || '',
    categoryId: config?.categoryId || '',
    subcategoryId: config?.subcategoryId || '',
    categoryName: config?.categoryName || '',
    subcategoryName: config?.subcategoryName || '',
  });

  const normalizeContactButton = (button) => ({
    id: button.id,
    title: button.title,
    description: button.description || '',
    image: button.image || imagePlaceholder,
    category: button.category || '',
    subcategory: button.subcategory || '',
  });

  const normalizeServiceCategory = (category) => ({
    id: category.id,
    name: category.name || '',
    subCategories: category.subCategories || [],
  });

  const normalizeServiceSubcategory = (subcategory) => ({
    id: subcategory.id,
    name: subcategory.name || '',
    categoryId: subcategory.categoryId,
    categoryName: subcategory.category?.name || '',
  });

  const normalizeProcess = (process) => ({
    ...process,
    createdAt: normalizeDate(process.createdAt),
    subcategory: process.subcategory || '',
    serviceId: process.serviceId || '',
  });

  const normalizeHireService = (service) => ({
    ...service,
    category: service.category || '',
    subcategory: service.subcategory || '',
  });

  const normalizeWhyService = (service) => ({
    ...service,
    category: service.category || '',
    subcategory: service.subcategory || '',
  });

  const normalizeWhyChooseHero = (item) => ({
    id: item.id,
    category: item.category || '',
    subcategory: item.subcategory || '',
    heroTitle: item.heroTitle || '',
    heroDescription: item.heroDescription || '',
    heroImage: item.heroImage || imagePlaceholder,
    tableTitle: item.tableTitle || '',
    tableDescription: item.tableDescription || '',
    services: (item.services || []).map(normalizeWhyService),
  });

  const normalizeWhyVedxReason = (reason) => ({
    ...reason,
    whyVedxId: reason.whyVedxId || '',
  });

  const normalizeWhyVedx = (item) => ({
    id: item.id,
    category: item.category || item.categoryName || '',
    subcategory: item.subcategory || item.subcategoryName || '',
    categoryId: item.categoryId || '',
    subcategoryId: item.subcategoryId || '',
    categoryName: item.categoryName || item.category || '',
    subcategoryName: item.subcategoryName || item.subcategory || '',
    heroTitle: item.heroTitle || '',
    heroDescription: item.heroDescription || '',
    heroImage: item.heroImage || imagePlaceholder,
    reasons: (item.reasons || []).map(normalizeWhyVedxReason),
  });

  const loadServiceMenus = useCallback(async ({ category, subcategory } = {}) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);

      const query = params.toString();
      const response = await fetch(apiUrl(`/api/service-menus${query ? `?${query}` : ''}`));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load service menus');
      setServices((data || []).map(normalizeServiceMenu));
    } catch (err) {
      console.error('Failed to load service menus', err);
    }
  }, []);

  const loadTechnologies = useCallback(async ({ category, subcategory } = {}) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);

      const response = await fetch(apiUrl(`/api/technologies${params.toString() ? `?${params.toString()}` : ''}`));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load technologies');
      setTechnologies((data || []).map(normalizeTechnology));
    } catch (err) {
      console.error('Failed to load technologies', err);
    }
  }, []);

  const loadServiceCategories = async () => {
    try {
      const response = await fetch(apiUrl('/api/service-categories'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load categories');
      setServiceCategories((data.categories || []).map(normalizeServiceCategory));
    } catch (err) {
      console.error('Failed to load service categories', err);
    }
  };

  const loadServiceSubcategories = async () => {
    try {
      const response = await fetch(apiUrl('/api/service-subcategories'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load sub-categories');
      setServiceSubcategories((data.subCategories || []).map(normalizeServiceSubcategory));
    } catch (err) {
      console.error('Failed to load service subcategories', err);
    }
  };

  const loadBenefits = useCallback(async ({ category, subcategory } = {}) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);

      const response = await fetch(apiUrl(`/api/benefits${params.toString() ? `?${params.toString()}` : ''}`));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load benefits');
      setBenefits((data || []).map(normalizeBenefit));
    } catch (err) {
      console.error('Failed to load benefits', err);
    }
  }, []);

  const loadBenefitConfigs = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/benefit-configs'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load benefit configuration');
      const normalized = (data || []).map(normalizeBenefitConfig);
      setBenefitConfigs(normalized);
    } catch (err) {
      console.error('Failed to load benefit configuration', err);
    }
  }, []);

  const loadProcesses = async () => {
    try {
      const response = await fetch(apiUrl('/api/service-processes'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load processes');
      setProcessList((data || []).map(normalizeProcess));
    } catch (err) {
      console.error('Failed to load processes', err);
    }
  };

  const loadHireContent = async () => {
    try {
      const response = await fetch(apiUrl('/api/hire-developer'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || '');
      setHireContent({
        title: data.title || '',
        description: data.description || '',
        heroImage: data.heroImage || imagePlaceholder,
        services: data.services?.map(normalizeHireService) || [],
      });
    } catch (err) {
      console.error('Failed to load hire developer config', err);
    }
  };

  const loadHireServices = useCallback(async ({ category, subcategory } = {}) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);

      const response = await fetch(apiUrl(`/api/hire-services${params.toString() ? `?${params.toString()}` : ''}`));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load hire services');
      setHireContent((prev) => ({ ...prev, services: (data || []).map(normalizeHireService) }));
    } catch (err) {
      console.error('Failed to load hire services', err);
    }
  }, []);

  const loadContactButtons = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/contact-buttons'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load contact buttons');
      setContactButtons((data || []).map(normalizeContactButton));
    } catch (err) {
      console.error('Failed to load contact buttons', err);
    }
  }, []);

  const loadWhyChoose = useCallback(async ({ category, subcategory } = {}) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);

      const response = await fetch(apiUrl(`/api/why-choose${params.toString() ? `?${params.toString()}` : ''}`));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || '');
      const normalized = (data || []).map(normalizeWhyChooseHero);
      const active = normalized[0] || initialWhyChoose;
      setWhyChoose(active);
      setWhyHeroForm({ ...active });
      setWhyChooseList(normalized);
      setSelectedWhyChooseId(active.id || '');
      setWhyServicePage(1);
    } catch (err) {
      console.error('Failed to load why choose config', err);
    }
  }, []);

  const loadWhyServices = useCallback(async (whyChooseId, { category, subcategory } = {}) => {
    try {
      const params = new URLSearchParams();
      if (whyChooseId) params.append('whyChooseId', String(whyChooseId));
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);
      const response = await fetch(apiUrl(`/api/why-services${params.toString() ? `?${params.toString()}` : ''}`));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load why services');
      setWhyChoose((prev) => ({ ...prev, services: (data || []).map(normalizeWhyService) }));
    } catch (err) {
      console.error('Failed to load why services', err);
    }
  }, []);

  const loadWhyVedx = useCallback(
    async ({ category, subcategory } = {}) => {
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        params.append('includeReasons', 'true');

        const response = await fetch(apiUrl(`/api/why-vedx?${params.toString()}`));
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || '');
        const list = Array.isArray(data) ? data.map(normalizeWhyVedx) : data ? [normalizeWhyVedx(data)] : [];

        setWhyVedxList(list);

        const active =
          list.find((item) => String(item.id) === String(selectedWhyVedxId)) || list[0] || emptyWhyVedxHero;
        setSelectedWhyVedxId(active.id || '');
        setWhyVedxHeroForm(active.id ? active : emptyWhyVedxHero);
        setWhyVedxReasons(active.reasons || []);
      } catch (err) {
        console.error('Failed to load why VEDX config', err);
      }
    },
    [selectedWhyVedxId]
  );

  const loadWhyVedxReasons = useCallback(async (whyVedxId, { category, subcategory } = {}) => {
    try {
      const params = new URLSearchParams();
      if (whyVedxId) params.append('whyVedxId', String(whyVedxId));
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);
      const response = await fetch(apiUrl(`/api/why-vedx-reasons${params.toString() ? `?${params.toString()}` : ''}`));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load reasons');
      setWhyVedxReasons((data || []).map(normalizeWhyVedxReason));
    } catch (err) {
      console.error('Failed to load why VEDX reasons', err);
    }
  }, []);

  useEffect(() => {
    loadServiceCategories();
    loadServiceSubcategories();
    loadProcesses();
    loadHireContent();
    loadWhyVedx();
    loadBenefitConfigs();
    loadContactButtons();
  }, [loadBenefitConfigs, loadWhyVedx]);

  useEffect(() => {
    const filters = {
      category: categoryFilter || undefined,
      subcategory: subcategoryFilter || undefined,
    };

    loadServiceMenus(filters);
    loadTechnologies(filters);
    loadBenefits(filters);
    loadHireServices(filters);
    loadWhyChoose(filters);
    loadWhyVedx(filters);
  }, [categoryFilter, loadBenefits, loadHireServices, loadServiceMenus, loadTechnologies, loadWhyChoose, loadWhyVedx, subcategoryFilter]);

  useEffect(() => {
    if (!selectedWhyChooseId) {
      setWhyChoose(initialWhyChoose);
      setWhyHeroForm(initialWhyChoose);
      setWhyServicePage(1);
      return;
    }

    const existing = whyChooseList.find((item) => String(item.id) === String(selectedWhyChooseId));
    if (existing) {
      setWhyChoose(existing);
      setWhyHeroForm(existing);
      setWhyServicePage(1);
      loadWhyServices(existing.id, {
        category: categoryFilter || undefined,
        subcategory: subcategoryFilter || undefined,
      });
    }
  }, [categoryFilter, loadWhyServices, selectedWhyChooseId, subcategoryFilter, whyChooseList]);

  useEffect(() => {
    const active = whyVedxList.find((item) => String(item.id) === String(selectedWhyVedxId));
    if (active) {
      setWhyVedxHeroForm(active);
      loadWhyVedxReasons(active.id, {
        category: categoryFilter || undefined,
        subcategory: subcategoryFilter || undefined,
      });
    } else {
      setWhyVedxHeroForm(emptyWhyVedxHero);
      setWhyVedxReasons([]);
    }
    setWhyVedxPage(1);
  }, [categoryFilter, loadWhyVedxReasons, selectedWhyVedxId, subcategoryFilter, whyVedxList]);

  const resetServiceForm = () =>
    setServiceForm({ ...emptyServiceForm, createdAt: new Date().toISOString().split('T')[0] });
  const resetTechnologyForm = () => {
    setTechnologyForm(emptyTechnologyForm);
    setTechnologyItemsInput('');
  };
  const resetBenefitForm = () => setBenefitForm(emptyBenefitForm);
  const resetHireServiceForm = () => setHireServiceForm(emptyHireServiceForm);
  const resetWhyServiceForm = () => setWhyServiceForm(emptyWhyServiceForm);
  const resetProcessForm = () => setProcessForm(emptyProcessForm);
  const resetWhyVedxForm = () => setWhyVedxForm({ ...emptyWhyVedxForm, whyVedxId: selectedWhyVedxId || '' });
  const resetOurServiceForm = () => setOurServiceForm(emptyOurServiceForm);
  const resetIndustryForm = () => setIndustryForm(emptyIndustryForm);
  const resetTechSolutionForm = () => setTechSolutionForm(emptyTechSolutionForm);
  const resetExpertiseForm = () => setExpertiseForm(emptyExpertiseForm);

  const handleServiceFormChange = (field, value) => {
    setServiceForm((prev) => ({ ...prev, [field]: value }));
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

  const handleBenefitHeroChange = (field, value) => {
    setBenefitHeroSaved(false);
    setBenefitHero((prev) => ({ ...prev, [field]: value }));
  };

  const handleBenefitConfigSelect = (config) => {
    const nextId = config?.id ? String(config.id) : '';
    benefitConfigClearedRef.current = !nextId;
    setSelectedBenefitConfigId(nextId);

    if (!nextId) {
      setBenefitHero(initialBenefitHero);
      setBenefitHeroSaved(false);
      setBenefitPage(1);
    }
  };

  const handleNewBenefitConfig = () => {
    benefitConfigClearedRef.current = true;
    setSelectedBenefitConfigId('');
    setBenefitHero(initialBenefitHero);
    setBenefitHeroSaved(false);
    setBenefitPage(1);
  };

  const handleHireServiceFormChange = (field, value) => {
    setHireServiceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHireContentChange = (field, value) => {
    setHeroSaved(false);
    setHireContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/hire-developer'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: hireContent.title,
          description: hireContent.description,
          heroImage: hireContent.heroImage,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save hero content');
      setHireContent((prev) => ({ ...prev, ...data, services: prev.services }));
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 3000);
    } catch (err) {
      handleRequestError(err, 'Unable to save hero content');
    }
  };

  const handleBenefitHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const isEdit = Boolean(selectedBenefitConfigId);
      const url = isEdit
        ? apiUrl(`/api/benefit-configs/${selectedBenefitConfigId}`)
        : apiUrl('/api/benefit-configs');
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          id: isEdit ? selectedBenefitConfigId : undefined,
          title: benefitHero.title,
          description: benefitHero.description,
          categoryId: benefitHero.categoryId || null,
          subcategoryId: benefitHero.subcategoryId || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save benefits copy');
      const normalized = normalizeBenefitConfig(data);
      setBenefitHero(normalized);
      setBenefitConfigs((prev) => {
        const exists = prev.some((item) => String(item.id) === String(normalized.id));
        if (exists) {
          return prev.map((item) => (String(item.id) === String(normalized.id) ? normalized : item));
        }
        return [normalized, ...prev];
      });
      setSelectedBenefitConfigId(String(normalized.id));
      setBenefitHeroSaved(true);
      setTimeout(() => setBenefitHeroSaved(false), 3000);
    } catch (err) {
      handleRequestError(err, 'Unable to save benefits copy');
    }
  };

  useEffect(() => {
    if (benefitConfigs.length === 0) {
      setSelectedBenefitConfigId('');
      setBenefitHero(initialBenefitHero);
      setBenefitPage(1);
      benefitConfigClearedRef.current = false;
      return;
    }

    if (!selectedBenefitConfigId) {
      if (!benefitConfigClearedRef.current) {
        setSelectedBenefitConfigId(String(benefitConfigs[0].id));
      }
      return;
    }

    const active = benefitConfigs.find((config) => String(config.id) === String(selectedBenefitConfigId));
    if (active) {
      setBenefitHero(active);
      setBenefitPage(1);
      benefitConfigClearedRef.current = false;
    }
  }, [benefitConfigs, selectedBenefitConfigId]);

  const handleProcessChange = (field, value) => {
    setProcessForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleWhyVedxHeroChange = (field, value) => {
    setWhyVedxHeroForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === 'categoryId') {
        const availableSubcategories = serviceSubcategories.filter(
          (subcategory) => Number(subcategory.categoryId) === Number(value)
        );

        next.category = categoryIdToName.get(String(value)) || '';
        next.categoryName = next.category;

        if (
          next.subcategoryId &&
          !availableSubcategories.some((subcategory) => String(subcategory.id) === String(next.subcategoryId))
        ) {
          next.subcategoryId = '';
          next.subcategory = '';
          next.subcategoryName = '';
        }
      }

      if (field === 'subcategoryId') {
        const subcategoryName = subcategoryIdToName.get(String(value)) || '';
        next.subcategory = subcategoryName;
        next.subcategoryName = subcategoryName;
      }

      return next;
    });
  };

  const handleOurServicesHeroChange = (field, value) => {
    setOurServicesHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpertiseHeroChange = (field, value) => {
    setExpertiseHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleWhyHeroChange = (field, value) => {
    setWhyHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactButtonFormChange = (field, value) => {
    if (field === 'category') {
      setContactButtonForm((prev) => {
        const allowedSubcategories = subcategoryLookup.get(value) || [];
        const nextSubcategory = allowedSubcategories.includes(prev.subcategory) ? prev.subcategory : '';
        return { ...prev, category: value, subcategory: nextSubcategory };
      });
      return;
    }

    setContactButtonForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleWhyHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/why-choose'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          id: selectedWhyChooseId || undefined,
          category: whyHeroForm.category,
          subcategory: whyHeroForm.subcategory,
          heroTitle: whyHeroForm.heroTitle,
          heroDescription: whyHeroForm.heroDescription,
          heroImage: whyHeroForm.heroImage,
          tableTitle: whyHeroForm.tableTitle,
          tableDescription: whyHeroForm.tableDescription,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save Why Choose hero');
      const normalized = normalizeWhyChooseHero(data);
      setWhyChoose(normalized);
      setWhyHeroForm(normalized);
      setSelectedWhyChooseId(String(normalized.id));
      setWhyChooseList((prev) => {
        const exists = prev.some((item) => item.id === normalized.id);
        return exists ? prev.map((item) => (item.id === normalized.id ? normalized : item)) : [normalized, ...prev];
      });
    } catch (err) {
      handleRequestError(err, 'Unable to save Why Choose hero');
    }
  };

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (serviceCategories || [])
            .map((category) => category.name)
            .filter((name) => Boolean(name && name.trim()))
        )
      ).map((categoryName) => {
        const category = serviceCategories.find((item) => item.name === categoryName);
        return {
          value: categoryName,
          label: categoryName,
          id: category?.id || '',
        };
      }),
    [serviceCategories]
  );

  const categoryIdToName = useMemo(() => {
    const lookup = new Map();
    serviceCategories.forEach((category) => {
      lookup.set(String(category.id), category.name);
    });
    return lookup;
  }, [serviceCategories]);

  const subcategoryIdToName = useMemo(() => {
    const lookup = new Map();
    serviceSubcategories.forEach((subcategory) => {
      lookup.set(String(subcategory.id), subcategory.name);
    });
    return lookup;
  }, [serviceSubcategories]);

  const subcategoryLookup = useMemo(() => {
    const lookup = new Map();

    serviceCategories.forEach((category) => {
      if (category.name) {
        lookup.set(category.name, []);
      }
    });

    serviceSubcategories.forEach((subcategory) => {
      if (!subcategory.name) return;

      const categoryName =
        serviceCategories.find((category) => category.id === subcategory.categoryId)?.name ||
        subcategory.categoryName ||
        '';

      if (!categoryName) return;

      const existing = lookup.get(categoryName) || [];
      if (!existing.includes(subcategory.name)) {
        lookup.set(categoryName, [...existing, subcategory.name]);
      }
    });

    return lookup;
  }, [serviceCategories, serviceSubcategories]);

  const allSubcategoryOptions = useMemo(
    () =>
      Array.from(
        new Set(serviceSubcategories.map((subcategory) => subcategory.name).filter((name) => Boolean(name)))
      ),
    [serviceSubcategories]
  );

  const whyVedxOptions = useMemo(
    () => whyVedxList.map((item) => ({ value: item.id, label: item.heroTitle || `Hero ${item.id}` })),
    [whyVedxList]
  );

  const whyVedxSubcategoryOptions = useMemo(() => {
    const base = whyVedxHeroForm.categoryId
      ? serviceSubcategories.filter((item) => Number(item.categoryId) === Number(whyVedxHeroForm.categoryId))
      : serviceSubcategories;

    return base.map((subcategory) => ({ value: subcategory.id, label: subcategory.name }));
  }, [serviceSubcategories, whyVedxHeroForm.categoryId]);

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const matchesCategory = categoryFilter
          ? service.category === categoryFilter
          : true;
        const matchesSubcategory = subcategoryFilter
          ? service.subcategories.some((subcategory) => subcategory.name === subcategoryFilter)
          : true;

        return (
          matchesDateFilter(service.createdAt, serviceDateFilter, serviceDateRange) &&
          matchesCategory &&
          matchesSubcategory
        );
      }),
    [categoryFilter, serviceDateFilter, serviceDateRange, services, subcategoryFilter]
  );

  const pagedServices = useMemo(() => {
    const start = (servicePage - 1) * rowsPerPage;
    return filteredServices.slice(start, start + rowsPerPage);
  }, [filteredServices, rowsPerPage, servicePage]);

  const groupedServices = useMemo(() => {
    const lookup = new Map();

    pagedServices.forEach((service) => {
      const key = service.category || 'Uncategorised';
      const existing = lookup.get(key) || [];
      lookup.set(key, [...existing, service]);
    });

    return Array.from(lookup.entries()).map(([category, services]) => ({ category, services }));
  }, [pagedServices]);

  const serviceLookupById = useMemo(
    () => new Map(services.map((service) => [String(service.id), service])),
    [services]
  );

  const filteredProcesses = useMemo(
    () =>
      processList.filter((item) => {
        const linkedService = serviceLookupById.get(String(item.serviceId));
        const matchesCategory = categoryFilter ? linkedService?.category === categoryFilter : true;
        const matchesSubcategory = subcategoryFilter
          ? item.subcategory === subcategoryFilter ||
            linkedService?.subcategories?.some((subcategory) => subcategory.name === subcategoryFilter)
          : true;

        return matchesCategory && matchesSubcategory;
      }),
    [categoryFilter, processList, serviceLookupById, subcategoryFilter]
  );

  const pagedProcesses = useMemo(() => {
    const start = (processPage - 1) * rowsPerPage;
    return filteredProcesses.slice(start, start + rowsPerPage);
  }, [filteredProcesses, processPage, rowsPerPage]);

  useEffect(() => {
    setServicePage(1);
  }, [categoryFilter, serviceDateFilter, serviceDateRange.end, serviceDateRange.start, subcategoryFilter]);

  useEffect(() => {
    setBenefitPage(1);
    setHireServicePage(1);
    setWhyServicePage(1);
    setProcessPage(1);
    setContactButtonPage(1);
  }, [categoryFilter, subcategoryFilter]);

  const benefitHeroCategoryOptions = useMemo(
    () => serviceCategories.map((category) => ({ value: category.id, label: category.name })),
    [serviceCategories]
  );

  const benefitHeroSubcategoryOptions = useMemo(() => {
    const base = benefitHero.categoryId
      ? serviceSubcategories.filter((item) => Number(item.categoryId) === Number(benefitHero.categoryId))
      : serviceSubcategories;

    return base.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.name,
      categoryId: subcategory.categoryId,
    }));
  }, [benefitHero.categoryId, serviceSubcategories]);

  useEffect(() => {
    if (!categoryFilter) {
      setSubcategoryFilter('');
      return;
    }

    const allowed = subcategoryLookup.get(categoryFilter) || [];
    if (subcategoryFilter && !allowed.includes(subcategoryFilter)) {
      setSubcategoryFilter('');
    }
  }, [categoryFilter, subcategoryFilter, subcategoryLookup]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredServices.length / rowsPerPage));
    setServicePage((prev) => Math.min(prev, maxPage));
  }, [filteredServices.length, rowsPerPage]);

  const activeBenefitConfig = useMemo(
    () => benefitConfigs.find((item) => String(item.id) === String(selectedBenefitConfigId)),
    [benefitConfigs, selectedBenefitConfigId]
  );

  const benefitConfigCategoryName = useMemo(() => {
    if (!activeBenefitConfig?.categoryId) return activeBenefitConfig?.categoryName || '';
    return categoryIdToName.get(String(activeBenefitConfig.categoryId)) || activeBenefitConfig.categoryName || '';
  }, [activeBenefitConfig, categoryIdToName]);

  const benefitConfigSubcategoryName = useMemo(() => {
    if (!activeBenefitConfig?.subcategoryId) return activeBenefitConfig?.subcategoryName || '';
    return (
      subcategoryIdToName.get(String(activeBenefitConfig.subcategoryId)) || activeBenefitConfig.subcategoryName || ''
    );
  }, [activeBenefitConfig, subcategoryIdToName]);

  const visibleBenefits = useMemo(() => {
    if (!selectedBenefitConfigId) return [];

    return benefits.filter((benefit) => {
      const matchesCategory = benefitConfigCategoryName
        ? benefit.category === benefitConfigCategoryName
        : true;
      const matchesSubcategory = benefitConfigSubcategoryName
        ? benefit.subcategory === benefitConfigSubcategoryName
        : true;

      return matchesCategory && matchesSubcategory;
    });
  }, [benefits, benefitConfigCategoryName, benefitConfigSubcategoryName, selectedBenefitConfigId]);

  const pagedBenefits = useMemo(() => {
    const start = (benefitPage - 1) * rowsPerPage;
    return visibleBenefits.slice(start, start + rowsPerPage);
  }, [benefitPage, rowsPerPage, visibleBenefits]);

  const groupedBenefits = useMemo(() => {
    const lookup = new Map();

    pagedBenefits.forEach((benefit) => {
      const categoryKey = benefit.category || 'Uncategorised';
      const existing = lookup.get(categoryKey) || [];
      lookup.set(categoryKey, [...existing, benefit]);
    });

    return Array.from(lookup.entries()).map(([category, items]) => ({ category, items }));
  }, [pagedBenefits]);

  const groupedTechnologies = useMemo(() => {
    const lookup = new Map();

    technologies.forEach((tech) => {
      const title = tech.title || 'Untitled';
      const existing = lookup.get(title) || [];
      lookup.set(title, [...existing, tech]);
    });

    return Array.from(lookup.entries()).map(([title, items]) => ({
      title,
      items: items.sort((a, b) => {
        const categoryCompare = (a.category || '').localeCompare(b.category || '');
        if (categoryCompare !== 0) return categoryCompare;
        const subcategoryCompare = (a.subcategory || '').localeCompare(b.subcategory || '');
        if (subcategoryCompare !== 0) return subcategoryCompare;
        return String(a.id ?? '').localeCompare(String(b.id ?? ''));
      }),
    }));
  }, [technologies]);

  const activeWhyVedxReasons = useMemo(() => {
    if (!selectedWhyVedxId) return whyVedxReasons;
    return whyVedxReasons.filter((reason) => String(reason.whyVedxId) === String(selectedWhyVedxId));
  }, [selectedWhyVedxId, whyVedxReasons]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(activeWhyVedxReasons.length / rowsPerPage));
    setWhyVedxPage((prev) => Math.min(prev, maxPage));
  }, [activeWhyVedxReasons.length, rowsPerPage]);

  const pagedWhyServices = useMemo(() => {
    const start = (whyServicePage - 1) * rowsPerPage;
    return whyChoose.services.slice(start, start + rowsPerPage);
  }, [whyChoose.services, rowsPerPage, whyServicePage]);

  const pagedHireServices = useMemo(() => {
    const start = (hireServicePage - 1) * rowsPerPage;
    return hireContent.services.slice(start, start + rowsPerPage);
  }, [hireContent.services, rowsPerPage, hireServicePage]);

  const groupedHireServices = useMemo(() => {
    const lookup = new Map();

    pagedHireServices.forEach((service) => {
      const category = service.category || 'Uncategorised';
      const existing = lookup.get(category) || [];
      lookup.set(category, [...existing, service]);
    });

    return Array.from(lookup.entries()).map(([category, items]) => ({
      category,
      services: items,
    }));
  }, [pagedHireServices]);

  const filteredContactButtons = useMemo(
    () =>
      contactButtons.filter((button) => {
        const matchesCategory = categoryFilter ? button.category === categoryFilter : true;
        const matchesSubcategory = subcategoryFilter ? button.subcategory === subcategoryFilter : true;
        return matchesCategory && matchesSubcategory;
      }),
    [categoryFilter, contactButtons, subcategoryFilter]
  );

  const pagedContactButtons = useMemo(() => {
    const start = (contactButtonPage - 1) * rowsPerPage;
    return filteredContactButtons.slice(start, start + rowsPerPage);
  }, [contactButtonPage, filteredContactButtons, rowsPerPage]);

  const groupedContactButtons = useMemo(() => {
    const lookup = new Map();

    pagedContactButtons.forEach((button) => {
      const categoryKey = button.category || 'Uncategorised';
      const existing = lookup.get(categoryKey) || [];
      lookup.set(categoryKey, [...existing, button]);
    });

    return Array.from(lookup.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [pagedContactButtons]);

  useEffect(() => {
    const maxBenefitPage = Math.max(1, Math.ceil(visibleBenefits.length / rowsPerPage));
    setBenefitPage((prev) => Math.min(prev, maxBenefitPage));
  }, [rowsPerPage, visibleBenefits.length]);

  const hasBenefitConfig = Boolean(selectedBenefitConfigId);

  useEffect(() => {
    const maxWhyPage = Math.max(1, Math.ceil(whyChoose.services.length / rowsPerPage));
    setWhyServicePage((prev) => Math.min(prev, maxWhyPage));
  }, [whyChoose.services.length, rowsPerPage]);

  useEffect(() => {
    const maxHireServicePage = Math.max(1, Math.ceil(hireContent.services.length / rowsPerPage));
    setHireServicePage((prev) => Math.min(prev, maxHireServicePage));
  }, [hireContent.services.length, rowsPerPage]);

  useEffect(() => {
    const maxProcessPage = Math.max(1, Math.ceil(filteredProcesses.length / rowsPerPage));
    setProcessPage((prev) => Math.min(prev, maxProcessPage));
  }, [filteredProcesses.length, rowsPerPage]);

  useEffect(() => {
    const maxContactPage = Math.max(1, Math.ceil(filteredContactButtons.length / rowsPerPage));
    setContactButtonPage((prev) => Math.min(prev, maxContactPage));
  }, [filteredContactButtons.length, rowsPerPage]);

  useEffect(() => {
    setOurServicesHeroForm((prev) => ({
      ...prev,
      sliderTitle: ourServices.sliderTitle,
      sliderDescription: ourServices.sliderDescription,
      sliderImage: ourServices.sliderImage,
    }));
  }, [ourServices.sliderDescription, ourServices.sliderImage, ourServices.sliderTitle]);

  const openServiceCreateDialog = () => {
    setServiceDialogMode('create');
    setActiveService(null);
    resetServiceForm();
    setFaqDraft({ question: '', answer: '' });
    setServiceDialogOpen(true);
  };

  const openServiceEditDialog = (service) => {
    setServiceDialogMode('edit');
    setActiveService(service);
    setServiceForm({ ...service });
    setFaqDraft({ question: '', answer: '' });
    setServiceDialogOpen(true);
  };

  const closeServiceDialog = () => {
    setServiceDialogOpen(false);
    setActiveService(null);
  };

  const handleServiceSubmit = async (event) => {
    event?.preventDefault();
    if (!serviceForm.category.trim()) return;

    const payload = {
      category: serviceForm.category,
      bannerTitle: serviceForm.bannerTitle,
      bannerSubtitle: serviceForm.bannerSubtitle,
      bannerImage: serviceForm.bannerImage,
      totalServices: Number(serviceForm.totalServices) || 0,
      totalProjects: Number(serviceForm.totalProjects) || 0,
      totalClients: Number(serviceForm.totalClients) || 0,
      description: serviceForm.description,
      subcategories: serviceForm.subcategories.map((subcategory) => ({ name: subcategory.name })),
      faqs: serviceForm.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
    };

    const isEdit = serviceDialogMode === 'edit' && activeService;
    const url = isEdit
      ? apiUrl(`/api/service-menus/${activeService.id}`)
      : apiUrl('/api/service-menus');

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save service menu');

      const normalized = normalizeServiceMenu(data);
      setServices((prev) =>
        isEdit ? prev.map((service) => (service.id === normalized.id ? normalized : service)) : [normalized, ...prev]
      );
      closeServiceDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save service menu');
    }
  };

  const openServiceDeleteDialog = (service) => setServiceToDelete(service);
  const closeServiceDeleteDialog = () => setServiceToDelete(null);
  const handleConfirmDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/service-menus/${serviceToDelete.id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete service');
      setServices((prev) => prev.filter((service) => service.id !== serviceToDelete.id));
      closeServiceDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete service');
    }
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
    setTechnologyItemsInput((technology.items || []).join(', '));
    setTechnologyDialogOpen(true);
  };

  const closeTechnologyDialog = () => {
    setTechnologyDialogOpen(false);
    setActiveTechnology(null);
    setTechnologyItemsInput('');
  };

  const handleTechnologySubmit = async (event) => {
    event?.preventDefault();
    if (!technologyForm.title.trim() || !technologyForm.category.trim() || !technologyForm.image) return;

    const payload = {
      category: technologyForm.category,
      subcategory: technologyForm.subcategory || '',
      title: technologyForm.title,
      image: technologyForm.image,
      items: technologyForm.items || [],
    };

    const isEdit = technologyDialogMode === 'edit' && activeTechnology;
    const url = isEdit
      ? apiUrl(`/api/technologies/${activeTechnology.id}`)
      : apiUrl('/api/technologies');

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save technology');

      const normalized = normalizeTechnology(data);
      setTechnologies((prev) =>
        isEdit ? prev.map((tech) => (tech.id === normalized.id ? normalized : tech)) : [normalized, ...prev]
      );
      closeTechnologyDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save technology');
    }
  };

  const openTechnologyDeleteDialog = (technology) => setTechnologyToDelete(technology);
  const closeTechnologyDeleteDialog = () => setTechnologyToDelete(null);
  const handleConfirmDeleteTechnology = async () => {
    if (!technologyToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/technologies/${technologyToDelete.id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete technology');
      setTechnologies((prev) => prev.filter((tech) => tech.id !== technologyToDelete.id));
      closeTechnologyDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete technology');
    }
  };

  const openBenefitCreateDialog = () => {
    if (!hasBenefitConfig) {
      handleRequestError(new Error('Please create and save a benefit config before adding benefits'));
      return;
    }

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

  const handleBenefitSubmit = async (event) => {
    event?.preventDefault();
    if (!benefitForm.title.trim() || !benefitForm.description.trim() || !benefitForm.image) return;

    const payload = {
      title: benefitForm.title,
      category: benefitForm.category,
      subcategory: benefitForm.subcategory,
      description: benefitForm.description,
      image: benefitForm.image,
    };

    const isEdit = benefitDialogMode === 'edit' && activeBenefit;
    const url = isEdit
      ? apiUrl(`/api/benefits/${activeBenefit.id}`)
      : apiUrl('/api/benefits');

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save benefit');

      const normalized = normalizeBenefit(data);
      setBenefits((prev) =>
        isEdit ? prev.map((benefit) => (benefit.id === normalized.id ? normalized : benefit)) : [normalized, ...prev]
      );
      closeBenefitDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save benefit');
    }
  };

  const openBenefitDeleteDialog = (benefit) => setBenefitToDelete(benefit);
  const closeBenefitDeleteDialog = () => setBenefitToDelete(null);
  const handleConfirmDeleteBenefit = async () => {
    if (!benefitToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/benefits/${benefitToDelete.id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete benefit');
      setBenefits((prev) => prev.filter((benefit) => benefit.id !== benefitToDelete.id));
      closeBenefitDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete benefit');
    }
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

  const handleWhyServiceSubmit = async (event) => {
    event?.preventDefault();
    if (!whyServiceForm.title.trim() || !whyServiceForm.category.trim()) return;
    if (!selectedWhyChooseId) {
      handleRequestError(new Error('Please select a Why Choose config before adding highlights'));
      return;
    }

    const payload = {
      category: whyServiceForm.category,
      subcategory: whyServiceForm.subcategory,
      title: whyServiceForm.title,
      description: whyServiceForm.description,
      whyChooseId: Number(selectedWhyChooseId),
    };

    const isEdit = whyServiceDialogMode === 'edit' && activeWhyService;
    const url = isEdit
      ? apiUrl(`/api/why-services/${activeWhyService.id}`)
      : apiUrl('/api/why-services');

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save Why Choose service');

      const normalized = normalizeWhyService(data);
      setWhyChoose((prev) => {
        const updatedServices = isEdit
          ? prev.services.map((service) => (service.id === normalized.id ? normalized : service))
          : [normalized, ...prev.services];

        return { ...prev, services: updatedServices };
      });
      setWhyChooseList((prev) =>
        prev.map((item) =>
          String(item.id) === String(selectedWhyChooseId)
            ? { ...item, services: isEdit ? item.services.map((service) => (service.id === normalized.id ? normalized : service)) : [normalized, ...(item.services || [])] }
            : item
        )
      );
      closeWhyServiceDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save Why Choose service');
    }
  };

  const openWhyServiceDeleteDialog = (service) => setWhyServiceToDelete(service);
  const closeWhyServiceDeleteDialog = () => setWhyServiceToDelete(null);
  const handleConfirmDeleteWhyService = async () => {
    if (!whyServiceToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/why-services/${whyServiceToDelete.id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete Why Choose service');
      setWhyChoose((prev) => ({
        ...prev,
        services: prev.services.filter((service) => service.id !== whyServiceToDelete.id),
      }));
      setWhyChooseList((prev) =>
        prev.map((item) =>
          String(item.id) === String(selectedWhyChooseId)
            ? { ...item, services: (item.services || []).filter((service) => service.id !== whyServiceToDelete.id) }
            : item
        )
      );
      closeWhyServiceDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete Why Choose service');
    }
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

  const handleHireServiceSubmit = async (event) => {
    event?.preventDefault();
    if (!hireServiceForm.title.trim() || !hireServiceForm.image) return;

    const payload = {
      category: hireServiceForm.category || null,
      subcategory: hireServiceForm.subcategory || null,
      title: hireServiceForm.title,
      description: hireServiceForm.description,
      image: hireServiceForm.image,
      hireDeveloperId: hireServiceForm.hireDeveloperId || null,
    };

    const isEdit = hireServiceDialogMode === 'edit' && activeHireService;
    const url = isEdit
      ? apiUrl(`/api/hire-services/${activeHireService.id}`)
      : apiUrl('/api/hire-services');

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save hire service');

      const normalized = normalizeHireService(data);
      setHireContent((prev) => ({
        ...prev,
        services: isEdit
          ? prev.services.map((service) => (service.id === normalized.id ? normalized : service))
          : [normalized, ...prev.services],
      }));
      closeHireServiceDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save hire service');
    }
  };

  const openHireServiceDeleteDialog = (service) => setHireServiceToDelete(service);
  const closeHireServiceDeleteDialog = () => setHireServiceToDelete(null);
  const handleConfirmDeleteHireService = async () => {
    if (!hireServiceToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/hire-services/${hireServiceToDelete.id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete hire service');
      setHireContent((prev) => ({
        ...prev,
        services: prev.services.filter((service) => service.id !== hireServiceToDelete.id),
      }));
      closeHireServiceDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete hire service');
    }
  };

  const openContactButtonCreateDialog = () => {
    setContactButtonDialogMode('create');
    setActiveContactButton(null);
    setContactButtonForm(emptyContactButtonForm);
    setContactButtonDialogOpen(true);
  };

  const openContactButtonEditDialog = (button) => {
    setContactButtonDialogMode('edit');
    setActiveContactButton(button);
    setContactButtonForm({ ...button });
    setContactButtonDialogOpen(true);
  };

  const closeContactButtonDialog = () => {
    setContactButtonDialogOpen(false);
    setActiveContactButton(null);
  };

  const handleContactButtonSubmit = async (event) => {
    event?.preventDefault();
    if (!contactButtonForm.title.trim() || !contactButtonForm.image) return;

    const payload = {
      title: contactButtonForm.title,
      description: contactButtonForm.description,
      image: contactButtonForm.image,
      category: contactButtonForm.category,
      subcategory: contactButtonForm.subcategory,
    };

    const isEdit = contactButtonDialogMode === 'edit' && activeContactButton;
    const url = isEdit
      ? apiUrl(`/api/contact-buttons/${activeContactButton.id}`)
      : apiUrl('/api/contact-buttons');

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save contact button');

      const normalized = normalizeContactButton(data);
      setContactButtons((prev) =>
        isEdit
          ? prev.map((item) => (item.id === normalized.id ? normalized : item))
          : [normalized, ...prev]
      );
      closeContactButtonDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save contact button');
    }
  };

  const openContactButtonDeleteDialog = (button) => setContactButtonToDelete(button);
  const closeContactButtonDeleteDialog = () => setContactButtonToDelete(null);
  const handleConfirmDeleteContactButton = async () => {
    if (!contactButtonToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/contact-buttons/${contactButtonToDelete.id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete contact button');
      setContactButtons((prev) => prev.filter((item) => item.id !== contactButtonToDelete.id));
      closeContactButtonDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete contact button');
    }
  };

  const openProcessCreateDialog = () => {
    resetProcessForm();
    setProcessDialogMode('create');
    setActiveProcess(null);
    setProcessDialogOpen(true);
  };

  const openProcessEditDialog = (item) => {
    setProcessDialogMode('edit');
    setActiveProcess(item);
    setProcessForm({ ...item });
    setProcessDialogOpen(true);
  };

  const closeProcessDialog = () => {
    setProcessDialogOpen(false);
    setActiveProcess(null);
  };

  const handleProcessSubmit = async (event) => {
    event?.preventDefault();
    if (!processForm.title.trim() || !processForm.image) return;

    const payload = {
      title: processForm.title,
      description: processForm.description,
      image: processForm.image,
      serviceId: processForm.serviceId || null,
    };

    const isEdit = processDialogMode === 'edit' && activeProcess;
    const url = isEdit
      ? apiUrl(`/api/service-processes/${activeProcess.id}`)
      : apiUrl('/api/service-processes');

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save process');

      const normalized = normalizeProcess(data);
      setProcessList((prev) =>
        isEdit ? prev.map((item) => (item.id === normalized.id ? normalized : item)) : [normalized, ...prev]
      );
      closeProcessDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save process');
    }
  };

  const openProcessDeleteDialog = (item) => setProcessToDelete(item);
  const closeProcessDeleteDialog = () => setProcessToDelete(null);
  const handleConfirmDeleteProcess = async () => {
    if (!processToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/service-processes/${processToDelete.id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete process');
      setProcessList((prev) => prev.filter((item) => item.id !== processToDelete.id));
      closeProcessDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete process');
    }
  };

  const handleWhyVedxHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/why-vedx'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          id: selectedWhyVedxId || undefined,
          category: whyVedxHeroForm.category || categoryIdToName.get(String(whyVedxHeroForm.categoryId)) || '',
          subcategory:
            whyVedxHeroForm.subcategory || subcategoryIdToName.get(String(whyVedxHeroForm.subcategoryId)) || '',
          categoryId: whyVedxHeroForm.categoryId || null,
          subcategoryId: whyVedxHeroForm.subcategoryId || null,
          heroTitle: whyVedxHeroForm.heroTitle,
          heroDescription: whyVedxHeroForm.heroDescription,
          heroImage: whyVedxHeroForm.heroImage,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save Why VEDX hero');
      const normalized = normalizeWhyVedx(data);

      setWhyVedxList((prev) => {
        const exists = prev.some((item) => item.id === normalized.id);
        return exists ? prev.map((item) => (item.id === normalized.id ? normalized : item)) : [normalized, ...prev];
      });
      setSelectedWhyVedxId(normalized.id);
      setWhyVedxHeroForm(normalized);
      if (normalized.reasons?.length) {
        setWhyVedxReasons((prev) => {
          const remaining = prev.filter((reason) => reason.whyVedxId !== normalized.id);
          return [...remaining, ...normalized.reasons];
        });
      }
    } catch (err) {
      handleRequestError(err, 'Unable to save Why VEDX hero');
    }
  };

  const handleOurServicesHeroSave = (event) => {
    event?.preventDefault();
    setOurServices((prev) => ({
      ...prev,
      sliderTitle: ourServicesHeroForm.sliderTitle,
      sliderDescription: ourServicesHeroForm.sliderDescription,
      sliderImage: ourServicesHeroForm.sliderImage,
    }));
  };

  const openWhyVedxCreateDialog = () => {
    resetWhyVedxForm();
    setWhyVedxDialogMode('create');
    setActiveWhyVedx(null);
    setWhyVedxDialogOpen(true);
  };

  const openWhyVedxEditDialog = (item) => {
    setWhyVedxDialogMode('edit');
    setActiveWhyVedx(item);
    setWhyVedxForm({ ...item });
    setWhyVedxDialogOpen(true);
  };

  const closeWhyVedxDialog = () => {
    setWhyVedxDialogOpen(false);
    setActiveWhyVedx(null);
  };

  const handleWhyVedxSubmit = async (event) => {
    event?.preventDefault();
    if (!whyVedxForm.title.trim() || !whyVedxForm.description.trim() || !whyVedxForm.image) return;

    const payload = {
      title: whyVedxForm.title,
      description: whyVedxForm.description,
      image: whyVedxForm.image,
      whyVedxId: whyVedxForm.whyVedxId || selectedWhyVedxId || null,
    };

    if (!payload.whyVedxId) {
      handleRequestError(new Error('Please select a hero before adding reasons'));
      return;
    }

    const isEdit = whyVedxDialogMode === 'edit' && activeWhyVedx;
    const url = isEdit
      ? apiUrl(`/api/why-vedx-reasons/${activeWhyVedx.id}`)
      : apiUrl('/api/why-vedx-reasons');

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save reason');

      const normalized = normalizeWhyVedxReason(data);
      setWhyVedxReasons((prev) => {
        const remaining = prev.filter((item) => item.id !== normalized.id);
        return [normalized, ...remaining];
      });
      closeWhyVedxDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save reason');
    }
  };

  const openWhyVedxDeleteDialog = (item) => setWhyVedxToDelete(item);
  const closeWhyVedxDeleteDialog = () => setWhyVedxToDelete(null);
  const handleConfirmDeleteWhyVedx = async () => {
    if (!whyVedxToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/why-vedx-reasons/${whyVedxToDelete.id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete reason');
      setWhyVedxReasons((prev) => prev.filter((item) => item.id !== whyVedxToDelete.id));
      closeWhyVedxDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete reason');
    }
  };

  const openOurServiceCreateDialog = () => {
    resetOurServiceForm();
    setOurServiceDialogMode('create');
    setActiveOurService(null);
    setOurServiceDialogOpen(true);
  };

  const openOurServiceEditDialog = (item) => {
    setOurServiceDialogMode('edit');
    setActiveOurService(item);
    setOurServiceForm({ ...item });
    setOurServiceDialogOpen(true);
  };

  const closeOurServiceDialog = () => {
    setOurServiceDialogOpen(false);
    setActiveOurService(null);
  };

  const handleOurServiceSubmit = (event) => {
    event?.preventDefault();
    if (!ourServiceForm.title.trim() || !ourServiceForm.image) return;

    if (ourServiceDialogMode === 'edit' && activeOurService) {
      setOurServices((prev) => ({
        ...prev,
        services: prev.services.map((item) => (item.id === activeOurService.id ? { ...ourServiceForm } : item)),
      }));
    } else {
      const newItem = { ...ourServiceForm, id: `our-service-${Date.now()}` };
      setOurServices((prev) => ({ ...prev, services: [newItem, ...prev.services] }));
    }

    closeOurServiceDialog();
  };

  const openOurServiceDeleteDialog = (item) => setOurServiceToDelete(item);
  const closeOurServiceDeleteDialog = () => setOurServiceToDelete(null);
  const handleConfirmDeleteOurService = () => {
    if (!ourServiceToDelete) return;
    setOurServices((prev) => ({
      ...prev,
      services: prev.services.filter((item) => item.id !== ourServiceToDelete.id),
    }));
    closeOurServiceDeleteDialog();
  };

  const openIndustryCreateDialog = () => {
    resetIndustryForm();
    setIndustryDialogMode('create');
    setActiveIndustry(null);
    setIndustryDialogOpen(true);
  };

  const openIndustryEditDialog = (item) => {
    setIndustryDialogMode('edit');
    setActiveIndustry(item);
    setIndustryForm({ ...item });
    setIndustryDialogOpen(true);
  };

  const closeIndustryDialog = () => {
    setIndustryDialogOpen(false);
    setActiveIndustry(null);
  };

  const handleIndustrySubmit = (event) => {
    event?.preventDefault();
    if (!industryForm.title.trim() || !industryForm.image) return;

    if (industryDialogMode === 'edit' && activeIndustry) {
      setIndustries((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.id === activeIndustry.id ? { ...industryForm } : item)),
      }));
    } else {
      const newItem = { ...industryForm, id: `industry-${Date.now()}` };
      setIndustries((prev) => ({ ...prev, items: [newItem, ...prev.items] }));
    }

    closeIndustryDialog();
  };

  const openIndustryDeleteDialog = (item) => setIndustryToDelete(item);
  const closeIndustryDeleteDialog = () => setIndustryToDelete(null);
  const handleConfirmDeleteIndustry = () => {
    if (!industryToDelete) return;
    setIndustries((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== industryToDelete.id),
    }));
    closeIndustryDeleteDialog();
  };

  const handleTechSolutionSubmit = (event) => {
    event?.preventDefault();
    if (!techSolutionForm.title.trim()) return;

    if (techSolutionDialogMode === 'edit' && activeTechSolution) {
      setTechSolutions((prev) => ({
        ...prev,
        solutions: prev.solutions.map((item) =>
          item.id === activeTechSolution.id ? { ...techSolutionForm } : item
        ),
      }));
    } else {
      const newItem = { ...techSolutionForm, id: `tech-solution-${Date.now()}` };
      setTechSolutions((prev) => ({ ...prev, solutions: [newItem, ...prev.solutions] }));
    }

    closeTechSolutionDialog();
  };

  const openTechSolutionCreateDialog = () => {
    resetTechSolutionForm();
    setTechSolutionDialogMode('create');
    setActiveTechSolution(null);
    setTechSolutionDialogOpen(true);
  };

  const openTechSolutionEditDialog = (item) => {
    setTechSolutionDialogMode('edit');
    setActiveTechSolution(item);
    setTechSolutionForm({ ...item });
    setTechSolutionDialogOpen(true);
  };

  const closeTechSolutionDialog = () => {
    setTechSolutionDialogOpen(false);
    setActiveTechSolution(null);
  };

  const openTechSolutionDeleteDialog = (item) => setTechSolutionToDelete(item);
  const closeTechSolutionDeleteDialog = () => setTechSolutionToDelete(null);
  const handleConfirmDeleteTechSolution = () => {
    if (!techSolutionToDelete) return;
    setTechSolutions((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((item) => item.id !== techSolutionToDelete.id),
    }));
    closeTechSolutionDeleteDialog();
  };

  const handleExpertiseHeroSave = (event) => {
    event?.preventDefault();
    setExpertise((prev) => ({
      ...prev,
      title: expertiseHeroForm.title,
      description: expertiseHeroForm.description,
    }));
  };

  const openExpertiseCreateDialog = () => {
    resetExpertiseForm();
    setExpertiseDialogMode('create');
    setActiveExpertise(null);
    setExpertiseDialogOpen(true);
  };

  const openExpertiseEditDialog = (item) => {
    setExpertiseDialogMode('edit');
    setActiveExpertise(item);
    setExpertiseForm({ ...item });
    setExpertiseDialogOpen(true);
  };

  const closeExpertiseDialog = () => {
    setExpertiseDialogOpen(false);
    setActiveExpertise(null);
  };

  const handleExpertiseSubmit = (event) => {
    event?.preventDefault();
    if (!expertiseForm.title.trim() || !expertiseForm.image) return;

    if (expertiseDialogMode === 'edit' && activeExpertise) {
      setExpertise((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.id === activeExpertise.id ? { ...expertiseForm } : item)),
      }));
    } else {
      const newItem = { ...expertiseForm, id: `expertise-${Date.now()}` };
      setExpertise((prev) => ({ ...prev, items: [newItem, ...prev.items] }));
    }

    closeExpertiseDialog();
  };

  const openExpertiseDeleteDialog = (item) => setExpertiseToDelete(item);
  const closeExpertiseDeleteDialog = () => setExpertiseToDelete(null);
  const handleConfirmDeleteExpertise = () => {
    if (!expertiseToDelete) return;
    setExpertise((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== expertiseToDelete.id),
    }));
    closeExpertiseDeleteDialog();
  };

  const serviceFormSubcategoryOptions = useMemo(() => {
    if (!serviceForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(serviceForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, serviceForm.category, subcategoryLookup]);

  const technologySubcategoryOptions = useMemo(() => {
    if (!technologyForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(technologyForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, subcategoryLookup, technologyForm.category]);

  const benefitSubcategoryOptions = useMemo(() => {
    if (!benefitForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(benefitForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, benefitForm.category, subcategoryLookup]);

  const contactButtonSubcategoryOptions = useMemo(() => {
    if (!contactButtonForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(contactButtonForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, contactButtonForm.category, subcategoryLookup]);

  const hireServiceSubcategoryOptions = useMemo(() => {
    if (!hireServiceForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(hireServiceForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, hireServiceForm.category, subcategoryLookup]);

  const whySubcategoryOptions = useMemo(() => {
    const options = subcategoryLookup.get(whyServiceForm.category) || [];
    return options.map((option) => ({ name: option }));
  }, [subcategoryLookup, whyServiceForm.category]);

  return (
    <Stack spacing={3}>
      <AdminSectionTabs
        value={activeTab}
        onChange={(event, value) => setActiveTab(value)}
        tabs={[
          { value: 'services', label: 'Service menu' },
          { value: 'process', label: 'Process' },
          { value: 'why-vedx', label: 'Why choose VedX' },
          { value: 'why-choose', label: 'Why choose service' },
          { value: 'technologies', label: 'Technologies we support' },
          { value: 'benefits', label: 'Benefits' },
          { value: 'contact-buttons', label: 'Contact buttons' },
          { value: 'hire', label: 'Development services' },
        ]}
        sx={{
          background: 'linear-gradient(135deg, #0b1120 0%, #111827 100%)',
        }}
      />

      {activeTab !== 'process' && (
        <Stack spacing={1} sx={{ px: { xs: 0, md: 1 } }}>

          <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'flex-end' }}
          >
            <Autocomplete
              sx={{ minWidth: 220 }}
              freeSolo
              options={categoryOptions.map((option) => option.label)}
              value={categoryFilter}
              onInputChange={(event, newValue) => setCategoryFilter(newValue || '')}
              renderInput={(params) => (
                <TextField {...params} label="Category filter" placeholder="All categories" />
              )}
            />
            <Autocomplete
              sx={{ minWidth: 220 }}
              freeSolo
              options={
                categoryFilter ? subcategoryLookup.get(categoryFilter) || [] : allSubcategoryOptions
              }
              value={subcategoryFilter}
              onInputChange={(event, newValue) => setSubcategoryFilter(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub-category filter"
                  placeholder={categoryFilter ? 'Filter by sub-category' : 'All sub-categories'}
                />
              )}
              disabled={!categoryFilter && allSubcategoryOptions.length === 0}
            />
          </Stack>
        </Stack>
      )}

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
            <Stack spacing={1.5}>
              {groupedServices.map(({ category, services }) => (
                <Accordion key={category} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Typography variant="subtitle1" fontWeight={700}>
                        {category}
                      </Typography>
                      <Chip label={`${services.length} entr${services.length === 1 ? 'y' : 'ies'}`} size="small" />
                      <Chip
                        label={`${services.reduce((sum, item) => sum + (item.subcategories?.length || 0), 0)} sub-categories`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1.5}>
                      {services.map((service) => (
                        <Card key={service.id} variant="outlined">
                          <CardContent>
                            <Grid container spacing={2}>
                              {/* LEFT: Sub-categories */}
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Sub-categories
                                </Typography>

                                <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                                  {service.subcategories.map((item) => (
                                    <Chip key={item.name} label={item.name} size="small" />
                                  ))}
                                </Stack>

                                <Chip
                                  label={`${service.faqs?.length || 0} FAQs`}
                                  size="small"
                                  sx={{ mt: 1 }}
                                />
                              </Grid>

                              {/* CENTER: Banner Preview */}
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Banner Preview
                                </Typography>

                                <Box
                                  component="img"
                                  src={service.bannerImage || imagePlaceholder}
                                  alt={`${service.category} banner`}
                                  sx={{
                                    width: '100%',
                                    height: 120,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                  }}
                                />

                                <Typography variant="body2" fontWeight={600} noWrap mt={1}>
                                  {service.bannerTitle}
                                </Typography>
                              </Grid>

                              {/* RIGHT: Totals */}
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Totals
                                </Typography>

                                <Typography variant="body2">
                                  Services: {service.totalServices}
                                </Typography>
                                <Typography variant="body2">
                                  Projects: {service.totalProjects}
                                </Typography>
                                <Typography variant="body2">
                                  Clients: {service.totalClients}
                                </Typography>
                              </Grid>

                              {/* ACTION BUTTONS */}
                              <Grid item xs={12} md={1} display="flex" alignItems="flex-end">
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
                              </Grid>
                            </Grid>

                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
              {filteredServices.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  No service categories yet. Click "Add service" to create your first entry.
                </Typography>
              )}
            </Stack>
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

      {activeTab === 'process' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Process"
            subheader="Capture delivery steps with visuals."
            action={
              <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openProcessCreateDialog}>
                Add process step
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
                  {pagedProcesses.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell>
                        <Box
                          component="img"
                          src={item.image || imagePlaceholder}
                          alt={`${item.title} visual`}
                          sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 240 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => openProcessEditDialog(item)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => openProcessDeleteDialog(item)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pagedProcesses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          {processList.length === 0
                            ? 'No process steps added yet.'
                            : 'No process steps match the selected filters.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(filteredProcesses.length / rowsPerPage))}
                page={processPage}
                onChange={(event, page) => setProcessPage(page)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'why-vedx' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Why choose VedX Solutions"
            subheader="Control headline, description, and proof points."
          />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Autocomplete
                  options={whyVedxOptions}
                  value={whyVedxOptions.find((option) => String(option.value) === String(selectedWhyVedxId)) || null}
                  onChange={(event, option) => setSelectedWhyVedxId(option?.value || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Select hero" placeholder="Pick an existing hero card" fullWidth />
                  )}
                  sx={{ minWidth: 260, flex: 1 }}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedWhyVedxId('');
                      setWhyVedxHeroForm(emptyWhyVedxHero);
                    }}
                  >
                    Add new hero
                  </Button>
                </Stack>
              </Stack>
              <Box component="form" onSubmit={handleWhyVedxHeroSave} sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                      <Autocomplete
                        options={serviceCategories.map((category) => ({ value: category.id, label: category.name }))}
                        value={
                          serviceCategories
                            .map((category) => ({ value: category.id, label: category.name }))
                            .find((option) => String(option.value) === String(whyVedxHeroForm.categoryId)) || null
                        }
                        onChange={(event, option) => handleWhyVedxHeroChange('categoryId', option?.value || '')}
                        renderInput={(params) => (
                          <TextField {...params} label="Category" placeholder="Select category" fullWidth />
                        )}
                        fullWidth
                      />
                      <Autocomplete
                        options={whyVedxSubcategoryOptions}
                        value={
                          whyVedxSubcategoryOptions.find(
                            (option) => String(option.value) === String(whyVedxHeroForm.subcategoryId)
                          ) || null
                        }
                        onChange={(event, option) => handleWhyVedxHeroChange('subcategoryId', option?.value || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Subcategory"
                            placeholder={
                              whyVedxHeroForm.categoryId
                                ? 'Select a subcategory'
                                : 'Select a category to filter subcategories'
                            }
                            fullWidth
                          />
                        )}
                        fullWidth
                        disabled={!whyVedxSubcategoryOptions.length}
                      />
                      <TextField
                        label="Title"
                        value={whyVedxHeroForm.heroTitle}
                        onChange={(event) => handleWhyVedxHeroChange('heroTitle', event.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="Description"
                        value={whyVedxHeroForm.heroDescription}
                        onChange={(event) => handleWhyVedxHeroChange('heroDescription', event.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                      />
                      <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
                        Save hero content
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ImageUpload
                      label="Hero image"
                      value={whyVedxHeroForm.heroImage}
                      onChange={(value) => handleWhyVedxHeroChange('heroImage', value)}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>

              <Stack spacing={1}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Box>
                    <Typography variant="h6">Reasons to choose us</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add visuals, titles, and descriptions that appear below the hero section.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={openWhyVedxCreateDialog}
                    sx={{ mt: { xs: 1, sm: 0 } }}
                    disabled={!selectedWhyVedxId}
                  >
                    Add reason
                  </Button>
                </Stack>
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
                      {activeWhyVedxReasons
                        .slice((whyVedxPage - 1) * rowsPerPage, whyVedxPage * rowsPerPage)
                        .map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                            <TableCell>
                              <Box
                                component="img"
                                src={item.image || imagePlaceholder}
                                alt={`${item.title} visual`}
                                sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                              />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 280 }}>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {item.description}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit">
                                  <IconButton size="small" color="primary" onClick={() => openWhyVedxEditDialog(item)}>
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton size="small" color="error" onClick={() => openWhyVedxDeleteDialog(item)}>
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      {activeWhyVedxReasons.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              {selectedWhyVedxId
                                ? 'No reasons added yet.'
                                : 'Select a hero card to start adding reasons.'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack mt={2} alignItems="flex-end">
                  <Pagination
                    count={Math.max(1, Math.ceil(activeWhyVedxReasons.length / rowsPerPage))}
                    page={whyVedxPage}
                    onChange={(event, page) => setWhyVedxPage(page)}
                    color="primary"
                  />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}



      {activeTab === 'industries' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Industry we serve"
            subheader="Set the headline and list of industries with imagery."
          />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Title"
                    value={industries.title}
                    onChange={(event) => setIndustries((prev) => ({ ...prev, title: event.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Description"
                    value={industries.description}
                    onChange={(event) => setIndustries((prev) => ({ ...prev, description: event.target.value }))}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box>
                  <Typography variant="h6">Industries</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload images, set titles, and describe each industry you support.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openIndustryCreateDialog}
                  sx={{ mt: { xs: 1, sm: 0 } }}
                >
                  Add industry
                </Button>
              </Stack>
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
                    {industries.items
                      .slice((industryPage - 1) * rowsPerPage, industryPage * rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                          <TableCell>
                            <Box
                              component="img"
                              src={item.image || imagePlaceholder}
                              alt={`${item.title} visual`}
                              sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                            />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 260 }}>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary" onClick={() => openIndustryEditDialog(item)}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => openIndustryDeleteDialog(item)}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    {industries.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            No industries configured yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(industries.items.length / rowsPerPage))}
                  page={industryPage}
                  onChange={(event, page) => setIndustryPage(page)}
                  color="primary"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tech-solutions' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Tech solutions for all business types"
            subheader="Control heading, copy, and business-type specific solutions."
          />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Title"
                    value={techSolutions.title}
                    onChange={(event) => setTechSolutions((prev) => ({ ...prev, title: event.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Description"
                    value={techSolutions.description}
                    onChange={(event) => setTechSolutions((prev) => ({ ...prev, description: event.target.value }))}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box>
                  <Typography variant="h6">Business solutions</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add solution cards for each business type with concise descriptions.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openTechSolutionCreateDialog}
                  sx={{ mt: { xs: 1, sm: 0 } }}
                >
                  Add solution
                </Button>
              </Stack>
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
                    {techSolutions.solutions
                      .slice((techSolutionPage - 1) * rowsPerPage, techSolutionPage * rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                          <TableCell sx={{ maxWidth: 360 }}>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary" onClick={() => openTechSolutionEditDialog(item)}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => openTechSolutionDeleteDialog(item)}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    {techSolutions.solutions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            No tech solutions yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(techSolutions.solutions.length / rowsPerPage))}
                  page={techSolutionPage}
                  onChange={(event, page) => setTechSolutionPage(page)}
                  color="primary"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'expertise' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader title="Ways to choose our expertise" subheader="Control headline, description, and expert cards." />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Title"
                    value={expertiseHeroForm.title}
                    onChange={(event) => handleExpertiseHeroChange('title', event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Description"
                    value={expertiseHeroForm.description}
                    onChange={(event) => handleExpertiseHeroChange('description', event.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Button variant="contained" onClick={handleExpertiseHeroSave} sx={{ alignSelf: 'flex-start' }}>
                Save intro
              </Button>

              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box>
                  <Typography variant="h6">Expertise options</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add cards with images, titles, and descriptions for each engagement model.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openExpertiseCreateDialog}
                  sx={{ mt: { xs: 1, sm: 0 } }}
                >
                  Add option
                </Button>
              </Stack>
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
                    {expertise.items
                      .slice((expertisePage - 1) * rowsPerPage, expertisePage * rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                          <TableCell>
                            <Box
                              component="img"
                              src={item.image || imagePlaceholder}
                              alt={`${item.title} visual`}
                              sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                            />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 260 }}>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary" onClick={() => openExpertiseEditDialog(item)}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => openExpertiseDeleteDialog(item)}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    {expertise.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            No expertise cards configured yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(expertise.items.length / rowsPerPage))}
                  page={expertisePage}
                  onChange={(event, page) => setExpertisePage(page)}
                  color="primary"
                />
              </Stack>
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
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                <Autocomplete
                  options={whyChooseList}
                  getOptionLabel={(option) =>
                    [option.category, option.subcategory].filter(Boolean).join(' / ') || 'Untitled'
                  }
                  value={whyChooseList.find((item) => String(item.id) === String(selectedWhyChooseId)) || null}
                  onChange={(event, value) => setSelectedWhyChooseId(value?.id ? String(value.id) : '')}
                  renderInput={(params) => <TextField {...params} label="Select why choose config" />}
                  sx={{ minWidth: { xs: '100%', md: 320 } }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => {
                    setSelectedWhyChooseId('');
                    setWhyHeroForm(initialWhyChoose);
                    setWhyChoose(initialWhyChoose);
                  }}
                  sx={{ alignSelf: { xs: 'stretch', md: 'flex-start' } }}
                >
                  New config
                </Button>
              </Stack>
              <Box
                component="form"
                onSubmit={handleWhyHeroSave}
                sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 2 }}
              >
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                      <TextField
                        select
                        label="Category"
                        value={whyHeroForm.category}
                        onChange={(event) => handleWhyHeroChange('category', event.target.value)}
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
                        value={whyHeroForm.subcategory}
                        onChange={(event) => handleWhyHeroChange('subcategory', event.target.value)}
                        fullWidth
                        disabled={!whyHeroForm.category || (subcategoryLookup.get(whyHeroForm.category) || []).length === 0}

                      >
                        {(subcategoryLookup.get(whyHeroForm.category) || []).map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
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
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={openWhyServiceCreateDialog}
                    disabled={!selectedWhyChooseId}
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
            <Stack spacing={1.5}>
              {groupedTechnologies.map(({ title, items }) => (
                <Accordion key={title} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Typography variant="subtitle1" fontWeight={700}>
                        {title}
                      </Typography>
                      <Chip label={`${items.length} entr${items.length === 1 ? 'y' : 'ies'}`} size="small" />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1.5}>
                      {items.map((tech) => (
                        <Card key={tech.id} variant="outlined">
                          <CardContent>
                            <Stack spacing={2}>
                              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'stretch' }}>
                                <Stack spacing={1} flex={1}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Category / Sub-category
                                  </Typography>
                                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                                    <Chip
                                      label={tech.category || 'Uncategorised'}
                                      size="small"
                                      color={tech.category ? 'default' : 'warning'}
                                    />
                                    {tech.subcategory ? (
                                      <Chip label={tech.subcategory} size="small" color="primary" variant="outlined" />
                                    ) : (
                                      <Chip label="No sub-category" size="small" variant="outlined" color="default" />
                                    )}
                                  </Stack>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Technologies
                                  </Typography>
                                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                                    {tech.items.length > 0 ? (
                                      tech.items.map((item) => (
                                        <Chip key={item} label={item} size="small" color="primary" variant="outlined" />
                                      ))
                                    ) : (
                                      <Typography variant="body2" color="text.secondary">
                                        No items added yet.
                                      </Typography>
                                    )}
                                  </Stack>
                                </Stack>
                                <Stack spacing={1} minWidth={220}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Preview
                                  </Typography>
                                  <Box
                                    component="img"
                                    src={tech.image || imagePlaceholder}
                                    alt={`${tech.title} preview`}
                                    sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1 }}
                                  />
                                  <Typography variant="body2" fontWeight={600} noWrap>
                                    {tech.title}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" noWrap>
                                    {tech.subcategory || 'No sub-category selected'}
                                  </Typography>
                                </Stack>
                              </Stack>
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit">
                                  <IconButton size="small" color="primary" onClick={() => openTechnologyEditDialog(tech)}>
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton size="small" color="error" onClick={() => openTechnologyDeleteDialog(tech)}>
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
              {technologies.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  No technology groups configured yet.
                </Typography>
              )}
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
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={openBenefitCreateDialog}
                disabled={!hasBenefitConfig}
              >
                Add benefit
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'center' }}
              mb={2}
            >
              <Autocomplete
                options={benefitConfigs}
                getOptionLabel={(option) =>
                  option?.categoryName || option?.subcategoryName
                    ? [option.categoryName, option.subcategoryName].filter(Boolean).join(' / ')
                    : option?.title || 'Untitled'
                }
                value={benefitConfigs.find((item) => String(item.id) === String(selectedBenefitConfigId)) || null}
                onChange={(event, value) => handleBenefitConfigSelect(value)}
                renderInput={(params) => <TextField {...params} label="Select benefits config" />}
                sx={{ minWidth: { xs: '100%', md: 320 } }}
              />
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleNewBenefitConfig}
                sx={{ alignSelf: { xs: 'stretch', md: 'flex-start' } }}
              >
                New config
              </Button>
            </Stack>

            <Stack spacing={2} mb={3} component="form" onSubmit={handleBenefitHeroSave}>
              <TextField
                select
                label="Category"
                value={benefitHero.categoryId}
                onChange={(event) => {
                  const value = event.target.value;
                  handleBenefitHeroChange('categoryId', value);

                  const allowedSubcategories = benefitHeroSubcategoryOptions
                    .filter((option) => Number(option.categoryId) === Number(value))
                    .map((option) => option.value);

                  if (value && benefitHero.subcategoryId && !allowedSubcategories.includes(benefitHero.subcategoryId)) {
                    handleBenefitHeroChange('subcategoryId', '');
                  }
                }}

                fullWidth
              >
                <MenuItem value="">All categories</MenuItem>
                {benefitHeroCategoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Sub-category"
                value={benefitHero.subcategoryId}
                onChange={(event) => handleBenefitHeroChange('subcategoryId', event.target.value)}

                fullWidth
                disabled={!benefitHeroCategoryOptions.length}
              >
                <MenuItem value="">All sub-categories</MenuItem>
                {benefitHeroSubcategoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Benefits title"
                value={benefitHero.title}
                onChange={(event) => handleBenefitHeroChange('title', event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Benefits description"
                value={benefitHero.description}
                onChange={(event) => handleBenefitHeroChange('description', event.target.value)}
                fullWidth
                multiline
                minRows={2}
              />

              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="contained" onClick={handleBenefitHeroSave}>
                  Save Benefits
                </Button>
                {benefitHeroSaved && (
                  <Typography variant="body2" color="success.main">
                    Saved
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {groupedBenefits.map((group) => (
                <Accordion key={group.category} defaultExpanded disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1">{group.category}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {group.items.length} benefit{group.items.length === 1 ? '' : 's'}
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Sub-category</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.items.map((benefit) => (
                            <TableRow key={benefit.id} hover>
                              <TableCell sx={{ fontWeight: 700 }}>{benefit.title}</TableCell>
                              <TableCell>{benefit.subcategory || '-'}</TableCell>
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
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
              {visibleBenefits.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  No benefits configured yet.
                </Typography>
              )}
            </Stack>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(visibleBenefits.length / rowsPerPage))}
                page={benefitPage}
                onChange={(event, page) => setBenefitPage(page)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'contact-buttons' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Contact buttons"
            subheader="Showcase contact CTAs with supporting copy and imagery."
            action={
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={openContactButtonCreateDialog}
              >
                Add contact button
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              {groupedContactButtons.map((group) => (
                <Accordion key={group.category} defaultExpanded disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1">{group.category}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {group.items.length} contact CTA{group.items.length === 1 ? '' : 's'}
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Sub-category</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.items.map((button) => (
                            <TableRow key={button.id} hover>
                              <TableCell sx={{ fontWeight: 700 }}>{button.title}</TableCell>
                              <TableCell sx={{ maxWidth: 360 }}>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {button.description || 'No description provided.'}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ maxWidth: 140 }}>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {button.subcategory || 'Not set'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box
                                  component="img"
                                  src={button.image || imagePlaceholder}
                                  alt={`${button.title} visual`}
                                  sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => openContactButtonEditDialog(button)}
                                    >
                                      <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => openContactButtonDeleteDialog(button)}
                                    >
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
              {groupedContactButtons.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  {contactButtons.length === 0
                    ? 'No contact buttons configured yet.'
                    : 'No contact buttons match the selected filters.'}
                </Typography>
              )}
            </Stack>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(filteredContactButtons.length / rowsPerPage))}
                page={contactButtonPage}
                onChange={(event, page) => setContactButtonPage(page)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'hire' && (
        <Stack spacing={3}>
          {/* <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Development services hero"
              subheader="Control the title, description, and hero image used on the development services section."
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
          </Card> */}

          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Development services"
              subheader="Manage the service tiles shown within the development services menu."
              action={
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openHireServiceCreateDialog}
                >
                  Add service
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={1.5}>
                {groupedHireServices.map(({ category, services }) => (
                  <Accordion key={category} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={700}>
                          {category}
                        </Typography>
                        <Chip
                          label={`${services.length} service${services.length === 1 ? '' : 's'}`}
                          size="small"
                        />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {services.map((service) => (
                          <Grid item xs={12} md={6} key={service.id}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent>
                                <Stack spacing={1.5} height="100%">
                                  <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    alignItems={{ sm: 'flex-start' }}
                                  >
                                    <Stack spacing={0.5} flex={1}>
                                      <Typography variant="subtitle1" fontWeight={700}>
                                        {service.title}
                                      </Typography>
                                      <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                                        <Chip
                                          label={service.category || 'Uncategorised'}
                                          size="small"
                                          color={service.category ? 'default' : 'warning'}
                                        />
                                        <Chip
                                          label={service.subcategory || 'No sub-category'}
                                          size="small"
                                          variant="outlined"
                                          color={service.subcategory ? 'primary' : 'default'}
                                        />
                                      </Stack>
                                    </Stack>
                                    <Box
                                      component="img"
                                      src={service.image || imagePlaceholder}
                                      alt={`${service.title} preview`}
                                      sx={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 1 }}
                                    />
                                  </Stack>

                                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                    {service.description || 'No description added yet.'}
                                  </Typography>

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
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
                {hireContent.services.length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No development services configured yet.
                  </Typography>
                )}
              </Stack>
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
                <Autocomplete
                  freeSolo
                  options={categoryOptions.map((option) => option.label)}
                  value={serviceForm.category}
                  onInputChange={(event, newValue) =>
                    handleServiceFormChange('category', newValue || '')
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Category" required helperText="Choose or type a category" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={serviceFormSubcategoryOptions}
                  value={serviceForm.subcategories.map((item) => item.name)}
                  onChange={(event, newValue) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      subcategories: newValue.map((name) => ({ name })),
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sub-categories"
                      placeholder="Select or type sub-categories"
                      helperText={
                        serviceForm.category
                          ? 'Linked to the selected service category'
                          : 'No category selected—showing all known sub-categories'
                      }
                    />
                  )}
                />
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
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {faq.question}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {faq.answer}
                          </Typography>
                        </Box>
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
                {viewService.subcategories.map((item) => (
                  <Chip key={item.name} label={item.name} size="small" />
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
              disabled={!whyServiceForm.category || whySubcategoryOptions.length === 0}
              helperText={
                !whyServiceForm.category
                  ? 'Select a category first'
                  : whySubcategoryOptions.length === 0
                    ? 'No sub-categories available for this category'
                    : undefined
              }
            >
              {whySubcategoryOptions.map((option) => (
                <MenuItem key={option.name} value={option.name}>
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
              select
              label="Category"
              value={technologyForm.category}
              onChange={(event) =>
                setTechnologyForm((prev) => ({
                  ...prev,
                  category: event.target.value,
                  subcategory: '',
                }))
              }
              fullWidth
              required
              helperText="Match the service category for this technology block"
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
              value={technologyForm.subcategory}
              onChange={(event) => handleTechnologyFormChange('subcategory', event.target.value)}
              fullWidth
              disabled={!technologyForm.category || technologySubcategoryOptions.length === 0}
              helperText="Keep stacks aligned to category and sub-category"
            >
              {technologySubcategoryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
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
              value={technologyItemsInput}
              onChange={(event) => {
                const nextValue = event.target.value;
                setTechnologyItemsInput(nextValue);
                handleTechnologyFormChange(
                  'items',
                  nextValue
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                );
              }}
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
            <TextField
              select
              label="Category"
              value={benefitForm.category}
              onChange={(event) =>
                handleBenefitFormChange('category', event.target.value)
              }
              helperText="Link the benefit to a service category"
              fullWidth
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
              value={benefitForm.subcategory}
              onChange={(event) => handleBenefitFormChange('subcategory', event.target.value)}
              disabled={!benefitForm.category && benefitSubcategoryOptions.length === 0}
              fullWidth
            >
              {benefitSubcategoryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
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
              required
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

      <Dialog open={contactButtonDialogOpen} onClose={closeContactButtonDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{
          contactButtonDialogMode === 'edit' ? 'Edit contact button' : 'Add contact button'
        }</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleContactButtonSubmit}>
            <TextField
              label="Title"
              value={contactButtonForm.title}
              onChange={(event) => handleContactButtonFormChange('title', event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={contactButtonForm.description}
              onChange={(event) => handleContactButtonFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <Autocomplete
              freeSolo
              options={categoryOptions.map((option) => option.label)}
              value={contactButtonForm.category}
              onInputChange={(event, newValue) => handleContactButtonFormChange('category', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="Select or type category"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              freeSolo
              options={contactButtonSubcategoryOptions}
              value={contactButtonForm.subcategory}
              onInputChange={(event, newValue) =>
                handleContactButtonFormChange('subcategory', newValue || '')
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subcategory"
                  placeholder="Select or type subcategory"
                  fullWidth
                />
              )}
              disabled={!contactButtonForm.category && contactButtonSubcategoryOptions.length === 0}
            />
            <ImageUpload
              label="Image"
              value={contactButtonForm.image}
              onChange={(value) => handleContactButtonFormChange('image', value)}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeContactButtonDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleContactButtonSubmit} variant="contained">
            {contactButtonDialogMode === 'edit' ? 'Save changes' : 'Add contact button'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(contactButtonToDelete)} onClose={closeContactButtonDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete contact button</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{contactButtonToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeContactButtonDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteContactButton} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={processDialogOpen} onClose={closeProcessDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{processDialogMode === 'edit' ? 'Edit process step' : 'Add process step'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleProcessSubmit}>
            <TextField
              label="Title"
              value={processForm.title}
              onChange={(event) => handleProcessChange('title', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={processForm.description}
              onChange={(event) => handleProcessChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
            <ImageUpload
              label="Process image"
              value={processForm.image}
              onChange={(value) => handleProcessChange('image', value)}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProcessDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleProcessSubmit} variant="contained">
            {processDialogMode === 'edit' ? 'Save changes' : 'Add process step'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(processToDelete)} onClose={closeProcessDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete process step</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{processToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProcessDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteProcess} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={whyVedxDialogOpen} onClose={closeWhyVedxDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{whyVedxDialogMode === 'edit' ? 'Edit reason' : 'Add reason'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleWhyVedxSubmit}>
            <TextField
              label="Title"
              value={whyVedxForm.title}
              onChange={(event) => setWhyVedxForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={whyVedxForm.description}
              onChange={(event) => setWhyVedxForm((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <ImageUpload
              label="Reason image"
              value={whyVedxForm.image}
              onChange={(value) => setWhyVedxForm((prev) => ({ ...prev, image: value }))}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWhyVedxDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleWhyVedxSubmit} variant="contained">
            {whyVedxDialogMode === 'edit' ? 'Save changes' : 'Add reason'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(whyVedxToDelete)} onClose={closeWhyVedxDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete reason</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{whyVedxToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWhyVedxDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteWhyVedx} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={ourServiceDialogOpen} onClose={closeOurServiceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{ourServiceDialogMode === 'edit' ? 'Edit service card' : 'Add service card'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleOurServiceSubmit}>
            <TextField
              label="Title"
              value={ourServiceForm.title}
              onChange={(event) => setOurServiceForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />
            <ImageUpload
              label="Service image"
              value={ourServiceForm.image}
              onChange={(value) => setOurServiceForm((prev) => ({ ...prev, image: value }))}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOurServiceDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleOurServiceSubmit} variant="contained">
            {ourServiceDialogMode === 'edit' ? 'Save changes' : 'Add service card'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(ourServiceToDelete)} onClose={closeOurServiceDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete service card</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{ourServiceToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOurServiceDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteOurService} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={industryDialogOpen} onClose={closeIndustryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{industryDialogMode === 'edit' ? 'Edit industry' : 'Add industry'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleIndustrySubmit}>
            <TextField
              label="Title"
              value={industryForm.title}
              onChange={(event) => setIndustryForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={industryForm.description}
              onChange={(event) => setIndustryForm((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <ImageUpload
              label="Industry image"
              value={industryForm.image}
              onChange={(value) => setIndustryForm((prev) => ({ ...prev, image: value }))}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeIndustryDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleIndustrySubmit} variant="contained">
            {industryDialogMode === 'edit' ? 'Save changes' : 'Add industry'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(industryToDelete)} onClose={closeIndustryDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete industry</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{industryToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeIndustryDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteIndustry} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={techSolutionDialogOpen} onClose={closeTechSolutionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{techSolutionDialogMode === 'edit' ? 'Edit solution' : 'Add solution'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleTechSolutionSubmit}>
            <TextField
              label="Title"
              value={techSolutionForm.title}
              onChange={(event) => setTechSolutionForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={techSolutionForm.description}
              onChange={(event) => setTechSolutionForm((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTechSolutionDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleTechSolutionSubmit} variant="contained">
            {techSolutionDialogMode === 'edit' ? 'Save changes' : 'Add solution'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(techSolutionToDelete)} onClose={closeTechSolutionDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete solution</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{techSolutionToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTechSolutionDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteTechSolution} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={expertiseDialogOpen} onClose={closeExpertiseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{expertiseDialogMode === 'edit' ? 'Edit expertise option' : 'Add expertise option'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleExpertiseSubmit}>
            <TextField
              label="Title"
              value={expertiseForm.title}
              onChange={(event) => setExpertiseForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={expertiseForm.description}
              onChange={(event) => setExpertiseForm((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <ImageUpload
              label="Option image"
              value={expertiseForm.image}
              onChange={(value) => setExpertiseForm((prev) => ({ ...prev, image: value }))}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeExpertiseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleExpertiseSubmit} variant="contained">
            {expertiseDialogMode === 'edit' ? 'Save changes' : 'Add option'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(expertiseToDelete)} onClose={closeExpertiseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete expertise option</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{expertiseToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeExpertiseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteExpertise} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={hireServiceDialogOpen} onClose={closeHireServiceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{hireServiceDialogMode === 'edit' ? 'Edit hire service' : 'Add hire service'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleHireServiceSubmit}>
            <Autocomplete
              freeSolo
              options={categoryOptions.map((option) => option.label)}
              value={hireServiceForm.category}
              onInputChange={(event, newValue) =>
                setHireServiceForm((prev) => ({
                  ...prev,
                  category: newValue || '',
                  subcategory: newValue === prev.category ? prev.subcategory : '',
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Service category"
                  helperText="Link hire cards to a service category"
                />
              )}
            />
            <Autocomplete
              freeSolo
              options={hireServiceSubcategoryOptions}
              value={hireServiceForm.subcategory}
              onInputChange={(event, newValue) => handleHireServiceFormChange('subcategory', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub-category"
                  helperText="Pick the matching sub-category"
                />
              )}
              disabled={!hireServiceForm.category && hireServiceSubcategoryOptions.length === 0}
            />
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
            <ImageUpload
              label="Service image"
              value={hireServiceForm.image}
              onChange={(value) => handleHireServiceFormChange('image', value)}
              required
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
