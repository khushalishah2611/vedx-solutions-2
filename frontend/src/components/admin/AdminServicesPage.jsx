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
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import AdminSectionTabs from './tabs/AdminSectionTabs.jsx';
import ServicesTab from './tabs/ServicesTab.jsx';
import ProcessTab from './tabs/ProcessTab.jsx';
import WhyVedxTab from './tabs/WhyVedxTab.jsx';
import WhyChooseTab from './tabs/WhyChooseTab.jsx';
import TechnologiesTab from './tabs/TechnologiesTab.jsx';
import BenefitsTab from './tabs/BenefitsTab.jsx';
import ContactButtonsTab from './tabs/ContactButtonsTab.jsx';
import HireTab from './tabs/HireTab.jsx';
import TechSolutionsTab from './tabs/TechSolutionsTab.jsx';

import ImageUpload from './tabs/ImageUpload.jsx';
import adminServiceTabs from './tabs/adminServiceTabs.js';

const imagePlaceholder = '';
const rowsPerPage = 20;

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
  serviceId: '',
  subcategory: '',
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

const emptyWhyServiceForm = {
  id: '',
  category: '',
  subcategory: '',
  title: '',
  description: '',
};

const emptyTechSolutionForm = {
  id: '',
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

const normalizeDate = (value) => (value ? String(value).split('T')[0] : '');

const clampPage = (setPage, total, perPage) => {
  const maxPage = Math.max(1, Math.ceil((total || 0) / (perPage || 1)));
  setPage((prev) => Math.min(prev, maxPage));
};

const AdminServicesPage = () => {
  const [activeTab, setActiveTab] = useState('services');

  // ---------- Common filters ----------
  const [serviceDateFilter, setServiceDateFilter] = useState('all');
  const [serviceDateRange, setServiceDateRange] = useState({ start: '', end: '' });

  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');

  // independent filters
  const [contactCategoryFilter, setContactCategoryFilter] = useState('');
  const [contactSubcategoryFilter, setContactSubcategoryFilter] = useState('');

  const [benefitCategoryFilter, setBenefitCategoryFilter] = useState('');
  const [benefitSubcategoryFilter, setBenefitSubcategoryFilter] = useState('');

  const [whyServiceCategoryFilter, setWhyServiceCategoryFilter] = useState('');
  const [whyServiceSubcategoryFilter, setWhyServiceSubcategoryFilter] = useState('');

  const [whyVedxCategoryFilter, setWhyVedxCategoryFilter] = useState('');
  const [whyVedxSubcategoryFilter, setWhyVedxSubcategoryFilter] = useState('');

  // ---------- Pagination ----------
  const [servicePage, setServicePage] = useState(1);
  const [benefitPage, setBenefitPage] = useState(1);
  const [whyServicePage, setWhyServicePage] = useState(1);
  const [hireServicePage, setHireServicePage] = useState(1);
  const [processPage, setProcessPage] = useState(1);
  const [whyVedxPage, setWhyVedxPage] = useState(1);
  const [techSolutionPage, setTechSolutionPage] = useState(1);
  const [contactButtonPage, setContactButtonPage] = useState(1);

  // ---------- Master data ----------
  const [services, setServices] = useState(initialServices);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [serviceSubcategories, setServiceSubcategories] = useState([]);

  const [technologies, setTechnologies] = useState(initialTechnologies);

  const [benefits, setBenefits] = useState(initialBenefits);
  const [benefitHero, setBenefitHero] = useState(initialBenefitHero);
  const [benefitConfigs, setBenefitConfigs] = useState([]);
  const [selectedBenefitConfigId, setSelectedBenefitConfigId] = useState('');
  const [benefitHeroSaved, setBenefitHeroSaved] = useState(false);
  const benefitConfigClearedRef = useRef(false);

  const [hireContent, setHireContent] = useState(initialHireDevelopers);
  const [heroSaved, setHeroSaved] = useState(false);

  const [contactButtons, setContactButtons] = useState([]);

  const [whyChooseList, setWhyChooseList] = useState([]);
  const [selectedWhyChooseId, setSelectedWhyChooseId] = useState('');
  const [whyChoose, setWhyChoose] = useState(initialWhyChoose);
  const [whyHeroForm, setWhyHeroForm] = useState(initialWhyChoose);
  const whyChooseConfigClearedRef = useRef(false);

  const [processList, setProcessList] = useState(initialProcess);

  const [whyVedxList, setWhyVedxList] = useState([]);
  const [selectedWhyVedxId, setSelectedWhyVedxId] = useState('');
  const [whyVedxHeroForm, setWhyVedxHeroForm] = useState(emptyWhyVedxHero);
  const [whyVedxReasons, setWhyVedxReasons] = useState([]);
  const whyVedxConfigClearedRef = useRef(false);

  const [techSolutions, setTechSolutions] = useState({ solutions: [] });

  // ---------- Dialogs ----------
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDialogMode, setServiceDialogMode] = useState('create');
  const [activeService, setActiveService] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [viewService, setViewService] = useState(null);
  const [faqDraft, setFaqDraft] = useState({ question: '', answer: '' });

  const [technologyDialogOpen, setTechnologyDialogOpen] = useState(false);
  const [technologyDialogMode, setTechnologyDialogMode] = useState('create');
  const [technologyForm, setTechnologyForm] = useState(emptyTechnologyForm);
  const [technologyItemsInput, setTechnologyItemsInput] = useState('');
  const [activeTechnology, setActiveTechnology] = useState(null);
  const [technologyToDelete, setTechnologyToDelete] = useState(null);

  const [benefitDialogOpen, setBenefitDialogOpen] = useState(false);
  const [benefitDialogMode, setBenefitDialogMode] = useState('create');
  const [benefitForm, setBenefitForm] = useState(emptyBenefitForm);
  const [activeBenefit, setActiveBenefit] = useState(null);
  const [benefitToDelete, setBenefitToDelete] = useState(null);

  const [hireServiceDialogOpen, setHireServiceDialogOpen] = useState(false);
  const [hireServiceDialogMode, setHireServiceDialogMode] = useState('create');
  const [hireServiceForm, setHireServiceForm] = useState(emptyHireServiceForm);
  const [activeHireService, setActiveHireService] = useState(null);
  const [hireServiceToDelete, setHireServiceToDelete] = useState(null);

  const [contactButtonDialogOpen, setContactButtonDialogOpen] = useState(false);
  const [contactButtonDialogMode, setContactButtonDialogMode] = useState('create');
  const [contactButtonForm, setContactButtonForm] = useState(emptyContactButtonForm);
  const [activeContactButton, setActiveContactButton] = useState(null);
  const [contactButtonToDelete, setContactButtonToDelete] = useState(null);

  const [whyServiceDialogOpen, setWhyServiceDialogOpen] = useState(false);
  const [whyServiceDialogMode, setWhyServiceDialogMode] = useState('create');
  const [whyServiceForm, setWhyServiceForm] = useState(emptyWhyServiceForm);
  const [activeWhyService, setActiveWhyService] = useState(null);
  const [whyServiceToDelete, setWhyServiceToDelete] = useState(null);

  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [processDialogMode, setProcessDialogMode] = useState('create');
  const [processForm, setProcessForm] = useState(emptyProcessForm);
  const [activeProcess, setActiveProcess] = useState(null);
  const [processToDelete, setProcessToDelete] = useState(null);

  const [whyVedxDialogOpen, setWhyVedxDialogOpen] = useState(false);
  const [whyVedxDialogMode, setWhyVedxDialogMode] = useState('create');
  const [whyVedxForm, setWhyVedxForm] = useState(emptyWhyVedxForm);
  const [activeWhyVedx, setActiveWhyVedx] = useState(null);
  const [whyVedxToDelete, setWhyVedxToDelete] = useState(null);

  const [techSolutionDialogOpen, setTechSolutionDialogOpen] = useState(false);
  const [techSolutionDialogMode, setTechSolutionDialogMode] = useState('create');
  const [techSolutionForm, setTechSolutionForm] = useState(emptyTechSolutionForm);
  const [activeTechSolution, setActiveTechSolution] = useState(null);
  const [techSolutionToDelete, setTechSolutionToDelete] = useState(null);

  // ---------- Auth ----------
  const requireToken = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Your session expired. Please log in again.');
    return token;
  }, []);

  const authHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${requireToken()}`,
      'Content-Type': 'application/json',
    }),
    [requireToken]
  );

  const handleRequestError = useCallback((err, fallback) => {
    console.error(fallback, err);
    alert(err?.message || fallback);
  }, []);

  // ---------- Normalizers ----------
  const normalizeServiceMenu = useCallback(
    (menu) => ({
      ...(menu || {}),
      createdAt: normalizeDate(menu?.createdAt),
      subcategories: menu?.subcategories || [],
      faqs: menu?.faqs || [],
    }),
    []
  );

  const normalizeTechnology = useCallback(
    (tech) => ({
      ...(tech || {}),
      title: tech?.title || '',
      image: tech?.image || imagePlaceholder,
      items: tech?.items || [],
    }),
    []
  );

  const normalizeBenefit = useCallback(
    (benefit) => ({
      ...(benefit || {}),
      benefitConfigId: benefit?.benefitConfigId ? String(benefit.benefitConfigId) : '',
      category: benefit?.category || '',
      subcategory: benefit?.subcategory || '',
    }),
    []
  );

  const normalizeBenefitConfig = useCallback(
    (config) => ({
      id: config?.id || '',
      title: config?.title || '',
      description: config?.description || '',
      categoryId: config?.categoryId || '',
      subcategoryId: config?.subcategoryId || '',
      categoryName: config?.categoryName || '',
      subcategoryName: config?.subcategoryName || '',
    }),
    []
  );

  const normalizeContactButton = useCallback(
    (button) => ({
      id: button?.id,
      title: button?.title || '',
      description: button?.description || '',
      image: button?.image || imagePlaceholder,
      category: button?.category || '',
      subcategory: button?.subcategory || '',
    }),
    []
  );

  const normalizeServiceCategory = useCallback(
    (category) => ({
      id: category?.id,
      name: category?.name || '',
      subCategories: category?.subCategories || [],
    }),
    []
  );

  const normalizeServiceSubcategory = useCallback(
    (subcategory) => ({
      id: subcategory?.id,
      name: subcategory?.name || '',
      categoryId: subcategory?.categoryId,
      categoryName: subcategory?.category?.name || '',
    }),
    []
  );

  const normalizeProcess = useCallback(
    (process) => ({
      ...(process || {}),
      createdAt: normalizeDate(process?.createdAt),
      subcategory: process?.subcategory || '',
      serviceId: process?.serviceId || '',
    }),
    []
  );

  const normalizeHireService = useCallback(
    (service) => ({
      ...(service || {}),
      category: service?.category || '',
      subcategory: service?.subcategory || '',
    }),
    []
  );

  const normalizeWhyService = useCallback(
    (service) => ({
      ...(service || {}),
      category: service?.category || '',
      subcategory: service?.subcategory || '',
    }),
    []
  );

  const normalizeWhyChooseHero = useCallback(
    (item) => ({
      id: item?.id,
      category: item?.category || '',
      subcategory: item?.subcategory || '',
      heroTitle: item?.heroTitle || '',
      heroDescription: item?.heroDescription || '',
      heroImage: item?.heroImage || imagePlaceholder,
      tableTitle: item?.tableTitle || '',
      tableDescription: item?.tableDescription || '',
      services: (item?.services || []).map(normalizeWhyService),
    }),
    [normalizeWhyService]
  );

  const normalizeWhyVedxReason = useCallback(
    (reason) => ({
      ...(reason || {}),
      categoryId: reason?.categoryId || '',
      subcategoryId: reason?.subcategoryId || '',
      categoryName: reason?.categoryName || '',
      subcategoryName: reason?.subcategoryName || '',
      whyVedxId: reason?.whyVedxId || '',
    }),
    []
  );

  const normalizeWhyVedx = useCallback(
    (item) => ({
      id: item?.id,
      category: item?.category || item?.categoryName || '',
      subcategory: item?.subcategory || item?.subcategoryName || '',
      categoryId: item?.categoryId || '',
      subcategoryId: item?.subcategoryId || '',
      categoryName: item?.categoryName || item?.category || '',
      subcategoryName: item?.subcategoryName || item?.subcategory || '',
      heroTitle: item?.heroTitle || '',
      heroDescription: item?.heroDescription || '',
      heroImage: item?.heroImage || imagePlaceholder,
      reasons: (item?.reasons || []).map(normalizeWhyVedxReason),
    }),
    [normalizeWhyVedxReason]
  );

  // ---------- Loaders ----------
  const loadServiceMenus = useCallback(
    async ({ category, subcategory } = {}) => {
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
    },
    [normalizeServiceMenu]
  );

  const loadTechnologies = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/technologies'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load technologies');
      setTechnologies((data || []).map(normalizeTechnology));
    } catch (err) {
      console.error('Failed to load technologies', err);
    }
  }, [normalizeTechnology]);

  const loadServiceCategories = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/service-categories'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load categories');
      setServiceCategories((data?.categories || []).map(normalizeServiceCategory));
    } catch (err) {
      console.error('Failed to load service categories', err);
    }
  }, [normalizeServiceCategory]);

  const loadServiceSubcategories = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/service-subcategories'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load sub-categories');
      setServiceSubcategories((data?.subCategories || []).map(normalizeServiceSubcategory));
    } catch (err) {
      console.error('Failed to load service subcategories', err);
    }
  }, [normalizeServiceSubcategory]);

  const loadBenefits = useCallback(
    async ({ category, subcategory, benefitConfigId } = {}) => {
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
    },
    [normalizeBenefit]
  );

  const loadBenefitConfigs = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/benefit-configs'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load benefit configuration');
      setBenefitConfigs((data || []).map(normalizeBenefitConfig));
    } catch (err) {
      console.error('Failed to load benefit configuration', err);
    }
  }, [normalizeBenefitConfig]);

  const loadProcesses = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/service-processes'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load processes');
      setProcessList((data || []).map(normalizeProcess));
    } catch (err) {
      console.error('Failed to load processes', err);
    }
  }, [normalizeProcess]);

  const loadHireContent = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/hire-developer'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || '');
      setHireContent({
        title: data?.title || '',
        description: data?.description || '',
        heroImage: data?.heroImage || imagePlaceholder,
        services: data?.services?.map(normalizeHireService) || [],
      });
    } catch (err) {
      console.error('Failed to load hire developer config', err);
    }
  }, [normalizeHireService]);

  const loadHireServices = useCallback(
    async ({ category, subcategory } = {}) => {
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
    },
    [normalizeHireService]
  );

  const loadContactButtons = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/contact-buttons'));
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load contact buttons');
      setContactButtons((data || []).map(normalizeContactButton));
    } catch (err) {
      console.error('Failed to load contact buttons', err);
    }
  }, [normalizeContactButton]);

  const loadWhyChoose = useCallback(
    async ({ category, subcategory } = {}) => {
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
        setSelectedWhyChooseId(active?.id ? String(active.id) : '');
        setWhyServicePage(1);
      } catch (err) {
        console.error('Failed to load why choose config', err);
      }
    },
    [normalizeWhyChooseHero]
  );

  const loadWhyServices = useCallback(
    async (whyChooseId, { category, subcategory } = {}) => {
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
    },
    [normalizeWhyService]
  );

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
      } catch (err) {
        console.error('Failed to load why VEDX config', err);
      }
    },
    [normalizeWhyVedx]
  );

  const loadWhyVedxReasons = useCallback(
    async (whyVedxId, { category, subcategory } = {}) => {
      try {
        const params = new URLSearchParams();
        if (whyVedxId) params.append('whyVedxId', String(whyVedxId));
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);

        const response = await fetch(
          apiUrl(`/api/why-vedx-reasons${params.toString() ? `?${params.toString()}` : ''}`)
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load reasons');
        setWhyVedxReasons((data || []).map(normalizeWhyVedxReason));
      } catch (err) {
        console.error('Failed to load why VEDX reasons', err);
      }
    },
    [normalizeWhyVedxReason]
  );

  // ---------- Initial loads ----------
  useEffect(() => {
    loadServiceCategories();
    loadServiceSubcategories();
    loadProcesses();
    loadHireContent();
    loadWhyVedx();
    loadBenefitConfigs();
    loadContactButtons();
  }, [
    loadBenefitConfigs,
    loadContactButtons,
    loadHireContent,
    loadProcesses,
    loadServiceCategories,
    loadServiceSubcategories,
    loadWhyVedx,
  ]);

  // Services/Technologies/Hire services react to top filters
  useEffect(() => {
    const filters = {
      category: categoryFilter || undefined,
      subcategory: subcategoryFilter || undefined,
    };

    loadServiceMenus(filters);
    loadTechnologies();
    loadHireServices(filters);
  }, [categoryFilter, subcategoryFilter, loadServiceMenus, loadTechnologies, loadHireServices]);

  // Why choose this service filters
  useEffect(() => {
    loadWhyChoose({
      category: whyServiceCategoryFilter || undefined,
      subcategory: whyServiceSubcategoryFilter || undefined,
    });
  }, [loadWhyChoose, whyServiceCategoryFilter, whyServiceSubcategoryFilter]);

  // Why choose VedX filters
  useEffect(() => {
    loadWhyVedx({
      category: whyVedxCategoryFilter || undefined,
      subcategory: whyVedxSubcategoryFilter || undefined,
    });
  }, [loadWhyVedx, whyVedxCategoryFilter, whyVedxSubcategoryFilter]);

  // Benefits list load depends on selected config id
  useEffect(() => {
    if (!selectedBenefitConfigId) {
      setBenefits([]);
      return;
    }
    loadBenefits({
      category: benefitCategoryFilter || undefined,
      subcategory: benefitSubcategoryFilter || undefined,
      benefitConfigId: selectedBenefitConfigId,
    });
  }, [benefitCategoryFilter, benefitSubcategoryFilter, loadBenefits, selectedBenefitConfigId]);

  // Select active whyChoose -> load services
  useEffect(() => {
    const matchesFilters = (item) => {
      const matchesCategory = whyServiceCategoryFilter
        ? item.categoryName === whyServiceCategoryFilter || item.category === whyServiceCategoryFilter
        : true;
      const matchesSubcategory = whyServiceSubcategoryFilter
        ? item.subcategoryName === whyServiceSubcategoryFilter || item.subcategory === whyServiceSubcategoryFilter
        : true;
      return matchesCategory && matchesSubcategory;
    };

    if (whyChooseList.length === 0) {
      setSelectedWhyChooseId('');
      setWhyChoose(initialWhyChoose);
      setWhyHeroForm(initialWhyChoose);
      setWhyServicePage(1);
      whyChooseConfigClearedRef.current = false;
      return;
    }

    // If user clicked "Add new hero", do not auto-pick.
    if (whyChooseConfigClearedRef.current && !selectedWhyChooseId) return;

    const active = whyChooseList.find((item) => String(item.id) === String(selectedWhyChooseId));
    const preferred = whyChooseList.find(matchesFilters) || whyChooseList[0];

    const next = active ? (matchesFilters(active) ? active : preferred) : preferred;

    if (!next) {
      setSelectedWhyChooseId('');
      setWhyChoose(initialWhyChoose);
      setWhyHeroForm(initialWhyChoose);
      setWhyServicePage(1);
      whyChooseConfigClearedRef.current = false;
      return;
    }

    if (String(next.id) !== String(selectedWhyChooseId)) {
      setSelectedWhyChooseId(String(next.id));
    }

    setWhyChoose(next);
    setWhyHeroForm(next);
    setWhyServicePage(1);
    loadWhyServices(next.id, {
      category: whyServiceCategoryFilter || undefined,
      subcategory: whyServiceSubcategoryFilter || undefined,
    });
  }, [loadWhyServices, selectedWhyChooseId, whyChooseList, whyServiceCategoryFilter, whyServiceSubcategoryFilter]);


  // Ensure active WhyVedx hero selection + reasons load
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

    if (
      whyVedxConfigClearedRef.current &&
      !selectedWhyVedxId &&
      !(whyVedxCategoryFilter || whyVedxSubcategoryFilter)
    ) return;

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
  }, [
    loadWhyVedxReasons,
    selectedWhyVedxId,
    whyVedxList,
    whyVedxCategoryFilter,
    whyVedxSubcategoryFilter,
  ]);

  // ---------- Lookups ----------
  const categoryOptions = useMemo(() => {
    const seen = new Set();
    return (serviceCategories || [])
      .filter((c) => c?.name?.trim())
      .filter((c) => {
        if (seen.has(c.name)) return false;
        seen.add(c.name);
        return true;
      })
      .map((c) => ({ value: c.name, label: c.name, id: c.id }));
  }, [serviceCategories]);

  const categoryIdToName = useMemo(() => {
    const lookup = new Map();
    serviceCategories.forEach((category) => lookup.set(String(category.id), category.name));
    return lookup;
  }, [serviceCategories]);

  const subcategoryIdToName = useMemo(() => {
    const lookup = new Map();
    serviceSubcategories.forEach((subcategory) => lookup.set(String(subcategory.id), subcategory.name));
    return lookup;
  }, [serviceSubcategories]);

  const subcategoryLookup = useMemo(() => {
    const lookup = new Map();
    serviceCategories.forEach((category) => {
      if (category.name) lookup.set(category.name, []);
    });

    serviceSubcategories.forEach((subcategory) => {
      if (!subcategory?.name) return;

      const categoryName =
        serviceCategories.find((category) => category.id === subcategory.categoryId)?.name ||
        subcategory.categoryName ||
        '';

      if (!categoryName) return;

      const existing = lookup.get(categoryName) || [];
      if (!existing.includes(subcategory.name)) lookup.set(categoryName, [...existing, subcategory.name]);
    });

    return lookup;
  }, [serviceCategories, serviceSubcategories]);

  const allSubcategoryOptions = useMemo(() => {
    return Array.from(new Set((serviceSubcategories || []).map((s) => s?.name).filter(Boolean)));
  }, [serviceSubcategories]);

  // ---------- FIXED FILTERS (Bug fix) ----------
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = categoryFilter ? service.category === categoryFilter : true;
      const matchesSubcategory = subcategoryFilter
        ? (service.subcategories || []).some((s) => s?.name === subcategoryFilter)
        : true;

      return (
        matchesDateFilter(service.createdAt, serviceDateFilter, serviceDateRange) &&
        matchesCategory &&
        matchesSubcategory
      );
    });
  }, [services, categoryFilter, subcategoryFilter, serviceDateFilter, serviceDateRange]);

  useEffect(() => {
    setServicePage(1);
  }, [categoryFilter, subcategoryFilter, serviceDateFilter, serviceDateRange.start, serviceDateRange.end]);

  useEffect(() => {
    clampPage(setServicePage, filteredServices.length, rowsPerPage);
  }, [filteredServices.length]);

  const pagedServices = useMemo(() => {
    const start = (servicePage - 1) * rowsPerPage;
    return filteredServices.slice(start, start + rowsPerPage);
  }, [filteredServices, servicePage]);

  const groupedServices = useMemo(() => {
    const lookup = new Map();
    pagedServices.forEach((service) => {
      const key = service.category || 'Uncategorised';
      const existing = lookup.get(key) || [];
      lookup.set(key, [...existing, service]);
    });
    return Array.from(lookup.entries()).map(([category, items]) => ({ category, services: items }));
  }, [pagedServices]);

  const serviceLookupById = useMemo(() => {
    return new Map(services.map((service) => [String(service.id), service]));
  }, [services]);

  const filteredProcesses = useMemo(() => {
    return processList.filter((item) => {
      const linkedService = serviceLookupById.get(String(item.serviceId));

      const matchesCategory = categoryFilter ? linkedService?.category === categoryFilter : true;
      const matchesSubcategory = subcategoryFilter
        ? item.subcategory === subcategoryFilter ||
          linkedService?.subcategories?.some((s) => s?.name === subcategoryFilter)
        : true;

      return matchesCategory && matchesSubcategory;
    });
  }, [processList, serviceLookupById, categoryFilter, subcategoryFilter]);

  useEffect(() => clampPage(setProcessPage, filteredProcesses.length, rowsPerPage), [filteredProcesses.length]);

  const pagedProcesses = useMemo(() => {
    const start = (processPage - 1) * rowsPerPage;
    return filteredProcesses.slice(start, start + rowsPerPage);
  }, [filteredProcesses, processPage]);

  // Technologies tab should NOT be filtered
  const groupedTechnologies = useMemo(() => {
    const sorted = [...technologies].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    const groups = new Map();
    sorted.forEach((tech) => {
      const key = (tech?.title || '').trim() || 'Untitled';
      const existing = groups.get(key) || [];
      groups.set(key, [...existing, tech]);
    });
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, items]) => ({ key, items }));
  }, [technologies]);

  // Why Vedx options
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
      ? serviceSubcategories.filter((s) => Number(s.categoryId) === Number(whyVedxHeroForm.categoryId))
      : serviceSubcategories;
    return base.map((s) => ({ value: s.id, label: s.name }));
  }, [serviceSubcategories, whyVedxHeroForm.categoryId]);

  const whyVedxReasonSubcategoryOptions = useMemo(() => {
    const base = whyVedxForm.categoryId
      ? serviceSubcategories.filter((s) => Number(s.categoryId) === Number(whyVedxForm.categoryId))
      : serviceSubcategories;
    return base.map((s) => ({ value: s.id, label: s.name }));
  }, [serviceSubcategories, whyVedxForm.categoryId]);

  const activeWhyVedxReasons = useMemo(() => {
    if (!selectedWhyVedxId) return whyVedxReasons;
    return whyVedxReasons.filter((r) => String(r.whyVedxId) === String(selectedWhyVedxId));
  }, [selectedWhyVedxId, whyVedxReasons]);

  useEffect(() => clampPage(setWhyVedxPage, activeWhyVedxReasons.length, rowsPerPage), [activeWhyVedxReasons.length]);

  const pagedWhyServices = useMemo(() => {
    const start = (whyServicePage - 1) * rowsPerPage;
    return (whyChoose.services || []).slice(start, start + rowsPerPage);
  }, [whyChoose.services, whyServicePage]);

  useEffect(() => clampPage(setWhyServicePage, (whyChoose.services || []).length, rowsPerPage), [whyChoose.services]);

  // Hire services (filtered by main filters)
  const filteredHireServices = useMemo(() => {
    return (hireContent.services || []).filter((service) => {
      const matchesCategory = categoryFilter ? service.category === categoryFilter : true;
      const matchesSubcategory = subcategoryFilter ? service.subcategory === subcategoryFilter : true;
      return matchesCategory && matchesSubcategory;
    });
  }, [hireContent.services, categoryFilter, subcategoryFilter]);

  useEffect(() => clampPage(setHireServicePage, filteredHireServices.length, rowsPerPage), [filteredHireServices.length]);

  const pagedHireServices = useMemo(() => {
    const start = (hireServicePage - 1) * rowsPerPage;
    return filteredHireServices.slice(start, start + rowsPerPage);
  }, [filteredHireServices, hireServicePage]);

  const groupedHireServices = useMemo(() => {
    const lookup = new Map();
    pagedHireServices.forEach((service) => {
      const key = service.category || 'Uncategorised';
      const existing = lookup.get(key) || [];
      lookup.set(key, [...existing, service]);
    });
    return Array.from(lookup.entries()).map(([category, items]) => ({ category, services: items }));
  }, [pagedHireServices]);

  // Contact buttons
  const filteredContactButtons = useMemo(() => {
    return (contactButtons || []).filter((button) => {
      const matchesCategory = contactCategoryFilter ? button.category === contactCategoryFilter : true;
      const matchesSubcategory = contactSubcategoryFilter ? button.subcategory === contactSubcategoryFilter : true;
      return matchesCategory && matchesSubcategory;
    });
  }, [contactButtons, contactCategoryFilter, contactSubcategoryFilter]);

  useEffect(() => clampPage(setContactButtonPage, filteredContactButtons.length, rowsPerPage), [filteredContactButtons.length]);

  const pagedContactButtons = useMemo(() => {
    const start = (contactButtonPage - 1) * rowsPerPage;
    return filteredContactButtons.slice(start, start + rowsPerPage);
  }, [filteredContactButtons, contactButtonPage]);

  const groupedContactButtons = useMemo(() => {
    const lookup = new Map();
    pagedContactButtons.forEach((button) => {
      const key = button.category || 'Uncategorised';
      const existing = lookup.get(key) || [];
      lookup.set(key, [...existing, button]);
    });
    return Array.from(lookup.entries()).map(([category, items]) => ({ category, items }));
  }, [pagedContactButtons]);

  // Benefits config selection logic
  const activeBenefitConfig = useMemo(() => {
    return benefitConfigs.find((c) => String(c.id) === String(selectedBenefitConfigId));
  }, [benefitConfigs, selectedBenefitConfigId]);

  const benefitConfigCategoryName = useMemo(() => {
    if (!activeBenefitConfig?.categoryId) return activeBenefitConfig?.categoryName || '';
    return categoryIdToName.get(String(activeBenefitConfig.categoryId)) || activeBenefitConfig?.categoryName || '';
  }, [activeBenefitConfig, categoryIdToName]);

  const benefitConfigSubcategoryName = useMemo(() => {
    if (!activeBenefitConfig?.subcategoryId) return activeBenefitConfig?.subcategoryName || '';
    return subcategoryIdToName.get(String(activeBenefitConfig.subcategoryId)) || activeBenefitConfig?.subcategoryName || '';
  }, [activeBenefitConfig, subcategoryIdToName]);

  const visibleBenefits = useMemo(() => {
    if (!selectedBenefitConfigId) return [];
    return benefits.filter((b) => String(b.benefitConfigId) === String(selectedBenefitConfigId));
  }, [benefits, selectedBenefitConfigId]);

  useEffect(() => clampPage(setBenefitPage, visibleBenefits.length, rowsPerPage), [visibleBenefits.length]);

  const pagedBenefits = useMemo(() => {
    const start = (benefitPage - 1) * rowsPerPage;
    return visibleBenefits.slice(start, start + rowsPerPage);
  }, [visibleBenefits, benefitPage]);

  const groupedBenefits = useMemo(() => {
    const lookup = new Map();
    pagedBenefits.forEach((b) => {
      const key = b.category || 'Uncategorised';
      const existing = lookup.get(key) || [];
      lookup.set(key, [...existing, b]);
    });
    return Array.from(lookup.entries()).map(([category, items]) => ({ category, items }));
  }, [pagedBenefits]);

  const hasBenefitConfig = Boolean(selectedBenefitConfigId);

  // Dependent filter validations
  useEffect(() => {
    if (!categoryFilter) {
      setSubcategoryFilter('');
      return;
    }
    const allowed = subcategoryLookup.get(categoryFilter) || [];
    if (subcategoryFilter && !allowed.includes(subcategoryFilter)) setSubcategoryFilter('');
  }, [categoryFilter, subcategoryFilter, subcategoryLookup]);

  useEffect(() => {
    if (!contactCategoryFilter) {
      setContactSubcategoryFilter('');
      return;
    }
    const allowed = subcategoryLookup.get(contactCategoryFilter) || [];
    if (contactSubcategoryFilter && !allowed.includes(contactSubcategoryFilter)) setContactSubcategoryFilter('');
  }, [contactCategoryFilter, contactSubcategoryFilter, subcategoryLookup]);

  useEffect(() => {
    if (!benefitCategoryFilter) {
      setBenefitSubcategoryFilter('');
      return;
    }
    const allowed = subcategoryLookup.get(benefitCategoryFilter) || [];
    if (benefitSubcategoryFilter && !allowed.includes(benefitSubcategoryFilter)) setBenefitSubcategoryFilter('');
  }, [benefitCategoryFilter, benefitSubcategoryFilter, subcategoryLookup]);

  useEffect(() => {
    if (!whyServiceCategoryFilter) {
      setWhyServiceSubcategoryFilter('');
      return;
    }
    const allowed = subcategoryLookup.get(whyServiceCategoryFilter) || [];
    if (whyServiceSubcategoryFilter && !allowed.includes(whyServiceSubcategoryFilter)) setWhyServiceSubcategoryFilter('');
  }, [whyServiceCategoryFilter, whyServiceSubcategoryFilter, subcategoryLookup]);

  useEffect(() => {
    if (!whyVedxCategoryFilter) {
      setWhyVedxSubcategoryFilter('');
      return;
    }
    const allowed = subcategoryLookup.get(whyVedxCategoryFilter) || [];
    if (whyVedxSubcategoryFilter && !allowed.includes(whyVedxSubcategoryFilter)) setWhyVedxSubcategoryFilter('');
  }, [whyVedxCategoryFilter, whyVedxSubcategoryFilter, subcategoryLookup]);

  // ---------- Form helpers ----------
  const resetServiceForm = useCallback(() => {
    setServiceForm({ ...emptyServiceForm, createdAt: new Date().toISOString().split('T')[0] });
  }, []);

  const resetTechnologyForm = useCallback(() => {
    setTechnologyForm(emptyTechnologyForm);
    setTechnologyItemsInput('');
  }, []);

  const resetBenefitForm = useCallback(() => setBenefitForm(emptyBenefitForm), []);
  const resetHireServiceForm = useCallback(() => setHireServiceForm(emptyHireServiceForm), []);
  const resetWhyServiceForm = useCallback(() => setWhyServiceForm(emptyWhyServiceForm), []);
  const resetProcessForm = useCallback(() => setProcessForm(emptyProcessForm), []);

  const resetWhyVedxForm = useCallback(() => {
    setWhyVedxForm({
      ...emptyWhyVedxForm,
      whyVedxId: selectedWhyVedxId || '',
      categoryId: whyVedxHeroForm.categoryId || '',
      categoryName: whyVedxHeroForm.categoryName || '',
      subcategoryId: whyVedxHeroForm.subcategoryId || '',
      subcategoryName: whyVedxHeroForm.subcategoryName || '',
    });
  }, [selectedWhyVedxId, whyVedxHeroForm.categoryId, whyVedxHeroForm.categoryName, whyVedxHeroForm.subcategoryId, whyVedxHeroForm.subcategoryName]);

  // ---------- Service FAQs ----------
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

  // ---------- Benefit Config selection ----------
  const handleBenefitConfigSelect = (config) => {
    const nextId = config?.id ? String(config.id) : '';
    benefitConfigClearedRef.current = false;
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

  // benefit configs auto-pick logic
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

    const active = benefitConfigs.find((c) => String(c.id) === String(selectedBenefitConfigId));
    const preferredByFilters =
      benefitCategoryFilter || benefitSubcategoryFilter ? benefitConfigs.find(matchesFilters) : null;
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

    if (String(nextConfig.id) !== String(selectedBenefitConfigId)) {
      setSelectedBenefitConfigId(String(nextConfig.id));
    }

    setBenefitHero(nextConfig);
    setBenefitPage(1);
    benefitConfigClearedRef.current = false;
  }, [benefitConfigs, benefitCategoryFilter, benefitSubcategoryFilter, selectedBenefitConfigId]);

  // ---------- WhyVedx hero form change: keep category/subcategory names synced ----------
  const handleWhyVedxHeroChange = (field, value) => {
    setWhyVedxHeroForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === 'categoryId') {
        const availableSub = serviceSubcategories.filter((s) => Number(s.categoryId) === Number(value));
        next.category = categoryIdToName.get(String(value)) || '';
        next.categoryName = next.category;

        if (next.subcategoryId && !availableSub.some((s) => String(s.id) === String(next.subcategoryId))) {
          next.subcategoryId = '';
          next.subcategory = '';
          next.subcategoryName = '';
        }
      }

      if (field === 'subcategoryId') {
        const subName = subcategoryIdToName.get(String(value)) || '';
        next.subcategory = subName;
        next.subcategoryName = subName;
      }

      return next;
    });
  };

  // ---------- WhyVedx hero new/select ----------
  const handleNewWhyVedxHero = () => {
    // Add new hero = start fresh entry mode
    whyVedxConfigClearedRef.current = true;

    // Also clear filters (Category/Subcategory) so the user can create a totally new hero.
    // If filters remain selected, the auto-pick logic will immediately select an existing hero.
    setWhyVedxCategoryFilter('');
    setWhyVedxSubcategoryFilter('');

    setSelectedWhyVedxId('');
    setWhyVedxHeroForm({ ...emptyWhyVedxHero });
    setWhyVedxReasons([]);
    setWhyVedxPage(1);
  };

  const handleWhyVedxSelect = (option) => {
    const nextId = option?.value ? String(option.value) : '';
    const isClearing = !nextId;

    // Clearing selection should NOT block auto-pick by Category/Subcategory filters.
    // We only block auto-pick when user explicitly clicks "Add new hero".
    whyVedxConfigClearedRef.current = false;
    setSelectedWhyVedxId(nextId);

    if (isClearing) {
      setWhyVedxHeroForm({ ...emptyWhyVedxHero });
      setWhyVedxReasons([]);
      setWhyVedxPage(1);
      return;
    }

    const match = whyVedxList.find((i) => String(i.id) === nextId);
    if (match) {
      setWhyVedxHeroForm(match);
      setWhyVedxReasons(match.reasons || []);
    }
    setWhyVedxPage(1);
  };

  // ---------- WhyChoose new config ----------
  const handleWhyChooseNewConfig = useCallback(() => {
    // When user explicitly clicks "Add new hero", we should NOT auto-pick a hero by filters.
    whyChooseConfigClearedRef.current = true;
    setSelectedWhyChooseId('');
    setWhyHeroForm(initialWhyChoose);
    setWhyChoose(initialWhyChoose);
    setWhyServicePage(1);
  }, []);

    const setSelectedWhyChooseIdSafe = useCallback((value) => {
    // Clearing selection SHOULD allow auto-pick by filters.
    whyChooseConfigClearedRef.current = false;
    setSelectedWhyChooseId(value ? String(value) : '');
  }, []);

// ---------- Subcategory options for forms ----------
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
    return options.map((o) => ({ name: o }));
  }, [subcategoryLookup, whyServiceForm.category]);

  // ---------- Dialog open/close handlers ----------
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
    setServiceForm({ ...(service || emptyServiceForm) });
    setFaqDraft({ question: '', answer: '' });
    setServiceDialogOpen(true);
  };

  const closeServiceDialog = () => {
    setServiceDialogOpen(false);
    setActiveService(null);
  };

  const openServiceDeleteDialog = (service) => setServiceToDelete(service);
  const closeServiceDeleteDialog = () => setServiceToDelete(null);

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
    setTechnologyItemsInput((technology?.items || []).join(', '));
    setTechnologyDialogOpen(true);
  };

  const closeTechnologyDialog = () => {
    setTechnologyDialogOpen(false);
    setActiveTechnology(null);
    setTechnologyItemsInput('');
  };

  const openBenefitCreateDialog = () => {
    if (!hasBenefitConfig) {
      handleRequestError(new Error('Please create and save a benefit config before adding benefits'));
      return;
    }
    setBenefitDialogMode('create');
    setActiveBenefit(null);
    setBenefitForm({
      ...emptyBenefitForm,
      category: benefitConfigCategoryName || '',
      subcategory: benefitConfigSubcategoryName || '',
      benefitConfigId: selectedBenefitConfigId,
    });
    setBenefitDialogOpen(true);
  };

  const openBenefitEditDialog = (benefit) => {
    setBenefitDialogMode('edit');
    setActiveBenefit(benefit);
    setBenefitForm({ ...(benefit || emptyBenefitForm) });
    setBenefitDialogOpen(true);
  };

  const closeBenefitDialog = () => {
    setBenefitDialogOpen(false);
    setActiveBenefit(null);
  };

  const openWhyServiceCreateDialog = () => {
    setWhyServiceDialogMode('create');
    setActiveWhyService(null);

    const defaultCategory = categoryFilter || whyHeroForm.category || '';
    const defaultSubcategory =
      subcategoryFilter || (defaultCategory === whyHeroForm.category ? whyHeroForm.subcategory : '');

    setWhyServiceForm({
      ...emptyWhyServiceForm,
      category: defaultCategory,
      subcategory: defaultSubcategory,
    });

    setWhyServiceDialogOpen(true);
  };

  const openWhyServiceEditDialog = (service) => {
    setWhyServiceDialogMode('edit');
    setActiveWhyService(service);
    setWhyServiceForm({ ...(service || emptyWhyServiceForm) });
    setWhyServiceDialogOpen(true);
  };

  const closeWhyServiceDialog = () => {
    setWhyServiceDialogOpen(false);
    setActiveWhyService(null);
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
    setHireServiceForm({ ...(service || emptyHireServiceForm) });
    setHireServiceDialogOpen(true);
  };

  const closeHireServiceDialog = () => {
    setHireServiceDialogOpen(false);
    setActiveHireService(null);
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
    setContactButtonForm({ ...(button || emptyContactButtonForm) });
    setContactButtonDialogOpen(true);
  };

  const closeContactButtonDialog = () => {
    setContactButtonDialogOpen(false);
    setActiveContactButton(null);
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
    setProcessForm({ ...(item || emptyProcessForm) });
    setProcessDialogOpen(true);
  };

  const closeProcessDialog = () => {
    setProcessDialogOpen(false);
    setActiveProcess(null);
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
    setWhyVedxForm({ ...(item || emptyWhyVedxForm) });
    setWhyVedxDialogOpen(true);
  };

  const closeWhyVedxDialog = () => {
    setWhyVedxDialogOpen(false);
    setActiveWhyVedx(null);
  };

  const openTechSolutionCreateDialog = () => {
    setTechSolutionForm(emptyTechSolutionForm);
    setTechSolutionDialogMode('create');
    setActiveTechSolution(null);
    setTechSolutionDialogOpen(true);
  };

  const openTechSolutionEditDialog = (item) => {
    setTechSolutionDialogMode('edit');
    setActiveTechSolution(item);
    setTechSolutionForm({ ...(item || emptyTechSolutionForm) });
    setTechSolutionDialogOpen(true);
  };

  const closeTechSolutionDialog = () => {
    setTechSolutionDialogOpen(false);
    setActiveTechSolution(null);
  };

  // ---------- Submit handlers ----------
  const handleServiceSubmit = async (event) => {
    event?.preventDefault();
    if (!serviceForm.category?.trim()) return;

    const payload = {
      category: serviceForm.category,
      bannerTitle: serviceForm.bannerTitle,
      bannerSubtitle: serviceForm.bannerSubtitle,
      bannerImage: serviceForm.bannerImage,
      totalServices: Number(serviceForm.totalServices) || 0,
      totalProjects: Number(serviceForm.totalProjects) || 0,
      totalClients: Number(serviceForm.totalClients) || 0,
      description: serviceForm.description,
      subcategories: (serviceForm.subcategories || []).map((s) => ({ name: s.name })),
      faqs: (serviceForm.faqs || []).map((f) => ({ question: f.question, answer: f.answer })),
    };

    const isEdit = serviceDialogMode === 'edit' && activeService;
    const url = isEdit ? apiUrl(`/api/service-menus/${activeService.id}`) : apiUrl('/api/service-menus');

    try {
      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save service menu');

      const normalized = normalizeServiceMenu(data);
      setServices((prev) => (isEdit ? prev.map((s) => (s.id === normalized.id ? normalized : s)) : [normalized, ...prev]));
      closeServiceDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save service menu');
    }
  };

  const handleConfirmDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/service-menus/${serviceToDelete.id}`), { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete service');
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      closeServiceDeleteDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to delete service');
    }
  };

  const handleTechnologySubmit = async (event) => {
    event?.preventDefault();
    if (!technologyForm.title?.trim() || !technologyForm.image) return;

    const payload = { title: technologyForm.title, image: technologyForm.image, items: technologyForm.items || [] };
    const isEdit = technologyDialogMode === 'edit' && activeTechnology;
    const url = isEdit ? apiUrl(`/api/technologies/${activeTechnology.id}`) : apiUrl('/api/technologies');

    try {
      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save technology');

      const normalized = normalizeTechnology(data);
      setTechnologies((prev) => (isEdit ? prev.map((t) => (t.id === normalized.id ? normalized : t)) : [normalized, ...prev]));
      closeTechnologyDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save technology');
    }
  };

  const handleConfirmDeleteTechnology = async () => {
    if (!technologyToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/technologies/${technologyToDelete.id}`), { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete technology');
      setTechnologies((prev) => prev.filter((t) => t.id !== technologyToDelete.id));
      setTechnologyToDelete(null);
    } catch (err) {
      handleRequestError(err, 'Unable to delete technology');
    }
  };

  const handleHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/hire-developer'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title: hireContent.title, description: hireContent.description, heroImage: hireContent.heroImage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save hero content');
      setHireContent((prev) => ({ ...prev, ...data, services: prev.services }));
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 2500);
    } catch (err) {
      handleRequestError(err, 'Unable to save hero content');
    }
  };

  const handleBenefitHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const isEdit = Boolean(selectedBenefitConfigId);
      const url = isEdit ? apiUrl(`/api/benefit-configs/${selectedBenefitConfigId}`) : apiUrl('/api/benefit-configs');

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
        const exists = prev.some((c) => String(c.id) === String(normalized.id));
        return exists ? prev.map((c) => (String(c.id) === String(normalized.id) ? normalized : c)) : [normalized, ...prev];
      });
      setSelectedBenefitConfigId(String(normalized.id));
      setBenefitHeroSaved(true);
      setTimeout(() => setBenefitHeroSaved(false), 2500);
    } catch (err) {
      handleRequestError(err, 'Unable to save benefits copy');
    }
  };

  const handleBenefitSubmit = async (event) => {
    event?.preventDefault();
    if (!benefitForm.title?.trim() || !benefitForm.description?.trim() || !benefitForm.image) return;

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
    const url = isEdit ? apiUrl(`/api/benefits/${activeBenefit.id}`) : apiUrl('/api/benefits');

    try {
      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save benefit');

      const normalized = normalizeBenefit(data);
      setBenefits((prev) => (isEdit ? prev.map((b) => (b.id === normalized.id ? normalized : b)) : [normalized, ...prev]));
      closeBenefitDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save benefit');
    }
  };

  const handleConfirmDeleteBenefit = async () => {
    if (!benefitToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/benefits/${benefitToDelete.id}`), { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete benefit');
      setBenefits((prev) => prev.filter((b) => b.id !== benefitToDelete.id));
      setBenefitToDelete(null);
    } catch (err) {
      handleRequestError(err, 'Unable to delete benefit');
    }
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
        const exists = prev.some((x) => String(x.id) === String(normalized.id));
        return exists ? prev.map((x) => (String(x.id) === String(normalized.id) ? normalized : x)) : [normalized, ...prev];
      });
    } catch (err) {
      handleRequestError(err, 'Unable to save Why Choose hero');
    }
  };

  const handleWhyServiceSubmit = async (event) => {
    event?.preventDefault();
    if (!whyServiceForm.title?.trim() || !whyServiceForm.category?.trim()) return;
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
    const url = isEdit ? apiUrl(`/api/why-services/${activeWhyService.id}`) : apiUrl('/api/why-services');

    try {
      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save Why Choose service');

      const normalized = normalizeWhyService(data);

      setWhyChoose((prev) => {
        const updated = isEdit ? prev.services.map((s) => (s.id === normalized.id ? normalized : s)) : [normalized, ...prev.services];
        return { ...prev, services: updated };
      });

      setWhyChooseList((prev) =>
        prev.map((item) =>
          String(item.id) === String(selectedWhyChooseId)
            ? {
                ...item,
                services: isEdit
                  ? (item.services || []).map((s) => (s.id === normalized.id ? normalized : s))
                  : [normalized, ...(item.services || [])],
              }
            : item
        )
      );

      closeWhyServiceDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save Why Choose service');
    }
  };

  const handleConfirmDeleteWhyService = async () => {
    if (!whyServiceToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/why-services/${whyServiceToDelete.id}`), { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete Why Choose service');

      setWhyChoose((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== whyServiceToDelete.id) }));
      setWhyChooseList((prev) =>
        prev.map((item) =>
          String(item.id) === String(selectedWhyChooseId)
            ? { ...item, services: (item.services || []).filter((s) => s.id !== whyServiceToDelete.id) }
            : item
        )
      );

      setWhyServiceToDelete(null);
    } catch (err) {
      handleRequestError(err, 'Unable to delete Why Choose service');
    }
  };

  const handleHireServiceSubmit = async (event) => {
    event?.preventDefault();
    if (!hireServiceForm.title?.trim() || !hireServiceForm.image) return;

    const payload = {
      category: hireServiceForm.category || null,
      subcategory: hireServiceForm.subcategory || null,
      title: hireServiceForm.title,
      description: hireServiceForm.description,
      image: hireServiceForm.image,
      hireDeveloperId: hireServiceForm.hireDeveloperId || null,
    };

    const isEdit = hireServiceDialogMode === 'edit' && activeHireService;
    const url = isEdit ? apiUrl(`/api/hire-services/${activeHireService.id}`) : apiUrl('/api/hire-services');

    try {
      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save hire service');

      const normalized = normalizeHireService(data);
      setHireContent((prev) => ({
        ...prev,
        services: isEdit ? prev.services.map((s) => (s.id === normalized.id ? normalized : s)) : [normalized, ...prev.services],
      }));

      closeHireServiceDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save hire service');
    }
  };

  const handleConfirmDeleteHireService = async () => {
    if (!hireServiceToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/hire-services/${hireServiceToDelete.id}`), { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete hire service');

      setHireContent((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== hireServiceToDelete.id) }));
      setHireServiceToDelete(null);
    } catch (err) {
      handleRequestError(err, 'Unable to delete hire service');
    }
  };

  const handleContactButtonSubmit = async (event) => {
    event?.preventDefault();
    if (!contactButtonForm.title?.trim() || !contactButtonForm.image) return;

    const payload = {
      title: contactButtonForm.title,
      description: contactButtonForm.description,
      image: contactButtonForm.image,
      category: contactButtonForm.category,
      subcategory: contactButtonForm.subcategory,
    };

    const isEdit = contactButtonDialogMode === 'edit' && activeContactButton;
    const url = isEdit ? apiUrl(`/api/contact-buttons/${activeContactButton.id}`) : apiUrl('/api/contact-buttons');

    try {
      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save contact button');

      const normalized = normalizeContactButton(data);
      setContactButtons((prev) => (isEdit ? prev.map((b) => (b.id === normalized.id ? normalized : b)) : [normalized, ...prev]));
      closeContactButtonDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save contact button');
    }
  };

  const handleConfirmDeleteContactButton = async () => {
    if (!contactButtonToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/contact-buttons/${contactButtonToDelete.id}`), { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete contact button');

      setContactButtons((prev) => prev.filter((b) => b.id !== contactButtonToDelete.id));
      setContactButtonToDelete(null);
    } catch (err) {
      handleRequestError(err, 'Unable to delete contact button');
    }
  };

  const handleProcessSubmit = async (event) => {
    event?.preventDefault();
    if (!processForm.title?.trim() || !processForm.image) return;

    const payload = {
      title: processForm.title,
      description: processForm.description,
      image: processForm.image,
      serviceId: processForm.serviceId || null,
    };

    const isEdit = processDialogMode === 'edit' && activeProcess;
    const url = isEdit ? apiUrl(`/api/service-processes/${activeProcess.id}`) : apiUrl('/api/service-processes');

    try {
      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save process');

      const normalized = normalizeProcess(data);
      setProcessList((prev) => (isEdit ? prev.map((p) => (p.id === normalized.id ? normalized : p)) : [normalized, ...prev]));
      closeProcessDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save process');
    }
  };

  const handleConfirmDeleteProcess = async () => {
    if (!processToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/service-processes/${processToDelete.id}`), { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete process');

      setProcessList((prev) => prev.filter((p) => p.id !== processToDelete.id));
      setProcessToDelete(null);
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
          subcategory: whyVedxHeroForm.subcategory || subcategoryIdToName.get(String(whyVedxHeroForm.subcategoryId)) || '',
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
        const exists = prev.some((x) => x.id === normalized.id);
        return exists ? prev.map((x) => (x.id === normalized.id ? normalized : x)) : [normalized, ...prev];
      });

      setSelectedWhyVedxId(String(normalized.id));
      setWhyVedxHeroForm(normalized);
      whyVedxConfigClearedRef.current = false;

      if (normalized.reasons?.length) {
        setWhyVedxReasons((prev) => {
          const remaining = prev.filter((r) => String(r.whyVedxId) !== String(normalized.id));
          return [...remaining, ...normalized.reasons];
        });
      }
    } catch (err) {
      handleRequestError(err, 'Unable to save Why VEDX hero');
    }
  };

  const handleWhyVedxSubmit = async (event) => {
    event?.preventDefault();
    if (!whyVedxForm.title?.trim() || !whyVedxForm.description?.trim() || !whyVedxForm.image) return;

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
    const url = isEdit ? apiUrl(`/api/why-vedx-reasons/${activeWhyVedx.id}`) : apiUrl('/api/why-vedx-reasons');

    try {
      const response = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save reason');

      const normalized = normalizeWhyVedxReason(data);
      setWhyVedxReasons((prev) => [normalized, ...prev.filter((x) => x.id !== normalized.id)]);
      closeWhyVedxDialog();
    } catch (err) {
      handleRequestError(err, 'Unable to save reason');
    }
  };

  const handleConfirmDeleteWhyVedx = async () => {
    if (!whyVedxToDelete) return;
    try {
      const response = await fetch(apiUrl(`/api/why-vedx-reasons/${whyVedxToDelete.id}`), { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to delete reason');

      setWhyVedxReasons((prev) => prev.filter((r) => r.id !== whyVedxToDelete.id));
      setWhyVedxToDelete(null);
    } catch (err) {
      handleRequestError(err, 'Unable to delete reason');
    }
  };

  const handleTechSolutionSubmit = (event) => {
    event?.preventDefault();
    if (!techSolutionForm.title?.trim()) return;

    if (techSolutionDialogMode === 'edit' && activeTechSolution) {
      setTechSolutions((prev) => ({
        ...prev,
        solutions: (prev.solutions || []).map((s) => (s.id === activeTechSolution.id ? { ...techSolutionForm } : s)),
      }));
    } else {
      const newItem = { ...techSolutionForm, id: `tech-solution-${Date.now()}` };
      setTechSolutions((prev) => ({ ...prev, solutions: [newItem, ...(prev.solutions || [])] }));
    }

    closeTechSolutionDialog();
  };

  const handleConfirmDeleteTechSolution = () => {
    if (!techSolutionToDelete) return;
    setTechSolutions((prev) => ({
      ...prev,
      solutions: (prev.solutions || []).filter((s) => s.id !== techSolutionToDelete.id),
    }));
    setTechSolutionToDelete(null);
  };

  // ---------- Handlers for minor forms ----------
  const handleBenefitHeroChange = (field, value) => {
    setBenefitHeroSaved(false);
    setBenefitHero((prev) => ({ ...prev, [field]: value }));
  };

  const handleHireContentChange = (field, value) => {
    setHeroSaved(false);
    setHireContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactButtonFormChange = (field, value) => {
    if (field === 'category') {
      setContactButtonForm((prev) => {
        const allowed = subcategoryLookup.get(value) || [];
        const nextSub = allowed.includes(prev.subcategory) ? prev.subcategory : '';
        return { ...prev, category: value, subcategory: nextSub };
      });
      return;
    }
    setContactButtonForm((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- Benefits hero dropdown options ----------
  const benefitHeroCategoryOptions = useMemo(() => {
    return serviceCategories.map((c) => ({ value: c.id, label: c.name }));
  }, [serviceCategories]);

  const benefitHeroSubcategoryOptions = useMemo(() => {
    const base = benefitHero.categoryId
      ? serviceSubcategories.filter((s) => Number(s.categoryId) === Number(benefitHero.categoryId))
      : serviceSubcategories;

    return base.map((s) => ({ value: s.id, label: s.name, categoryId: s.categoryId }));
  }, [benefitHero.categoryId, serviceSubcategories]);

  // ---------- Render ----------
  return (
    <Stack spacing={3}>
      <AdminSectionTabs
        value={activeTab}
        onChange={(event, value) => setActiveTab(value)}
        tabs={adminServiceTabs}
        sx={{ background: 'linear-gradient(135deg, #0b1120 0%, #111827 100%)' }}
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
          openProcessDeleteDialog={(item) => setProcessToDelete(item)}
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
          openWhyVedxDeleteDialog={(item) => setWhyVedxToDelete(item)}
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
          openTechSolutionDeleteDialog={(item) => setTechSolutionToDelete(item)}
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
          setSelectedWhyChooseId={setSelectedWhyChooseIdSafe}
          onNewConfig={handleWhyChooseNewConfig}
          whyHeroForm={whyHeroForm}
          handleWhyHeroChange={(field, value) => setWhyHeroForm((p) => ({ ...p, [field]: value }))}
          handleWhyHeroSave={handleWhyHeroSave}
          openWhyServiceCreateDialog={openWhyServiceCreateDialog}
          pagedWhyServices={pagedWhyServices}
          whyChoose={whyChoose}
          openWhyServiceEditDialog={openWhyServiceEditDialog}
          openWhyServiceDeleteDialog={(service) => setWhyServiceToDelete(service)}
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
          openTechnologyDeleteDialog={(tech) => setTechnologyToDelete(tech)}
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
          openBenefitDeleteDialog={(benefit) => setBenefitToDelete(benefit)}
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
          openContactButtonDeleteDialog={(button) => setContactButtonToDelete(button)}
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
          openHireServiceDeleteDialog={(service) => setHireServiceToDelete(service)}
          imagePlaceholder={imagePlaceholder}
          heroSaved={heroSaved}
          handleHeroSave={handleHeroSave}
          handleHireContentChange={handleHireContentChange}
        />
      )}

      {/* -------------------- DIALOGS -------------------- */}

      {/* Service Create/Edit */}
      <Dialog open={serviceDialogOpen} onClose={closeServiceDialog} maxWidth="md" fullWidth>
        <DialogTitle>{serviceDialogMode === 'edit' ? 'Edit service menu' : 'Add service menu'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleServiceSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  freeSolo
                  clearOnEscape
                  options={categoryOptions.map((o) => o.label)}
                  value={serviceForm.category}
                  onInputChange={(event, newValue) => setServiceForm((p) => ({ ...p, category: newValue || '' }))}
                  renderInput={(params) => <TextField {...params} label="Category" required />}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  clearOnEscape
                  options={serviceFormSubcategoryOptions}
                  value={serviceForm.subcategories?.[0]?.name || null}
                  onChange={(event, newValue) =>
                    setServiceForm((prev) => ({ ...prev, subcategories: newValue ? [{ name: newValue }] : [] }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Sub-category" placeholder="Select sub-category" required />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Banner title"
                  value={serviceForm.bannerTitle}
                  onChange={(e) => setServiceForm((p) => ({ ...p, bannerTitle: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Banner subtitle"
                  value={serviceForm.bannerSubtitle}
                  onChange={(e) => setServiceForm((p) => ({ ...p, bannerSubtitle: e.target.value }))}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <ImageUpload
                  label="Banner image"
                  value={serviceForm.bannerImage}
                  onChange={(value) => setServiceForm((p) => ({ ...p, bannerImage: value }))}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Total services"
                  value={serviceForm.totalServices}
                  onChange={(e) => setServiceForm((p) => ({ ...p, totalServices: Number(e.target.value) }))}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Total projects"
                  value={serviceForm.totalProjects}
                  onChange={(e) => setServiceForm((p) => ({ ...p, totalProjects: Number(e.target.value) }))}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Total clients"
                  value={serviceForm.totalClients}
                  onChange={(e) => setServiceForm((p) => ({ ...p, totalClients: Number(e.target.value) }))}
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
                        onChange={(e) => setFaqDraft((p) => ({ ...p, question: e.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        label="Answer"
                        value={faqDraft.answer}
                        onChange={(e) => setFaqDraft((p) => ({ ...p, answer: e.target.value }))}
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
                        <Box display="flex" flexDirection="column" gap={1} flex={1}>
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

      {/* Service view */}
      <Dialog open={Boolean(viewService)} onClose={() => setViewService(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Service details</DialogTitle>
        <DialogContent dividers>
          {viewService && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                {viewService.category}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                {(viewService.subcategories || []).map((item) => (
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
                  viewService.faqs.map((faq, idx) => (
                    <Stack key={faq.id || `${idx}-${faq.question}`} spacing={0.5}>
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

      {/* Service delete */}
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

      {/* Why service dialog */}
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
              onChange={(e) => setWhyServiceForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={whyServiceForm.description}
              onChange={(e) => setWhyServiceForm((p) => ({ ...p, description: e.target.value }))}
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

      {/* Why service delete */}
      <Dialog open={Boolean(whyServiceToDelete)} onClose={() => setWhyServiceToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete highlight</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{whyServiceToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWhyServiceToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteWhyService} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Technology dialog */}
      <Dialog open={technologyDialogOpen} onClose={closeTechnologyDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{technologyDialogMode === 'edit' ? 'Edit technology block' : 'Add technology block'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleTechnologySubmit}>
            <TextField
              label="Title"
              value={technologyForm.title}
              onChange={(e) => setTechnologyForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              required
            />
            <ImageUpload
              label="Image selection"
              value={technologyForm.image}
              onChange={(value) => setTechnologyForm((p) => ({ ...p, image: value }))}
              required
            />
            <TextField
              label="Technologies"
              value={technologyItemsInput}
              onChange={(e) => {
                const nextValue = e.target.value;
                setTechnologyItemsInput(nextValue);
                setTechnologyForm((p) => ({
                  ...p,
                  items: nextValue
                    .split(',')
                    .map((x) => x.trim())
                    .filter(Boolean),
                }));
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

      {/* Technology delete */}
      <Dialog open={Boolean(technologyToDelete)} onClose={() => setTechnologyToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete technology block</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{technologyToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTechnologyToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteTechnology} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Benefit dialog */}
      <Dialog open={benefitDialogOpen} onClose={closeBenefitDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{benefitDialogMode === 'edit' ? 'Edit benefit' : 'Add benefit'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleBenefitSubmit}>
            <TextField
              label="Title"
              value={benefitForm.title}
              onChange={(e) => setBenefitForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField select label="Category" value={benefitForm.category} fullWidth disabled>
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Sub-category" value={benefitForm.subcategory} fullWidth disabled>
              {benefitSubcategoryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <ImageUpload
              label="Image"
              value={benefitForm.image}
              onChange={(value) => setBenefitForm((p) => ({ ...p, image: value }))}
              required
            />
            <TextField
              label="Description"
              value={benefitForm.description}
              onChange={(e) => setBenefitForm((p) => ({ ...p, description: e.target.value }))}
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

      {/* Benefit delete */}
      <Dialog open={Boolean(benefitToDelete)} onClose={() => setBenefitToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete benefit</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{benefitToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBenefitToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteBenefit} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact button dialog */}
      <Dialog open={contactButtonDialogOpen} onClose={closeContactButtonDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{contactButtonDialogMode === 'edit' ? 'Edit contact button' : 'Add contact button'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleContactButtonSubmit}>
            <TextField
              label="Title"
              value={contactButtonForm.title}
              onChange={(e) => handleContactButtonFormChange('title', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={contactButtonForm.description}
              onChange={(e) => handleContactButtonFormChange('description', e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />

            <Autocomplete
              freeSolo
              clearOnEscape
              options={categoryOptions.map((o) => o.label)}
              value={contactButtonForm.category}
              onInputChange={(e, v) => handleContactButtonFormChange('category', v || '')}
              renderInput={(params) => <TextField {...params} label="Category" placeholder="Select or type category" fullWidth />}
            />

            <Autocomplete
              freeSolo
              clearOnEscape
              options={contactButtonSubcategoryOptions}
              value={contactButtonForm.subcategory}
              onInputChange={(e, v) => handleContactButtonFormChange('subcategory', v || '')}
              renderInput={(params) => <TextField {...params} label="Subcategory" placeholder="Select or type subcategory" fullWidth />}
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

      {/* Contact button delete */}
      <Dialog open={Boolean(contactButtonToDelete)} onClose={() => setContactButtonToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete contact button</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{contactButtonToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactButtonToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteContactButton} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Process dialog */}
      <Dialog open={processDialogOpen} onClose={closeProcessDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{processDialogMode === 'edit' ? 'Edit process step' : 'Add process step'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleProcessSubmit}>
            <TextField
              label="Title"
              value={processForm.title}
              onChange={(e) => setProcessForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={processForm.description}
              onChange={(e) => setProcessForm((p) => ({ ...p, description: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <ImageUpload
              label="Process image"
              value={processForm.image}
              onChange={(value) => setProcessForm((p) => ({ ...p, image: value }))}
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

      {/* Process delete */}
      <Dialog open={Boolean(processToDelete)} onClose={() => setProcessToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete process step</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{processToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProcessToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteProcess} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Why Vedx reason dialog */}
      <Dialog open={whyVedxDialogOpen} onClose={closeWhyVedxDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{whyVedxDialogMode === 'edit' ? 'Edit reason' : 'Add reason'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleWhyVedxSubmit}>
            <Autocomplete
              clearOnEscape
              options={serviceCategories.map((c) => ({ value: c.id, label: c.name }))}
              value={
                serviceCategories
                  .map((c) => ({ value: c.id, label: c.name }))
                  .find((o) => String(o.value) === String(whyVedxForm.categoryId)) || null
              }
              disabled
              renderInput={(params) => <TextField {...params} label="Category" fullWidth />}
              fullWidth
            />

            <Autocomplete
              clearOnEscape
              options={whyVedxReasonSubcategoryOptions}
              value={whyVedxReasonSubcategoryOptions.find((o) => String(o.value) === String(whyVedxForm.subcategoryId)) || null}
              onChange={(event, option) =>
                setWhyVedxForm((prev) => ({ ...prev, subcategoryId: option?.value || '', subcategoryName: option?.label || '' }))
              }
              renderInput={(params) => <TextField {...params} label="Subcategory" fullWidth />}
              fullWidth
              disabled
            />

            <TextField
              label="Title"
              value={whyVedxForm.title}
              onChange={(e) => setWhyVedxForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={whyVedxForm.description}
              onChange={(e) => setWhyVedxForm((p) => ({ ...p, description: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <ImageUpload
              label="Reason image"
              value={whyVedxForm.image}
              onChange={(value) => setWhyVedxForm((p) => ({ ...p, image: value }))}
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

      {/* Why Vedx delete */}
      <Dialog open={Boolean(whyVedxToDelete)} onClose={() => setWhyVedxToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete reason</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{whyVedxToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWhyVedxToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteWhyVedx} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hire service dialog */}
      <Dialog open={hireServiceDialogOpen} onClose={closeHireServiceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{hireServiceDialogMode === 'edit' ? 'Edit hire service' : 'Add hire service'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleHireServiceSubmit}>
            <Autocomplete
              freeSolo
              clearOnEscape
              options={categoryOptions.map((o) => o.label)}
              value={hireServiceForm.category}
              onInputChange={(e, v) =>
                setHireServiceForm((p) => ({ ...p, category: v || '', subcategory: v === p.category ? p.subcategory : '' }))
              }
              renderInput={(params) => <TextField {...params} label="Service category" helperText="Link hire cards to a service category" />}
            />
            <Autocomplete
              freeSolo
              clearOnEscape
              options={hireServiceSubcategoryOptions}
              value={hireServiceForm.subcategory}
              onInputChange={(e, v) => setHireServiceForm((p) => ({ ...p, subcategory: v || '' }))}
              renderInput={(params) => <TextField {...params} label="Sub-category" helperText="Pick the matching sub-category" />}
              disabled={!hireServiceForm.category && hireServiceSubcategoryOptions.length === 0}
            />
            <TextField
              label="Title"
              value={hireServiceForm.title}
              onChange={(e) => setHireServiceForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={hireServiceForm.description}
              onChange={(e) => setHireServiceForm((p) => ({ ...p, description: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <ImageUpload
              label="Service image"
              value={hireServiceForm.image}
              onChange={(value) => setHireServiceForm((p) => ({ ...p, image: value }))}
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

      {/* Hire service delete */}
      <Dialog open={Boolean(hireServiceToDelete)} onClose={() => setHireServiceToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete hire service</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{hireServiceToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHireServiceToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteHireService} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tech solutions dialog */}
      <Dialog open={techSolutionDialogOpen} onClose={closeTechSolutionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{techSolutionDialogMode === 'edit' ? 'Edit solution' : 'Add solution'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleTechSolutionSubmit}>
            <TextField
              label="Title"
              value={techSolutionForm.title}
              onChange={(e) => setTechSolutionForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={techSolutionForm.description}
              onChange={(e) => setTechSolutionForm((p) => ({ ...p, description: e.target.value }))}
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

      {/* Tech solutions delete */}
      <Dialog open={Boolean(techSolutionToDelete)} onClose={() => setTechSolutionToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete solution</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{techSolutionToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTechSolutionToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteTechSolution} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AdminServicesPage;
