import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiUrl } from '../../utils/const.js';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AdminSectionTabs from './AdminSectionTabs.jsx';
import ServicesTab from './tabs/ServicesTab.jsx';
import ProcessTab from './tabs/ProcessTab.jsx';
import WhyVedxTab from './tabs/WhyVedxTab.jsx';
import ImageUpload from './ImageUpload.jsx';
import IndustriesTab from './tabs/IndustriesTab.jsx';
import TechSolutionsTab from './tabs/TechSolutionsTab.jsx';
import ExpertiseTab from './tabs/ExpertiseTab.jsx';
import WhyChooseTab from './tabs/WhyChooseTab.jsx';
import TechnologiesTab from './tabs/TechnologiesTab.jsx';
import BenefitsTab from './tabs/BenefitsTab.jsx';
import ContactButtonsTab from './tabs/ContactButtonsTab.jsx';
import HireTab from './tabs/HireTab.jsx';
import adminServiceTabs from './adminServiceTabs.js';

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
  benefitConfigId: '',
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
  categoryId: '',
  subcategoryId: '',
  categoryName: '',
  subcategoryName: '',
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
  const whyVedxConfigClearedRef = useRef(false);

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

  const rowsPerPage = 20;
  const [serviceDateFilter, setServiceDateFilter] = useState('all');
  const [serviceDateRange, setServiceDateRange] = useState({ start: '', end: '' });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [contactCategoryFilter, setContactCategoryFilter] = useState('');
  const [contactSubcategoryFilter, setContactSubcategoryFilter] = useState('');
  const [benefitCategoryFilter, setBenefitCategoryFilter] = useState('');
  const [benefitSubcategoryFilter, setBenefitSubcategoryFilter] = useState('');
  const [whyServiceCategoryFilter, setWhyServiceCategoryFilter] = useState('');
  const [whyServiceSubcategoryFilter, setWhyServiceSubcategoryFilter] = useState('');
  const [whyVedxCategoryFilter, setWhyVedxCategoryFilter] = useState('');
  const [whyVedxSubcategoryFilter, setWhyVedxSubcategoryFilter] = useState('');
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
    category: tech.category || '',
    subcategory: tech.subcategory || '',
    items: tech.items || [],
  });

  const normalizeBenefit = (benefit) => ({
    ...benefit,
    benefitConfigId: benefit.benefitConfigId ? String(benefit.benefitConfigId) : '',
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
    categoryId: reason.categoryId || '',
    subcategoryId: reason.subcategoryId || '',
    categoryName: reason.categoryName || '',
    subcategoryName: reason.subcategoryName || '',
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

  const loadTechnologies = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/technologies'));
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

  const loadBenefits = useCallback(async ({ category, subcategory, benefitConfigId } = {}) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);
      if (benefitConfigId) params.append('benefitConfigId', benefitConfigId);

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

  const loadWhyVedx = useCallback(async ({ category, subcategory } = {}) => {
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
    } catch (err) {
      console.error('Failed to load why VEDX config', err);
    }
  }, []);
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
    loadTechnologies();
    loadHireServices(filters);
  }, [categoryFilter, loadHireServices, loadServiceMenus, loadTechnologies, subcategoryFilter]);

  // Benefits tab filters (independent from other tabs)
  useEffect(() => {
    // benefit configs are loaded separately; this effect exists just to reset paging when filters change.
    setBenefitPage(1);
  }, [benefitCategoryFilter, benefitSubcategoryFilter]);

  // Why choose this service tab filters (independent from other tabs)
  useEffect(() => {
    const filters = {
      category: whyServiceCategoryFilter || undefined,
      subcategory: whyServiceSubcategoryFilter || undefined,
    };
    loadWhyChoose(filters);
  }, [loadWhyChoose, whyServiceCategoryFilter, whyServiceSubcategoryFilter]);

  // Why choose VedX tab filters (independent from other tabs)
  useEffect(() => {
    const filters = {
      category: whyVedxCategoryFilter || undefined,
      subcategory: whyVedxSubcategoryFilter || undefined,
    };
    loadWhyVedx(filters);
  }, [loadWhyVedx, whyVedxCategoryFilter, whyVedxSubcategoryFilter]);

  useEffect(() => {
    if (!selectedBenefitConfigId) {
      setBenefits([]);
      return;
    }

    const filters = {
      category: benefitCategoryFilter || undefined,
      subcategory: benefitSubcategoryFilter || undefined,
      benefitConfigId: selectedBenefitConfigId,
    };

    loadBenefits(filters);
  }, [benefitCategoryFilter, benefitSubcategoryFilter, loadBenefits, selectedBenefitConfigId]);

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
        category: whyServiceCategoryFilter || undefined,
        subcategory: whyServiceSubcategoryFilter || undefined,
      });
    }
  }, [loadWhyServices, selectedWhyChooseId, whyChooseList, whyServiceCategoryFilter, whyServiceSubcategoryFilter]);

  useEffect(() => {
    const matchesFilters = (item) => {
      const matchesCategory = whyVedxCategoryFilter
        ? item.categoryName === whyVedxCategoryFilter || item.category === whyVedxCategoryFilter
        : true;
      const matchesSubcategory = whyVedxSubcategoryFilter
        ? item.subcategoryName === whyVedxSubcategoryFilter || item.subcategory === whyVedxSubcategoryFilter
        : true;

      return matchesCategory && matchesSubcategory;
    };

    if (whyVedxList.length === 0) {
      setSelectedWhyVedxId('');
      setWhyVedxHeroForm(emptyWhyVedxHero);
      setWhyVedxReasons([]);
      setWhyVedxPage(1);
      whyVedxConfigClearedRef.current = false;
      return;
    }

    if (whyVedxConfigClearedRef.current && !selectedWhyVedxId) {
      return;
    }

    const active = whyVedxList.find((item) => String(item.id) === String(selectedWhyVedxId));
    const preferred = (whyVedxCategoryFilter || whyVedxSubcategoryFilter) ? whyVedxList.find(matchesFilters) : null;
    const next = preferred || active || whyVedxList[0];

    if (String(next?.id || '') !== String(selectedWhyVedxId || '')) {
      setSelectedWhyVedxId(next?.id ? String(next.id) : '');
    }

    if (next) {
      setWhyVedxHeroForm(next);
      loadWhyVedxReasons(next.id, {
        category: whyVedxCategoryFilter || undefined,
        subcategory: whyVedxSubcategoryFilter || undefined,
      });
    } else {
      setWhyVedxHeroForm(emptyWhyVedxHero);
      setWhyVedxReasons([]);
    }
    setWhyVedxPage(1);
    whyVedxConfigClearedRef.current = false;
  }, [loadWhyVedxReasons, selectedWhyVedxId, whyVedxList, whyVedxCategoryFilter, whyVedxSubcategoryFilter]);

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
  const resetWhyVedxForm = () =>
    setWhyVedxForm({
      ...emptyWhyVedxForm,
      whyVedxId: selectedWhyVedxId || '',
      categoryId: whyVedxHeroForm.categoryId || '',
      categoryName: whyVedxHeroForm.categoryName || '',
      subcategoryId: whyVedxHeroForm.subcategoryId || '',
      subcategoryName: whyVedxHeroForm.subcategoryName || '',
    });
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

  const buildDefaultWhyVedxHero = () => {
    return { ...emptyWhyVedxHero };
  };

  const handleNewWhyVedxHero = () => {
    whyVedxConfigClearedRef.current = true;
    setSelectedWhyVedxId('');
    setWhyVedxHeroForm(buildDefaultWhyVedxHero());
    setWhyVedxReasons([]);
    setWhyVedxPage(1);
  };

  const handleWhyVedxSelect = (option) => {
    const nextId = option?.value ? String(option.value) : '';
    const isClearing = !nextId;

    whyVedxConfigClearedRef.current = isClearing;
    setSelectedWhyVedxId(nextId);

    if (isClearing) {
      setWhyVedxHeroForm(buildDefaultWhyVedxHero());
      setWhyVedxReasons([]);
      setWhyVedxPage(1);
      return;
    }

    const matchingHero = whyVedxList.find((item) => String(item.id) === nextId);
    if (matchingHero) {
      setWhyVedxHeroForm(matchingHero);
      setWhyVedxReasons(matchingHero.reasons || []);
    }
    setWhyVedxPage(1);
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
    const matchesFilters = (config) => {
      const matchesCategory = benefitCategoryFilter ? config.categoryName === benefitCategoryFilter : true;
      const matchesSubcategory = benefitSubcategoryFilter ? config.subcategoryName === benefitSubcategoryFilter : true;
      return matchesCategory && matchesSubcategory;
    };

    if (benefitConfigs.length === 0) {
      setSelectedBenefitConfigId('');
      setBenefitHero(initialBenefitHero);
      setBenefitPage(1);
      benefitConfigClearedRef.current = false;
      return;
    }

    const active = benefitConfigs.find((config) => String(config.id) === String(selectedBenefitConfigId));
    const preferredByFilters = benefitCategoryFilter || benefitSubcategoryFilter ? benefitConfigs.find(matchesFilters) : null;
    const fallback = !benefitConfigClearedRef.current ? benefitConfigs[0] : null;

    let nextConfig = null;

    if (benefitCategoryFilter || benefitSubcategoryFilter) {
      nextConfig = preferredByFilters || (active && matchesFilters(active) ? active : null);
    } else {
      nextConfig = active || fallback;
    }

    if (!nextConfig) {
      setSelectedBenefitConfigId('');
      setBenefitHero(initialBenefitHero);
      setBenefitPage(1);
      return;
    }

    if (String(nextConfig.id) !== selectedBenefitConfigId) {
      setSelectedBenefitConfigId(String(nextConfig.id));
    }

    setBenefitHero(nextConfig);
    setBenefitPage(1);
    benefitConfigClearedRef.current = false;
  }, [
    benefitConfigs,
    benefitCategoryFilter,
    selectedBenefitConfigId,
    benefitSubcategoryFilter,
  ]);

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

  const handleWhyChooseNewConfig = useCallback(() => {
    setSelectedWhyChooseId('');
    setWhyHeroForm(initialWhyChoose);
    setWhyChoose(initialWhyChoose);
  }, []);

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

  const categoryNameToId = useMemo(() => {
    const lookup = new Map();
    serviceCategories.forEach((category) => {
      if (category.name) lookup.set(category.name, category.id);
    });
    return lookup;
  }, [serviceCategories]);

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

  const subcategoryNameToId = useMemo(() => {
    const lookup = new Map();
    serviceSubcategories.forEach((subcategory) => {
      if (subcategory.name) lookup.set(subcategory.name, subcategory.id);
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

  const whyVedxOptions = useMemo(() => {
    const buildLabel = (item) => {
      const category = (item.categoryName || item.category || '').trim();
      const subcategory = (item.subcategoryName || item.subcategory || '').trim();

      if (category && subcategory) return `${category} / ${subcategory}`;
      if (category) return category;
      if (subcategory) return subcategory;

      const title = (item.heroTitle || '').trim();
      return title ? title : `Hero ${item.id}`;
    };

    return whyVedxList.map((item) => ({ value: item.id, label: buildLabel(item) }));
  }, [whyVedxList]);

  const whyVedxSubcategoryOptions = useMemo(() => {
    const base = whyVedxHeroForm.categoryId
      ? serviceSubcategories.filter((item) => Number(item.categoryId) === Number(whyVedxHeroForm.categoryId))
      : serviceSubcategories;

    return base.map((subcategory) => ({ value: subcategory.id, label: subcategory.name }));
  }, [serviceSubcategories, whyVedxHeroForm.categoryId]);

  const whyVedxReasonSubcategoryOptions = useMemo(() => {
    const base = whyVedxForm.categoryId
      ? serviceSubcategories.filter((item) => Number(item.categoryId) === Number(whyVedxForm.categoryId))
      : serviceSubcategories;

    return base.map((subcategory) => ({ value: subcategory.id, label: subcategory.name }));
  }, [serviceSubcategories, whyVedxForm.categoryId]);

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const matchesCategory = whyVedxCategoryFilter
          ? service.category === categoryFilter
          : true;
        const matchesSubcategory = whyVedxSubcategoryFilter
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
        const matchesCategory = whyVedxCategoryFilter ? linkedService?.category === categoryFilter : true;
        const matchesSubcategory = whyVedxSubcategoryFilter
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
    setHireServicePage(1);
    setProcessPage(1);
  }, [categoryFilter, subcategoryFilter]);

  useEffect(() => {
    setContactButtonPage(1);
  }, [contactCategoryFilter, contactSubcategoryFilter]);

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
    if (!contactCategoryFilter) {
      setContactSubcategoryFilter('');
      return;
    }

    const allowed = subcategoryLookup.get(contactCategoryFilter) || [];
    if (contactSubcategoryFilter && !allowed.includes(contactSubcategoryFilter)) {
      setContactSubcategoryFilter('');
    }
  }, [contactCategoryFilter, contactSubcategoryFilter, subcategoryLookup]);

  // Keep dependent filters valid for Benefits tab
  useEffect(() => {
    if (!benefitCategoryFilter) {
      setBenefitSubcategoryFilter('');
      return;
    }

    const allowed = subcategoryLookup.get(benefitCategoryFilter) || [];
    if (benefitSubcategoryFilter && !allowed.includes(benefitSubcategoryFilter)) {
      setBenefitSubcategoryFilter('');
    }
  }, [benefitCategoryFilter, benefitSubcategoryFilter, subcategoryLookup]);

  // Keep dependent filters valid for Why choose this service tab
  useEffect(() => {
    if (!whyServiceCategoryFilter) {
      setWhyServiceSubcategoryFilter('');
      return;
    }

    const allowed = subcategoryLookup.get(whyServiceCategoryFilter) || [];
    if (whyServiceSubcategoryFilter && !allowed.includes(whyServiceSubcategoryFilter)) {
      setWhyServiceSubcategoryFilter('');
    }
  }, [whyServiceCategoryFilter, whyServiceSubcategoryFilter, subcategoryLookup]);

  // Keep dependent filters valid for Why choose VedX tab
  useEffect(() => {
    if (!whyVedxCategoryFilter) {
      setWhyVedxSubcategoryFilter('');
      return;
    }

    const allowed = subcategoryLookup.get(whyVedxCategoryFilter) || [];
    if (whyVedxSubcategoryFilter && !allowed.includes(whyVedxSubcategoryFilter)) {
      setWhyVedxSubcategoryFilter('');
    }
  }, [whyVedxCategoryFilter, whyVedxSubcategoryFilter, subcategoryLookup]);

  useEffect(() => {
    setWhyServicePage(1);
  }, [whyServiceCategoryFilter, whyServiceSubcategoryFilter]);

  useEffect(() => {
    setWhyVedxPage(1);
  }, [whyVedxCategoryFilter, whyVedxSubcategoryFilter]);

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

    return benefits.filter(
      (benefit) => String(benefit.benefitConfigId) === String(selectedBenefitConfigId)
    );
  }, [benefits, selectedBenefitConfigId]);

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

  const sortedTechnologies = useMemo(
    () =>
      [...technologies].sort((a, b) => {
        const titleCompare = (a.title || '').localeCompare(b.title || '');
        if (titleCompare !== 0) return titleCompare;
        return String(a.id ?? '').localeCompare(String(b.id ?? ''));
      }),
    [technologies]
  );

  // Technologies tab should NOT be filtered by category/sub-category.
  const filteredTechnologies = useMemo(() => sortedTechnologies, [sortedTechnologies]);

  const groupedTechnologies = useMemo(() => {
    const groups = new Map();

    filteredTechnologies.forEach((tech) => {
      const key = (tech?.title || '').trim() || 'Untitled';

      const existing = groups.get(key) || [];
      groups.set(key, [...existing, tech]);
    });

    // Sort groups by title (optional but nice)
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, items]) => ({ key, items }));
  }, [filteredTechnologies]);

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

  const filteredHireServices = useMemo(
    () =>
      hireContent.services.filter((service) => {
        const matchesCategory = whyVedxCategoryFilter ? service.category === categoryFilter : true;
        const matchesSubcategory = whyVedxSubcategoryFilter ? service.subcategory === subcategoryFilter : true;
        return matchesCategory && matchesSubcategory;
      }),
    [categoryFilter, hireContent.services, subcategoryFilter]
  );

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredHireServices.length / rowsPerPage));
    setHireServicePage((prev) => Math.min(prev, maxPage));
  }, [filteredHireServices.length, rowsPerPage]);

  const pagedHireServices = useMemo(() => {
    const start = (hireServicePage - 1) * rowsPerPage;
    return filteredHireServices.slice(start, start + rowsPerPage);
  }, [filteredHireServices, rowsPerPage, hireServicePage]);

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
        const matchesCategory = contactCategoryFilter ? button.category === contactCategoryFilter : true;
        const matchesSubcategory = contactSubcategoryFilter ? button.subcategory === contactSubcategoryFilter : true;
        return matchesCategory && matchesSubcategory;
      }),
    [contactButtons, contactCategoryFilter, contactSubcategoryFilter]
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
    setTechnologyForm({
      ...emptyTechnologyForm,
      id: technology?.id ?? '',
      title: technology?.title ?? '',
      image: technology?.image ?? imagePlaceholder,
      items: Array.isArray(technology?.items) ? technology.items : [],
    });
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
    if (!technologyForm.title.trim() || !technologyForm.image) return;

    const payload = {
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

    const defaultCategory = benefitConfigCategoryName || '';
    const defaultSubcategory = benefitConfigSubcategoryName || '';

    setBenefitDialogMode('create');
    setActiveBenefit(null);
    setBenefitForm({
      ...emptyBenefitForm,
      category: defaultCategory,
      subcategory: defaultSubcategory,
      benefitConfigId: selectedBenefitConfigId,
    });
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

    const benefitConfigId = benefitForm.benefitConfigId || selectedBenefitConfigId;
    if (!benefitConfigId) {
      handleRequestError(new Error('Please select a benefit config before saving benefits'));
      return;
    }

    const payload = {
      title: benefitForm.title,
      category: benefitForm.category,
      subcategory: benefitForm.subcategory,
      description: benefitForm.description,
      image: benefitForm.image,
      benefitConfigId,
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
    const defaultCategory = categoryFilter || whyHeroForm.category || '';
    const defaultSubcategory =
      subcategoryFilter || (defaultCategory === whyHeroForm.category ? whyHeroForm.subcategory : '');

    setWhyServiceForm((prev) => ({
      ...prev,
      ...emptyWhyServiceForm,
      category: defaultCategory,
      subcategory: defaultSubcategory,
    }));
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
    setContactButtonForm({
      ...emptyContactButtonForm,
      category: contactCategoryFilter || '',
      subcategory: contactSubcategoryFilter || '',
    });
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
      whyVedxConfigClearedRef.current = false;
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
      categoryId: whyVedxForm.categoryId || null,
      subcategoryId: whyVedxForm.subcategoryId || null,
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
        tabs={adminServiceTabs}
        sx={{
          background: 'linear-gradient(135deg, #0b1120 0%, #111827 100%)',
        }}
      />

      {activeTab === 'services' && (
        <ServicesTab
          dateFilterOptions={dateFilterOptions}
          serviceDateFilter={serviceDateFilter}
          setServiceDateFilter={setServiceDateFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categoryOptions={categoryOptions}
          subcategoryFilter={subcategoryFilter}
          setSubcategoryFilter={setSubcategoryFilter}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          serviceDateRange={serviceDateRange}
          setServiceDateRange={setServiceDateRange}
          groupedServices={groupedServices}
          imagePlaceholder={imagePlaceholder}
          setViewService={setViewService}
          openServiceEditDialog={openServiceEditDialog}
          openServiceDeleteDialog={openServiceDeleteDialog}
          filteredServices={filteredServices}
          rowsPerPage={rowsPerPage}
          servicePage={servicePage}
          setServicePage={setServicePage}
          openServiceCreateDialog={openServiceCreateDialog}
        />
      )}

      {activeTab === 'process' && (
        <ProcessTab
          pagedProcesses={pagedProcesses}
          imagePlaceholder={imagePlaceholder}
          openProcessCreateDialog={openProcessCreateDialog}
          filteredProcesses={filteredProcesses}
          rowsPerPage={rowsPerPage}
          processPage={processPage}
          setProcessPage={setProcessPage}
          processList={processList}
          openProcessEditDialog={openProcessEditDialog}
          openProcessDeleteDialog={openProcessDeleteDialog}
        />
      )}

      {activeTab === 'why-vedx' && (
        <WhyVedxTab
          categoryOptions={categoryOptions}
          whyVedxCategoryFilter={whyVedxCategoryFilter}
          setWhyVedxCategoryFilter={setWhyVedxCategoryFilter}
          whyVedxSubcategoryFilter={whyVedxSubcategoryFilter}
          setWhyVedxSubcategoryFilter={setWhyVedxSubcategoryFilter}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          whyVedxOptions={whyVedxOptions}
          selectedWhyVedxId={selectedWhyVedxId}
          handleWhyVedxSelect={handleWhyVedxSelect}
          handleNewWhyVedxHero={handleNewWhyVedxHero}
          serviceCategories={serviceCategories}
          whyVedxHeroForm={whyVedxHeroForm}
          handleWhyVedxHeroChange={handleWhyVedxHeroChange}
          handleWhyVedxHeroSave={handleWhyVedxHeroSave}
          ImageUpload={ImageUpload}
          whyVedxSubcategoryOptions={whyVedxSubcategoryOptions}
          activeWhyVedxReasons={activeWhyVedxReasons}
          rowsPerPage={rowsPerPage}
          whyVedxPage={whyVedxPage}
          setWhyVedxPage={setWhyVedxPage}
          imagePlaceholder={imagePlaceholder}
          openWhyVedxCreateDialog={openWhyVedxCreateDialog}
          openWhyVedxEditDialog={openWhyVedxEditDialog}
          openWhyVedxDeleteDialog={openWhyVedxDeleteDialog}
        />
      )}
      {activeTab === 'industries' && (
        <IndustriesTab
          industries={industries}
          setIndustries={setIndustries}
          imagePlaceholder={imagePlaceholder}
          rowsPerPage={rowsPerPage}
          industryPage={industryPage}
          setIndustryPage={setIndustryPage}
          openIndustryCreateDialog={openIndustryCreateDialog}
          openIndustryEditDialog={openIndustryEditDialog}
          openIndustryDeleteDialog={openIndustryDeleteDialog}
        />
      )}

      {activeTab === 'tech-solutions' && (
        <TechSolutionsTab
          techSolutions={techSolutions}
          setTechSolutions={setTechSolutions}
          rowsPerPage={rowsPerPage}
          techSolutionPage={techSolutionPage}
          setTechSolutionPage={setTechSolutionPage}
          openTechSolutionCreateDialog={openTechSolutionCreateDialog}
          openTechSolutionEditDialog={openTechSolutionEditDialog}
          openTechSolutionDeleteDialog={openTechSolutionDeleteDialog}
        />
      )}

      {activeTab === 'expertise' && (
        <ExpertiseTab
          expertiseHeroForm={expertiseHeroForm}
          handleExpertiseHeroChange={handleExpertiseHeroChange}
          handleExpertiseHeroSave={handleExpertiseHeroSave}
          expertise={expertise}
          openExpertiseCreateDialog={openExpertiseCreateDialog}
          openExpertiseEditDialog={openExpertiseEditDialog}
          openExpertiseDeleteDialog={openExpertiseDeleteDialog}
          rowsPerPage={rowsPerPage}
          expertisePage={expertisePage}
          setExpertisePage={setExpertisePage}
          imagePlaceholder={imagePlaceholder}
        />
      )}

      {activeTab === 'why-choose' && (
        <WhyChooseTab
          categoryOptions={categoryOptions}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          whyServiceCategoryFilter={whyServiceCategoryFilter}
          setWhyServiceCategoryFilter={setWhyServiceCategoryFilter}
          whyServiceSubcategoryFilter={whyServiceSubcategoryFilter}
          setWhyServiceSubcategoryFilter={setWhyServiceSubcategoryFilter}
          whyChooseList={whyChooseList}
          selectedWhyChooseId={selectedWhyChooseId}
          setSelectedWhyChooseId={setSelectedWhyChooseId}
          onNewConfig={handleWhyChooseNewConfig}
          whyHeroForm={whyHeroForm}
          handleWhyHeroChange={handleWhyHeroChange}
          handleWhyHeroSave={handleWhyHeroSave}
          openWhyServiceCreateDialog={openWhyServiceCreateDialog}
          pagedWhyServices={pagedWhyServices}
          whyChoose={whyChoose}
          openWhyServiceEditDialog={openWhyServiceEditDialog}
          openWhyServiceDeleteDialog={openWhyServiceDeleteDialog}
          rowsPerPage={rowsPerPage}
          whyServicePage={whyServicePage}
          setWhyServicePage={setWhyServicePage}
        />
      )}

      {activeTab === 'technologies' && (
        <TechnologiesTab
          groupedTechnologies={groupedTechnologies}
          technologies={technologies}
          openTechnologyCreateDialog={openTechnologyCreateDialog}
          openTechnologyEditDialog={openTechnologyEditDialog}
          openTechnologyDeleteDialog={openTechnologyDeleteDialog}
          imagePlaceholder={imagePlaceholder}
        />
      )}

      {activeTab === 'benefits' && (
        <BenefitsTab
          categoryOptions={categoryOptions}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          benefitCategoryFilter={benefitCategoryFilter}
          setBenefitCategoryFilter={setBenefitCategoryFilter}
          benefitSubcategoryFilter={benefitSubcategoryFilter}
          setBenefitSubcategoryFilter={setBenefitSubcategoryFilter}
          benefitConfigs={benefitConfigs}
          selectedBenefitConfigId={selectedBenefitConfigId}
          handleBenefitConfigSelect={handleBenefitConfigSelect}
          handleNewBenefitConfig={handleNewBenefitConfig}
          benefitHero={benefitHero}
          benefitHeroCategoryOptions={benefitHeroCategoryOptions}
          benefitHeroSubcategoryOptions={benefitHeroSubcategoryOptions}
          handleBenefitHeroChange={handleBenefitHeroChange}
          handleBenefitHeroSave={handleBenefitHeroSave}
          benefitHeroSaved={benefitHeroSaved}
          hasBenefitConfig={hasBenefitConfig}
          groupedBenefits={groupedBenefits}
          visibleBenefits={visibleBenefits}
          rowsPerPage={rowsPerPage}
          benefitPage={benefitPage}
          setBenefitPage={setBenefitPage}
          openBenefitCreateDialog={openBenefitCreateDialog}
          openBenefitEditDialog={openBenefitEditDialog}
          openBenefitDeleteDialog={openBenefitDeleteDialog}
          imagePlaceholder={imagePlaceholder}
        />
      )}

      {activeTab === 'contact-buttons' && (
        <ContactButtonsTab
          categoryOptions={categoryOptions}
          contactCategoryFilter={contactCategoryFilter}
          setContactCategoryFilter={setContactCategoryFilter}
          contactSubcategoryFilter={contactSubcategoryFilter}
          setContactSubcategoryFilter={setContactSubcategoryFilter}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          groupedContactButtons={groupedContactButtons}
          contactButtons={contactButtons}
          filteredContactButtons={filteredContactButtons}
          rowsPerPage={rowsPerPage}
          contactButtonPage={contactButtonPage}
          setContactButtonPage={setContactButtonPage}
          openContactButtonCreateDialog={openContactButtonCreateDialog}
          openContactButtonEditDialog={openContactButtonEditDialog}
          openContactButtonDeleteDialog={openContactButtonDeleteDialog}
          imagePlaceholder={imagePlaceholder}
        />
      )}

      {activeTab === 'hire' && (
        <HireTab
          categoryOptions={categoryOptions}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          subcategoryFilter={subcategoryFilter}
          setSubcategoryFilter={setSubcategoryFilter}
          groupedHireServices={groupedHireServices}
          hireContent={hireContent}
          rowsPerPage={rowsPerPage}
          hireServicePage={hireServicePage}
          setHireServicePage={setHireServicePage}
          openHireServiceCreateDialog={openHireServiceCreateDialog}
          openHireServiceEditDialog={openHireServiceEditDialog}
          openHireServiceDeleteDialog={openHireServiceDeleteDialog}
          imagePlaceholder={imagePlaceholder}
        />
      )}

      <Dialog open={serviceDialogOpen} onClose={closeServiceDialog} maxWidth="md" fullWidth>
        <DialogTitle>{serviceDialogMode === 'edit' ? 'Edit service menu' : 'Add service menu'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleServiceSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disableClearable={false}
                  clearOnEscape
                  freeSolo
                  options={categoryOptions.map((option) => option.label)}
                  value={serviceForm.category}
                  onInputChange={(event, newValue) =>
                    handleServiceFormChange('category', newValue || '')
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Category" required />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  disableClearable={false}
                  clearOnEscape
                  options={serviceFormSubcategoryOptions}
                  value={serviceForm.subcategories[0]?.name || null}
                  onChange={(event, newValue) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      subcategories: newValue ? [{ name: newValue }] : [],
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sub-category"
                      placeholder="Select sub-category"
                      required
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
              fullWidth
              required
              disabled
              helperText="Category is set by the current Why choose config"
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
              fullWidth
              disabled
              helperText="Sub-category follows the selected Why choose config"
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
              label="Technologies"
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
              disabled
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
              disabled
              fullWidth
              InputProps={{ readOnly: true }}
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
                  disableClearable={false}
                  clearOnEscape
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
                  disableClearable={false}
                  clearOnEscape
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
            <Autocomplete
                  disableClearable={false}
                  clearOnEscape
              options={serviceCategories.map((category) => ({ value: category.id, label: category.name }))}
              value={
                serviceCategories
                  .map((category) => ({ value: category.id, label: category.name }))
                  .find((option) => String(option.value) === String(whyVedxForm.categoryId)) || null
              }
              disabled
              onChange={(event, option) =>
                setWhyVedxForm((prev) => ({
                  ...prev,
                  categoryId: option?.value || '',
                  categoryName: option?.label || '',
                  subcategoryId: '',
                  subcategoryName: '',
                }))
              }
              renderInput={(params) => <TextField {...params} label="Category" placeholder="Select category" fullWidth />}
              fullWidth
            />
            <Autocomplete
                  disableClearable={false}
                  clearOnEscape
              options={whyVedxReasonSubcategoryOptions}
              value={
                whyVedxReasonSubcategoryOptions.find(
                  (option) => String(option.value) === String(whyVedxForm.subcategoryId)
                ) || null
              }

              onChange={(event, option) =>
                setWhyVedxForm((prev) => ({
                  ...prev,
                  subcategoryId: option?.value || '',
                  subcategoryName: option?.label || '',
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subcategory"
                  placeholder={
                    whyVedxForm.categoryId
                      ? 'Select a subcategory'
                      : 'Select a category to filter subcategories'
                  }
                  fullWidth
                />
              )}
              fullWidth
              disabled
            />
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
                  disableClearable={false}
                  clearOnEscape
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
                  disableClearable={false}
                  clearOnEscape
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
