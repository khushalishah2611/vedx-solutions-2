import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiUrl } from '../../utils/const.js';
import {
  Autocomplete,
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdminSectionTabs from './tabs/AdminSectionTabs.jsx';
import ContactButtonsTab from './tabs/ContactButtonsTab.jsx';
import BenefitsTab from './tabs/BenefitsTab.jsx';
import WhyChooseTab from './tabs/WhyChooseTab.jsx';
import WhyVedxTab from './tabs/WhyVedxTab.jsx';

const imagePlaceholder = '';

const initialHirePricingState = {
  heroTitle: '',
  heroDescription: '',
  heroImage: imagePlaceholder,
  plans: [],
};

const initialWhyChooseState = {
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

const initialWhyVedxState = {
  id: '',
  category: '',
  subcategory: '',
  categoryId: '',
  subcategoryId: '',
  heroTitle: '',
  heroDescription: '',
  reasons: [],
};

const initialOurServicesState = {
  sliderTitle: '',
  sliderDescription: '',
  sliderImage: imagePlaceholder,
  services: [],
};

const initialIndustriesState = {
  title: '',
  description: '',
  items: [],
};

const initialTechSolutionsState = {
  title: '',
  description: '',
  solutions: [],
};

const initialExpertiseState = {
  title: '',
  description: '',
  items: [],
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

const initialBenefitHero = {
  id: '',
  title: '',
  description: '',
  categoryId: '',
  subcategoryId: '',
  categoryName: '',
  subcategoryName: '',
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

const emptyHirePricingForm = {
  id: '',
  title: '',
  subtitle: '',
  description: '',
  price: '',
  services: [],
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

const emptyWhyVedxHero = {
  id: '',
  category: '',
  subcategory: '',
  categoryId: '',
  subcategoryId: '',
  heroTitle: '',
  heroDescription: '',
};

const emptyWhyVedxForm = {
  id: '',
  title: '',
  description: '',
  image: imagePlaceholder,
  category: '',
  subcategory: '',
  whyVedxConfigId: '',
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


const normalizeHireMasterCategory = (category = {}) => ({
  id: category.id,
  title: category.title || '',
  subcategories: Array.isArray(category.roles)
    ? category.roles.map((role) => role.title || '').filter(Boolean)
    : [],
});

const normalizeHireMasterSubcategory = (subcategory = {}) => ({
  id: subcategory.id,
  title: subcategory.title || '',
  category:
    subcategory.category ||
    subcategory.categoryTitle ||
    subcategory.categoryName ||
    subcategory.hireCategory?.title ||
    '',
});

const normalizeService = (service) => ({
  id: service.id,
  category: service.category || '',
  subcategories: service.subcategories || [],
  bannerTitle: service.bannerTitle || '',
  bannerSubtitle: service.bannerSubtitle || '',
  bannerImage: service.bannerImage || imagePlaceholder,
  createdAt: service.createdAt ? service.createdAt.slice(0, 10) : '',
  totalServices: service.totalServices ?? 0,
  totalProjects: service.totalProjects ?? 0,
  totalClients: service.totalClients ?? 0,
  faqs: service.faqs || [],
  description: service.description || '',
});

const normalizeTechnology = (tech) => ({
  id: tech.id,
  title: tech.title || '',
  image: tech.image || imagePlaceholder,
  items: tech.items || [],
});

const normalizeBenefit = (benefit) => ({
  id: benefit.id,
  title: benefit.title || '',
  category: benefit.category || '',
  subcategory: benefit.subcategory || '',
  description: benefit.description || '',
  image: benefit.image || imagePlaceholder,
  benefitConfigId: benefit.benefitConfigId ? String(benefit.benefitConfigId) : '',
});

const normalizeBenefitConfig = (config) => ({
  id: config.id,
  title: config.title || '',
  description: config.description || '',
  categoryId: config.category || '',
  subcategoryId: config.subcategory || '',
  categoryName: config.category || '',
  subcategoryName: config.subcategory || '',
});

const normalizePricingPlan = (plan) => ({
  id: plan.id,
  title: plan.title || '',
  subtitle: plan.subtitle || '',
  description: plan.description || '',
  price: plan.price || '',
  services: plan.services || [],
  heroTitle: plan.heroTitle || '',
  heroDescription: plan.heroDescription || '',
  heroImage: plan.heroImage || imagePlaceholder,
});

const normalizeContactButton = (button) => ({
  id: button?.id,
  title: button?.title || '',
  description: button?.description || '',
  image: button?.image || imagePlaceholder,
  category: button?.category || '',
  subcategory: button?.subcategory || '',
});

const normalizeProcess = (item) => ({
  id: item.id,
  title: item.title || '',
  description: item.description || '',
  category: item.category || '',
  subcategory: item.subcategory || '',
  image: item.image || imagePlaceholder,
});

const normalizeWhyVedxReason = (item) => ({
  id: item.id,
  title: item.title || '',
  description: item.description || '',
  image: item.image || imagePlaceholder,
  category: item.category || '',
  subcategory: item.subcategory || '',
  whyVedxConfigId: item.whyVedxConfigId ? String(item.whyVedxConfigId) : '',
});

const normalizeWhyVedx = (item) => ({
  id: item.id,
  category: item.category || '',
  subcategory: item.subcategory || '',
  categoryId: item.category || '',
  subcategoryId: item.subcategory || '',
  heroTitle: item.heroTitle || '',
  heroDescription: item.heroDescription || '',
  reasons: (item.reasons || []).map(normalizeWhyVedxReason),
});

const normalizeWhyService = (item) => ({
  id: item.id,
  category: item.category || '',
  subcategory: item.subcategory || '',
  title: item.title || '',
  description: item.description || '',
  whyChooseConfigId: item.whyChooseConfigId ? String(item.whyChooseConfigId) : '',
});

const normalizeWhyChoose = (item) => ({
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

const normalizeIndustry = (item) => ({
  id: item.id,
  title: item.title || '',
  description: item.description || '',
  image: item.image || imagePlaceholder,
  sectionTitle: item.sectionTitle || '',
  sectionDescription: item.sectionDescription || '',
});

const normalizeTechSolution = (item) => ({
  id: item.id,
  title: item.title || '',
  description: item.description || '',
  image: item.image || imagePlaceholder,
  sectionTitle: item.sectionTitle || '',
  sectionDescription: item.sectionDescription || '',
  sliderTitle: item.sliderTitle || '',
  sliderDescription: item.sliderDescription || '',
  sliderImage: item.sliderImage || imagePlaceholder,
});

const normalizeExpertise = (item) => ({
  id: item.id,
  title: item.title || '',
  description: item.description || '',
  image: item.image || imagePlaceholder,
  sectionTitle: item.sectionTitle || '',
  sectionDescription: item.sectionDescription || '',
});

const emptyWhyServiceForm = {
  id: '',
  category: '',
  subcategory: '',
  title: '',
  description: '',
  whyChooseConfigId: '',
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

const AdminHiredeveloperPage = () => {
  const [activeTab, setActiveTab] = useState('services');

  const [services, setServices] = useState([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDialogMode, setServiceDialogMode] = useState('create');
  const [activeService, setActiveService] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [viewService, setViewService] = useState(null);
  const [faqDraft, setFaqDraft] = useState({ question: '', answer: '' });

  const [technologies, setTechnologies] = useState([]);
  const [technologyDialogOpen, setTechnologyDialogOpen] = useState(false);
  const [technologyDialogMode, setTechnologyDialogMode] = useState('create');
  const [technologyForm, setTechnologyForm] = useState(emptyTechnologyForm);
  const [technologyItemsInput, setTechnologyItemsInput] = useState('');
  const [activeTechnology, setActiveTechnology] = useState(null);
  const [technologyToDelete, setTechnologyToDelete] = useState(null);

  const [benefits, setBenefits] = useState([]);
  const [benefitConfigs, setBenefitConfigs] = useState([]);
  const [selectedBenefitConfigId, setSelectedBenefitConfigId] = useState('');
  const [benefitHero, setBenefitHero] = useState(initialBenefitHero);
  const [benefitHeroSaved, setBenefitHeroSaved] = useState(false);
  const benefitConfigClearedRef = useRef(false);
  const [benefitDialogOpen, setBenefitDialogOpen] = useState(false);
  const [benefitDialogMode, setBenefitDialogMode] = useState('create');
  const [benefitForm, setBenefitForm] = useState(emptyBenefitForm);
  const [activeBenefit, setActiveBenefit] = useState(null);
  const [benefitToDelete, setBenefitToDelete] = useState(null);

  const [hirePricing, setHirePricing] = useState(initialHirePricingState);
  const [hirePricingHeroForm, setHirePricingHeroForm] = useState({
    heroTitle: '',
    heroDescription: '',
    heroImage: imagePlaceholder,
  });
  const [hirePricingHeroSaved, setHirePricingHeroSaved] = useState(false);
  const [hirePricingDialogOpen, setHirePricingDialogOpen] = useState(false);
  const [hirePricingDialogMode, setHirePricingDialogMode] = useState('create');
  const [hirePricingForm, setHirePricingForm] = useState(emptyHirePricingForm);
  const [activeHirePricingPlan, setActiveHirePricingPlan] = useState(null);
  const [hirePricingToDelete, setHirePricingToDelete] = useState(null);
  const [newHirePricingService, setNewHirePricingService] = useState('');
  const [hirePricingServiceToEdit, setHirePricingServiceToEdit] = useState(null);
  const [hirePricingServiceEditValue, setHirePricingServiceEditValue] = useState('');
  const [hirePricingServiceToDelete, setHirePricingServiceToDelete] = useState(null);


  const [contactButtons, setContactButtons] = useState([]);
  const [contactButtonDialogOpen, setContactButtonDialogOpen] = useState(false);
  const [contactButtonDialogMode, setContactButtonDialogMode] = useState('create');
  const [contactButtonForm, setContactButtonForm] = useState(emptyContactButtonForm);
  const [activeContactButton, setActiveContactButton] = useState(null);
  const [contactButtonToDelete, setContactButtonToDelete] = useState(null);

  const [whyChoose, setWhyChoose] = useState(initialWhyChooseState);
  const [whyChooseList, setWhyChooseList] = useState([]);
  const [selectedWhyChooseId, setSelectedWhyChooseId] = useState('');
  const whyChooseConfigClearedRef = useRef(false);
  const [whyHeroForm, setWhyHeroForm] = useState(initialWhyChooseState);
  const [whyServiceDialogOpen, setWhyServiceDialogOpen] = useState(false);
  const [whyServiceDialogMode, setWhyServiceDialogMode] = useState('create');
  const [whyServiceForm, setWhyServiceForm] = useState(emptyWhyServiceForm);
  const [activeWhyService, setActiveWhyService] = useState(null);
  const [whyServiceToDelete, setWhyServiceToDelete] = useState(null);

  const [processList, setProcessList] = useState([]);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [processDialogMode, setProcessDialogMode] = useState('create');
  const [processForm, setProcessForm] = useState(emptyProcessForm);
  const [activeProcess, setActiveProcess] = useState(null);
  const [processToDelete, setProcessToDelete] = useState(null);

  const [whyVedx, setWhyVedx] = useState(initialWhyVedxState);
  const [whyVedxList, setWhyVedxList] = useState([]);
  const [selectedWhyVedxId, setSelectedWhyVedxId] = useState('');
  const [whyVedxReasons, setWhyVedxReasons] = useState([]);
  const whyVedxConfigClearedRef = useRef(false);
  const [whyVedxHeroForm, setWhyVedxHeroForm] = useState(initialWhyVedxState);
  const [whyVedxDialogOpen, setWhyVedxDialogOpen] = useState(false);
  const [whyVedxDialogMode, setWhyVedxDialogMode] = useState('create');
  const [whyVedxForm, setWhyVedxForm] = useState(emptyWhyVedxForm);
  const [activeWhyVedx, setActiveWhyVedx] = useState(null);
  const [whyVedxToDelete, setWhyVedxToDelete] = useState(null);

  const [ourServices, setOurServices] = useState(initialOurServicesState);
  const [ourServicesHeroForm, setOurServicesHeroForm] = useState(initialOurServicesState);
  const [ourServiceDialogOpen, setOurServiceDialogOpen] = useState(false);
  const [ourServiceDialogMode, setOurServiceDialogMode] = useState('create');
  const [ourServiceForm, setOurServiceForm] = useState(emptyOurServiceForm);
  const [activeOurService, setActiveOurService] = useState(null);
  const [ourServiceToDelete, setOurServiceToDelete] = useState(null);

  const [industries, setIndustries] = useState(initialIndustriesState);
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false);
  const [industryDialogMode, setIndustryDialogMode] = useState('create');
  const [industryForm, setIndustryForm] = useState(emptyIndustryForm);
  const [activeIndustry, setActiveIndustry] = useState(null);
  const [industryToDelete, setIndustryToDelete] = useState(null);

  const [techSolutions, setTechSolutions] = useState(initialTechSolutionsState);
  const [techSolutionDialogOpen, setTechSolutionDialogOpen] = useState(false);
  const [techSolutionDialogMode, setTechSolutionDialogMode] = useState('create');
  const [techSolutionForm, setTechSolutionForm] = useState(emptyTechSolutionForm);
  const [activeTechSolution, setActiveTechSolution] = useState(null);
  const [techSolutionToDelete, setTechSolutionToDelete] = useState(null);

  const [expertise, setExpertise] = useState(initialExpertiseState);
  const [expertiseHeroForm, setExpertiseHeroForm] = useState(initialExpertiseState);
  const [expertiseDialogOpen, setExpertiseDialogOpen] = useState(false);
  const [expertiseDialogMode, setExpertiseDialogMode] = useState('create');
  const [expertiseForm, setExpertiseForm] = useState(emptyExpertiseForm);
  const [activeExpertise, setActiveExpertise] = useState(null);
  const [expertiseToDelete, setExpertiseToDelete] = useState(null);

  const rowsPerPage = 5;
  const [serviceDateFilter, setServiceDateFilter] = useState('all');
  const [serviceDateRange, setServiceDateRange] = useState({ start: '', end: '' });
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('');
  const [serviceSubcategoryFilter, setServiceSubcategoryFilter] = useState('');
  const [whyServiceCategoryFilter, setWhyServiceCategoryFilter] = useState('');
  const [whyServiceSubcategoryFilter, setWhyServiceSubcategoryFilter] = useState('');
  const [whyVedxCategoryFilter, setWhyVedxCategoryFilter] = useState('');
  const [whyVedxSubcategoryFilter, setWhyVedxSubcategoryFilter] = useState('');
  const [benefitCategoryFilter, setBenefitCategoryFilter] = useState('');
  const [benefitSubcategoryFilter, setBenefitSubcategoryFilter] = useState('');
  const [contactCategoryFilter, setContactCategoryFilter] = useState('');
  const [contactSubcategoryFilter, setContactSubcategoryFilter] = useState('');
  const [servicePage, setServicePage] = useState(1);
  const [benefitPage, setBenefitPage] = useState(1);
  const [whyServicePage, setWhyServicePage] = useState(1);
  const [hirePricingPage, setHirePricingPage] = useState(1);
  const [processPage, setProcessPage] = useState(1);
  const [whyVedxPage, setWhyVedxPage] = useState(1);
  const [industryPage, setIndustryPage] = useState(1);
  const [techSolutionPage, setTechSolutionPage] = useState(1);
  const [expertisePage, setExpertisePage] = useState(1);
  const [contactButtonPage, setContactButtonPage] = useState(1);
  const [hireMasterCategories, setHireMasterCategories] = useState([]);
  const [hireMasterSubcategories, setHireMasterSubcategories] = useState([]);

  const requireToken = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Your session expired. Please log in again.');
    }
    return token;
  }, []);

  const authHeaders = useCallback(
    (headers = {}) => ({
      ...headers,
      Authorization: `Bearer ${requireToken()}`,
      'Content-Type': 'application/json',
    }),
    [requireToken]
  );

  const fetchJson = useCallback(async (path, options = {}) => {
    const response = await fetch(apiUrl(path), {
      ...options,
      headers: authHeaders(options.headers),
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      data = text;
    }

    if (!response.ok) {
      const message = data?.error || data?.message || (typeof data === 'string' ? data : 'Request failed');
      throw new Error(message);
    }

    return data;
  }, [authHeaders]);

  const loadHireMasterCategories = async () => {
    try {
      const data = await fetchJson('/api/hire-categories');
      setHireMasterCategories((data?.categories || []).map(normalizeHireMasterCategory));
    } catch (error) {
      console.error('Failed to load hire category master data', error);
      setHireMasterCategories([]);
    }
  };

  const loadHireMasterSubcategories = async () => {
    try {
      const data = await fetchJson('/api/admin/hire-roles');
      setHireMasterSubcategories((data?.roles || data || []).map(normalizeHireMasterSubcategory));
    } catch (error) {
      console.error('Failed to load hire subcategory master data', error);
      setHireMasterSubcategories([]);
    }
  };

  const loadServices = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/services');
      setServices((data || []).map(normalizeService));
    } catch (error) {
      console.error('Failed to load hire developer services', error);
    }
  };

  const loadTechnologies = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/technologies');
      setTechnologies((data || []).map(normalizeTechnology));
    } catch (error) {
      console.error('Failed to load hire developer technologies', error);
    }
  };

  const loadBenefits = useCallback(
    async ({ category, subcategory, benefitConfigId } = {}) => {
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        if (benefitConfigId) params.append('benefitConfigId', benefitConfigId);
        const data = await fetchJson(`/api/hire-developer/benefits${params.toString() ? `?${params.toString()}` : ''}`);
        setBenefits((data || []).map(normalizeBenefit));
      } catch (error) {
        console.error('Failed to load hire developer benefits', error);
      }
    },
    [fetchJson]
  );

  const loadBenefitConfigs = useCallback(async () => {
    try {
      const data = await fetchJson('/api/hire-developer/benefit-configs');
      setBenefitConfigs((data || []).map(normalizeBenefitConfig));
    } catch (error) {
      console.error('Failed to load hire developer benefit configs', error);
      setBenefitConfigs([]);
    }
  }, [fetchJson]);

  const loadHirePricing = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/pricing');
      const plans = (data || []).map(normalizePricingPlan);
      const heroSource = plans[0] || {};
      setHirePricing({
        heroTitle: heroSource.heroTitle || '',
        heroDescription: heroSource.heroDescription || '',
        heroImage: heroSource.heroImage || imagePlaceholder,
        plans,
      });
      setHirePricingHeroForm({
        heroTitle: heroSource.heroTitle || '',
        heroDescription: heroSource.heroDescription || '',
        heroImage: heroSource.heroImage || imagePlaceholder,
      });
    } catch (error) {
      console.error('Failed to load hire pricing', error);
    }
  };


  const loadContactButtons = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/contact-buttons');
      setContactButtons((data || []).map(normalizeContactButton));
    } catch (error) {
      console.error('Failed to load hire contact buttons', error);
    }
  };

  const loadProcesses = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/processes');
      setProcessList((data || []).map(normalizeProcess));
    } catch (error) {
      console.error('Failed to load hire developer processes', error);
    }
  };

  const loadWhyVedx = useCallback(
    async ({ category, subcategory } = {}) => {
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        params.append('includeReasons', 'true');
        const data = await fetchJson(`/api/hire-developer/why-vedx?${params.toString()}`);
        const list = (data || []).map(normalizeWhyVedx);
        setWhyVedxList(list);
      } catch (error) {
        console.error('Failed to load why VedX configs', error);
      }
    },
    [fetchJson]
  );

  const loadWhyVedxReasons = useCallback(
    async (whyVedxConfigId, { category, subcategory } = {}) => {
      try {
        const params = new URLSearchParams();
        if (whyVedxConfigId) params.append('whyVedxConfigId', whyVedxConfigId);
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        const data = await fetchJson(`/api/hire-developer/why-vedx-reasons?${params.toString()}`);
        setWhyVedxReasons((data || []).map(normalizeWhyVedxReason));
      } catch (error) {
        console.error('Failed to load why VedX reasons', error);
      }
    },
    [fetchJson]
  );

  const loadWhyChoose = useCallback(
    async ({ category, subcategory } = {}) => {
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        const data = await fetchJson(`/api/hire-developer/why-choose${params.toString() ? `?${params.toString()}` : ''}`);
        const normalized = (data || []).map(normalizeWhyChoose);
        const active = normalized[0] || initialWhyChooseState;
        setWhyChoose(active);
        setWhyHeroForm({ ...active });
        setWhyChooseList(normalized);
        setSelectedWhyChooseId(active?.id ? String(active.id) : '');
        setWhyServicePage(1);
      } catch (error) {
        console.error('Failed to load why choose configs', error);
      }
    },
    [fetchJson]
  );

  const loadWhyServices = useCallback(
    async (whyChooseConfigId, { category, subcategory } = {}) => {
      try {
        const params = new URLSearchParams();
        if (whyChooseConfigId) params.append('whyChooseConfigId', whyChooseConfigId);
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        const data = await fetchJson(`/api/hire-developer/why-choose-services?${params.toString()}`);
        setWhyChoose((prev) => ({ ...prev, services: (data || []).map(normalizeWhyService) }));
      } catch (error) {
        console.error('Failed to load why choose highlights', error);
      }
    },
    [fetchJson]
  );

  const loadIndustries = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/industries');
      const items = (data || []).map(normalizeIndustry);
      const heroSource = items[0] || {};
      setIndustries({
        title: heroSource.sectionTitle || '',
        description: heroSource.sectionDescription || '',
        items,
      });
    } catch (error) {
      console.error('Failed to load industries', error);
    }
  };

  const loadTechSolutions = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/tech-solutions');
      const solutions = (data || []).map(normalizeTechSolution);
      const heroSource = solutions[0] || {};
      setTechSolutions({
        title: heroSource.sectionTitle || '',
        description: heroSource.sectionDescription || '',
        solutions,
      });
    } catch (error) {
      console.error('Failed to load tech solutions', error);
    }
  };

  const loadExpertise = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/expertise');
      const items = (data || []).map(normalizeExpertise);
      const heroSource = items[0] || {};
      setExpertise({
        title: heroSource.sectionTitle || '',
        description: heroSource.sectionDescription || '',
        items,
      });
      setExpertiseHeroForm({
        title: heroSource.sectionTitle || '',
        description: heroSource.sectionDescription || '',
      });
    } catch (error) {
      console.error('Failed to load expertise items', error);
    }
  };

  const loadOurServices = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/our-services');
      const services = (data || []).map(normalizeTechSolution);
      const heroSource = data?.[0] || {};
      setOurServices({
        sliderTitle: heroSource.sliderTitle || '',
        sliderDescription: heroSource.sliderDescription || '',
        sliderImage: heroSource.sliderImage || imagePlaceholder,
        services,
      });
      setOurServicesHeroForm({
        sliderTitle: heroSource.sliderTitle || '',
        sliderDescription: heroSource.sliderDescription || '',
        sliderImage: heroSource.sliderImage || imagePlaceholder,
      });
    } catch (error) {
      console.error('Failed to load hire developer our services', error);
    }
  };

  useEffect(() => {
    loadHireMasterCategories();
    loadServices();
    loadTechnologies();
    loadBenefitConfigs();
    loadHireMasterSubcategories();
    loadHirePricing();
    loadContactButtons();
    loadProcesses();
    loadWhyVedx();
    loadWhyChoose();
    loadIndustries();
    loadTechSolutions();
    loadExpertise();
    loadOurServices();
  }, [
    loadBenefitConfigs,
    loadWhyChoose,
    loadWhyVedx,
  ]);

  useEffect(() => {
    loadWhyChoose({
      category: whyServiceCategoryFilter || undefined,
      subcategory: whyServiceSubcategoryFilter || undefined,
    });
  }, [loadWhyChoose, whyServiceCategoryFilter, whyServiceSubcategoryFilter]);

  useEffect(() => {
    loadWhyVedx({
      category: whyVedxCategoryFilter || undefined,
      subcategory: whyVedxSubcategoryFilter || undefined,
    });
  }, [loadWhyVedx, whyVedxCategoryFilter, whyVedxSubcategoryFilter]);

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

  useEffect(() => {
    const matchesFilters = (item) => {
      const matchesCategory = whyServiceCategoryFilter ? item.category === whyServiceCategoryFilter : true;
      const matchesSubcategory = whyServiceSubcategoryFilter ? item.subcategory === whyServiceSubcategoryFilter : true;
      return matchesCategory && matchesSubcategory;
    };

    if (whyChooseList.length === 0) {
      setSelectedWhyChooseId('');
      setWhyChoose(initialWhyChooseState);
      setWhyHeroForm(initialWhyChooseState);
      setWhyServicePage(1);
      whyChooseConfigClearedRef.current = false;
      return;
    }

    if (whyChooseConfigClearedRef.current && !selectedWhyChooseId) return;

    const active = whyChooseList.find((item) => String(item.id) === String(selectedWhyChooseId));
    const preferred = whyChooseList.find(matchesFilters) || whyChooseList[0];
    const next = active ? (matchesFilters(active) ? active : preferred) : preferred;

    if (!next) {
      setSelectedWhyChooseId('');
      setWhyChoose(initialWhyChooseState);
      setWhyHeroForm(initialWhyChooseState);
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
    loadWhyServices(String(next.id), {
      category: whyServiceCategoryFilter || undefined,
      subcategory: whyServiceSubcategoryFilter || undefined,
    });
  }, [loadWhyServices, selectedWhyChooseId, whyChooseList, whyServiceCategoryFilter, whyServiceSubcategoryFilter]);

  useEffect(() => {
    const matchesFilters = (item) => {
      const matchesCategory = whyVedxCategoryFilter ? item.category === whyVedxCategoryFilter : true;
      const matchesSubcategory = whyVedxSubcategoryFilter ? item.subcategory === whyVedxSubcategoryFilter : true;
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

    if (whyVedxConfigClearedRef.current && !selectedWhyVedxId && !(whyVedxCategoryFilter || whyVedxSubcategoryFilter)) {
      return;
    }

    const active = whyVedxList.find((item) => String(item.id) === String(selectedWhyVedxId));
    const preferred = whyVedxList.find(matchesFilters) || whyVedxList[0];
    const next = active ? (matchesFilters(active) ? active : preferred) : preferred;

    if (!next) {
      setSelectedWhyVedxId('');
      setWhyVedxHeroForm(emptyWhyVedxHero);
      setWhyVedxReasons([]);
      setWhyVedxPage(1);
      whyVedxConfigClearedRef.current = false;
      return;
    }

    if (String(next.id) !== String(selectedWhyVedxId)) {
      setSelectedWhyVedxId(String(next.id));
    }

    setWhyVedx(next);
    setWhyVedxHeroForm(next);
    setWhyVedxPage(1);
    loadWhyVedxReasons(String(next.id), {
      category: whyVedxCategoryFilter || undefined,
      subcategory: whyVedxSubcategoryFilter || undefined,
    });
  }, [loadWhyVedxReasons, selectedWhyVedxId, whyVedxList, whyVedxCategoryFilter, whyVedxSubcategoryFilter]);

  useEffect(() => {
    const matchesFilters = (config) => {
      const matchesCategory = benefitCategoryFilter ? config.categoryName === benefitCategoryFilter || config.categoryId === benefitCategoryFilter : true;
      const matchesSubcategory =
        benefitSubcategoryFilter ? config.subcategoryName === benefitSubcategoryFilter || config.subcategoryId === benefitSubcategoryFilter : true;
      return matchesCategory && matchesSubcategory;
    };

    if (benefitConfigs.length === 0) {
      setSelectedBenefitConfigId('');
      setBenefitHero(initialBenefitHero);
      setBenefitPage(1);
      benefitConfigClearedRef.current = false;
      return;
    }

    if (benefitConfigClearedRef.current && !selectedBenefitConfigId) return;

    const active = benefitConfigs.find((config) => String(config.id) === String(selectedBenefitConfigId));
    const preferred = benefitCategoryFilter || benefitSubcategoryFilter ? benefitConfigs.find(matchesFilters) : null;
    const fallback = !benefitConfigClearedRef.current ? benefitConfigs[0] : null;
    const nextConfig = active && matchesFilters(active) ? active : preferred || fallback;

    if (!nextConfig) {
      setSelectedBenefitConfigId('');
      setBenefitHero(initialBenefitHero);
      setBenefitPage(1);
      benefitConfigClearedRef.current = false;
      return;
    }

    if (String(nextConfig.id) !== String(selectedBenefitConfigId)) {
      setSelectedBenefitConfigId(String(nextConfig.id));
    }

    setBenefitHero(nextConfig);
    setBenefitPage(1);
    benefitConfigClearedRef.current = false;
  }, [benefitConfigs, benefitCategoryFilter, benefitSubcategoryFilter, selectedBenefitConfigId]);

  const resetServiceForm = () =>
    setServiceForm({ ...emptyServiceForm, createdAt: new Date().toISOString().split('T')[0] });
  const resetTechnologyForm = () => {
    setTechnologyForm(emptyTechnologyForm);
    setTechnologyItemsInput('');
  };
  const resetHirePricingForm = () => setHirePricingForm(emptyHirePricingForm);
  const resetProcessForm = () => setProcessForm(emptyProcessForm);
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

  const handleBenefitConfigSelect = (config) => {
    benefitConfigClearedRef.current = false;
    const nextId = config?.id ? String(config.id) : '';
    setSelectedBenefitConfigId(nextId);
    setBenefitHero(config ? normalizeBenefitConfig(config) : initialBenefitHero);
    setBenefitHeroSaved(false);
    setBenefitPage(1);
  };

  const handleNewBenefitConfig = () => {
    benefitConfigClearedRef.current = true;
    setSelectedBenefitConfigId('');
    setBenefitHero(initialBenefitHero);
    setBenefitHeroSaved(false);
    setBenefitPage(1);
  };

  const handleBenefitHeroChange = (field, value) => {
    setBenefitHeroSaved(false);
    setBenefitHero((prev) => ({ ...prev, [field]: value }));
  };

  const handleBenefitHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/hire-developer/benefit-configs'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          id: selectedBenefitConfigId || undefined,
          title: benefitHero.title,
          description: benefitHero.description,
          category: benefitHero.categoryId || null,
          subcategory: benefitHero.subcategoryId || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to save benefit config');
      const normalized = normalizeBenefitConfig(data);
      setBenefitHero(normalized);
      setBenefitConfigs((prev) => {
        const exists = prev.some((item) => String(item.id) === String(normalized.id));
        return exists ? prev.map((item) => (String(item.id) === String(normalized.id) ? normalized : item)) : [normalized, ...prev];
      });
      setSelectedBenefitConfigId(String(normalized.id));
      benefitConfigClearedRef.current = false;
      setBenefitHeroSaved(true);
      setTimeout(() => setBenefitHeroSaved(false), 2500);
    } catch (error) {
      console.error('Failed to save benefit hero content', error);
    }
  };

  const handleHirePricingHeroChange = (field, value) => {
    setHirePricingHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHirePricingFormChange = (field, value) => {
    setHirePricingForm((prev) => ({ ...prev, [field]: value }));
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

  const handleHirePricingHeroSave = async () => {
    if (!hirePricing.plans.length) return;

    const primaryPlan = hirePricing.plans[0];

    try {
      const updated = await fetchJson(`/api/hire-developer/pricing/${primaryPlan.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...primaryPlan,
          heroTitle: hirePricingHeroForm.heroTitle,
          heroDescription: hirePricingHeroForm.heroDescription,
          heroImage: hirePricingHeroForm.heroImage,
        }),
      });

      const normalized = normalizePricingPlan(updated);

      setHirePricing((prev) => ({
        ...prev,
        heroTitle: normalized.heroTitle,
        heroDescription: normalized.heroDescription,
        heroImage: normalized.heroImage,
        plans: prev.plans.map((plan) => (plan.id === normalized.id ? normalized : plan)),
      }));

      setHirePricingHeroSaved(true);
      setTimeout(() => setHirePricingHeroSaved(false), 2500);
    } catch (error) {
      console.error('Failed to save hire pricing hero content', error);
    }
  };

  const addHirePricingService = () => {
    const trimmedService = newHirePricingService.trim();
    if (!trimmedService) return;

    setHirePricingForm((prev) => ({
      ...prev,
      services: [...(prev.services || []), trimmedService],
    }));
    setNewHirePricingService('');
  };

  const openHirePricingServiceEditDialog = (service) => {
    setHirePricingServiceToEdit(service);
    setHirePricingServiceEditValue(service);
  };

  const closeHirePricingServiceEditDialog = () => {
    setHirePricingServiceToEdit(null);
    setHirePricingServiceEditValue('');
  };

  const handleConfirmEditHirePricingService = () => {
    const trimmedService = hirePricingServiceEditValue.trim();
    if (!hirePricingServiceToEdit || !trimmedService) return;

    setHirePricingForm((prev) => ({
      ...prev,
      services: (prev.services || []).map((service) =>
        service === hirePricingServiceToEdit ? trimmedService : service
      ),
    }));

    closeHirePricingServiceEditDialog();
  };

  const openHirePricingServiceDeleteDialog = (service) => {
    setHirePricingServiceToDelete(service);
  };

  const closeHirePricingServiceDeleteDialog = () => {
    setHirePricingServiceToDelete(null);
  };

  const handleConfirmDeleteHirePricingService = () => {
    if (!hirePricingServiceToDelete) return;
    setHirePricingForm((prev) => ({
      ...prev,
      services: (prev.services || []).filter((service) => service !== hirePricingServiceToDelete),
    }));
    closeHirePricingServiceDeleteDialog();
  };


  const handleProcessChange = (field, value) => {
    setProcessForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleWhyVedxHeroChange = (field, value) => {
    setWhyVedxHeroForm((prev) => ({ ...prev, [field]: value }));
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

  const handleWhyHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const updated = await fetchJson('/api/hire-developer/why-choose', {
        method: 'POST',
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

      const normalized = normalizeWhyChoose(updated);
      setWhyChoose(normalized);
      setWhyHeroForm(normalized);
      setSelectedWhyChooseId(String(normalized.id));
      setWhyChooseList((prev) => {
        const exists = prev.some((item) => String(item.id) === String(normalized.id));
        return exists ? prev.map((item) => (String(item.id) === String(normalized.id) ? normalized : item)) : [normalized, ...prev];
      });
      whyChooseConfigClearedRef.current = false;
    } catch (error) {
      console.error('Failed to save why choose hero content', error);
    }
  };

  const categoryOptions = useMemo(() => {
    if (hireMasterCategories.length) {
      return hireMasterCategories.map((category) => ({
        value: category.title,
        label: category.title,
      }));
    }

    return Array.from(new Set(services.map((service) => service.category))).map((category) => ({
      value: category,
      label: category,
    }));
  }, [hireMasterCategories, services]);

  const subcategoryLookup = useMemo(() => {
    if (hireMasterCategories.length) {
      return new Map(
        hireMasterCategories.map((category) => [
          category.title,
          Array.from(new Set(category.subcategories)),
        ])
      );
    }

    if (hireMasterSubcategories.length) {
      const lookup = new Map();
      hireMasterSubcategories.forEach((subcategory) => {
        const category = subcategory.category || '';
        const existing = lookup.get(category) || [];
        if (subcategory.title) {
          lookup.set(category, Array.from(new Set([...existing, subcategory.title])));
        }
      });
      return lookup;
    }

    const lookup = new Map();
    services.forEach((service) => {
      lookup.set(
        service.category,
        Array.from(
          new Set(
            (service.subcategories || []).map(
              (subcategory) => subcategory?.name || subcategory || ''
            )
          )
        ).filter(Boolean)
      );
    });
    return lookup;
  }, [hireMasterCategories, hireMasterSubcategories, services]);

  const allSubcategoryOptions = useMemo(() => {
    if (hireMasterCategories.length) {
      return Array.from(
        new Set(hireMasterCategories.flatMap((category) => category.subcategories).filter(Boolean))
      );
    }

    if (hireMasterSubcategories.length) {
      return Array.from(
        new Set(
          hireMasterSubcategories
            .map((subcategory) => subcategory.title || '')
            .filter(Boolean)
        )
      );
    }

    return Array.from(
      new Set(
        services.flatMap((service) =>
          (service.subcategories || []).map(
            (subcategory) => subcategory?.name || subcategory || ''
          )
        )
      )
    ).filter(Boolean);
  }, [hireMasterCategories, hireMasterSubcategories, services]);

  const technologySubcategoryOptions = useMemo(() => {
    if (!technologyForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(technologyForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, subcategoryLookup, technologyForm.category]);

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const matchesCategory = serviceCategoryFilter
          ? service.category === serviceCategoryFilter
          : true;
        const matchesSubcategory = serviceSubcategoryFilter
          ? service.subcategories.some(
            (subcategory) =>
              (subcategory?.name || subcategory || '') === serviceSubcategoryFilter
          )
          : true;

        return (
          matchesDateFilter(service.createdAt, serviceDateFilter, serviceDateRange) &&
          matchesCategory &&
          matchesSubcategory
        );
      }),
    [serviceCategoryFilter, serviceDateFilter, serviceDateRange, serviceSubcategoryFilter, services]
  );

  const pagedServices = useMemo(() => {
    const start = (servicePage - 1) * rowsPerPage;
    return filteredServices.slice(start, start + rowsPerPage);
  }, [filteredServices, rowsPerPage, servicePage]);


  const groupedPagedServices = useMemo(() => {
    const groups = new Map();
    pagedServices.forEach((service) => {
      const key = (service.category || '').trim() || 'Uncategorized';
      const existing = groups.get(key) || [];
      groups.set(key, [...existing, service]);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({ category, items }));
  }, [pagedServices]);

  useEffect(() => {
    setServicePage(1);
  }, [serviceCategoryFilter, serviceDateFilter, serviceDateRange.end, serviceDateRange.start, serviceSubcategoryFilter]);

  useEffect(() => {
    if (!serviceCategoryFilter) {
      setServiceSubcategoryFilter('');
      return;
    }

    const allowed = subcategoryLookup.get(serviceCategoryFilter) || [];
    if (serviceSubcategoryFilter && !allowed.includes(serviceSubcategoryFilter)) {
      setServiceSubcategoryFilter('');
    }
  }, [serviceCategoryFilter, serviceSubcategoryFilter, subcategoryLookup]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredServices.length / rowsPerPage));
    setServicePage((prev) => Math.min(prev, maxPage));
  }, [filteredServices.length, rowsPerPage]);

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

  const visibleBenefits = useMemo(() => {
    if (!selectedBenefitConfigId) return [];
    return benefits.filter((benefit) => String(benefit.benefitConfigId) === String(selectedBenefitConfigId));
  }, [benefits, selectedBenefitConfigId]);

  const pagedBenefits = useMemo(() => {
    const start = (benefitPage - 1) * rowsPerPage;
    return visibleBenefits.slice(start, start + rowsPerPage);
  }, [visibleBenefits, rowsPerPage, benefitPage]);

  const groupedBenefits = useMemo(() => {
    const sorted = [...pagedBenefits].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    const groups = new Map();

    sorted.forEach((benefit) => {
      const key = (benefit.category || '').trim() || 'Uncategorized';
      const existing = groups.get(key) || [];
      groups.set(key, [...existing, benefit]);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({ category, items }));
  }, [pagedBenefits]);

  const pagedWhyServices = useMemo(() => {
    const start = (whyServicePage - 1) * rowsPerPage;
    return whyChoose.services.slice(start, start + rowsPerPage);
  }, [whyChoose.services, rowsPerPage, whyServicePage]);

  const pagedHirePricingPlans = useMemo(() => {
    const start = (hirePricingPage - 1) * rowsPerPage;
    return hirePricing.plans.slice(start, start + rowsPerPage);
  }, [hirePricing.plans, rowsPerPage, hirePricingPage]);

  const filteredContactButtons = useMemo(() => {
    return (contactButtons || []).filter((button) => {
      const matchesCategory = contactCategoryFilter ? button.category === contactCategoryFilter : true;
      const matchesSubcategory = contactSubcategoryFilter ? button.subcategory === contactSubcategoryFilter : true;
      return matchesCategory && matchesSubcategory;
    });
  }, [contactButtons, contactCategoryFilter, contactSubcategoryFilter]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredContactButtons.length / rowsPerPage));
    setContactButtonPage((prev) => Math.min(prev, maxPage));
  }, [filteredContactButtons.length, rowsPerPage]);

  useEffect(() => {
    setContactButtonPage(1);
  }, [contactCategoryFilter, contactSubcategoryFilter]);

  const pagedContactButtons = useMemo(() => {
    const start = (contactButtonPage - 1) * rowsPerPage;
    return filteredContactButtons.slice(start, start + rowsPerPage);
  }, [contactButtonPage, filteredContactButtons, rowsPerPage]);

  const groupedContactButtons = useMemo(() => {
    const lookup = new Map();
    pagedContactButtons.forEach((button) => {
      const key = button.category || 'Uncategorised';
      const existing = lookup.get(key) || [];
      lookup.set(key, [...existing, button]);
    });

    return Array.from(lookup.entries()).map(([category, items]) => ({ category, items }));
  }, [pagedContactButtons]);

  useEffect(() => {
    const maxBenefitPage = Math.max(1, Math.ceil(visibleBenefits.length / rowsPerPage));
    setBenefitPage((prev) => Math.min(prev, maxBenefitPage));
  }, [visibleBenefits.length, rowsPerPage]);

  useEffect(() => {
    const maxWhyPage = Math.max(1, Math.ceil(whyChoose.services.length / rowsPerPage));
    setWhyServicePage((prev) => Math.min(prev, maxWhyPage));
  }, [whyChoose.services.length, rowsPerPage]);

  useEffect(() => {
    const maxHirePricingPage = Math.max(1, Math.ceil(hirePricing.plans.length / rowsPerPage));
    setHirePricingPage((prev) => Math.min(prev, maxHirePricingPage));
  }, [hirePricing.plans.length, rowsPerPage]);



  useEffect(() => {
    setOurServicesHeroForm((prev) => ({
      ...prev,
      sliderTitle: ourServices.sliderTitle,
      sliderDescription: ourServices.sliderDescription,
      sliderImage: ourServices.sliderImage,
    }));
  }, [ourServices.sliderDescription, ourServices.sliderImage, ourServices.sliderTitle]);

  const openHirePricingCreateDialog = () => {
    setHirePricingDialogMode('create');
    setActiveHirePricingPlan(null);
    resetHirePricingForm();
    setNewHirePricingService('');
    setHirePricingServiceToEdit(null);
    setHirePricingServiceEditValue('');
    setHirePricingDialogOpen(true);
  };

  const openHirePricingEditDialog = (plan) => {
    setHirePricingDialogMode('edit');
    setActiveHirePricingPlan(plan);
    setHirePricingForm({ ...plan });
    setNewHirePricingService('');
    setHirePricingServiceToEdit(null);
    setHirePricingServiceEditValue('');
    setHirePricingDialogOpen(true);
  };

  const closeHirePricingDialog = () => {
    setHirePricingDialogOpen(false);
    setActiveHirePricingPlan(null);
    setHirePricingServiceToEdit(null);
    setHirePricingServiceEditValue('');
  };

  const handleHirePricingSubmit = async (event) => {
    event?.preventDefault();
    if (!hirePricingForm.title.trim() || !hirePricingForm.price.trim()) return;

    try {
      if (hirePricingDialogMode === 'edit' && activeHirePricingPlan) {
        const updated = await fetchJson(`/api/hire-developer/pricing/${activeHirePricingPlan.id}`, {
          method: 'PUT',
          body: JSON.stringify(hirePricingForm),
        });
        const normalized = normalizePricingPlan(updated);
        setHirePricing((prev) => ({
          ...prev,
          plans: prev.plans.map((plan) => (plan.id === activeHirePricingPlan.id ? normalized : plan)),
        }));
      } else {
        const created = await fetchJson('/api/hire-developer/pricing', {
          method: 'POST',
          body: JSON.stringify(hirePricingForm),
        });
        const normalized = normalizePricingPlan(created);
        setHirePricing((prev) => ({ ...prev, plans: [normalized, ...prev.plans] }));
      }

      closeHirePricingDialog();
    } catch (error) {
      console.error('Failed to save hire pricing plan', error);
    }
  };

  const openHirePricingDeleteDialog = (plan) => setHirePricingToDelete(plan);
  const closeHirePricingDeleteDialog = () => setHirePricingToDelete(null);
  const handleConfirmDeleteHirePricing = async () => {
    if (!hirePricingToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/pricing/${hirePricingToDelete.id}`, { method: 'DELETE' });
      setHirePricing((prev) => ({
        ...prev,
        plans: prev.plans.filter((plan) => plan.id !== hirePricingToDelete.id),
      }));
      closeHirePricingDeleteDialog();
    } catch (error) {
      console.error('Failed to delete hire pricing plan', error);
    }
  };

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

    try {
      if (serviceDialogMode === 'edit' && activeService) {
        const updated = await fetchJson(`/api/hire-developer/services/${activeService.id}`, {
          method: 'PUT',
          body: JSON.stringify(serviceForm),
        });
        const normalized = normalizeService(updated);
        setServices((prev) => prev.map((service) => (service.id === activeService.id ? normalized : service)));
      } else {
        const created = await fetchJson('/api/hire-developer/services', {
          method: 'POST',
          body: JSON.stringify(serviceForm),
        });
        const normalized = normalizeService(created);
        setServices((prev) => [normalized, ...prev]);
      }

      closeServiceDialog();
    } catch (error) {
      console.error('Failed to save hire developer service', error);
    }
  };

  const openServiceDeleteDialog = (service) => setServiceToDelete(service);
  const closeServiceDeleteDialog = () => setServiceToDelete(null);
  const handleConfirmDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/services/${serviceToDelete.id}`, { method: 'DELETE' });
      setServices((prev) => prev.filter((service) => service.id !== serviceToDelete.id));
      closeServiceDeleteDialog();
    } catch (error) {
      console.error('Failed to delete hire developer service', error);
    }
  };

  const openTechnologyCreateDialog = () => {
    setTechnologyDialogMode('create');
    setActiveTechnology(null);
    resetTechnologyForm();
    setTechnologyItemsInput('');
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
    if (!technologyForm.title.trim() || !technologyForm.image) return;

    try {
      if (technologyDialogMode === 'edit' && activeTechnology) {
        const updated = await fetchJson(`/api/hire-developer/technologies/${activeTechnology.id}`, {
          method: 'PUT',
          body: JSON.stringify(technologyForm),
        });
        const normalized = normalizeTechnology(updated);
        setTechnologies((prev) => prev.map((tech) => (tech.id === activeTechnology.id ? normalized : tech)));
      } else {
        const created = await fetchJson('/api/hire-developer/technologies', {
          method: 'POST',
          body: JSON.stringify(technologyForm),
        });
        const normalized = normalizeTechnology(created);
        setTechnologies((prev) => [normalized, ...prev]);
      }

      closeTechnologyDialog();
    } catch (error) {
      console.error('Failed to save hire developer technology', error);
    }
  };

  const openTechnologyDeleteDialog = (technology) => setTechnologyToDelete(technology);
  const closeTechnologyDeleteDialog = () => setTechnologyToDelete(null);
  const handleConfirmDeleteTechnology = async () => {
    if (!technologyToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/technologies/${technologyToDelete.id}`, { method: 'DELETE' });
      setTechnologies((prev) => prev.filter((tech) => tech.id !== technologyToDelete.id));
      closeTechnologyDeleteDialog();
    } catch (error) {
      console.error('Failed to delete hire developer technology', error);
    }
  };

  const openBenefitCreateDialog = () => {
    if (!selectedBenefitConfigId) return;
    setBenefitDialogMode('create');
    setActiveBenefit(null);
    setBenefitForm({
      ...emptyBenefitForm,
      category: benefitHero.categoryId || '',
      subcategory: benefitHero.subcategoryId || '',
      benefitConfigId: selectedBenefitConfigId,
    });
    setBenefitDialogOpen(true);
  };

  const openBenefitEditDialog = (benefit) => {
    setBenefitDialogMode('edit');
    setActiveBenefit(benefit);
    setBenefitForm({ ...benefit, benefitConfigId: benefit.benefitConfigId || selectedBenefitConfigId });
    setBenefitDialogOpen(true);
  };

  const closeBenefitDialog = () => {
    setBenefitDialogOpen(false);
    setActiveBenefit(null);
  };

  const handleBenefitSubmit = async (event) => {
    event?.preventDefault();
    if (!benefitForm.title.trim()) return;

    try {
      const benefitConfigId = benefitForm.benefitConfigId || selectedBenefitConfigId;
      if (!benefitConfigId) return;
      if (benefitDialogMode === 'edit' && activeBenefit) {
        const updated = await fetchJson(`/api/hire-developer/benefits/${activeBenefit.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...benefitForm, benefitConfigId }),
        });
        const normalized = normalizeBenefit(updated);
        setBenefits((prev) => prev.map((benefit) => (benefit.id === activeBenefit.id ? normalized : benefit)));
      } else {
        const created = await fetchJson('/api/hire-developer/benefits', {
          method: 'POST',
          body: JSON.stringify({ ...benefitForm, benefitConfigId }),
        });
        const normalized = normalizeBenefit(created);
        setBenefits((prev) => [normalized, ...prev]);
      }

      closeBenefitDialog();
    } catch (error) {
      console.error('Failed to save hire developer benefit', error);
    }
  };

  const openBenefitDeleteDialog = (benefit) => setBenefitToDelete(benefit);
  const closeBenefitDeleteDialog = () => setBenefitToDelete(null);
  const handleConfirmDeleteBenefit = async () => {
    if (!benefitToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/benefits/${benefitToDelete.id}`, { method: 'DELETE' });
      setBenefits((prev) => prev.filter((benefit) => benefit.id !== benefitToDelete.id));
      closeBenefitDeleteDialog();
    } catch (error) {
      console.error('Failed to delete hire developer benefit', error);
    }
  };

  const openWhyServiceCreateDialog = () => {
    setWhyServiceDialogMode('create');
    setActiveWhyService(null);
    const defaultCategory = whyServiceCategoryFilter || whyHeroForm.category || '';
    const defaultSubcategory =
      whyServiceSubcategoryFilter || (defaultCategory === whyHeroForm.category ? whyHeroForm.subcategory : '');
    setWhyServiceForm({
      ...emptyWhyServiceForm,
      category: defaultCategory,
      subcategory: defaultSubcategory,
      whyChooseConfigId: selectedWhyChooseId || '',
    });
    setWhyServiceDialogOpen(true);
  };

  const openWhyServiceEditDialog = (service) => {
    setWhyServiceDialogMode('edit');
    setActiveWhyService(service);
    setWhyServiceForm({ ...service, whyChooseConfigId: service.whyChooseConfigId || selectedWhyChooseId });
    setWhyServiceDialogOpen(true);
  };

  const closeWhyServiceDialog = () => {
    setWhyServiceDialogOpen(false);
    setActiveWhyService(null);
  };

  const handleWhyServiceSubmit = async (event) => {
    event?.preventDefault();
    if (!whyServiceForm.title.trim() || !whyServiceForm.category.trim()) return;
    if (!selectedWhyChooseId) return;

    try {
      const payload = {
        category: whyServiceForm.category,
        subcategory: whyServiceForm.subcategory,
        title: whyServiceForm.title,
        description: whyServiceForm.description,
        whyChooseConfigId: selectedWhyChooseId,
      };

      if (whyServiceDialogMode === 'edit' && activeWhyService) {
        const updated = await fetchJson(`/api/hire-developer/why-choose-services/${activeWhyService.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        const normalized = normalizeWhyService(updated);
        setWhyChoose((prev) => ({
          ...prev,
          services: prev.services.map((service) =>
            service.id === activeWhyService.id ? normalized : service
          ),
        }));
        setWhyChooseList((prev) =>
          prev.map((item) =>
            String(item.id) === String(selectedWhyChooseId)
              ? {
                ...item,
                services: (item.services || []).map((service) =>
                  service.id === normalized.id ? normalized : service
                ),
              }
              : item
          )
        );
      } else {
        const created = await fetchJson('/api/hire-developer/why-choose-services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const normalized = normalizeWhyService(created);
        setWhyChoose((prev) => ({ ...prev, services: [normalized, ...prev.services] }));
        setWhyChooseList((prev) =>
          prev.map((item) =>
            String(item.id) === String(selectedWhyChooseId)
              ? { ...item, services: [normalized, ...(item.services || [])] }
              : item
          )
        );
      }

      closeWhyServiceDialog();
    } catch (error) {
      console.error('Failed to save why choose item', error);
    }
  };

  const openWhyServiceDeleteDialog = (service) => setWhyServiceToDelete(service);
  const closeWhyServiceDeleteDialog = () => setWhyServiceToDelete(null);
  const handleConfirmDeleteWhyService = async () => {
    if (!whyServiceToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/why-choose-services/${whyServiceToDelete.id}`, { method: 'DELETE' });
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
    } catch (error) {
      console.error('Failed to delete why choose item', error);
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
    if (!contactButtonForm.title?.trim() || !contactButtonForm.image) return;

    const payload = {
      title: contactButtonForm.title,
      description: contactButtonForm.description,
      image: contactButtonForm.image,
      category: contactButtonForm.category,
      subcategory: contactButtonForm.subcategory,
    };

    try {
      if (contactButtonDialogMode === 'edit' && activeContactButton) {
        const updated = await fetchJson(`/api/hire-developer/contact-buttons/${activeContactButton.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        const normalized = normalizeContactButton(updated);
        setContactButtons((prev) => prev.map((button) => (button.id === normalized.id ? normalized : button)));
      } else {
        const created = await fetchJson('/api/hire-developer/contact-buttons', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const normalized = normalizeContactButton(created);
        setContactButtons((prev) => [normalized, ...prev]);
      }

      closeContactButtonDialog();
    } catch (error) {
      console.error('Failed to save hire contact button', error);
    }
  };

  const handleConfirmDeleteContactButton = async () => {
    if (!contactButtonToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/contact-buttons/${contactButtonToDelete.id}`, { method: 'DELETE' });
      setContactButtons((prev) => prev.filter((button) => button.id !== contactButtonToDelete.id));
      setContactButtonToDelete(null);
    } catch (error) {
      console.error('Failed to delete hire contact button', error);
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
      category: processForm.category || null,
      subcategory: processForm.subcategory || null,
      image: processForm.image,
    };

    try {
      if (processDialogMode === 'edit' && activeProcess) {
        const updated = await fetchJson(`/api/hire-developer/processes/${activeProcess.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        const normalized = normalizeProcess(updated);
        setProcessList((prev) => prev.map((item) => (item.id === activeProcess.id ? normalized : item)));
      } else {
        const created = await fetchJson('/api/hire-developer/processes', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const normalized = normalizeProcess(created);
        setProcessList((prev) => [normalized, ...prev]);
      }

      closeProcessDialog();
    } catch (error) {
      console.error('Failed to save hire developer process', error);
    }
  };

  const openProcessDeleteDialog = (item) => setProcessToDelete(item);
  const closeProcessDeleteDialog = () => setProcessToDelete(null);
  const handleConfirmDeleteProcess = async () => {
    if (!processToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/processes/${processToDelete.id}`, { method: 'DELETE' });
      setProcessList((prev) => prev.filter((item) => item.id !== processToDelete.id));
      closeProcessDeleteDialog();
    } catch (error) {
      console.error('Failed to delete hire developer process', error);
    }
  };

  const handleWhyVedxHeroSave = async (event) => {
    event?.preventDefault();
    try {
      const updated = await fetchJson('/api/hire-developer/why-vedx', {
        method: 'POST',
        body: JSON.stringify({
          id: selectedWhyVedxId || undefined,
          category: whyVedxHeroForm.categoryId,
          subcategory: whyVedxHeroForm.subcategoryId,
          heroTitle: whyVedxHeroForm.heroTitle,
          heroDescription: whyVedxHeroForm.heroDescription,
        }),
      });

      const normalized = normalizeWhyVedx(updated);
      setWhyVedx(normalized);
      setWhyVedxHeroForm(normalized);
      setSelectedWhyVedxId(String(normalized.id));
      setWhyVedxList((prev) => {
        const exists = prev.some((item) => String(item.id) === String(normalized.id));
        return exists ? prev.map((item) => (String(item.id) === String(normalized.id) ? normalized : item)) : [normalized, ...prev];
      });
      whyVedxConfigClearedRef.current = false;
    } catch (error) {
      console.error('Failed to save why VedX hero content', error);
    }
  };

  const handleOurServicesHeroSave = async (event) => {
    event?.preventDefault();
    if (!ourServices.services.length) return;

    const primary = ourServices.services[0];

    try {
      const updated = await fetchJson(`/api/hire-developer/our-services/${primary.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...primary,
          sliderTitle: ourServicesHeroForm.sliderTitle,
          sliderDescription: ourServicesHeroForm.sliderDescription,
          sliderImage: ourServicesHeroForm.sliderImage,
        }),
      });

      const normalized = normalizeTechSolution(updated);

      setOurServices((prev) => ({
        sliderTitle: normalized.sliderTitle,
        sliderDescription: normalized.sliderDescription,
        sliderImage: normalized.sliderImage,
        services: prev.services.map((item) => (item.id === normalized.id ? normalized : item)),
      }));
    } catch (error) {
      console.error('Failed to save our services hero content', error);
    }
  };

  const openWhyVedxCreateDialog = () => {
    if (!selectedWhyVedxId) return;
    setWhyVedxForm({
      ...emptyWhyVedxForm,
      category: whyVedxHeroForm.categoryId || '',
      subcategory: whyVedxHeroForm.subcategoryId || '',
      whyVedxConfigId: selectedWhyVedxId,
    });
    setWhyVedxDialogMode('create');
    setActiveWhyVedx(null);
    setWhyVedxDialogOpen(true);
  };

  const openWhyVedxEditDialog = (item) => {
    setWhyVedxDialogMode('edit');
    setActiveWhyVedx(item);
    setWhyVedxForm({ ...item, whyVedxConfigId: item.whyVedxConfigId || selectedWhyVedxId });
    setWhyVedxDialogOpen(true);
  };

  const closeWhyVedxDialog = () => {
    setWhyVedxDialogOpen(false);
    setActiveWhyVedx(null);
  };

  const handleWhyVedxSubmit = async (event) => {
    event?.preventDefault();
    if (!whyVedxForm.title.trim() || !whyVedxForm.image) return;
    if (!selectedWhyVedxId) return;

    try {
      const payload = {
        ...whyVedxForm,
        whyVedxConfigId: selectedWhyVedxId,
      };

      if (whyVedxDialogMode === 'edit' && activeWhyVedx) {
        const updated = await fetchJson(`/api/hire-developer/why-vedx-reasons/${activeWhyVedx.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        const normalized = normalizeWhyVedxReason(updated);
        setWhyVedxReasons((prev) => prev.map((item) => (item.id === activeWhyVedx.id ? normalized : item)));
      } else {
        const created = await fetchJson('/api/hire-developer/why-vedx-reasons', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const normalized = normalizeWhyVedxReason(created);
        setWhyVedxReasons((prev) => [normalized, ...prev]);
      }

      closeWhyVedxDialog();
    } catch (error) {
      console.error('Failed to save why VedX item', error);
    }
  };

  const openWhyVedxDeleteDialog = (item) => setWhyVedxToDelete(item);
  const closeWhyVedxDeleteDialog = () => setWhyVedxToDelete(null);
  const handleConfirmDeleteWhyVedx = async () => {
    if (!whyVedxToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/why-vedx-reasons/${whyVedxToDelete.id}`, { method: 'DELETE' });
      setWhyVedxReasons((prev) => prev.filter((item) => item.id !== whyVedxToDelete.id));
      closeWhyVedxDeleteDialog();
    } catch (error) {
      console.error('Failed to delete why VedX item', error);
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

  const handleOurServiceSubmit = async (event) => {
    event?.preventDefault();
    if (!ourServiceForm.title.trim() || !ourServiceForm.image) return;

    try {
      if (ourServiceDialogMode === 'edit' && activeOurService) {
        const updated = await fetchJson(`/api/hire-developer/our-services/${activeOurService.id}`, {
          method: 'PUT',
          body: JSON.stringify(ourServiceForm),
        });
        const normalized = normalizeTechSolution(updated);
        setOurServices((prev) => ({
          ...prev,
          services: prev.services.map((item) => (item.id === activeOurService.id ? normalized : item)),
        }));
      } else {
        const created = await fetchJson('/api/hire-developer/our-services', {
          method: 'POST',
          body: JSON.stringify(ourServiceForm),
        });
        const normalized = normalizeTechSolution(created);
        setOurServices((prev) => ({ ...prev, services: [normalized, ...prev.services] }));
      }

      closeOurServiceDialog();
    } catch (error) {
      console.error('Failed to save our service item', error);
    }
  };

  const openOurServiceDeleteDialog = (item) => setOurServiceToDelete(item);
  const closeOurServiceDeleteDialog = () => setOurServiceToDelete(null);
  const handleConfirmDeleteOurService = async () => {
    if (!ourServiceToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/our-services/${ourServiceToDelete.id}`, { method: 'DELETE' });
      setOurServices((prev) => ({
        ...prev,
        services: prev.services.filter((item) => item.id !== ourServiceToDelete.id),
      }));
      closeOurServiceDeleteDialog();
    } catch (error) {
      console.error('Failed to delete our service item', error);
    }
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

  const handleIndustrySubmit = async (event) => {
    event?.preventDefault();
    if (!industryForm.title.trim() || !industryForm.image) return;

    try {
      if (industryDialogMode === 'edit' && activeIndustry) {
        const updated = await fetchJson(`/api/hire-developer/industries/${activeIndustry.id}`, {
          method: 'PUT',
          body: JSON.stringify(industryForm),
        });
        const normalized = normalizeIndustry(updated);
        setIndustries((prev) => ({
          ...prev,
          items: prev.items.map((item) => (item.id === activeIndustry.id ? normalized : item)),
        }));
      } else {
        const created = await fetchJson('/api/hire-developer/industries', {
          method: 'POST',
          body: JSON.stringify(industryForm),
        });
        const normalized = normalizeIndustry(created);
        setIndustries((prev) => ({ ...prev, items: [normalized, ...prev.items] }));
      }

      closeIndustryDialog();
    } catch (error) {
      console.error('Failed to save industry item', error);
    }
  };

  const openIndustryDeleteDialog = (item) => setIndustryToDelete(item);
  const closeIndustryDeleteDialog = () => setIndustryToDelete(null);
  const handleConfirmDeleteIndustry = async () => {
    if (!industryToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/industries/${industryToDelete.id}`, { method: 'DELETE' });
      setIndustries((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== industryToDelete.id),
      }));
      closeIndustryDeleteDialog();
    } catch (error) {
      console.error('Failed to delete industry item', error);
    }
  };

  const handleTechSolutionSubmit = async (event) => {
    event?.preventDefault();
    if (!techSolutionForm.title.trim()) return;

    try {
      if (techSolutionDialogMode === 'edit' && activeTechSolution) {
        const updated = await fetchJson(`/api/hire-developer/tech-solutions/${activeTechSolution.id}`, {
          method: 'PUT',
          body: JSON.stringify(techSolutionForm),
        });
        const normalized = normalizeTechSolution(updated);
        setTechSolutions((prev) => ({
          ...prev,
          solutions: prev.solutions.map((item) =>
            item.id === activeTechSolution.id ? normalized : item
          ),
        }));
      } else {
        const created = await fetchJson('/api/hire-developer/tech-solutions', {
          method: 'POST',
          body: JSON.stringify(techSolutionForm),
        });
        const normalized = normalizeTechSolution(created);
        setTechSolutions((prev) => ({ ...prev, solutions: [normalized, ...prev.solutions] }));
      }

      closeTechSolutionDialog();
    } catch (error) {
      console.error('Failed to save tech solution item', error);
    }
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
  const handleConfirmDeleteTechSolution = async () => {
    if (!techSolutionToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/tech-solutions/${techSolutionToDelete.id}`, { method: 'DELETE' });
      setTechSolutions((prev) => ({
        ...prev,
        solutions: prev.solutions.filter((item) => item.id !== techSolutionToDelete.id),
      }));
      closeTechSolutionDeleteDialog();
    } catch (error) {
      console.error('Failed to delete tech solution item', error);
    }
  };

  const handleExpertiseHeroSave = async (event) => {
    event?.preventDefault();
    try {
      if (expertise.items.length) {
        const primary = expertise.items[0];
        const updated = await fetchJson(`/api/hire-developer/expertise/${primary.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...primary,
            sectionTitle: expertiseHeroForm.title,
            sectionDescription: expertiseHeroForm.description,
          }),
        });
        const normalized = normalizeExpertise(updated);
        setExpertise((prev) => ({
          title: normalized.sectionTitle,
          description: normalized.sectionDescription,
          items: prev.items.map((item) => (item.id === normalized.id ? normalized : item)),
        }));
      }
    } catch (error) {
      console.error('Failed to save expertise hero content', error);
    }
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

  const handleExpertiseSubmit = async (event) => {
    event?.preventDefault();
    if (!expertiseForm.title.trim() || !expertiseForm.image) return;

    try {
      if (expertiseDialogMode === 'edit' && activeExpertise) {
        const updated = await fetchJson(`/api/hire-developer/expertise/${activeExpertise.id}`, {
          method: 'PUT',
          body: JSON.stringify(expertiseForm),
        });
        const normalized = normalizeExpertise(updated);
        setExpertise((prev) => ({
          ...prev,
          items: prev.items.map((item) => (item.id === activeExpertise.id ? normalized : item)),
        }));
      } else {
        const created = await fetchJson('/api/hire-developer/expertise', {
          method: 'POST',
          body: JSON.stringify(expertiseForm),
        });
        const normalized = normalizeExpertise(created);
        setExpertise((prev) => ({ ...prev, items: [normalized, ...prev.items] }));
      }

      closeExpertiseDialog();
    } catch (error) {
      console.error('Failed to save expertise item', error);
    }
  };

  const openExpertiseDeleteDialog = (item) => setExpertiseToDelete(item);
  const closeExpertiseDeleteDialog = () => setExpertiseToDelete(null);
  const handleConfirmDeleteExpertise = async () => {
    if (!expertiseToDelete) return;

    try {
      await fetchJson(`/api/hire-developer/expertise/${expertiseToDelete.id}`, { method: 'DELETE' });
      setExpertise((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== expertiseToDelete.id),
      }));
      closeExpertiseDeleteDialog();
    } catch (error) {
      console.error('Failed to delete expertise item', error);
    }
  };

  const serviceFormSubcategoryOptions = useMemo(() => {
    if (!serviceForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(serviceForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, serviceForm.category, subcategoryLookup]);
  const selectedServiceSubcategory = serviceForm.subcategories?.[0]?.name || '';

  const benefitSubcategoryOptions = useMemo(() => {
    if (!benefitForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(benefitForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, benefitForm.category, subcategoryLookup]);

  const benefitHeroCategoryOptions = useMemo(() => categoryOptions, [categoryOptions]);

  const benefitHeroSubcategoryOptions = useMemo(() => {
    const categoryId = benefitHero.categoryId || '';
    const base = categoryId ? subcategoryLookup.get(categoryId) || [] : allSubcategoryOptions;
    return base.map((option) => ({ value: option, label: option, categoryId }));
  }, [benefitHero.categoryId, subcategoryLookup, allSubcategoryOptions]);

  const whySubcategoryOptions = useMemo(() => {
    const options = subcategoryLookup.get(whyServiceForm.category) || [];
    return options.map((option) => ({ name: option }));
  }, [subcategoryLookup, whyServiceForm.category]);

  const whyVedxReasonCategoryOptions = useMemo(
    () => categoryOptions.map((option) => ({ value: option.value, label: option.label })),
    [categoryOptions]
  );

  const whyVedxReasonSubcategoryOptions = useMemo(() => {
    const options = whyVedxForm.category
      ? subcategoryLookup.get(whyVedxForm.category) || []
      : allSubcategoryOptions;
    return options.map((option) => ({ value: option, label: option }));
  }, [allSubcategoryOptions, subcategoryLookup, whyVedxForm.category]);

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
          { value: 'hire-pricing', label: 'Hire pricing' },
        ]}
        sx={{
          background: 'linear-gradient(135deg, #0b1120 0%, #111827 100%)',
        }}
      />

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
              <Autocomplete
                sx={{ minWidth: 220 }}
                freeSolo
                options={categoryOptions.map((option) => option.label)}
                value={serviceCategoryFilter}
                onInputChange={(event, newValue) => setServiceCategoryFilter(newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category filter"
                    placeholder="All categories"

                  />
                )}
              />
              <Autocomplete
                sx={{ minWidth: 220 }}
                freeSolo
                options={
                  serviceCategoryFilter
                    ? subcategoryLookup.get(serviceCategoryFilter) || []
                    : allSubcategoryOptions
                }
                value={serviceSubcategoryFilter}
                onInputChange={(event, newValue) => setServiceSubcategoryFilter(newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub-category filter"
                    placeholder="All sub-categories"

                  />
                )}
                disabled={!serviceCategoryFilter && allSubcategoryOptions.length === 0}
              />
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

            <Stack spacing={2}>
              {groupedPagedServices.map((group) => {
                const subcategoryCount = Array.from(
                  new Set(
                    group.items.flatMap((service) =>
                      (service.subcategories || []).map((item) => item?.name || item || '')
                    )
                  )
                ).filter(Boolean).length;

                return (
                  <Accordion key={group.category} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={800}>
                          {group.category}
                        </Typography>
                        <Chip
                          label={`${group.items.length} ${group.items.length === 1 ? 'entry' : 'entries'}`}
                          size="small"
                        />
                        <Chip
                          label={`${subcategoryCount} ${subcategoryCount === 1 ? 'sub-category' : 'sub-categories'}`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Sub-categories</TableCell>
                              <TableCell>Banner</TableCell>

                              <TableCell>FAQs</TableCell>
                              <TableCell>Totals</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {group.items.map((service) => (
                              <TableRow key={service.id} hover>
                                <TableCell sx={{ maxWidth: 240 }}>
                                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                                    {(service.subcategories || []).map((item) => (
                                      <Chip key={item?.name || item} label={item?.name || item} size="small" />
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
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                );
              })}

              {filteredServices.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No service categories yet. Click "Add service" to create your first entry.
                </Typography>
              )}

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(filteredServices.length / rowsPerPage))}
                  page={servicePage}
                  onChange={(event, page) => setServicePage(page)}
                  color="primary"
                />
              </Stack>

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
                  {processList.slice((processPage - 1) * rowsPerPage, processPage * rowsPerPage).map((item) => (
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
                  {processList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No process steps added yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(processList.length / rowsPerPage))}
                page={processPage}
                onChange={(event, page) => setProcessPage(page)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'why-vedx' && (
        <WhyVedxTab
          showHeroImage={false}
          categoryOptions={categoryOptions}
          whyVedxCategoryFilter={whyVedxCategoryFilter}
          setWhyVedxCategoryFilter={setWhyVedxCategoryFilter}
          whyVedxSubcategoryFilter={whyVedxSubcategoryFilter}
          setWhyVedxSubcategoryFilter={setWhyVedxSubcategoryFilter}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          whyVedxOptions={whyVedxList.map((item) => ({
            value: item.id,
            label: [item.category, item.subcategory].filter(Boolean).join(' / ') || item.heroTitle || 'Why VedX hero',
          }))}
          selectedWhyVedxId={selectedWhyVedxId}
          handleWhyVedxSelect={(option) => {
            whyVedxConfigClearedRef.current = false;
            const nextId = option?.value ? String(option.value) : '';
            setSelectedWhyVedxId(nextId);
          }}
          handleNewWhyVedxHero={() => {
            whyVedxConfigClearedRef.current = true;
            setSelectedWhyVedxId('');
            setWhyVedxHeroForm(emptyWhyVedxHero);
            setWhyVedxReasons([]);
            setWhyVedxPage(1);
          }}
          serviceCategories={categoryOptions.map((option) => ({ id: option.value, name: option.label }))}
          whyVedxHeroForm={whyVedxHeroForm}
          handleWhyVedxHeroChange={handleWhyVedxHeroChange}
          handleWhyVedxHeroSave={handleWhyVedxHeroSave}
          whyVedxSubcategoryOptions={(whyVedxHeroForm.categoryId
            ? (subcategoryLookup.get(whyVedxHeroForm.categoryId) || []).map((value) => ({ value, label: value }))
            : allSubcategoryOptions.map((value) => ({ value, label: value })))}
          activeWhyVedxReasons={whyVedxReasons}
          rowsPerPage={rowsPerPage}
          whyVedxPage={whyVedxPage}
          setWhyVedxPage={setWhyVedxPage}
          openWhyVedxCreateDialog={openWhyVedxCreateDialog}
          openWhyVedxEditDialog={openWhyVedxEditDialog}
          openWhyVedxDeleteDialog={openWhyVedxDeleteDialog}
        />
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
        <WhyChooseTab
          categoryOptions={categoryOptions}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          disableCategoryFields
          whyServiceCategoryFilter={whyServiceCategoryFilter}
          setWhyServiceCategoryFilter={setWhyServiceCategoryFilter}
          whyServiceSubcategoryFilter={whyServiceSubcategoryFilter}
          setWhyServiceSubcategoryFilter={setWhyServiceSubcategoryFilter}
          whyChooseList={whyChooseList}
          selectedWhyChooseId={selectedWhyChooseId}
          setSelectedWhyChooseId={(value) => {
            whyChooseConfigClearedRef.current = false;
            setSelectedWhyChooseId(value);
          }}
          onNewConfig={() => {
            whyChooseConfigClearedRef.current = true;
            setSelectedWhyChooseId('');
            setWhyHeroForm(initialWhyChooseState);
            setWhyChoose(initialWhyChooseState);
            setWhyServicePage(1);
          }}
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
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Technologies we support"
            subheader="Group technology blocks (Frontend/Backend) and keep the services page dynamic."
            action={
              <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openTechnologyCreateDialog}>
                Add technology block
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              {groupedTechnologies.map((group) => (
                <Accordion
                  key={group.key}
                  disableGutters
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      {group.key} ({group.items.length})
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Stack spacing={1.5}>
                      {group.items.map((tech) => (
                        <Box
                          key={tech.id}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 1.5,
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Stack spacing={1} flex={1}>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {tech.items?.length > 0 ? (
                                  tech.items.map((item, index) => (
                                    <Chip
                                      key={index}
                                      label={item}
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                  ))
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    No items added yet.
                                  </Typography>
                                )}
                              </Stack>

                              <Box
                                sx={{
                                  width: 180,
                                  height: 100,
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: 'background.default',
                                }}
                              >
                                <Box
                                  component="img"
                                  src={tech.image || imagePlaceholder}
                                  alt={`${tech.title} preview`}
                                  sx={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                  }}
                                />
                              </Box>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => openTechnologyEditDialog(tech)}
                                >
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
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}

              {groupedTechnologies.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  {technologies.length === 0
                    ? 'No technology blocks configured yet.'
                    : 'No technology blocks found.'}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'benefits' && (
        <BenefitsTab
          categoryOptions={categoryOptions}
          subcategoryLookup={subcategoryLookup}
          allSubcategoryOptions={allSubcategoryOptions}
          disableCategoryFields
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
          hasBenefitConfig={Boolean(selectedBenefitConfigId)}
          groupedBenefits={groupedBenefits}
          visibleBenefits={visibleBenefits}
          rowsPerPage={rowsPerPage}
          benefitPage={benefitPage}
          setBenefitPage={setBenefitPage}
          openBenefitCreateDialog={openBenefitCreateDialog}
          openBenefitEditDialog={openBenefitEditDialog}
          openBenefitDeleteDialog={openBenefitDeleteDialog}
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

      {activeTab === 'hire-pricing' && (
        <Stack spacing={3}>
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Hire pricing hero"
              subheader="Update the headline, overview, and image shown on the hire pricing section."
            />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  value={hirePricingHeroForm.heroTitle}
                  onChange={(event) =>
                    handleHirePricingHeroChange('heroTitle', event.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={hirePricingHeroForm.heroDescription}
                  onChange={(event) =>
                    handleHirePricingHeroChange('heroDescription', event.target.value)
                  }
                  fullWidth
                  multiline
                  minRows={3}
                />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button variant="contained" onClick={handleHirePricingHeroSave}>
                    Save hero
                  </Button>
                  {hirePricingHeroSaved && (
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
              title="Hire pricing plans"
              subheader="Create, update, and delete hire pricing packages with their inclusions."
              action={
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openHirePricingCreateDialog}>
                  Add hire pricing
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
                      <TableCell>Subtitle</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Services</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedHirePricingPlans.map((plan) => (
                      <TableRow key={plan.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{plan.title}</TableCell>
                        <TableCell>{plan.subtitle || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{plan.price}</TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {plan.description}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 360 }}>
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {plan.services?.length ? (
                              plan.services.map((service) => <Chip key={service} label={service} size="small" />)
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No services listed
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openHirePricingEditDialog(plan)}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => openHirePricingDeleteDialog(plan)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {hirePricing.plans.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            No hire pricing plans configured yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(hirePricing.plans.length / rowsPerPage))}
                  page={hirePricingPage}
                  onChange={(event, page) => setHirePricingPage(page)}
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
                    setServiceForm((prev) => ({
                      ...prev,
                      category: newValue || '',
                      subcategories: newValue === prev.category ? prev.subcategories : [],
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Category" required  />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={serviceFormSubcategoryOptions}
                  value={selectedServiceSubcategory || null}
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
                      
                    />
                  )}
                  disabled={!serviceForm.category && serviceFormSubcategoryOptions.length === 0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Banner title"
                  value={serviceForm.bannerTitle}
                  onChange={(event) => handleServiceFormChange('bannerTitle', event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Banner subtitle"
                  value={serviceForm.bannerSubtitle}
                  onChange={(event) => handleServiceFormChange('bannerSubtitle', event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <ImageUpload
                  label="Banner image*"
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
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Total projects"
                  value={serviceForm.totalProjects}
                  required
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
                  required
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
                        required
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
                        required
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

      <Dialog open={hirePricingDialogOpen} onClose={closeHirePricingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{hirePricingDialogMode === 'edit' ? 'Edit hire pricing' : 'Add hire pricing'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" onSubmit={handleHirePricingSubmit}>
            <TextField
              label="Title"
              value={hirePricingForm.title}
              onChange={(event) => handleHirePricingFormChange('title', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Subtitle"
              value={hirePricingForm.subtitle}
              onChange={(event) => handleHirePricingFormChange('subtitle', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Price"
              value={hirePricingForm.price}
              onChange={(event) => handleHirePricingFormChange('price', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={hirePricingForm.description}
              onChange={(event) => handleHirePricingFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={3}
              required
            />
            <Stack spacing={1}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
                <TextField
                  label="Service title"
                  value={newHirePricingService}
                  onChange={(event) => setNewHirePricingService(event.target.value)}
                  helperText="Add the inclusions for this pricing plan"
                  fullWidth
                  required
                />

              </Stack>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addHirePricingService}
                sx={{ mt: { xs: 0, sm: '4px' } }}
              >
                Add service
              </Button>
              <Stack spacing={1} useFlexGap>
                {hirePricingForm.services?.length ? (
                  hirePricingForm.services.map((service) => (
                    <Stack key={service} direction="row" spacing={1} alignItems="center">
                      <Chip label={service} variant="outlined" />
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => openHirePricingServiceEditDialog(service)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openHirePricingServiceDeleteDialog(service)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No services added yet.
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHirePricingDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleHirePricingSubmit} variant="contained">
            {hirePricingDialogMode === 'edit' ? 'Save changes' : 'Add hire pricing'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(hirePricingServiceToDelete)}
        onClose={closeHirePricingServiceDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove service</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove "{hirePricingServiceToDelete}" from this plan?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHirePricingServiceDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteHirePricingService} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(hirePricingServiceToEdit)}
        onClose={closeHirePricingServiceEditDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit service</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Service title"
            value={hirePricingServiceEditValue}
            onChange={(event) => setHirePricingServiceEditValue(event.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHirePricingServiceEditDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmEditHirePricingService} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(hirePricingToDelete)} onClose={closeHirePricingDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete hire pricing</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{hirePricingToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHirePricingDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteHirePricing} color="error" variant="contained">
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
              value={whyServiceForm.subcategory}
              onChange={(event) => setWhyServiceForm((prev) => ({ ...prev, subcategory: event.target.value }))}
              fullWidth
              disabled
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
              required
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
              label="Image selection *"
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
              required
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
            <Autocomplete
              freeSolo
              options={categoryOptions.map((option) => option.label)}
              value={benefitForm.category}
              onInputChange={(event, newValue) =>
                handleBenefitFormChange('category', newValue || '')
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                 
                />
              )}
              disabled
            />
            <Autocomplete
              freeSolo
              options={benefitSubcategoryOptions}
              value={benefitForm.subcategory}
              onInputChange={(event, newValue) =>
                handleBenefitFormChange('subcategory', newValue || '')
              }
              renderInput={(params) => <TextField {...params} label="Sub-category" />}
              disabled
            />
            <ImageUpload
              label="Image *"
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
        <DialogTitle>{contactButtonDialogMode === 'edit' ? 'Edit contact button' : 'Add contact button'}</DialogTitle>
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
              required
            />

            <Autocomplete
              freeSolo
              clearOnEscape
              options={categoryOptions.map((option) => option.label)}
              value={contactButtonForm.category}
              onInputChange={(event, newValue) => handleContactButtonFormChange('category', newValue || '')}
              renderInput={(params) => <TextField {...params} label="Category" placeholder="Select or type category" fullWidth required />}
              
              
            />

            <Autocomplete
              freeSolo
              clearOnEscape
              options={
                contactButtonForm.category
                  ? subcategoryLookup.get(contactButtonForm.category) || []
                  : allSubcategoryOptions
              }
              value={contactButtonForm.subcategory}
              onInputChange={(event, newValue) => handleContactButtonFormChange('subcategory', newValue || '')}
              renderInput={(params) => (
                <TextField {...params} label="Sub-category" placeholder="Select or type sub-category" fullWidth    required/>
              )}
              
            
            />

            <ImageUpload
              label="Image *"
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
              required
            />
            <ImageUpload
              label="Process image *"
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
              clearOnEscape
              options={whyVedxReasonCategoryOptions}
              value={whyVedxReasonCategoryOptions.find((option) => String(option.value) === String(whyVedxForm.category)) || null}
              disabled
              renderInput={(params) => <TextField {...params} label="Category" fullWidth />}
              fullWidth
            />
            <Autocomplete
              clearOnEscape
              options={whyVedxReasonSubcategoryOptions}
              value={
                whyVedxReasonSubcategoryOptions.find((option) => String(option.value) === String(whyVedxForm.subcategory)) || null
              }
              disabled
              renderInput={(params) => <TextField {...params} label="Subcategory" fullWidth />}
              fullWidth
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
              required
            />
            <ImageUpload
              label="Reason image* "
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

    </Stack>
  );
};

export default AdminHiredeveloperPage;
