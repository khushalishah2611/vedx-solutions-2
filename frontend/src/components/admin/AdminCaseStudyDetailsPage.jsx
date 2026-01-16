import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Card, CardContent, CardHeader, Chip, CircularProgress, Divider, Grid, IconButton, Pagination, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography } from '@mui/material';
import { AppButton, AppTextField } from '../shared/FormControls.jsx';

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

const emptyTechnology = { title: '', image: '' };
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
      <AppButton component="label" variant="outlined">
        {value ? `Change ${label}` : `Upload ${label}`}
        <input type="file" hidden accept="image/*" onChange={handleChange} />
      </AppButton>
      {value && (
        <Box
          component="img"
          src={value}
          alt={label}
          sx={{ width: '100%', maxWidth: 360, borderRadius: 2, objectFit: 'cover' }}
        />
      )}
      {value && (
        <AppButton color="secondary" size="small" onClick={() => onChange?.('')}>
          Remove {label}
        </AppButton>
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

  const [technologyForm, setTechnologyForm] = useState(emptyTechnology);
  const [technologyEditIndex, setTechnologyEditIndex] = useState(-1);
  const [technologyPage, setTechnologyPage] = useState(1);

  const [screenshotForm, setScreenshotForm] = useState(emptyScreenshot);
  const [screenshotEditIndex, setScreenshotEditIndex] = useState(-1);
  const [screenshotPage, setScreenshotPage] = useState(1);

  const resetPagination = () => {
    setTechnologyPage(1);
    setScreenshotPage(1);
  };

  useEffect(() => {
    const totalTechPages = Math.max(1, Math.ceil(detail.technologies.length / ITEMS_PER_PAGE) || 1);
    setTechnologyPage((prev) => Math.min(prev, totalTechPages));
  }, [detail.technologies]);

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
    setTechnologyForm(emptyTechnology);
    setTechnologyEditIndex(-1);
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

  const handleTechnologySave = () => {
    if (!(technologyForm.title || technologyForm.image)) return;
    updateList('technologies', { ...technologyForm }, technologyEditIndex);
    setTechnologyForm(emptyTechnology);
    setTechnologyEditIndex(-1);
    setTechnologyPage(1);
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
          <AppButton startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/case-studies')}>
            Back
          </AppButton>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Admin Case Study Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage project overview, technologies, and application screenshots.
            </Typography>
          </Box>
        </Stack>
        <AppButton
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Details'}
        </AppButton>
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
        <Tab label="Technologies We Support" id="tab-1" />
        <Tab label="Application Screenshots" id="tab-2" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardHeader title="Project Overview" subheader="Update the hero image, title, subtitle, and description." />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <AppTextField
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
                  <AppTextField
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
                  <AppTextField
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
              <CardHeader title={technologyEditIndex >= 0 ? 'Edit Technology' : 'Add Technology'} />
              <CardContent>
                <Stack spacing={2}>
                  <AppTextField
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
                    <AppButton variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleTechnologySave}>
                      {technologyEditIndex >= 0 ? 'Update' : 'Add Technology'}
                    </AppButton>
                    {technologyEditIndex >= 0 && (
                      <AppButton variant="text" onClick={() => setTechnologyEditIndex(-1)}>
                        Cancel
                      </AppButton>
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
                setActiveTab(1);
              },
              (index) => removeFromList('technologies', index),
              technologyPage,
              setTechnologyPage,
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={screenshotEditIndex >= 0 ? 'Edit Screenshot' : 'Add Screenshot'} />
              <CardContent>
                <Stack spacing={2}>
                  <AppTextField
                    label="Title"
                    value={screenshotForm.title}
                    onChange={(e) => setScreenshotForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <AppTextField
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
                    <AppButton variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleScreenshotSave}>
                      {screenshotEditIndex >= 0 ? 'Update' : 'Add Screenshot'}
                    </AppButton>
                    {screenshotEditIndex >= 0 && (
                      <AppButton variant="text" onClick={() => setScreenshotEditIndex(-1)}>
                        Cancel
                      </AppButton>
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
                setActiveTab(2);
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
