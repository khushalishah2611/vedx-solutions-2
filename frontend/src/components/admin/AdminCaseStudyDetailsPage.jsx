import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
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
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { apiUrl } from '../../utils/const.js';
import { fileToDataUrl } from '../../utils/files.js';

const DEFAULT_DETAIL = {
  projectOverview: { title: '', subtitle: '', description: '', image: '' },
  approaches: [],
  solutions: [],
  technologies: [],
  features: [],
  screenshots: [],
};

const emptyApproach = { title: '', subtitle: '', approachType: '', image: '' };
const emptySolution = { title: '', subtitle: '', tagsInput: '' };
const emptyTechnology = { title: '', image: '' };
const emptyFeature = { title: '' };
const emptyScreenshot = { title: '', subtitle: '', image: '' };
const trimValue = (value) => (typeof value === 'string' ? value.trim() : String(value ?? '').trim());

const ITEMS_PER_PAGE = 5;

const TabPanel = ({ children, value, index }) => {
  if (value !== index) return null;
  return (
    <Box role="tabpanel" aria-labelledby={`tab-${index}`} sx={{ pt: 3 }}>
      {children}
    </Box>
  );
};

const ImageUpload = ({ label, value, onChange }) => {
  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onChange?.(dataUrl);
  };

  return (
    <Stack spacing={1} alignItems="flex-start">
      <Button component="label" variant="outlined">
        {value ? `Change ${label}` : `Upload ${label}`}
        <input type="file" hidden accept="image/*" onChange={handleChange} />
      </Button>
      {value && (
        <Box
          component="img"
          src={value}
          alt={label}
          sx={{ width: '100%', maxWidth: 360, borderRadius: 2, objectFit: 'cover' }}
        />
      )}
      {value && (
        <Button color="secondary" size="small" onClick={() => onChange?.('')}>
          Remove {label}
        </Button>
      )}
    </Stack>
  );
};

const paginate = (items, page) => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

const AdminCaseStudyDetailsPage = () => {
  const { caseStudyId } = useParams();
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('adminToken'), []);

  const [activeTab, setActiveTab] = useState(0);
  const [caseStudy, setCaseStudy] = useState(null);
  const [detail, setDetail] = useState(DEFAULT_DETAIL);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [approachForm, setApproachForm] = useState(emptyApproach);
  const [approachEditIndex, setApproachEditIndex] = useState(-1);
  const [approachPage, setApproachPage] = useState(1);

  const [solutionForm, setSolutionForm] = useState(emptySolution);
  const [solutionEditIndex, setSolutionEditIndex] = useState(-1);
  const [solutionPage, setSolutionPage] = useState(1);

  const [technologyForm, setTechnologyForm] = useState(emptyTechnology);
  const [technologyEditIndex, setTechnologyEditIndex] = useState(-1);
  const [technologyPage, setTechnologyPage] = useState(1);

  const [featureForm, setFeatureForm] = useState(emptyFeature);
  const [featureEditIndex, setFeatureEditIndex] = useState(-1);
  const [featurePage, setFeaturePage] = useState(1);

  const [screenshotForm, setScreenshotForm] = useState(emptyScreenshot);
  const [screenshotEditIndex, setScreenshotEditIndex] = useState(-1);
  const [screenshotPage, setScreenshotPage] = useState(1);

  const resetPagination = () => {
    setApproachPage(1);
    setSolutionPage(1);
    setTechnologyPage(1);
    setFeaturePage(1);
    setScreenshotPage(1);
  };

  useEffect(() => {
    const totalApproachPages = Math.max(1, Math.ceil(detail.approaches.length / ITEMS_PER_PAGE) || 1);
    setApproachPage((prev) => Math.min(prev, totalApproachPages));
  }, [detail.approaches]);

  useEffect(() => {
    const totalSolutionPages = Math.max(1, Math.ceil(detail.solutions.length / ITEMS_PER_PAGE) || 1);
    setSolutionPage((prev) => Math.min(prev, totalSolutionPages));
  }, [detail.solutions]);

  useEffect(() => {
    const totalTechPages = Math.max(1, Math.ceil(detail.technologies.length / ITEMS_PER_PAGE) || 1);
    setTechnologyPage((prev) => Math.min(prev, totalTechPages));
  }, [detail.technologies]);

  useEffect(() => {
    const totalFeaturePages = Math.max(1, Math.ceil(detail.features.length / ITEMS_PER_PAGE) || 1);
    setFeaturePage((prev) => Math.min(prev, totalFeaturePages));
  }, [detail.features]);

  useEffect(() => {
    const totalScreenshotPages = Math.max(1, Math.ceil(detail.screenshots.length / ITEMS_PER_PAGE) || 1);
    setScreenshotPage((prev) => Math.min(prev, totalScreenshotPages));
  }, [detail.screenshots]);

  const normalizeListItem = (item) => ({
    title: item.title || '',
    subtitle: item.subtitle || '',
    image: item.image || '',
    id: item.id,
    approachType: item.approachType || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
  });

  const toCommaString = (values = []) => values.join(', ');

  const buildDetailState = (caseStudyData, incomingDetail = {}) => ({
    projectOverview: {
      title: incomingDetail.projectOverview?.title || caseStudyData?.title || '',
      subtitle: incomingDetail.projectOverview?.subtitle || caseStudyData?.subtitle || '',
      description: incomingDetail.projectOverview?.description || caseStudyData?.description || '',
      image: incomingDetail.projectOverview?.image || '',
    },
    approaches: Array.isArray(incomingDetail.approaches)
      ? incomingDetail.approaches.map(normalizeListItem)
      : [],
    solutions: Array.isArray(incomingDetail.solutions)
      ? incomingDetail.solutions.map((item) => ({
        title: item.title || '',
        subtitle: item.subtitle || '',
        tags: Array.isArray(item.tags) ? item.tags : [],
        id: item.id,
      }))
      : [],
    technologies: Array.isArray(incomingDetail.technologies)
      ? incomingDetail.technologies.map(normalizeListItem)
      : [],
    features: Array.isArray(incomingDetail.features)
      ? incomingDetail.features.map((item) => ({ title: item.title || '', id: item.id }))
      : [],
    screenshots: Array.isArray(incomingDetail.screenshots)
      ? incomingDetail.screenshots.map(normalizeListItem)
      : [],
  });

  const loadDetail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/case-studies/${caseStudyId}/details`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load case study detail.');

      setCaseStudy(payload.caseStudy);

      const incomingDetail = payload.detail || {};
      setDetail(buildDetailState(payload.caseStudy, incomingDetail));

      resetPagination();
    } catch (err) {
      console.error('Load detail failed', err);
      setError(err?.message || 'Unable to load case study detail right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [caseStudyId]);

  const updateList = (key, newItem, editIndex) => {
    setDetail((prev) => {
      const updatedList = [...prev[key]];
      if (Number.isInteger(editIndex) && editIndex >= 0) {
        updatedList[editIndex] = newItem;
      } else {
        updatedList.unshift(newItem);
      }
      return { ...prev, [key]: updatedList };
    });
  };

  const removeFromList = (key, index) => {
    setDetail((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, idx) => idx !== index),
    }));
  };

  const resetForms = () => {
    setApproachForm(emptyApproach);
    setApproachEditIndex(-1);
    setSolutionForm(emptySolution);
    setSolutionEditIndex(-1);
    setTechnologyForm(emptyTechnology);
    setTechnologyEditIndex(-1);
    setFeatureForm(emptyFeature);
    setFeatureEditIndex(-1);
    setScreenshotForm(emptyScreenshot);
    setScreenshotEditIndex(-1);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const trimmedOverviewTitle = trimValue(detail.projectOverview.title);
    if (!trimmedOverviewTitle) {
      setSaving(false);
      setError('Project overview title is required.');
      return;
    }

    const payload = {
      projectOverview: {
        title: trimmedOverviewTitle,
        subtitle: trimValue(detail.projectOverview.subtitle),
        description: trimValue(detail.projectOverview.description),
        image: trimValue(detail.projectOverview.image),
      },
      approaches: detail.approaches
        .map((item) => ({
          title: trimValue(item.title),
          subtitle: trimValue(item.subtitle),
          approachType: trimValue(item.approachType),
          image: trimValue(item.image),
        }))
        .filter((item) => item.title || item.subtitle || item.approachType || item.image),
      solutions: detail.solutions
        .map((item) => ({
          title: trimValue(item.title),
          subtitle: trimValue(item.subtitle),
          tags: (item.tags || []).map((tag) => trimValue(tag)).filter(Boolean),
        }))
        .filter((item) => item.title || item.subtitle || item.tags.length),
      technologies: detail.technologies
        .map((item) => ({
          title: trimValue(item.title),
          image: trimValue(item.image),
        }))
        .filter((item) => item.title || item.image),
      features: detail.features
        .map((item) => ({ title: trimValue(item.title) }))
        .filter((item) => item.title),
      screenshots: detail.screenshots
        .map((item) => ({
          title: trimValue(item.title),
          subtitle: trimValue(item.subtitle),
          image: trimValue(item.image),
        }))
        .filter((item) => item.title || item.subtitle || item.image),
    };

    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/case-studies/${caseStudyId}/details`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Unable to save detail.');

      setCaseStudy((prev) => data.caseStudy || prev);
      setDetail(buildDetailState(data.caseStudy || caseStudy, data.detail || payload));

      setSuccess(data?.message || 'Case study detail saved successfully.');
      resetForms();
      resetPagination();
    } catch (err) {
      console.error('Save detail failed', err);
      setError(err?.message || 'Unable to save case study detail right now.');
    } finally {
      setSaving(false);
    }
  };

  const handleApproachSave = () => {
    if (!(approachForm.title || approachForm.subtitle || approachForm.approachType || approachForm.image)) return;
    updateList('approaches', { ...approachForm }, approachEditIndex);
    setApproachForm(emptyApproach);
    setApproachEditIndex(-1);
    setApproachPage(1);
  };

  const handleSolutionSave = () => {
    if (!(solutionForm.title || solutionForm.subtitle || solutionForm.tagsInput)) return;
    const tags = solutionForm.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    updateList(
      'solutions',
      {
        title: solutionForm.title,
        subtitle: solutionForm.subtitle,
        tags,
      },
      solutionEditIndex,
    );
    setSolutionForm(emptySolution);
    setSolutionEditIndex(-1);
    setSolutionPage(1);
  };

  const handleTechnologySave = () => {
    if (!(technologyForm.title || technologyForm.image)) return;
    updateList('technologies', { ...technologyForm }, technologyEditIndex);
    setTechnologyForm(emptyTechnology);
    setTechnologyEditIndex(-1);
    setTechnologyPage(1);
  };

  const handleFeatureSave = () => {
    if (!featureForm.title) return;
    updateList('features', { ...featureForm }, featureEditIndex);
    setFeatureForm(emptyFeature);
    setFeatureEditIndex(-1);
    setFeaturePage(1);
  };

  const handleScreenshotSave = () => {
    if (!(screenshotForm.title || screenshotForm.subtitle || screenshotForm.image)) return;
    updateList('screenshots', { ...screenshotForm }, screenshotEditIndex);
    setScreenshotForm(emptyScreenshot);
    setScreenshotEditIndex(-1);
    setScreenshotPage(1);
  };

  const renderListSection = (title, description, columns, rows, onEdit, onDelete, page, onPageChange) => {
    const totalPages = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE) || 1);
    const data = paginate(rows, page);

    return (
      <Card>
        <CardHeader title={title} subheader={description} />
        <CardContent>
          {rows.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No records added yet.
            </Typography>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column}>{column}</TableCell>
                      ))}
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => {
                      const actualIndex = (page - 1) * ITEMS_PER_PAGE + index;
                      return (
                        <TableRow key={actualIndex} hover>
                          {columns.map((column) => (
                            <TableCell key={`${column}-${actualIndex}`}>
                              {Array.isArray(row[column]) ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                  {row[column].map((value, idx) => (
                                    <Chip key={idx} size="small" label={value} />
                                  ))}
                                </Stack>
                              ) : column.toLowerCase().includes('image') ? (
                                row[column] ? (
                                  <Box
                                    component="img"
                                    src={row[column]}
                                    alt={row.title || row.subtitle || 'Preview'}
                                    sx={{ width: 64, height: 48, borderRadius: 1, objectFit: 'cover' }}
                                  />
                                ) : (
                                  '—'
                                )
                              ) : (
                                row[column] || '—'
                              )}
                            </TableCell>
                          ))}
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => onEdit(actualIndex)}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => onDelete(actualIndex)}>
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {rows.length > ITEMS_PER_PAGE && (
                <Stack direction="row" justifyContent="center" mt={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => onPageChange(value)}
                    shape="rounded"
                    color="primary"
                  />
                </Stack>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} mb={3}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/case-studies')}>
            Back
          </Button>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Admin Case Study Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage project overview, approach, solution, technologies, features, screenshots, and list content.
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Details'}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                {caseStudy?.slug || 'Case Study'}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {caseStudy?.title || 'Case study details'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {caseStudy?.subtitle || 'Update the supporting details for this case study.'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onChange={(_event, value) => setActiveTab(value)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        <Tab label="Project Overview" id="tab-0" />
        <Tab label="Our Approach" id="tab-1" />
        <Tab label="Our Solution" id="tab-2" />
        <Tab label="Technologies We Support" id="tab-3" />
        <Tab label="Features" id="tab-4" />
        <Tab label="Application Screenshots" id="tab-5" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardHeader title="Project Overview" subheader="Update the hero image, title, subtitle, and description." />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    value={detail.projectOverview.title}
                    onChange={(e) =>
                      setDetail((prev) => ({
                        ...prev,
                        projectOverview: { ...prev.projectOverview, title: e.target.value },
                      }))
                    }
                    required
                    fullWidth
                  />
                  <TextField
                    label="Subtitle"
                    value={detail.projectOverview.subtitle}
                    onChange={(e) =>
                      setDetail((prev) => ({
                        ...prev,
                        projectOverview: { ...prev.projectOverview, subtitle: e.target.value },
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    value={detail.projectOverview.description}
                    onChange={(e) =>
                      setDetail((prev) => ({
                        ...prev,
                        projectOverview: { ...prev.projectOverview, description: e.target.value },
                      }))
                    }
                    multiline
                    minRows={4}
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <ImageUpload
                  label="Project Image"
                  value={detail.projectOverview.image}
                  onChange={(value) =>
                    setDetail((prev) => ({
                      ...prev,
                      projectOverview: { ...prev.projectOverview, image: value },
                    }))
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={approachEditIndex >= 0 ? 'Edit Approach' : 'Add Approach'} />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    value={approachForm.title}
                    onChange={(e) => setApproachForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Subtitle"
                    value={approachForm.subtitle}
                    onChange={(e) => setApproachForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Approach Type"
                    value={approachForm.approachType}
                    onChange={(e) => setApproachForm((prev) => ({ ...prev, approachType: e.target.value }))}
                    helperText="Use comma-separated values for multiple approach types."
                    fullWidth
                  />
                  <ImageUpload
                    label="Approach Image"
                    value={approachForm.image}
                    onChange={(value) => setApproachForm((prev) => ({ ...prev, image: value }))}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleApproachSave}>
                      {approachEditIndex >= 0 ? 'Update' : 'Add Approach'}
                    </Button>
                    {approachEditIndex >= 0 && (
                      <Button variant="text" onClick={() => setApproachEditIndex(-1)}>
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            {renderListSection(
              'Approach List',
              'Manage approach cards with title, subtitle, image, and approach type.',
              ['title', 'subtitle', 'approachType', 'image'],
              detail.approaches,
              (index) => {
                const current = detail.approaches[index];
                setApproachForm({ ...current });
                setApproachEditIndex(index);
                setActiveTab(1);
              },
              (index) => removeFromList('approaches', index),
              approachPage,
              setApproachPage,
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={solutionEditIndex >= 0 ? 'Edit Solution' : 'Add Solution'} />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    value={solutionForm.title}
                    onChange={(e) => setSolutionForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Subtitle"
                    value={solutionForm.subtitle}
                    onChange={(e) => setSolutionForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Tags"
                    value={solutionForm.tagsInput}
                    onChange={(e) => setSolutionForm((prev) => ({ ...prev, tagsInput: e.target.value }))}
                    helperText="Enter comma-separated tags (e.g., mobile app, fintech)."
                    fullWidth
                  />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleSolutionSave}>
                      {solutionEditIndex >= 0 ? 'Update' : 'Add Solution'}
                    </Button>
                    {solutionEditIndex >= 0 && (
                      <Button variant="text" onClick={() => setSolutionEditIndex(-1)}>
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            {renderListSection(
              'Solution List',
              'Title, subtitle, and comma-separated tags.',
              ['title', 'subtitle', 'tags'],
              detail.solutions,
              (index) => {
                const current = detail.solutions[index];
                setSolutionForm({
                  title: current.title,
                  subtitle: current.subtitle,
                  tagsInput: toCommaString(current.tags),
                });
                setSolutionEditIndex(index);
                setActiveTab(2);
              },
              (index) => removeFromList('solutions', index),
              solutionPage,
              setSolutionPage,
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={technologyEditIndex >= 0 ? 'Edit Technology' : 'Add Technology'} />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    value={technologyForm.title}
                    onChange={(e) => setTechnologyForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <ImageUpload
                    label="Technology Image"
                    value={technologyForm.image}
                    onChange={(value) => setTechnologyForm((prev) => ({ ...prev, image: value }))}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleTechnologySave}>
                      {technologyEditIndex >= 0 ? 'Update' : 'Add Technology'}
                    </Button>
                    {technologyEditIndex >= 0 && (
                      <Button variant="text" onClick={() => setTechnologyEditIndex(-1)}>
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            {renderListSection(
              'Technologies We Support',
              'Add technology cards with titles and supporting imagery.',
              ['title', 'image'],
              detail.technologies,
              (index) => {
                const current = detail.technologies[index];
                setTechnologyForm({ ...current });
                setTechnologyEditIndex(index);
                setActiveTab(3);
              },
              (index) => removeFromList('technologies', index),
              technologyPage,
              setTechnologyPage,
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={featureEditIndex >= 0 ? 'Edit Feature' : 'Add Feature'} />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    value={featureForm.title}
                    onChange={(e) => setFeatureForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleFeatureSave}>
                      {featureEditIndex >= 0 ? 'Update' : 'Add Feature'}
                    </Button>
                    {featureEditIndex >= 0 && (
                      <Button variant="text" onClick={() => setFeatureEditIndex(-1)}>
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            {renderListSection(
              'Feature List',
              'Capture feature highlights with simple titles.',
              ['title'],
              detail.features,
              (index) => {
                const current = detail.features[index];
                setFeatureForm({ ...current });
                setFeatureEditIndex(index);
                setActiveTab(4);
              },
              (index) => removeFromList('features', index),
              featurePage,
              setFeaturePage,
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={screenshotEditIndex >= 0 ? 'Edit Screenshot' : 'Add Screenshot'} />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    value={screenshotForm.title}
                    onChange={(e) => setScreenshotForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Subtitle"
                    value={screenshotForm.subtitle}
                    onChange={(e) => setScreenshotForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                    fullWidth
                  />
                  <ImageUpload
                    label="Screenshot Image"
                    value={screenshotForm.image}
                    onChange={(value) => setScreenshotForm((prev) => ({ ...prev, image: value }))}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleScreenshotSave}>
                      {screenshotEditIndex >= 0 ? 'Update' : 'Add Screenshot'}
                    </Button>
                    {screenshotEditIndex >= 0 && (
                      <Button variant="text" onClick={() => setScreenshotEditIndex(-1)}>
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            {renderListSection(
              'Application Screenshots',
              'Add gallery screenshots with titles and subtitles.',
              ['title', 'subtitle', 'image'],
              detail.screenshots,
              (index) => {
                const current = detail.screenshots[index];
                setScreenshotForm({ ...current });
                setScreenshotEditIndex(index);
                setActiveTab(5);
              },
              (index) => removeFromList('screenshots', index),
              screenshotPage,
              setScreenshotPage,
            )}
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default AdminCaseStudyDetailsPage;
