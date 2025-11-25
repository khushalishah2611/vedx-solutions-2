import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const initialProcess = [
  {
    id: 'process-1',
    title: 'Discovery and planning',
    description: 'Align goals, scope, and delivery milestones with stakeholder workshops.',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 'process-2',
    title: 'Release and measurement',
    description: 'Ship builds, monitor analytics, and optimise through iterative releases.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60',
  },
];

const initialOurServices = {
  sliderTitle: 'Our Services',
  sliderDescription: 'Showcase priority services with visuals, titles, and taxonomy tags.',
  sliderImage:
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
  services: [
    {
      id: 'os-1',
      title: 'Cloud native engineering',
      subtitle: 'Modernise delivery with resilient architectures.',
      image:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'os-2',
      title: 'Data and AI accelerators',
      subtitle: 'Operationalise analytics with governed workflows.',
      image:
        'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=60',
    },
  ],
};

const initialIndustries = {
  title: 'Industries we serve',
  description: 'Tailored solutions for digital-first leaders across sectors.',
  items: [
    {
      id: 'ind-1',
      title: 'Fintech',
      description: 'Regulatory-ready delivery with robust security practices.',
      image:
        'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=60',
    },
    {
      id: 'ind-2',
      title: 'Healthtech',
      description: 'Compliant experiences with patient-first design.',
      image:
        'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=60',
    },
  ],
};

const initialTechSolutions = {
  title: 'Tech solutions for all business types',
  description: 'Reusable solution kits that scale with growth and compliance needs.',
  solutions: [
    {
      id: 'ts-1',
      title: 'SMB accelerators',
      description: 'Launch quickly with curated starter kits and managed services.',
    },
    {
      id: 'ts-2',
      title: 'Enterprise modernization',
      description: 'Refactor, cloud migrate, and govern change with confidence.',
    },
  ],
};

const initialExpertise = {
  title: 'Ways to choose our expertise',
  description: 'Pick the collaboration model and focus area that best fits your roadmap.',
  items: [
    {
      id: 'exp-1',
      title: 'Dedicated pods',
      description: 'Long-running pods aligned to a business unit with steady velocity.',
      image:
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 'exp-2',
      title: 'Outcome squads',
      description: 'Cross-functional teams focused on a single measurable outcome.',
      image:
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=60',
    },
  ],
};

const initialHireCategories = [
  {
    id: 'hire-cat-1',
    title: 'Mobile app developers',
    description: 'Build native and cross-platform mobile experiences.',
    subcategories: [
      { id: 'hire-sub-1', title: 'Android developers' },
      { id: 'hire-sub-2', title: 'iOS developers' },
      { id: 'hire-sub-3', title: 'React Native developers' },
    ],
  },
  {
    id: 'hire-cat-2',
    title: 'Web app developers',
    description: 'Ship performant web applications with modern stacks.',
    subcategories: [
      { id: 'hire-sub-4', title: 'Full stack engineers' },
      { id: 'hire-sub-5', title: 'Frontend specialists' },
      { id: 'hire-sub-6', title: 'Backend specialists' },
    ],
  },
];

const initialBanners = [
  {
    id: 'banner-1',
    title: 'Home spotlight',
    type: 'home',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    ],
  },
  {
    id: 'banner-2',
    title: 'Build with VedX',
    type: 'about',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=60',
  },
];

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

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('process');
  const rowsPerPage = 5;

  const fileInputRef = useRef(null);
  const industryFileInputRef = useRef(null);
  const processFileInputRef = useRef(null);
  const expertiseFileInputRef = useRef(null);

  const [banners, setBanners] = useState(initialBanners);
  const [bannerForm, setBannerForm] = useState({ title: '', image: '', images: [], type: '' });
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerPage, setBannerPage] = useState(1);

  const [processList, setProcessList] = useState(initialProcess);
  const [processForm, setProcessForm] = useState({
    title: '',
    description: '',
    image: '',
  });
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [editingProcessId, setEditingProcessId] = useState(null);
  const [processPage, setProcessPage] = useState(1);

  // ─────────────────────
  // OUR SERVICES - SLIDERS + SERVICES
  // ─────────────────────
  const [ourServicesSliders, setOurServicesSliders] = useState(() => [
    {
      id: 'slider-default',
      sliderTitle: initialOurServices.sliderTitle,
      sliderDescription: initialOurServices.sliderDescription,
      sliderImage: initialOurServices.sliderImage,
    },
  ]);

  const [ourServicesHeroForm, setOurServicesHeroForm] = useState({
    sliderTitle: initialOurServices.sliderTitle,
    sliderDescription: initialOurServices.sliderDescription,
    sliderImage: initialOurServices.sliderImage,
  });
  const [editingSliderId, setEditingSliderId] = useState('slider-default');
  const [ourServicesSliderPage, setOurServicesSliderPage] = useState(1);
  const [ourHeaderSaved, setOurHeaderSaved] = useState(false);

  // services table pagination + dialog
  const [services, setServices] = useState(() =>
    initialOurServices.services.map((item) => ({
      ...item,
      sliderId: 'slider-default',
    }))
  );

  const [ourServiceForm, setOurServiceForm] = useState({
    title: '',
    sliderId: 'slider-default',
  });
  const [ourServiceDialogOpen, setOurServiceDialogOpen] = useState(false);
  const [ourServiceDeleteDialogOpen, setOurServiceDeleteDialogOpen] = useState(false);
  const [ourServicePendingDelete, setOurServicePendingDelete] = useState(null);
  const [editingOurServiceId, setEditingOurServiceId] = useState(null);
  const [ourServicePage, setOurServicePage] = useState(1);
  const [sliderPickerOpen, setSliderPickerOpen] = useState(false); // image-wise slider picker

  const [industries, setIndustries] = useState(initialIndustries);
  const [industryForm, setIndustryForm] = useState({ title: '', description: '', image: '' });
  const [industrySaved, setIndustrySaved] = useState(false);
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false);
  const [editingIndustryId, setEditingIndustryId] = useState(1);
  const [industryPage, setIndustryPage] = useState(1);

  const [techSolutions, setTechSolutions] = useState(initialTechSolutions);
  const [techSolutionForm, setTechSolutionForm] = useState({ title: '', description: '' });
  const [techSolutionsSaved, setTechSolutionsSaved] = useState(false);
  const [techSolutionDialogOpen, setTechSolutionDialogOpen] = useState(false);
  const [editingTechSolutionId, setEditingTechSolutionId] = useState(null);
  const [techSolutionPage, setTechSolutionPage] = useState(1);

  const [expertise, setExpertise] = useState(initialExpertise);
  const [expertiseForm, setExpertiseForm] = useState({ title: '', description: '', image: '' });
  const [expertiseSaved, setExpertiseSaved] = useState(false);
  const [expertiseDialogOpen, setExpertiseDialogOpen] = useState(false);
  const [editingExpertiseId, setEditingExpertiseId] = useState(null);
  const [expertisePage, setExpertisePage] = useState(1);

  // Our services - slider dialog
  const [sliderDialogOpen, setSliderDialogOpen] = useState(false);

  const [hireCategories, setHireCategories] = useState(initialHireCategories);
  const [hireCategoryForm, setHireCategoryForm] = useState({ title: '', description: '' });
  const [hireCategoryDialogOpen, setHireCategoryDialogOpen] = useState(false);
  const [editingHireCategoryId, setEditingHireCategoryId] = useState(null);
  const [hireCategoryPage, setHireCategoryPage] = useState(1);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [activeHireCategoryId, setActiveHireCategoryId] = useState(null);
  const [hireSubcategoryForm, setHireSubcategoryForm] = useState({ title: '' });
  const [editingHireSubcategoryId, setEditingHireSubcategoryId] = useState(null);
  const [hireCategoryError, setHireCategoryError] = useState('');
  const [hireSubcategoryError, setHireSubcategoryError] = useState('');

  // selected slider for service dialog preview
  const selectedSliderForServiceDialog =
    ourServicesSliders.find((s) => s.id === ourServiceForm.sliderId) || null;

  // ─────────────────────────────────────
  // Banner handlers
  // ─────────────────────────────────────
  const handleBannerImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (bannerForm.type === 'home') {
      Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      ).then((images) => setBannerForm((prev) => ({ ...prev, images })));
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setBannerForm((prev) => ({ ...prev, image: reader.result, images: [] }));
    };
    reader.readAsDataURL(file);
  };

  const handleBannerTypeChange = (event) => {
    const nextType = event.target.value;
    const nextImages =
      nextType === 'home'
        ? bannerForm.images.length
          ? bannerForm.images
          : bannerForm.image
            ? [bannerForm.image]
            : []
        : [];
    setBannerForm((prev) => ({
      ...prev,
      type: nextType,
      image: nextType === 'home' ? '' : prev.image,
      images: nextImages,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddOrUpdateBanner = () => {
    const isHome = bannerForm.type === 'home';
    const hasImage = isHome ? bannerForm.images.length > 0 : Boolean(bannerForm.image);
    if (!bannerForm.title.trim() || !bannerForm.type || !hasImage) return;

    if (editingBannerId) {
      setBanners((prev) =>
        prev.map((item) =>
          item.id === editingBannerId
            ? {
              ...item,
              title: bannerForm.title,
              image: isHome ? '' : bannerForm.image,
              images: isHome ? bannerForm.images : [],
              type: bannerForm.type,
            }
            : item
        )
      );
    } else {
      const newItem = {
        id: `banner-${Date.now()}`,
        title: bannerForm.title,
        type: bannerForm.type,
        image: isHome ? '' : bannerForm.image,
        images: isHome ? bannerForm.images : [],
      };
      setBanners((prev) => [newItem, ...prev]);
      setBannerPage(1);
    }

    setBannerForm({ title: '', image: '', images: [], type: '' });
    setEditingBannerId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditBanner = (id) => {
    const match = banners.find((item) => item.id === id);
    if (!match) return;
    setBannerForm({
      title: match.title,
      image: match.image || '',
      images: match.images || [],
      type: match.type || '',
    });
    setEditingBannerId(id);
  };

  const handleDeleteBanner = (id) => {
    setBanners((prev) => prev.filter((item) => item.id !== id));
    if (editingBannerId === id) {
      setEditingBannerId(null);
      setBannerForm({ title: '', image: '', images: [], type: '' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // ─────────────────────────────────────
  // Process handlers
  // ─────────────────────────────────────
  const openProcessDialog = (item = null) => {
    if (item) {
      setProcessForm({
        title: item.title || '',
        description: item.description || '',
        image: item.image || '',
      });
      setEditingProcessId(item.id);
    } else {
      setProcessForm({ title: '', description: '', image: '' });
      setEditingProcessId(null);
    }
    setProcessDialogOpen(true);
    if (processFileInputRef.current) {
      processFileInputRef.current.value = '';
    }
  };

  const closeProcessDialog = () => {
    setProcessDialogOpen(false);
    setEditingProcessId(null);
    setProcessForm({ title: '', description: '', image: '' });
    if (processFileInputRef.current) {
      processFileInputRef.current.value = '';
    }
  };

  const handleProcessImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProcessForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleProcessSave = () => {
    if (!processForm.title.trim() || !processForm.image) return;

    if (editingProcessId) {
      setProcessList((prev) =>
        prev.map((item) => (item.id === editingProcessId ? { ...item, ...processForm } : item))
      );
    } else {
      const newItem = { ...processForm, id: `process-${Date.now()}` };
      setProcessList((prev) => [newItem, ...prev]);
      setProcessPage(1);
    }

    closeProcessDialog();
  };

  const handleDeleteProcess = (id) => {
    setProcessList((prev) => prev.filter((item) => item.id !== id));
  };

  // ─────────────────────────────────────
  // Our services - slider handlers
  // ─────────────────────────────────────
  const handleOurServicesHeroChange = (field, value) => {
    setOurServicesHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  // NEW: create a fresh slider (for multiple slider support)
  const handleCreateNewSlider = () => {
    setOurServicesHeroForm({
      sliderTitle: '',
      sliderDescription: '',
      sliderImage: '',
    });
    setEditingSliderId(null);
    setSliderDialogOpen(true);
  };

  const closeSliderDialog = () => {
    setSliderDialogOpen(false);
    setEditingSliderId(null);
    setOurServicesHeroForm({
      sliderTitle: '',
      sliderDescription: '',
      sliderImage: '',
    });
  };

  const handleOurServicesHeroSave = (event) => {
    event?.preventDefault();
    if (!ourServicesHeroForm.sliderTitle.trim() || !ourServicesHeroForm.sliderImage) return;

    if (editingSliderId) {
      setOurServicesSliders((prev) =>
        prev.map((slider) =>
          slider.id === editingSliderId ? { ...slider, ...ourServicesHeroForm } : slider
        )
      );
    } else {
      const newId = `slider-${Date.now()}`;
      const newSlider = { id: newId, ...ourServicesHeroForm };
      setOurServicesSliders((prev) => [newSlider, ...prev]);
      setEditingSliderId(newId);
      setOurServicesSliderPage(1);
    }

    setOurHeaderSaved(true);
    setTimeout(() => setOurHeaderSaved(false), 2000);
    setSliderDialogOpen(false);
  };

  const handleEditOurServiceSlider = (slider) => {
    setOurServicesHeroForm({
      sliderTitle: slider.sliderTitle,
      sliderDescription: slider.sliderDescription,
      sliderImage: slider.sliderImage,
    });
    setEditingSliderId(slider.id);
    setSliderDialogOpen(true);
  };

  const handleDeleteOurServiceSlider = (id) => {
    setOurServicesSliders((prev) => {
      const remaining = prev.filter((slider) => slider.id !== id);

      if (editingSliderId === id) {
        if (remaining.length) {
          const first = remaining[0];
          setEditingSliderId(first.id);
          setOurServicesHeroForm({
            sliderTitle: first.sliderTitle,
            sliderDescription: first.sliderDescription,
            sliderImage: first.sliderImage,
          });
        } else {
          setEditingSliderId(null);
          setOurServicesHeroForm({
            sliderTitle: '',
            sliderDescription: '',
            sliderImage: '',
          });
        }
      }

      return remaining;
    });

    // Remove any services attached to this slider
    setServices((prev) => prev.filter((service) => service.sliderId !== id));
  };

  // ─────────────────────────────────────
  // Our services - service handlers
  // ─────────────────────────────────────
  const openOurServiceCreateDialog = () => {
    const defaultSliderId = editingSliderId || ourServicesSliders[0]?.id || '';
    setOurServiceForm({ title: '', sliderId: defaultSliderId });
    setEditingOurServiceId(null);
    setOurServiceDialogOpen(true);
  };

  const openOurServiceEditDialog = (item) => {
    setOurServiceForm({
      title: item.title || '',
      sliderId: item.sliderId || editingSliderId || ourServicesSliders[0]?.id || '',
    });
    setEditingOurServiceId(item.id);
    setOurServiceDialogOpen(true);
  };

  const closeOurServiceDialog = () => {
    setOurServiceDialogOpen(false);
    setEditingOurServiceId(null);
    const defaultSliderId = editingSliderId || ourServicesSliders[0]?.id || '';
    setOurServiceForm({ title: '', sliderId: defaultSliderId });
  };

  const handleSaveOurService = () => {
    if (!ourServiceForm.title.trim() || !ourServiceForm.sliderId) return;

    if (editingOurServiceId) {
      setServices((prev) =>
        prev.map((item) =>
          item.id === editingOurServiceId
            ? { ...item, title: ourServiceForm.title, sliderId: ourServiceForm.sliderId }
            : item
        )
      );
    } else {
      const newItem = {
        id: `os-${Date.now()}`,
        title: ourServiceForm.title,
        sliderId: ourServiceForm.sliderId,
      };
      setServices((prev) => [newItem, ...prev]);
      setOurServicePage(1);
    }

    closeOurServiceDialog();
  };

  const openOurServiceDeleteDialog = (item) => {
    setOurServicePendingDelete(item);
    setOurServiceDeleteDialogOpen(true);
  };

  const closeOurServiceDeleteDialog = () => {
    setOurServicePendingDelete(null);
    setOurServiceDeleteDialogOpen(false);
  };

  const handleConfirmDeleteOurService = () => {
    if (!ourServicePendingDelete) return;

    setServices((prev) => {
      const updated = prev.filter((item) => item.id !== ourServicePendingDelete.id);
      const nextLength = updated.length;
      setOurServicePage((prevPage) => {
        const totalPages = Math.max(1, Math.ceil(nextLength / rowsPerPage));
        return Math.min(prevPage, totalPages);
      });
      return updated;
    });

    closeOurServiceDeleteDialog();
  };

  // ─────────────────────────────────────
  // Industries handlers
  // ─────────────────────────────────────
  const handleIndustrySave = () => {
    setIndustries((prev) => ({ ...prev }));
    setIndustrySaved(true);
    setTimeout(() => setIndustrySaved(false), 2000);
  };

  const openIndustryDialog = (item = null) => {
    if (item) {
      setIndustryForm({
        title: item.title || '',
        description: item.description || '',
        image: item.image || '',
      });
      setEditingIndustryId(item.id);
    } else {
      setIndustryForm({ title: '', description: '', image: '' });
      setEditingIndustryId(null);
    }
    setIndustryDialogOpen(true);
    if (industryFileInputRef.current) {
      industryFileInputRef.current.value = '';
    }
  };

  const closeIndustryDialog = () => {
    setIndustryDialogOpen(false);
    setEditingIndustryId(null);
    setIndustryForm({ title: '', description: '', image: '' });
    if (industryFileInputRef.current) {
      industryFileInputRef.current.value = '';
    }
  };

  const handleIndustryImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setIndustryForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleIndustrySubmit = () => {
    if (!industryForm.title.trim() || !industryForm.image) return;

    if (editingIndustryId) {
      setIndustries((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === editingIndustryId ? { ...item, ...industryForm } : item
        ),
      }));
    } else {
      const newItem = { ...industryForm, id: `ind-${Date.now()}` };
      setIndustries((prev) => ({ ...prev, items: [newItem, ...prev.items] }));
      setIndustryPage(1);
    }

    closeIndustryDialog();
  };

  const handleDeleteIndustry = (id) => {
    setIndustries((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
    if (editingIndustryId === id) {
      closeIndustryDialog();
    }
  };

  // ─────────────────────────────────────
  // Tech solutions handlers
  // ─────────────────────────────────────
  const handleTechSolutionsSave = () => {
    setTechSolutions((prev) => ({ ...prev }));
    setTechSolutionsSaved(true);
    setTimeout(() => setTechSolutionsSaved(false), 2000);
  };

  const openTechSolutionDialog = (item = null) => {
    if (item) {
      setTechSolutionForm({ title: item.title, description: item.description });
      setEditingTechSolutionId(item.id);
    } else {
      setTechSolutionForm({ title: '', description: '' });
      setEditingTechSolutionId(null);
    }
    setTechSolutionDialogOpen(true);
  };

  const closeTechSolutionDialog = () => {
    setTechSolutionDialogOpen(false);
    setEditingTechSolutionId(null);
    setTechSolutionForm({ title: '', description: '' });
  };

  const handleTechSolutionSave = () => {
    if (!techSolutionForm.title.trim()) return;

    if (editingTechSolutionId) {
      setTechSolutions((prev) => ({
        ...prev,
        solutions: prev.solutions.map((item) =>
          item.id === editingTechSolutionId ? { ...item, ...techSolutionForm } : item
        ),
      }));
    } else {
      const newItem = { ...techSolutionForm, id: `ts-${Date.now()}` };
      setTechSolutions((prev) => ({ ...prev, solutions: [newItem, ...prev.solutions] }));
      setTechSolutionPage(1);
    }

    closeTechSolutionDialog();
  };

  const handleDeleteTechSolution = (id) => {
    setTechSolutions((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((item) => item.id !== id),
    }));
  };

  // ─────────────────────────────────────
  // Expertise handlers
  // ─────────────────────────────────────
  const handleExpertiseSave = () => {
    setExpertise((prev) => ({ ...prev }));
    setExpertiseSaved(true);
    setTimeout(() => setExpertiseSaved(false), 2000);
  };

  const openExpertiseDialog = (item = null) => {
    if (item) {
      setExpertiseForm({
        title: item.title || '',
        description: item.description || '',
        image: item.image || '',
      });
      setEditingExpertiseId(item.id);
    } else {
      setExpertiseForm({ title: '', description: '', image: '' });
      setEditingExpertiseId(null);
    }
    setExpertiseDialogOpen(true);
    if (expertiseFileInputRef.current) {
      expertiseFileInputRef.current.value = '';
    }
  };

  const closeExpertiseDialog = () => {
    setExpertiseDialogOpen(false);
    setEditingExpertiseId(null);
    setExpertiseForm({ title: '', description: '', image: '' });
    if (expertiseFileInputRef.current) {
      expertiseFileInputRef.current.value = '';
    }
  };

  const handleExpertiseImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setExpertiseForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleExpertiseSubmit = () => {
    if (!expertiseForm.title.trim() || !expertiseForm.image) return;

    if (editingExpertiseId) {
      setExpertise((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === editingExpertiseId ? { ...item, ...expertiseForm } : item
        ),
      }));
    } else {
      const newItem = { ...expertiseForm, id: `exp-${Date.now()}` };
      setExpertise((prev) => ({ ...prev, items: [newItem, ...prev.items] }));
      setExpertisePage(1);
    }

    closeExpertiseDialog();
  };

  const handleDeleteExpertise = (id) => {
    setExpertise((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
    if (editingExpertiseId === id) {
      closeExpertiseDialog();
    }
  };

  // ─────────────────────────────────────
  // Hire developers - category + sub-category handlers
  // ─────────────────────────────────────
  const openHireCategoryDialog = (item = null) => {
    setHireCategoryError('');
    if (item) {
      setHireCategoryForm({ title: item.title || '', description: item.description || '' });
      setEditingHireCategoryId(item.id);
    } else {
      setHireCategoryForm({ title: '', description: '' });
      setEditingHireCategoryId(null);
    }
    setHireCategoryDialogOpen(true);
  };

  const closeHireCategoryDialog = () => {
    setHireCategoryDialogOpen(false);
    setEditingHireCategoryId(null);
    setHireCategoryForm({ title: '', description: '' });
    setHireCategoryError('');
  };

  const handleSaveHireCategory = () => {
    const title = hireCategoryForm.title.trim();
    if (!title) {
      setHireCategoryError('Title is required');
      return;
    }

    const duplicate = hireCategories.some(
      (category) =>
        category.title.trim().toLowerCase() === title.toLowerCase() &&
        category.id !== editingHireCategoryId
    );

    if (duplicate) {
      setHireCategoryError('A category with this title already exists');
      return;
    }

    setHireCategoryError('');

    if (editingHireCategoryId) {
      setHireCategories((prev) =>
        prev.map((category) =>
          category.id === editingHireCategoryId
            ? { ...category, ...hireCategoryForm, title }
            : category
        )
      );
    } else {
      const newCategory = {
        id: `hire-cat-${Date.now()}`,
        title,
        description: hireCategoryForm.description,
        subcategories: [],
      };
      setHireCategories((prev) => [newCategory, ...prev]);
      setHireCategoryPage(1);
    }

    closeHireCategoryDialog();
  };

  const handleDeleteHireCategory = (id) => {
    setHireCategories((prev) => {
      const updated = prev.filter((category) => category.id !== id);
      setHireCategoryPage((prevPage) => {
        const totalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));
        return Math.min(prevPage, totalPages);
      });
      return updated;
    });

    if (activeHireCategoryId === id) {
      closeSubcategoryDialog();
    }
  };

  const openSubcategoryDialog = (category) => {
    setActiveHireCategoryId(category.id);
    setHireSubcategoryForm({ title: '' });
    setEditingHireSubcategoryId(null);
    setHireSubcategoryError('');
    setSubcategoryDialogOpen(true);
  };

  const closeSubcategoryDialog = () => {
    setSubcategoryDialogOpen(false);
    setActiveHireCategoryId(null);
    setHireSubcategoryForm({ title: '' });
    setEditingHireSubcategoryId(null);
    setHireSubcategoryError('');
  };

  const handleSaveHireSubcategory = () => {
    if (!activeHireCategoryId) return;

    const title = hireSubcategoryForm.title.trim();
    if (!title) {
      setHireSubcategoryError('Title is required');
      return;
    }

    const activeCategory = hireCategories.find((category) => category.id === activeHireCategoryId);
    const duplicate = activeCategory?.subcategories.some(
      (subcategory) =>
        subcategory.title.trim().toLowerCase() === title.toLowerCase() &&
        subcategory.id !== editingHireSubcategoryId
    );

    if (duplicate) {
      setHireSubcategoryError('This sub-category already exists for the category');
      return;
    }

    setHireSubcategoryError('');

    setHireCategories((prev) =>
      prev.map((category) => {
        if (category.id !== activeHireCategoryId) return category;

        const nextSubcategories = editingHireSubcategoryId
          ? category.subcategories.map((subcategory) =>
            subcategory.id === editingHireSubcategoryId
              ? { ...subcategory, title }
              : subcategory
          )
          : [{ id: `hire-sub-${Date.now()}`, title }, ...category.subcategories];

        return { ...category, subcategories: nextSubcategories };
      })
    );

    setHireSubcategoryForm({ title: '' });
    setEditingHireSubcategoryId(null);
  };

  const handleEditHireSubcategory = (subcategory) => {
    setHireSubcategoryForm({ title: subcategory.title });
    setEditingHireSubcategoryId(subcategory.id);
    setHireSubcategoryError('');
  };

  const handleDeleteHireSubcategory = (id) => {
    setHireCategories((prev) =>
      prev.map((category) => {
        if (category.id !== activeHireCategoryId) return category;
        return {
          ...category,
          subcategories: category.subcategories.filter((subcategory) => subcategory.id !== id),
        };
      })
    );

    if (editingHireSubcategoryId === id) {
      setHireSubcategoryForm({ title: '' });
      setEditingHireSubcategoryId(null);
    }
  };

  // ─────────────────────────────────────
  // Pagination slices
  // ─────────────────────────────────────
  const paginatedBanners = banners.slice(
    (bannerPage - 1) * rowsPerPage,
    bannerPage * rowsPerPage
  );
  const paginatedProcessList = processList.slice(
    (processPage - 1) * rowsPerPage,
    processPage * rowsPerPage
  );
  const paginatedIndustries = industries.items.slice(
    (industryPage - 1) * rowsPerPage,
    industryPage * rowsPerPage
  );
  const paginatedTechSolutions = techSolutions.solutions.slice(
    (techSolutionPage - 1) * rowsPerPage,
    techSolutionPage * rowsPerPage
  );
  const paginatedExpertise = expertise.items.slice(
    (expertisePage - 1) * rowsPerPage,
    expertisePage * rowsPerPage
  );
  const paginatedServices = services.slice(
    (ourServicePage - 1) * rowsPerPage,
    ourServicePage * rowsPerPage
  );
  const paginatedOurServiceSliders = ourServicesSliders.slice(
    (ourServicesSliderPage - 1) * rowsPerPage,
    ourServicesSliderPage * rowsPerPage
  );
  const paginatedHireCategories = hireCategories.slice(
    (hireCategoryPage - 1) * rowsPerPage,
    hireCategoryPage * rowsPerPage
  );
  const activeHireCategory =
    hireCategories.find((category) => category.id === activeHireCategoryId) || null;

  return (
    <>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure cross-page modules including process, services, and expertise content.
          </Typography>
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(event, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab value="banner" label="Dashboard banner" />
            <Tab value="process" label="Process" />
            <Tab value="our-services" label="Our services" />
            <Tab value="industries" label="Industries we serve" />
            <Tab value="tech-solutions" label="Tech solutions" />
            <Tab value="expertise" label="Expertise models" />

          </Tabs>
        </Box>

        {/* BANNER TAB */}
        {activeTab === 'banner' && (
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Dashboard banner"
              subheader="Set the hero banner title and artwork for the dashboard."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'stretch', md: 'flex-start' }}
              >
                <Box
                  sx={{
                    flex: 1,
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
                    minHeight: 180,
                    backgroundColor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {bannerForm.type === 'home' ? (
                    bannerForm.images.length ? (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ width: '100%', overflowX: 'auto', p: 2 }}
                      >
                        {bannerForm.images.map((src, index) => (
                          <Box
                            key={index}
                            component="img"
                            src={src}
                            alt={(bannerForm.title || 'Banner preview') + ` ${index + 1}`}
                            sx={{
                              height: 140,
                              width: 240,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary" align="center" px={2}>
                        Banner preview will appear here once you add a title and choose an image.
                      </Typography>
                    )
                  ) : bannerForm.image ? (
                    <Box
                      component="img"
                      src={bannerForm.image}
                      alt={bannerForm.title || 'Banner preview'}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" px={2}>
                      Banner preview will appear here once you add a title and choose an image.
                    </Typography>
                  )}
                </Box>

                <Stack spacing={2} flex={1} minWidth={{ xs: 'auto', md: 360 }}>
                  <TextField
                    label="Title"
                    value={bannerForm.title}
                    onChange={(event) =>
                      setBannerForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    fullWidth
                  />

                  <TextField
                    select
                    label="Type"
                    value={bannerForm.type}
                    onChange={handleBannerTypeChange}
                    fullWidth
                    helperText="Choose where this banner will be used"
                  >
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="about">About</MenuItem>
                    <MenuItem value="blogs">Blogs</MenuItem>
                    <MenuItem value="contact">Contact</MenuItem>
                    <MenuItem value="career">Career</MenuItem>
                  </TextField>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={bannerForm.type === 'home'}
                    style={{ display: 'none' }}
                    onChange={handleBannerImageChange}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!bannerForm.type}
                  >
                    {bannerForm.type === 'home' ? 'Choose images' : 'Choose image'}
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    {!bannerForm.type
                      ? 'Select a banner type to enable image selection. Home supports multiple images; other types use a single image.'
                      : bannerForm.type === 'home'
                        ? 'Home banners allow selecting multiple images for the slider.'
                        : 'Other banner types accept a single image.'}
                  </Typography>

                  <Button variant="contained" onClick={handleAddOrUpdateBanner}>
                    {editingBannerId ? 'Update banner' : 'Add banner'}
                  </Button>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Image(s)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBanners.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{item.type}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        {item.type === 'home' ? (
                          item.images?.length ? (
                            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                              {item.images.map((src, index) => (
                                <Box
                                  key={index}
                                  component="img"
                                  src={src}
                                  alt={`${item.title} ${index + 1}`}
                                  sx={{
                                    width: 120,
                                    height: 60,
                                    borderRadius: 1,
                                    objectFit: 'cover',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                />
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No images selected
                            </Typography>
                          )
                        ) : (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title}
                            sx={{
                              width: 140,
                              height: 60,
                              borderRadius: 1,
                              objectFit: 'cover',
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEditBanner(item.id)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteBanner(item.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!banners.length && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No banner entries yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(banners.length / rowsPerPage))}
                  page={bannerPage}
                  onChange={(event, page) => setBannerPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* PROCESS TAB */}
        {activeTab === 'process' && (
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader title="Process" subheader="Capture key delivery steps." />
            <Divider />
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" color="text.secondary">
                  Add and edit process steps with titles, descriptions, and preview imagery.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => openProcessDialog()}
                >
                  Add step
                </Button>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProcessList.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell width={120}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title || 'Process preview'}
                            sx={{
                              width: 88,
                              height: 56,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No image
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openProcessDialog(item)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteProcess(item.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!processList.length && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No process steps configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(processList.length / rowsPerPage))}
                  page={processPage}
                  onChange={(event, page) => setProcessPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* OUR SERVICES TAB */}
        {activeTab === 'our-services' && (
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Our services"
              subheader="Manage slider title/description and the list of showcased services."
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>

                {/* Slider list */}
                <Box>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    mb={1}
                  >
                    <Box>
                      <Typography variant="h6">Saved sliders</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage multiple slider variants for different contexts.
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleCreateNewSlider}
                    >
                      New slider
                    </Button>
                  </Stack>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedOurServiceSliders.map((slider) => (
                          <TableRow key={slider.id} hover>
                            <TableCell width={120}>
                              {slider.sliderImage ? (
                                <Box
                                  component="img"
                                  src={slider.sliderImage}
                                  alt={slider.sliderTitle}
                                  sx={{
                                    width: 88,
                                    height: 56,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                />
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  No image
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              {slider.sliderTitle}
                            </TableCell>
                            <TableCell sx={{ maxWidth: 360 }}>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {slider.sliderDescription || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit slider">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditOurServiceSlider(slider)}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete slider">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteOurServiceSlider(slider.id)}
                                    disabled={ourServicesSliders.length === 1}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                        {ourServicesSliders.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Typography variant="body2" color="text.secondary" align="center">
                                No sliders configured yet.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Stack mt={2} alignItems="flex-end">
                    <Pagination
                      count={Math.max(1, Math.ceil(ourServicesSliders.length / rowsPerPage))}
                      page={ourServicesSliderPage}
                      onChange={(event, page) => setOurServicesSliderPage(page)}
                      color="primary"
                      size="small"
                    />
                  </Stack>
                </Box>

                <Divider />

                {/* Service cards */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Box>
                    <Typography variant="h6">Service cards</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add the services that appear in the carousel with titles and slider mapping.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={openOurServiceCreateDialog}
                    sx={{ mt: { xs: 1, sm: 0 } }}
                    disabled={!ourServicesSliders.length}
                  >
                    Add service card
                  </Button>
                </Stack>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Slider</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedServices.map((item) => {
                        const slider =
                          ourServicesSliders.find((s) => s.id === item.sliderId) || null;
                        return (
                          <TableRow key={item.id} hover>
                            <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {slider?.sliderTitle || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => openOurServiceEditDialog(item)}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => openOurServiceDeleteDialog(item)}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {services.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No service cards configured yet.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack mt={2} alignItems="flex-end">
                  <Pagination
                    count={Math.max(1, Math.ceil(services.length / rowsPerPage))}
                    page={ourServicePage}
                    onChange={(event, page) => setOurServicePage(page)}
                    color="primary"
                    size="small"
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* INDUSTRIES TAB */}
        {activeTab === 'industries' && (
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Industries we serve"
              subheader="Set the headline and list of industries with descriptions."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                mb={3}
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'stretch', md: 'flex-end' }}
              >
                <TextField
                  label="Title"
                  value={industries.title}
                  onChange={(event) =>
                    setIndustries((prev) => ({ ...prev, title: event.target.value }))
                  }
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={industries.description}
                  onChange={(event) =>
                    setIndustries((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </Stack>

              <Stack direction="row" justifyContent="flex-end" mb={1}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button variant="contained" onClick={handleIndustrySave}>
                    Save header
                  </Button>

                  {industrySaved && (
                    <Typography variant="body2" color="success.main">
                      Saved
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => openIndustryDialog()}
                  >
                    Add industry
                  </Button>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedIndustries.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title}
                            sx={{
                              width: 96,
                              height: 56,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openIndustryDialog(item)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteIndustry(item.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!industries.items.length && (
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

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(industries.items.length / rowsPerPage))}
                  page={industryPage}
                  onChange={(event, page) => setIndustryPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* TECH SOLUTIONS TAB */}
        {activeTab === 'tech-solutions' && (
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Tech solutions for all business types"
              subheader="Control heading, copy, and business-type specific solutions."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                mb={3}
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'stretch', md: 'flex-end' }}
              >
                <TextField
                  label="Title"
                  value={techSolutions.title}
                  onChange={(event) =>
                    setTechSolutions((prev) => ({ ...prev, title: event.target.value }))
                  }
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={techSolutions.description}
                  onChange={(event) =>
                    setTechSolutions((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </Stack>

              <Stack direction="row" justifyContent="flex-end" mb={1} spacing={2}>
                <Button variant="contained" onClick={handleTechSolutionsSave}>
                  Save header
                </Button>

                {techSolutionsSaved && (
                  <Typography variant="body2" color="success.main">
                    Saved
                  </Typography>
                )}

                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => openTechSolutionDialog()}
                >
                  Add solution
                </Button>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTechSolutions.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openTechSolutionDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteTechSolution(item.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!techSolutions.solutions.length && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No solutions configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(techSolutions.solutions.length / rowsPerPage))}
                  page={techSolutionPage}
                  onChange={(event, page) => setTechSolutionPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* EXPERTISE TAB */}
        {activeTab === 'expertise' && (
          <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title="Ways to choose our expertise"
              subheader="Manage collaboration models and proof points."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                mb={3}
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'stretch', md: 'flex-end' }}
              >
                <TextField
                  label="Title"
                  value={expertise.title}
                  onChange={(event) =>
                    setExpertise((prev) => ({ ...prev, title: event.target.value }))
                  }
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={expertise.description}
                  onChange={(event) =>
                    setExpertise((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Add industry-style expertise options with title, description, and imagery.
                </Typography>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Button variant="contained" onClick={handleExpertiseSave}>
                    Save header
                  </Button>

                  {expertiseSaved && (
                    <Typography variant="body2" color="success.main">
                      Saved
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => openExpertiseDialog()}
                  >
                    Add industry
                  </Button>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedExpertise.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell width={120}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title || 'Expertise preview'}
                            sx={{
                              width: 88,
                              height: 56,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No image
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openExpertiseDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteExpertise(item.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!expertise.items.length && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No expertise options configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(expertise.items.length / rowsPerPage))}
                  page={expertisePage}
                  onChange={(event, page) => setExpertisePage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}



      </Stack>


      {/* Our services slider dialog */}
      <Dialog open={sliderDialogOpen} onClose={closeSliderDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingSliderId ? 'Edit slider' : 'Add slider'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleOurServicesHeroSave} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Slider title"
                  value={ourServicesHeroForm.sliderTitle}
                  onChange={(event) =>
                    handleOurServicesHeroChange('sliderTitle', event.target.value)
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Slider description"
                  value={ourServicesHeroForm.sliderDescription}
                  onChange={(event) =>
                    handleOurServicesHeroChange('sliderDescription', event.target.value)
                  }
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ImageUpload
                  label="Slider image"
                  value={ourServicesHeroForm.sliderImage}
                  onChange={(value) => handleOurServicesHeroChange('sliderImage', value)}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSliderDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleOurServicesHeroSave} variant="contained">
            {editingSliderId ? 'Save slider' : 'Add slider'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Our services dialog - now includes slider dropdown + image-wise picker */}
      <Dialog
        open={ourServiceDialogOpen}
        onClose={closeOurServiceDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingOurServiceId ? 'Edit service card' : 'Add service card'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {/* slider selection row */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', sm: 'flex-end' }}
            >
              <TextField
                select
                label="Slider"
                required
                value={ourServiceForm.sliderId}
                onChange={(event) =>
                  setOurServiceForm((prev) => ({ ...prev, sliderId: event.target.value }))
                }
                fullWidth
                helperText="Choose which slider this service belongs to"
              >
                {ourServicesSliders.map((slider) => (
                  <MenuItem key={slider.id} value={slider.id}>
                    {slider.sliderTitle}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                onClick={() => setSliderPickerOpen(true)}
                sx={{ minWidth: { xs: '100%', sm: 160 } }}
                disabled={!ourServicesSliders.length}
              >
                Choose by image
              </Button>
            </Stack>

            {/* current selected slider preview */}
            {selectedSliderForServiceDialog && (
              <Box
                sx={{
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  p: 1,
                }}
              >
                {selectedSliderForServiceDialog.sliderImage ? (
                  <Box
                    component="img"
                    src={selectedSliderForServiceDialog.sliderImage}
                    alt={selectedSliderForServiceDialog.sliderTitle}
                    sx={{
                      width: 96,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      mr: 2,
                    }}
                  />
                ) : null}
                <Box>
                  <Typography variant="subtitle2">
                    {selectedSliderForServiceDialog.sliderTitle}
                  </Typography>
                  {selectedSliderForServiceDialog.sliderDescription && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {selectedSliderForServiceDialog.sliderDescription}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            <TextField
              label="Service title"
              required
              value={ourServiceForm.title}
              onChange={(event) =>
                setOurServiceForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOurServiceDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveOurService}
            variant="contained"
            disabled={!ourServiceForm.sliderId}
          >
            {editingOurServiceId ? 'Update service' : 'Add service'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Slider picker dialog - image-wise selection */}
      <Dialog
        open={sliderPickerOpen}
        onClose={() => setSliderPickerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Choose slider</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mt={0.5}>
            {ourServicesSliders.map((slider) => (
              <Grid item xs={12} sm={6} md={4} key={slider.id}>
                <Card
                  onClick={() => {
                    setOurServiceForm((prev) => ({ ...prev, sliderId: slider.id }));
                    setSliderPickerOpen(false);
                  }}
                  sx={{
                    cursor: 'pointer',
                    border:
                      slider.id === ourServiceForm.sliderId ? '2px solid' : '1px solid',
                    borderColor:
                      slider.id === ourServiceForm.sliderId ? 'primary.main' : 'divider',
                  }}
                >
                  {slider.sliderImage && (
                    <Box
                      component="img"
                      src={slider.sliderImage}
                      alt={slider.sliderTitle}
                      sx={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom noWrap>
                      {slider.sliderTitle}
                    </Typography>
                    {slider.sliderDescription && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {slider.sliderDescription}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {!ourServicesSliders.length && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No sliders available. Please create a slider first.
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSliderPickerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete service dialog */}
      <Dialog
        open={ourServiceDeleteDialogOpen}
        onClose={closeOurServiceDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete service card</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete &quot;{ourServicePendingDelete?.title}&quot;? This
            action cannot be undone.
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

      {/* Industry dialog */}
      <Dialog
        open={industryDialogOpen}
        onClose={closeIndustryDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingIndustryId ? 'Edit industry' : 'Add industry'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Industry title"
              required
              value={industryForm.title}
              onChange={(event) =>
                setIndustryForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={industryForm.description}
              onChange={(event) =>
                setIndustryForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Add optional details for the industry"
            />
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                minHeight: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => industryFileInputRef.current?.click()}
            >
              {industryForm.image ? (
                <Box
                  component="img"
                  src={industryForm.image}
                  alt={industryForm.title || 'Industry preview'}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" px={2}>
                  Banner preview will appear here once you add a title and choose an image.
                </Typography>
              )}
            </Box>
            <Stack spacing={1}>
              <Button variant="outlined" onClick={() => industryFileInputRef.current?.click()}>
                Choose image
              </Button>
              <Typography variant="caption" color="text.secondary">
                Select a single image to represent the industry.
              </Typography>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={industryFileInputRef}
                onChange={handleIndustryImageChange}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeIndustryDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleIndustrySubmit} variant="contained">
            {editingIndustryId ? 'Update industry' : 'Add industry'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tech solution dialog */}
      <Dialog
        open={techSolutionDialogOpen}
        onClose={closeTechSolutionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingTechSolutionId ? 'Edit solution' : 'Add solution'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Solution title"
              required
              value={techSolutionForm.title}
              onChange={(event) =>
                setTechSolutionForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={techSolutionForm.description}
              onChange={(event) =>
                setTechSolutionForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Add optional details about the solution"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTechSolutionDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleTechSolutionSave} variant="contained">
            {editingTechSolutionId ? 'Update solution' : 'Add solution'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expertise dialog */}
      <Dialog
        open={expertiseDialogOpen}
        onClose={closeExpertiseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingExpertiseId ? 'Edit industry' : 'Add industry'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              required
              value={expertiseForm.title}
              onChange={(event) =>
                setExpertiseForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={expertiseForm.description}
              onChange={(event) =>
                setExpertiseForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Add optional details for the expertise option"
            />
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                minHeight: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => expertiseFileInputRef.current?.click()}
            >
              {expertiseForm.image ? (
                <Box
                  component="img"
                  src={expertiseForm.image}
                  alt={expertiseForm.title || 'Expertise preview'}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" px={2}>
                  Banner preview will appear here once you add a title and choose an image.
                </Typography>
              )}
            </Box>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                onClick={() => expertiseFileInputRef.current?.click()}
                fullWidth
              >
                Choose image
              </Button>
              <Typography variant="caption" color="text.secondary">
                Select a single image to highlight this expertise option.
              </Typography>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={expertiseFileInputRef}
                onChange={handleExpertiseImageChange}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeExpertiseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleExpertiseSubmit} variant="contained">
            {editingExpertiseId ? 'Update industry' : 'Add industry'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Process dialog */}
      <Dialog
        open={processDialogOpen}
        onClose={closeProcessDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingProcessId ? 'Edit process step' : 'Add process step'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              required
              value={processForm.title}
              onChange={(event) =>
                setProcessForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={processForm.description}
              onChange={(event) =>
                setProcessForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Add optional details for the process step"
            />
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                minHeight: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => processFileInputRef.current?.click()}
            >
              {processForm.image ? (
                <Box
                  component="img"
                  src={processForm.image}
                  alt={processForm.title || 'Process preview'}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" px={2}>
                  Banner preview will appear here once you add a title and choose an image.
                </Typography>
              )}
            </Box>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                onClick={() => processFileInputRef.current?.click()}
                fullWidth
              >
                Choose image
              </Button>
              <Typography variant="caption" color="text.secondary">
                Select a relevant image to accompany this process step.
              </Typography>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={processFileInputRef}
                onChange={handleProcessImageChange}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProcessDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleProcessSave} variant="contained">
            {editingProcessId ? 'Update step' : 'Add step'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDashboardPage;
