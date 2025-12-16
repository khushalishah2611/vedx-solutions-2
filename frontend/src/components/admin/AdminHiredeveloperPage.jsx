import { useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../../utils/const.js';
import {
  Autocomplete,
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

const imagePlaceholder = '';

const initialHirePricingState = {
  heroTitle: '',
  heroDescription: '',
  heroImage: imagePlaceholder,
  plans: [],
};

const initialHireContentState = {
  title: '',
  description: '',
  heroImage: imagePlaceholder,
  services: [],
};

const initialWhyChooseState = {
  heroTitle: '',
  heroDescription: '',
  heroImage: imagePlaceholder,
  tableTitle: '',
  tableDescription: '',
  services: [],
};

const initialWhyVedxState = {
  heroTitle: '',
  heroDescription: '',
  heroImage: imagePlaceholder,
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

const emptyHirePricingForm = {
  id: '',
  title: '',
  subtitle: '',
  description: '',
  price: '',
  services: [],
};

const emptyHireServiceForm = {
  id: '',
  category: '',
  subcategory: '',
  title: '',
  description: '',
  image: imagePlaceholder,
};

const emptyProcessForm = {
  id: '',
  title: '',
  description: '',
  category: '',
  subcategory: '',
  image: imagePlaceholder,
};

const emptyWhyVedxHero = {
  heroTitle: '',
  heroDescription: '',
  heroImage: imagePlaceholder,
};

const emptyWhyVedxForm = {
  id: '',
  title: '',
  description: '',
  image: imagePlaceholder,
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
  category: tech.category || '',
  subcategory: tech.subcategory || '',
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

const normalizeHireService = (service) => ({
  id: service.id,
  category: service.category || '',
  subcategory: service.subcategory || '',
  title: service.title || '',
  description: service.description || '',
  image: service.image || imagePlaceholder,
  heroTitle: service.heroTitle || '',
  heroDescription: service.heroDescription || '',
  heroImage: service.heroImage || imagePlaceholder,
});

const normalizeProcess = (item) => ({
  id: item.id,
  title: item.title || '',
  description: item.description || '',
  category: item.category || '',
  subcategory: item.subcategory || '',
  image: item.image || imagePlaceholder,
});

const normalizeWhyVedx = (item) => ({
  id: item.id,
  title: item.title || '',
  description: item.description || '',
  image: item.image || imagePlaceholder,
  heroTitle: item.heroTitle || '',
  heroDescription: item.heroDescription || '',
  heroImage: item.heroImage || imagePlaceholder,
});

const normalizeWhyChoose = (item) => ({
  id: item.id,
  category: item.category || '',
  subcategory: item.subcategory || '',
  title: item.title || '',
  description: item.description || '',
  heroTitle: item.heroTitle || '',
  heroDescription: item.heroDescription || '',
  heroImage: item.heroImage || imagePlaceholder,
  tableTitle: item.tableTitle || '',
  tableDescription: item.tableDescription || '',
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
  const [activeTechnology, setActiveTechnology] = useState(null);
  const [technologyToDelete, setTechnologyToDelete] = useState(null);

  const [benefits, setBenefits] = useState([]);
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

  const [hireContent, setHireContent] = useState(initialHireContentState);
  const [hireServiceDialogOpen, setHireServiceDialogOpen] = useState(false);
  const [hireServiceDialogMode, setHireServiceDialogMode] = useState('create');
  const [hireServiceForm, setHireServiceForm] = useState(emptyHireServiceForm);
  const [activeHireService, setActiveHireService] = useState(null);
  const [hireServiceToDelete, setHireServiceToDelete] = useState(null);
  const [heroSaved, setHeroSaved] = useState(false);

  const [whyChoose, setWhyChoose] = useState(initialWhyChooseState);
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
  const [servicePage, setServicePage] = useState(1);
  const [technologyPage, setTechnologyPage] = useState(1);
  const [benefitPage, setBenefitPage] = useState(1);
  const [whyServicePage, setWhyServicePage] = useState(1);
  const [hirePricingPage, setHirePricingPage] = useState(1);
  const [hireServicePage, setHireServicePage] = useState(1);
  const [processPage, setProcessPage] = useState(1);
  const [whyVedxPage, setWhyVedxPage] = useState(1);
  const [industryPage, setIndustryPage] = useState(1);
  const [techSolutionPage, setTechSolutionPage] = useState(1);
  const [expertisePage, setExpertisePage] = useState(1);
  const [hireMasterCategories, setHireMasterCategories] = useState([]);

  const fetchJson = async (path, options = {}) => {
    const response = await fetch(apiUrl(path), {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Request failed');
    }
    return data;
  };

  const loadHireMasterCategories = async () => {
    try {
      const data = await fetchJson('/api/hire-categories');
      setHireMasterCategories((data?.categories || []).map(normalizeHireMasterCategory));
    } catch (error) {
      console.error('Failed to load hire category master data', error);
      setHireMasterCategories([]);
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

  const loadBenefits = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/benefits');
      setBenefits((data || []).map(normalizeBenefit));
    } catch (error) {
      console.error('Failed to load hire developer benefits', error);
    }
  };

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

  const loadHireServices = async () => {
    try {
      const [heroData, servicesData] = await Promise.all([
        fetchJson('/api/hire-developer').catch(() => null),
        fetchJson('/api/hire-developer/hire-services'),
      ]);

      setHireContent({
        title: heroData?.title || '',
        description: heroData?.description || '',
        heroImage: heroData?.heroImage || imagePlaceholder,
        services: (servicesData || []).map(normalizeHireService),
      });
    } catch (error) {
      console.error('Failed to load hire services', error);
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

  const loadWhyVedx = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/why-vedx');
      const reasons = (data || []).map(normalizeWhyVedx);
      const heroSource = reasons[0] || {};
      setWhyVedx({
        heroTitle: heroSource.heroTitle || '',
        heroDescription: heroSource.heroDescription || '',
        heroImage: heroSource.heroImage || imagePlaceholder,
        reasons,
      });
      setWhyVedxHeroForm({
        heroTitle: heroSource.heroTitle || '',
        heroDescription: heroSource.heroDescription || '',
        heroImage: heroSource.heroImage || imagePlaceholder,
      });
    } catch (error) {
      console.error('Failed to load why VedX items', error);
    }
  };

  const loadWhyChoose = async () => {
    try {
      const data = await fetchJson('/api/hire-developer/why-choose');
      const services = (data || []).map(normalizeWhyChoose);
      const heroSource = services[0] || {};
      setWhyChoose({
        heroTitle: heroSource.heroTitle || '',
        heroDescription: heroSource.heroDescription || '',
        heroImage: heroSource.heroImage || imagePlaceholder,
        tableTitle: heroSource.tableTitle || '',
        tableDescription: heroSource.tableDescription || '',
        services,
      });
      setWhyHeroForm({
        heroTitle: heroSource.heroTitle || '',
        heroDescription: heroSource.heroDescription || '',
        heroImage: heroSource.heroImage || imagePlaceholder,
        tableTitle: heroSource.tableTitle || '',
        tableDescription: heroSource.tableDescription || '',
      });
    } catch (error) {
      console.error('Failed to load why choose items', error);
    }
  };

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
    loadBenefits();
    loadHirePricing();
    loadHireServices();
    loadProcesses();
    loadWhyVedx();
    loadWhyChoose();
    loadIndustries();
    loadTechSolutions();
    loadExpertise();
    loadOurServices();
  }, []);

  const resetServiceForm = () =>
    setServiceForm({ ...emptyServiceForm, createdAt: new Date().toISOString().split('T')[0] });
  const resetTechnologyForm = () => setTechnologyForm(emptyTechnologyForm);
  const resetBenefitForm = () => setBenefitForm(emptyBenefitForm);
  const resetHirePricingForm = () => setHirePricingForm(emptyHirePricingForm);
  const resetHireServiceForm = () => setHireServiceForm(emptyHireServiceForm);
  const resetWhyServiceForm = () => setWhyServiceForm(emptyWhyServiceForm);
  const resetProcessForm = () => setProcessForm(emptyProcessForm);
  const resetWhyVedxForm = () => setWhyVedxForm(emptyWhyVedxForm);
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

  const handleHirePricingHeroChange = (field, value) => {
    setHirePricingHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHirePricingFormChange = (field, value) => {
    setHirePricingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHireServiceFormChange = (field, value) => {
    setHireServiceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHireContentChange = (field, value) => {
    setHeroSaved(false);
    setHireContent((prev) => ({ ...prev, [field]: value }));
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

  const handleHeroSave = async () => {
    try {
      const saved = await fetchJson('/api/hire-developer', {
        method: 'POST',
        body: JSON.stringify({
          title: hireContent.title,
          description: hireContent.description,
          heroImage: hireContent.heroImage,
        }),
      });

      setHireContent((prev) => ({
        ...prev,
        title: saved?.title || prev.title,
        description: saved?.description || prev.description,
        heroImage: saved?.heroImage || prev.heroImage,
      }));

      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save hire developer hero', error);
    }
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
    if (!whyChoose.services.length) return;

    const primary = whyChoose.services[0];

    try {
      const updated = await fetchJson(`/api/hire-developer/why-choose/${primary.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...primary,
          heroTitle: whyHeroForm.heroTitle,
          heroDescription: whyHeroForm.heroDescription,
          heroImage: whyHeroForm.heroImage,
          tableTitle: whyHeroForm.tableTitle,
          tableDescription: whyHeroForm.tableDescription,
        }),
      });

      const normalized = normalizeWhyChoose(updated);

      setWhyChoose((prev) => ({
        heroTitle: normalized.heroTitle,
        heroDescription: normalized.heroDescription,
        heroImage: normalized.heroImage,
        tableTitle: normalized.tableTitle,
        tableDescription: normalized.tableDescription,
        services: prev.services.map((item) => (item.id === normalized.id ? normalized : item)),
      }));
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
  }, [hireMasterCategories, services]);

  const allSubcategoryOptions = useMemo(() => {
    if (hireMasterCategories.length) {
      return Array.from(
        new Set(hireMasterCategories.flatMap((category) => category.subcategories).filter(Boolean))
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
  }, [hireMasterCategories, services]);

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

  const pagedHirePricingPlans = useMemo(() => {
    const start = (hirePricingPage - 1) * rowsPerPage;
    return hirePricing.plans.slice(start, start + rowsPerPage);
  }, [hirePricing.plans, rowsPerPage, hirePricingPage]);

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
    const maxHirePricingPage = Math.max(1, Math.ceil(hirePricing.plans.length / rowsPerPage));
    setHirePricingPage((prev) => Math.min(prev, maxHirePricingPage));
  }, [hirePricing.plans.length, rowsPerPage]);

  useEffect(() => {
    const maxHireServicePage = Math.max(1, Math.ceil(hireContent.services.length / rowsPerPage));
    setHireServicePage((prev) => Math.min(prev, maxHireServicePage));
  }, [hireContent.services.length, rowsPerPage]);

  useEffect(() => {
    setOurServicesHeroForm((prev) => ({
      ...prev,
      sliderTitle: ourServices.sliderTitle,
      sliderDescription: ourServices.sliderDescription,
      sliderImage: ourServices.sliderImage,
    }));
  }, [ourServices.sliderDescription, ourServices.sliderImage, ourServices.sliderTitle]);

  useEffect(() => {
    const allowed = subcategoryLookup.get(processForm.category) || [];
    if (processForm.subcategory && !allowed.includes(processForm.subcategory)) {
      setProcessForm((prev) => ({ ...prev, subcategory: '' }));
    }
  }, [processForm.category, processForm.subcategory, subcategoryLookup]);

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

  const handleHirePricingSubmit = (event) => {
    event?.preventDefault();
    if (!hirePricingForm.title.trim() || !hirePricingForm.price.trim()) return;

    if (hirePricingDialogMode === 'edit' && activeHirePricingPlan) {
      setHirePricing((prev) => ({
        ...prev,
        plans: prev.plans.map((plan) =>
          plan.id === activeHirePricingPlan.id ? { ...hirePricingForm } : plan
        ),
      }));
    } else {
      const newPlan = { ...hirePricingForm, id: `hire-pricing-${Date.now()}` };
      setHirePricing((prev) => ({ ...prev, plans: [newPlan, ...prev.plans] }));
    }

    closeHirePricingDialog();
  };

  const openHirePricingDeleteDialog = (plan) => setHirePricingToDelete(plan);
  const closeHirePricingDeleteDialog = () => setHirePricingToDelete(null);
  const handleConfirmDeleteHirePricing = () => {
    if (!hirePricingToDelete) return;
    setHirePricing((prev) => ({
      ...prev,
      plans: prev.plans.filter((plan) => plan.id !== hirePricingToDelete.id),
    }));
    closeHirePricingDeleteDialog();
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
    if (!technologyForm.title.trim() || !technologyForm.category.trim() || !technologyForm.image) return;

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
    if (!hireServiceForm.title.trim() || !hireServiceForm.category.trim() || !hireServiceForm.image) return;

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

  const handleProcessSubmit = (event) => {
    event?.preventDefault();
    if (!processForm.title.trim() || !processForm.image || !processForm.category || !processForm.subcategory) return;

    if (processDialogMode === 'edit' && activeProcess) {
      setProcessList((prev) => prev.map((item) => (item.id === activeProcess.id ? { ...processForm } : item)));
    } else {
      const newItem = { ...processForm, id: `process-${Date.now()}` };
      setProcessList((prev) => [newItem, ...prev]);
    }

    closeProcessDialog();
  };

  const openProcessDeleteDialog = (item) => setProcessToDelete(item);
  const closeProcessDeleteDialog = () => setProcessToDelete(null);
  const handleConfirmDeleteProcess = () => {
    if (!processToDelete) return;
    setProcessList((prev) => prev.filter((item) => item.id !== processToDelete.id));
    closeProcessDeleteDialog();
  };

  const handleWhyVedxHeroSave = async (event) => {
    event?.preventDefault();
    if (!whyVedx.reasons.length) return;

    const primary = whyVedx.reasons[0];

    try {
      const updated = await fetchJson(`/api/hire-developer/why-vedx/${primary.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...primary,
          heroTitle: whyVedxHeroForm.heroTitle,
          heroDescription: whyVedxHeroForm.heroDescription,
          heroImage: whyVedxHeroForm.heroImage,
        }),
      });

      const normalized = normalizeWhyVedx(updated);

      setWhyVedx((prev) => ({
        heroTitle: normalized.heroTitle,
        heroDescription: normalized.heroDescription,
        heroImage: normalized.heroImage,
        reasons: prev.reasons.map((item) => (item.id === normalized.id ? normalized : item)),
      }));
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

  const handleWhyVedxSubmit = (event) => {
    event?.preventDefault();
    if (!whyVedxForm.title.trim() || !whyVedxForm.image) return;

    if (whyVedxDialogMode === 'edit' && activeWhyVedx) {
      setWhyVedx((prev) => ({
        ...prev,
        reasons: prev.reasons.map((item) => (item.id === activeWhyVedx.id ? { ...whyVedxForm } : item)),
      }));
    } else {
      const newItem = { ...whyVedxForm, id: `why-vedx-${Date.now()}` };
      setWhyVedx((prev) => ({ ...prev, reasons: [newItem, ...prev.reasons] }));
    }

    closeWhyVedxDialog();
  };

  const openWhyVedxDeleteDialog = (item) => setWhyVedxToDelete(item);
  const closeWhyVedxDeleteDialog = () => setWhyVedxToDelete(null);
  const handleConfirmDeleteWhyVedx = () => {
    if (!whyVedxToDelete) return;
    setWhyVedx((prev) => ({
      ...prev,
      reasons: prev.reasons.filter((item) => item.id !== whyVedxToDelete.id),
    }));
    closeWhyVedxDeleteDialog();
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

  const formattedTechnologyItems = useMemo(
    () => (technologyForm.items?.length ? technologyForm.items.join(', ') : ''),
    [technologyForm.items]
  );

  const serviceFormSubcategoryOptions = useMemo(() => {
    if (!serviceForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(serviceForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, serviceForm.category, subcategoryLookup]);

  const technologySubcategoryOptions = useMemo(() => {
    if (!technologyForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(technologyForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, subcategoryLookup, technologyForm.category]);

  const hireSubcategoryOptions = useMemo(() => {
    if (!hireServiceForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(hireServiceForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, hireServiceForm.category, subcategoryLookup]);

  const benefitSubcategoryOptions = useMemo(() => {
    if (!benefitForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(benefitForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, benefitForm.category, subcategoryLookup]);

  const processSubcategoryOptions = useMemo(() => {
    if (!processForm.category) return allSubcategoryOptions;
    return subcategoryLookup.get(processForm.category) || allSubcategoryOptions;
  }, [allSubcategoryOptions, processForm.category, subcategoryLookup]);

  const whySubcategoryOptions = useMemo(() => {
    const options = subcategoryLookup.get(whyServiceForm.category) || [];
    return options.map((option) => ({ name: option }));
  }, [subcategoryLookup, whyServiceForm.category]);

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
          <Tab value="process" label="Process" />
          <Tab value="why-vedx" label="Why choose VedX" />
          <Tab value="why-choose" label="Why choose service" />
          <Tab value="technologies" label="Technologies we support" />
          <Tab value="benefits" label="Benefits" />
          <Tab value="hire-pricing" label="Hire pricing" />
          <Tab value="hire" label="Development services" />
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
                    helperText="Show services for a specific category"
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
                    helperText="Filter by specific sub-category"
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
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Sub-categories</TableCell>
                    <TableCell>Banner</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>FAQs</TableCell>
                    <TableCell>Totals</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedServices.map((service) => (
                    <TableRow key={service.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{service.category}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                          {service.subcategories.map((item) => (
                            <Chip
                              key={item.name}
                              label={item.name}
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
                      <TableCell colSpan={7}>
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
                    <TableCell>Category</TableCell>
                    <TableCell>Sub-category</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processList.slice((processPage - 1) * rowsPerPage, processPage * rowsPerPage).map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell>{item.category || '-'}</TableCell>
                      <TableCell>{item.subcategory || '-'}</TableCell>
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
                      <TableCell colSpan={6}>
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
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Why choose VedX Solutions"
            subheader="Control headline, description, and proof points."
          />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Box component="form" onSubmit={handleWhyVedxHeroSave} sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
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
                      {whyVedx.reasons
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
                      {whyVedx.reasons.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No reasons added yet.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack mt={2} alignItems="flex-end">
                  <Pagination
                    count={Math.max(1, Math.ceil(whyVedx.reasons.length / rowsPerPage))}
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
                    <TableCell>Category</TableCell>
                    <TableCell>Sub-category</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedTechnologies.map((tech) => (
                    <TableRow key={tech.id} hover>
                      <TableCell>{tech.category || '-'}</TableCell>
                      <TableCell>{tech.subcategory || '-'}</TableCell>
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
                      <TableCell colSpan={6}>
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
                    <TableCell>Category</TableCell>
                    <TableCell>Sub-category</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedBenefits.map((benefit) => (
                    <TableRow key={benefit.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{benefit.title}</TableCell>
                      <TableCell>{benefit.category || '-'}</TableCell>
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
                  {benefits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
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

      {activeTab === 'hire' && (
        <Stack spacing={3}>
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
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
          </Card>

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
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Sub-category</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedHireServices.map((service) => (
                      <TableRow key={service.id} hover>
                        <TableCell>{service.category || '-'}</TableCell>
                        <TableCell>{service.subcategory || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{service.title}</TableCell>
                        <TableCell>
                          <Box
                            component="img"
                            src={service.image || imagePlaceholder}
                            alt={`${service.title} visual`}
                            sx={{ width: 120, height: 70, objectFit: 'cover', borderRadius: 1 }}
                          />
                        </TableCell>
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
                        <TableCell colSpan={5}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            No development services configured yet.
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
            />
            <Stack spacing={1}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
                <TextField
                  label="Service title"
                  value={newHirePricingService}
                  onChange={(event) => setNewHirePricingService(event.target.value)}
                  helperText="Add the inclusions for this pricing plan"
                  fullWidth
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
            <Autocomplete
              freeSolo
              options={categoryOptions.map((option) => option.label)}
              value={technologyForm.category}
              onInputChange={(event, newValue) =>
                setTechnologyForm((prev) => ({
                  ...prev,
                  category: newValue || '',
                  subcategory: newValue === prev.category ? prev.subcategory : '',
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  required
                  helperText="Match the service category for this technology block"
                />
              )}
            />
            <Autocomplete
              freeSolo
              options={technologySubcategoryOptions}
              value={technologyForm.subcategory}
              onInputChange={(event, newValue) =>
                handleTechnologyFormChange('subcategory', newValue || '')
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub-category"
                  helperText="Keep stacks aligned to category and sub-category"
                />
              )}
              disabled={!technologyForm.category && technologySubcategoryOptions.length === 0}
            />
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
                  helperText="Link the benefit to a service category"
                />
              )}
            />
            <Autocomplete
              freeSolo
              options={benefitSubcategoryOptions}
              value={benefitForm.subcategory}
              onInputChange={(event, newValue) =>
                handleBenefitFormChange('subcategory', newValue || '')
              }
              renderInput={(params) => <TextField {...params} label="Sub-category" />}
              disabled={!benefitForm.category && benefitSubcategoryOptions.length === 0}
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
            <Autocomplete
              options={categoryOptions.map((option) => option.label)}
              value={processForm.category}
              onInputChange={(event, newValue) => handleProcessChange('category', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="Select category"
                  required
                  helperText="Choose which category this process step belongs to"
                />
              )}
            />
            <Autocomplete
              options={processSubcategoryOptions}
              value={processForm.subcategory}
              onInputChange={(event, newValue) => handleProcessChange('subcategory', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub-category"
                  placeholder="Select sub-category"
                  required
                  helperText="Pick a sub-category linked to the selected category"
                />
              )}
              disabled={!processForm.category && processSubcategoryOptions.length === 0}
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
                  required
                  helperText="Link hire cards to a service category"
                />
              )}
            />
            <Autocomplete
              freeSolo
              options={hireSubcategoryOptions}
              value={hireServiceForm.subcategory}
              onInputChange={(event, newValue) =>
                handleHireServiceFormChange('subcategory', newValue || '')
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub-category"
                  helperText="Pick the sub-category for this hire option"
                />
              )}
              disabled={!hireServiceForm.category && hireSubcategoryOptions.length === 0}
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

export default AdminHiredeveloperPage;
