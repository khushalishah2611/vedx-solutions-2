import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
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
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

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

  const fileInputRef = useRef(null);
  const industryFileInputRef = useRef(null);
  const processFileInputRef = useRef(null);
  const expertiseFileInputRef = useRef(null);
  const ourSliderFileInputRef = useRef(null);
  const ourServiceFileInputRef = useRef(null);

  const [banners, setBanners] = useState(initialBanners);
  const [bannerForm, setBannerForm] = useState({ title: '', image: '', images: [], type: '' });
  const [editingBannerId, setEditingBannerId] = useState(null);

  const [processList, setProcessList] = useState(initialProcess);
  const [processForm, setProcessForm] = useState({
    title: '',
    description: '',
    image: '',
  });
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [editingProcessId, setEditingProcessId] = useState(null);

  const [ourServices, setOurServices] = useState(initialOurServices);
  const [ourServicesHeroForm, setOurServicesHeroForm] = useState(initialOurServices);
  const [ourServiceForm, setOurServiceForm] = useState({ title: '', subtitle: '', image: '' });
  const [ourHeaderSaved, setOurHeaderSaved] = useState(false);

  const [industries, setIndustries] = useState(initialIndustries);
  const [industryForm, setIndustryForm] = useState({ title: '', description: '', image: '' });
  const [industrySaved, setIndustrySaved] = useState(false);
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false);
  const [editingIndustryId, setEditingIndustryId] = useState(null);

  const [techSolutions, setTechSolutions] = useState(initialTechSolutions);
  const [techSolutionForm, setTechSolutionForm] = useState({ title: '', description: '' });
  const [techSolutionsSaved, setTechSolutionsSaved] = useState(false);
  const [techSolutionDialogOpen, setTechSolutionDialogOpen] = useState(false);
  const [editingTechSolutionId, setEditingTechSolutionId] = useState(null);

  const [expertise, setExpertise] = useState(initialExpertise);
  const [expertiseForm, setExpertiseForm] = useState({ title: '', description: '', image: '' });
  const [expertiseSaved, setExpertiseSaved] = useState(false);
  const [expertiseDialogOpen, setExpertiseDialogOpen] = useState(false);
  const [editingExpertiseId, setEditingExpertiseId] = useState(null);

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

    const reader = new FileReader();
    reader.onload = () => {
      setBannerForm((prev) => ({ ...prev, image: reader.result, images: [] }));
    };
    reader.readAsDataURL(files[0]);
  };

  const handleBannerTypeChange = (event) => {
    const nextType = event.target.value;
    const nextImages =
      nextType === 'home' ? (bannerForm.images.length ? bannerForm.images : bannerForm.image ? [bannerForm.image] : []) : [];
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
    }

    closeProcessDialog();
  };

  const handleDeleteProcess = (id) => {
    setProcessList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOurSliderImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setOurServices((prev) => ({ ...prev, sliderImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleOurServicesHeroChange = (field, value) => {
    setOurServicesHeroForm((prev) => ({ ...prev, [field]: value }));
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

  const handleOurServiceImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setOurServiceForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleOurHeaderSave = () => {
    setOurServices((prev) => ({ ...prev }));
    setOurHeaderSaved(true);
    setTimeout(() => setOurHeaderSaved(false), 2000);
  };

  const handleAddOurService = () => {
    if (!ourServiceForm.title.trim() || !ourServiceForm.image) return;
    const newItem = { ...ourServiceForm, id: `os-${Date.now()}` };
    setOurServices((prev) => ({ ...prev, services: [newItem, ...prev.services] }));
    setOurServiceForm({ title: '', subtitle: '', image: '' });
    if (ourServiceFileInputRef.current) {
      ourServiceFileInputRef.current.value = '';
    }
  };

  const handleDeleteOurService = (id) => {
    setOurServices((prev) => ({
      ...prev,
      services: prev.services.filter((item) => item.id !== id),
    }));
  };

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
    }

    closeIndustryDialog();
  };

  const handleDeleteIndustry = (id) => {
    setIndustries((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
    if (editingIndustryId === id) {
      closeIndustryDialog();
    }
  };

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
    }

    closeTechSolutionDialog();
  };

  const handleDeleteTechSolution = (id) => {
    setTechSolutions((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((item) => item.id !== id),
    }));
  };

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
    }

    closeExpertiseDialog();
  };

  const handleDeleteExpertise = (id) => {
    setExpertise((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
    if (editingExpertiseId === id) {
      closeExpertiseDialog();
    }
  };

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

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
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

      {activeTab === 'banner' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Dashboard banner"
            subheader="Set the hero banner title and artwork for the dashboard."
          />
          <Divider />
          <CardContent>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'flex-start' }}>
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
                  onChange={(event) => setBannerForm((prev) => ({ ...prev, title: event.target.value }))}
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
                {banners.map((item) => (
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
                          sx={{ width: 140, height: 60, borderRadius: 1, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
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
                          <IconButton color="error" size="small" onClick={() => handleDeleteBanner(item.id)}>
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
          </CardContent>
        </Card>
      )}

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
                {processList.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell width={120}>
                      {item.image ? (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.title || 'Process preview'}
                          sx={{ width: 88, height: 56, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
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
                          <IconButton color="error" size="small" onClick={() => handleDeleteProcess(item.id)}>
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
          </CardContent>
        </Card>
      )}

      {activeTab === 'our-services' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Our services"
            subheader="Manage slider title/description and the list of showcased services."
          />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <Box
                component="form"
                onSubmit={handleOurServicesHeroSave}
                sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Slider title"
                      value={ourServicesHeroForm.sliderTitle}
                      onChange={(event) => handleOurServicesHeroChange('sliderTitle', event.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Slider description"
                      value={ourServicesHeroForm.sliderDescription}
                      onChange={(event) => handleOurServicesHeroChange('sliderDescription', event.target.value)}
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
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Save slider content
                </Button>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box>
                  <Typography variant="h6">Service cards</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add the services that appear in the carousel with titles and images.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openOurServiceCreateDialog}
                  sx={{ mt: { xs: 1, sm: 0 } }}
                >
                  Add service card
                </Button>
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ourServices.services
                      .slice((ourServicePage - 1) * rowsPerPage, ourServicePage * rowsPerPage)
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
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary" onClick={() => openOurServiceEditDialog(item)}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => openOurServiceDeleteDialog(item)}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    {ourServices.services.length === 0 && (
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
                  count={Math.max(1, Math.ceil(ourServices.services.length / rowsPerPage))}
                  page={ourServicePage}
                  onChange={(event, page) => setOurServicePage(page)}
                  color="primary"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeTab === 'industries' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Industries we serve"
            subheader="Set the headline and list of industries with descriptions."
          />
          <Divider />
          <CardContent>
            <Stack spacing={2} mb={3} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
              <TextField
                label="Title"
                value={industries.title}
                onChange={(event) => setIndustries((prev) => ({ ...prev, title: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Description"
                value={industries.description}
                onChange={(event) => setIndustries((prev) => ({ ...prev, description: event.target.value }))}
                fullWidth
              />
              <Button variant="contained" onClick={handleIndustrySave}>
                Save header
              </Button>
              {industrySaved && (
                <Typography variant="body2" color="success.main">
                  Saved
                </Typography>
              )}
            </Stack>

            <Stack direction="row" justifyContent="flex-end" mb={1}>
              <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => openIndustryDialog()}>
                Add industry
              </Button>
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
                {industries.items.map((item) => (
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
                          sx={{ width: 96, height: 56, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
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
                        <IconButton color="error" size="small" onClick={() => handleDeleteIndustry(item.id)}>
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
            <Stack spacing={2} mb={3} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
              <TextField
                label="Title"
                value={techSolutions.title}
                onChange={(event) => setTechSolutions((prev) => ({ ...prev, title: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Description"
                value={techSolutions.description}
                onChange={(event) => setTechSolutions((prev) => ({ ...prev, description: event.target.value }))}
                fullWidth
              />
              <Button variant="contained" onClick={handleTechSolutionsSave}>
                Save header
              </Button>
              {techSolutionsSaved && (
                <Typography variant="body2" color="success.main">
                  Saved
                </Typography>
              )}
            </Stack>

            <Stack direction="row" justifyContent="flex-end" mb={1}>
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
                {techSolutions.solutions.map((item) => (
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
                        <IconButton color="error" size="small" onClick={() => handleDeleteTechSolution(item.id)}>
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
          </CardContent>
        </Card>
      )}

      {activeTab === 'expertise' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Ways to choose our expertise"
            subheader="Manage collaboration models and proof points."
          />
          <Divider />
          <CardContent>
            <Stack spacing={2} mb={3} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
              <TextField
                label="Title"
                value={expertise.title}
                onChange={(event) => setExpertise((prev) => ({ ...prev, title: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Description"
                value={expertise.description}
                onChange={(event) => setExpertise((prev) => ({ ...prev, description: event.target.value }))}
                fullWidth
              />
              <Button variant="contained" onClick={handleExpertiseSave}>
                Save header
              </Button>
              {expertiseSaved && (
                <Typography variant="body2" color="success.main">
                  Saved
                </Typography>
              )}
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" color="text.secondary">
                Add industry-style expertise options with title, description, and imagery.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => openExpertiseDialog()}
              >
                Add industry
              </Button>
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
                {expertise.items.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell width={120}>
                      {item.image ? (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.title || 'Expertise preview'}
                          sx={{ width: 88, height: 56, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
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
                        <IconButton color="error" size="small" onClick={() => handleDeleteExpertise(item.id)}>
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
          </CardContent>
        </Card>
      )}
      </Stack>

      <Dialog open={industryDialogOpen} onClose={closeIndustryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingIndustryId ? 'Edit industry' : 'Add industry'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Industry title"
              required
              value={industryForm.title}
              onChange={(event) => setIndustryForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={industryForm.description}
              onChange={(event) => setIndustryForm((prev) => ({ ...prev, description: event.target.value }))}
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

      <Dialog open={techSolutionDialogOpen} onClose={closeTechSolutionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTechSolutionId ? 'Edit solution' : 'Add solution'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Solution title"
              required
              value={techSolutionForm.title}
              onChange={(event) => setTechSolutionForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={techSolutionForm.description}
              onChange={(event) => setTechSolutionForm((prev) => ({ ...prev, description: event.target.value }))}
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

      <Dialog open={expertiseDialogOpen} onClose={closeExpertiseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingExpertiseId ? 'Edit industry' : 'Add industry'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              required
              value={expertiseForm.title}
              onChange={(event) => setExpertiseForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={expertiseForm.description}
              onChange={(event) => setExpertiseForm((prev) => ({ ...prev, description: event.target.value }))}
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
              <Button variant="outlined" onClick={() => expertiseFileInputRef.current?.click()} fullWidth>
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

      <Dialog open={processDialogOpen} onClose={closeProcessDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProcessId ? 'Edit process step' : 'Add process step'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              required
              value={processForm.title}
              onChange={(event) => setProcessForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={processForm.description}
              onChange={(event) => setProcessForm((prev) => ({ ...prev, description: event.target.value }))}
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
              <Button variant="outlined" onClick={() => processFileInputRef.current?.click()} fullWidth>
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
