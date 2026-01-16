import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
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
  Tooltip,
  Typography,
} from '@mui/material';
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
  problemConfig: { title: '', description: '', image: '' },
  solutionConfig: { title: '', description: '', image: '' },
  appConfig: { title: '', description: '', image: '' },
  problems: [],
  solutions: [],
  features: [],
  developmentChallenges: [],
  apps: [],
  impacts: [],
  teamMembers: [],
  timelines: [],
};

const emptyProblem = { title: '', description: '' };
const emptySolution = { title: '', description: '', image: '' };
const emptyFeature = { title: '', description: '', image: '' };
const emptyChallenge = {
  title: '',
  image: '',
  solutionTitle: '',
  solutionSubtitle: '',
  solutionDescription: '',
};
const emptyApp = { title: '', description: '', images: [] };
const emptyImpact = { title: '', image: '' };
const emptyTeamMember = { title: '' };
const emptyTimeline = { title: '', description: '' };
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

const MultiImageUpload = ({ label, values, onChange }) => {
  const handleChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const dataUrls = await Promise.all(files.map((file) => fileToDataUrl(file)));
    onChange?.([...(values || []), ...dataUrls]);
  };

  const handleRemove = (index) => {
    const next = (values || []).filter((_, idx) => idx !== index);
    onChange?.(next);
  };

  return (
    <Stack spacing={1} alignItems="flex-start">
      <AppButton component="label" variant="outlined">
        {values?.length ? `Add ${label}` : `Upload ${label}`}
        <input type="file" hidden accept="image/*" multiple onChange={handleChange} />
      </AppButton>
      {values?.length ? (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {values.map((src, index) => (
            <Stack key={`${src}-${index}`} spacing={1} alignItems="center">
              <Box
                component="img"
                src={src}
                alt={`${label} ${index + 1}`}
                sx={{ width: 110, height: 80, borderRadius: 1, objectFit: 'cover' }}
              />
              <AppButton size="small" color="secondary" onClick={() => handleRemove(index)}>
                Remove
              </AppButton>
            </Stack>
          ))}
        </Stack>
      ) : null}
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

  const [problemForm, setProblemForm] = useState(emptyProblem);
  const [problemEditIndex, setProblemEditIndex] = useState(-1);
  const [problemPage, setProblemPage] = useState(1);

  const [solutionForm, setSolutionForm] = useState(emptySolution);
  const [solutionEditIndex, setSolutionEditIndex] = useState(-1);
  const [solutionPage, setSolutionPage] = useState(1);

  const [featureForm, setFeatureForm] = useState(emptyFeature);
  const [featureEditIndex, setFeatureEditIndex] = useState(-1);
  const [featurePage, setFeaturePage] = useState(1);

  const [challengeForm, setChallengeForm] = useState(emptyChallenge);
  const [challengeEditIndex, setChallengeEditIndex] = useState(-1);
  const [challengePage, setChallengePage] = useState(1);

  const [appForm, setAppForm] = useState(emptyApp);
  const [appEditIndex, setAppEditIndex] = useState(-1);
  const [appPage, setAppPage] = useState(1);

  const [impactForm, setImpactForm] = useState(emptyImpact);
  const [impactEditIndex, setImpactEditIndex] = useState(-1);
  const [impactPage, setImpactPage] = useState(1);

  const [teamForm, setTeamForm] = useState(emptyTeamMember);
  const [teamEditIndex, setTeamEditIndex] = useState(-1);
  const [teamPage, setTeamPage] = useState(1);

  const [timelineForm, setTimelineForm] = useState(emptyTimeline);
  const [timelineEditIndex, setTimelineEditIndex] = useState(-1);
  const [timelinePage, setTimelinePage] = useState(1);

  const resetPagination = () => {
    setProblemPage(1);
    setSolutionPage(1);
    setFeaturePage(1);
    setChallengePage(1);
    setAppPage(1);
    setImpactPage(1);
    setTeamPage(1);
    setTimelinePage(1);
  };

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(detail.problems.length / ITEMS_PER_PAGE) || 1);
    setProblemPage((prev) => Math.min(prev, totalPages));
  }, [detail.problems]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(detail.solutions.length / ITEMS_PER_PAGE) || 1);
    setSolutionPage((prev) => Math.min(prev, totalPages));
  }, [detail.solutions]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(detail.features.length / ITEMS_PER_PAGE) || 1);
    setFeaturePage((prev) => Math.min(prev, totalPages));
  }, [detail.features]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(detail.developmentChallenges.length / ITEMS_PER_PAGE) || 1);
    setChallengePage((prev) => Math.min(prev, totalPages));
  }, [detail.developmentChallenges]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(detail.apps.length / ITEMS_PER_PAGE) || 1);
    setAppPage((prev) => Math.min(prev, totalPages));
  }, [detail.apps]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(detail.impacts.length / ITEMS_PER_PAGE) || 1);
    setImpactPage((prev) => Math.min(prev, totalPages));
  }, [detail.impacts]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(detail.teamMembers.length / ITEMS_PER_PAGE) || 1);
    setTeamPage((prev) => Math.min(prev, totalPages));
  }, [detail.teamMembers]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(detail.timelines.length / ITEMS_PER_PAGE) || 1);
    setTimelinePage((prev) => Math.min(prev, totalPages));
  }, [detail.timelines]);

  const buildDetailState = (caseStudyData, incomingDetail = {}) => ({
    projectOverview: {
      title: incomingDetail.projectOverview?.title || caseStudyData?.title || '',
      subtitle: incomingDetail.projectOverview?.subtitle || caseStudyData?.subtitle || '',
      description: incomingDetail.projectOverview?.description || caseStudyData?.description || '',
      image: incomingDetail.projectOverview?.image || '',
    },
    problemConfig: {
      title: incomingDetail.problemConfig?.title || '',
      description: incomingDetail.problemConfig?.description || '',
      image: incomingDetail.problemConfig?.image || '',
    },
    solutionConfig: {
      title: incomingDetail.solutionConfig?.title || '',
      description: incomingDetail.solutionConfig?.description || '',
      image: incomingDetail.solutionConfig?.image || '',
    },
    appConfig: {
      title: incomingDetail.appConfig?.title || '',
      description: incomingDetail.appConfig?.description || '',
      image: incomingDetail.appConfig?.image || '',
    },
    problems: Array.isArray(incomingDetail.problems) ? incomingDetail.problems : [],
    solutions: Array.isArray(incomingDetail.solutions) ? incomingDetail.solutions : [],
    features: Array.isArray(incomingDetail.features) ? incomingDetail.features : [],
    developmentChallenges: Array.isArray(incomingDetail.developmentChallenges)
      ? incomingDetail.developmentChallenges
      : [],
    apps: Array.isArray(incomingDetail.apps) ? incomingDetail.apps : [],
    impacts: Array.isArray(incomingDetail.impacts) ? incomingDetail.impacts : [],
    teamMembers: Array.isArray(incomingDetail.teamMembers) ? incomingDetail.teamMembers : [],
    timelines: Array.isArray(incomingDetail.timelines) ? incomingDetail.timelines : [],
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

  const fetchSection = async (sectionKey, endpoint) => {
    if (!token) throw new Error('Your session expired. Please log in again.');
    const response = await fetch(apiUrl(endpoint), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.message || 'Unable to load case study section.');
    setDetail((prev) => ({ ...prev, [sectionKey]: payload.items || [] }));
  };

  const handleSaveOverview = async () => {
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
    } catch (err) {
      console.error('Save detail failed', err);
      setError(err?.message || 'Unable to save case study detail right now.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSectionConfig = async (sectionKey, payloadKey, label) => {
    setSaving(true);
    setError('');
    setSuccess('');

    const config = detail[sectionKey] || {};
    const title = trimValue(config.title);
    if (!title) {
      setSaving(false);
      setError(`${label} title is required.`);
      return;
    }

    const payload = {
      [payloadKey]: {
        title,
        description: trimValue(config.description),
        image: trimValue(config.image),
      },
    };

    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/case-studies/${caseStudyId}/section-configs`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Unable to save section config.');

      setCaseStudy((prev) => data.caseStudy || prev);
      setDetail(buildDetailState(data.caseStudy || caseStudy, data.detail || detail));

      setSuccess(data?.message || 'Section config saved successfully.');
    } catch (err) {
      console.error('Save section config failed', err);
      setError(err?.message || 'Unable to save section config right now.');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionSave = async ({
    form,
    editIndex,
    list,
    endpointBase,
    sectionKey,
    resetForm,
  }) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const isEdit = Number.isInteger(editIndex) && editIndex >= 0;
      const targetId = isEdit ? list[editIndex]?.id : null;
      const endpoint = isEdit
        ? `/api/admin/case-studies/${caseStudyId}/${endpointBase}/${targetId}`
        : `/api/admin/case-studies/${caseStudyId}/${endpointBase}`;

      const response = await fetch(apiUrl(endpoint), {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Unable to save section item.');

      await fetchSection(sectionKey, `/api/admin/case-studies/${caseStudyId}/${endpointBase}`);
      resetForm();
      setSuccess(data?.message || 'Case study item saved successfully.');
    } catch (err) {
      console.error('Save section failed', err);
      setError(err?.message || 'Unable to save case study item right now.');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionDelete = async ({ sectionKey, endpointBase, itemId }) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/case-studies/${caseStudyId}/${endpointBase}/${itemId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Unable to delete item.');

      await fetchSection(sectionKey, `/api/admin/case-studies/${caseStudyId}/${endpointBase}`);
      setSuccess(data?.message || 'Item deleted.');
    } catch (err) {
      console.error('Delete section failed', err);
      setError(err?.message || 'Unable to delete case study item right now.');
    } finally {
      setSaving(false);
    }
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
                        <TableCell key={column.key}>{column.label}</TableCell>
                      ))}
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => {
                      const actualIndex = (page - 1) * ITEMS_PER_PAGE + index;
                      return (
                        <TableRow key={actualIndex} hover>
                          {columns.map((column) => {
                            const value = row[column.key];
                            if (column.type === 'image') {
                              return (
                                <TableCell key={`${column.key}-${actualIndex}`}>
                                  {value ? (
                                    <Box
                                      component="img"
                                      src={value}
                                      alt={row.title || row.subtitle || 'Preview'}
                                      sx={{ width: 64, height: 48, borderRadius: 1, objectFit: 'cover' }}
                                    />
                                  ) : (
                                    '—'
                                  )}
                                </TableCell>
                              );
                            }
                            if (column.type === 'images') {
                              return (
                                <TableCell key={`${column.key}-${actualIndex}`}>
                                  {Array.isArray(value) && value.length ? (
                                    <Chip size="small" label={`${value.length} images`} />
                                  ) : (
                                    '—'
                                  )}
                                </TableCell>
                              );
                            }
                            if (column.type === 'longtext') {
                              const text = typeof value === 'string' ? value : '';
                              const trimmed = text.length > 90 ? `${text.slice(0, 90)}…` : text;
                              return (
                                <TableCell key={`${column.key}-${actualIndex}`}>
                                  {trimmed || '—'}
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={`${column.key}-${actualIndex}`}>
                                {value || '—'}
                              </TableCell>
                            );
                          })}
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
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
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
              Manage project overview and tab-wise content blocks for this case study.
            </Typography>
          </Box>
        </Stack>
        <AppButton
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSaveOverview}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Overview'}
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
        <Tab label="Problems" id="tab-1" />
        <Tab label="Our Solutions" id="tab-2" />
        <Tab label="Features" id="tab-3" />
        <Tab label="Development Challenges" id="tab-4" />
        <Tab label="Impact" id="tab-5" />
        <Tab label="Our App" id="tab-6" />
        <Tab label="Team Members" id="tab-7" />
        <Tab label="Timeline" id="tab-8" />
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
        <Stack spacing={2}>
          <Card>
            <CardHeader title="Problem Section Header" subheader="Set the hero title, description, and image." />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Stack spacing={2}>
                    <AppTextField
                      label="Title"
                      value={detail.problemConfig.title}
                      onChange={(e) =>
                        setDetail((prev) => ({
                          ...prev,
                          problemConfig: { ...prev.problemConfig, title: e.target.value },
                        }))
                      }
                      fullWidth
                      required
                    />
                    <AppTextField
                      label="Description"
                      value={detail.problemConfig.description}
                      onChange={(e) =>
                        setDetail((prev) => ({
                          ...prev,
                          problemConfig: { ...prev.problemConfig, description: e.target.value },
                        }))
                      }
                      multiline
                      minRows={3}
                      fullWidth
                    />
                    <AppButton
                      variant="contained"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={() => handleSaveSectionConfig('problemConfig', 'problemConfig', 'Problem section')}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Section Header'}
                    </AppButton>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={5}>
                  <ImageUpload
                    label="Problem Section Image"
                    value={detail.problemConfig.image}
                    onChange={(value) =>
                      setDetail((prev) => ({
                        ...prev,
                        problemConfig: { ...prev.problemConfig, image: value },
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardHeader title={problemEditIndex >= 0 ? 'Edit Problem' : 'Add Problem'} />
                <CardContent>
                  <Stack spacing={2}>
                    <AppTextField
                      label="Title"
                      value={problemForm.title}
                      onChange={(e) => setProblemForm((prev) => ({ ...prev, title: e.target.value }))}
                      fullWidth
                    />
                    <AppTextField
                      label="Description"
                      value={problemForm.description}
                      onChange={(e) => setProblemForm((prev) => ({ ...prev, description: e.target.value }))}
                      multiline
                      minRows={4}
                      fullWidth
                    />
                    <Stack direction="row" spacing={1}>
                      <AppButton
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() =>
                          handleSectionSave({
                            form: problemForm,
                            editIndex: problemEditIndex,
                            list: detail.problems,
                            endpointBase: 'problems',
                            sectionKey: 'problems',
                            resetForm: () => {
                              setProblemForm(emptyProblem);
                              setProblemEditIndex(-1);
                              setProblemPage(1);
                            },
                          })
                        }
                      >
                        {problemEditIndex >= 0 ? 'Update' : 'Add Problem'}
                      </AppButton>
                      {problemEditIndex >= 0 && (
                        <AppButton variant="text" onClick={() => setProblemEditIndex(-1)}>
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
                'Problem List',
                'Capture each problem statement with long-form details.',
                [
                  { key: 'title', label: 'Title' },
                  { key: 'description', label: 'Description', type: 'longtext' },
                ],
                detail.problems,
                (index) => {
                  const current = detail.problems[index];
                  setProblemForm({ title: current.title, description: current.description });
                  setProblemEditIndex(index);
                  setActiveTab(1);
                },
                (index) =>
                  handleSectionDelete({
                    sectionKey: 'problems',
                    endpointBase: 'problems',
                    itemId: detail.problems[index]?.id,
                  }),
                problemPage,
                setProblemPage
              )}
            </Grid>
          </Grid>
        </Stack>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title="Solutions Section Header" subheader="Set the hero title, description, and image." />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Stack spacing={2}>
                    <AppTextField
                      label="Title"
                      value={detail.solutionConfig.title}
                      onChange={(e) =>
                        setDetail((prev) => ({
                          ...prev,
                          solutionConfig: { ...prev.solutionConfig, title: e.target.value },
                        }))
                      }
                      fullWidth
                      required
                    />
                    <AppTextField
                      label="Description"
                      value={detail.solutionConfig.description}
                      onChange={(e) =>
                        setDetail((prev) => ({
                          ...prev,
                          solutionConfig: { ...prev.solutionConfig, description: e.target.value },
                        }))
                      }
                      multiline
                      minRows={3}
                      fullWidth
                    />
                    <AppButton
                      variant="contained"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={() => handleSaveSectionConfig('solutionConfig', 'solutionConfig', 'Solution section')}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Section Header'}
                    </AppButton>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={5}>
                  <ImageUpload
                    label="Solution Section Image"
                    value={detail.solutionConfig.image}
                    onChange={(value) =>
                      setDetail((prev) => ({
                        ...prev,
                        solutionConfig: { ...prev.solutionConfig, image: value },
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardHeader title={solutionEditIndex >= 0 ? 'Edit Solution' : 'Add Solution'} />
                <CardContent>
                  <Stack spacing={2}>
                    <AppTextField
                      label="Title"
                      value={solutionForm.title}
                      onChange={(e) => setSolutionForm((prev) => ({ ...prev, title: e.target.value }))}
                      fullWidth
                    />
                    <AppTextField
                      label="Description"
                      value={solutionForm.description}
                      onChange={(e) => setSolutionForm((prev) => ({ ...prev, description: e.target.value }))}
                      multiline
                      minRows={4}
                      fullWidth
                    />
                    <ImageUpload
                      label="Solution Image"
                      value={solutionForm.image}
                      onChange={(value) => setSolutionForm((prev) => ({ ...prev, image: value }))}
                    />
                    <Stack direction="row" spacing={1}>
                      <AppButton
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() =>
                          handleSectionSave({
                            form: solutionForm,
                            editIndex: solutionEditIndex,
                            list: detail.solutions,
                            endpointBase: 'solutions',
                            sectionKey: 'solutions',
                            resetForm: () => {
                              setSolutionForm(emptySolution);
                              setSolutionEditIndex(-1);
                              setSolutionPage(1);
                            },
                          })
                        }
                      >
                        {solutionEditIndex >= 0 ? 'Update' : 'Add Solution'}
                      </AppButton>
                      {solutionEditIndex >= 0 && (
                        <AppButton variant="text" onClick={() => setSolutionEditIndex(-1)}>
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
                'Solution List',
                'Add solution titles with supporting long-form descriptions.',
                [
                  { key: 'title', label: 'Title' },
                  { key: 'image', label: 'Image', type: 'image' },
                  { key: 'description', label: 'Description', type: 'longtext' },
                ],
                detail.solutions,
                (index) => {
                  const current = detail.solutions[index];
                  setSolutionForm({
                    title: current.title,
                    description: current.description,
                    image: current.image,
                  });
                  setSolutionEditIndex(index);
                  setActiveTab(2);
                },
                (index) =>
                  handleSectionDelete({
                    sectionKey: 'solutions',
                    endpointBase: 'solutions',
                    itemId: detail.solutions[index]?.id,
                  }),
                solutionPage,
                setSolutionPage
              )}
            </Grid>
          </Grid>
        </Stack>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={featureEditIndex >= 0 ? 'Edit Feature' : 'Add Feature'} />
              <CardContent>
                <Stack spacing={2}>
                  <AppTextField
                    label="Title"
                    value={featureForm.title}
                    onChange={(e) => setFeatureForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <AppTextField
                    label="Description"
                    value={featureForm.description}
                    onChange={(e) => setFeatureForm((prev) => ({ ...prev, description: e.target.value }))}
                    multiline
                    minRows={4}
                    fullWidth
                  />
                  <ImageUpload
                    label="Feature Image"
                    value={featureForm.image}
                    onChange={(value) => setFeatureForm((prev) => ({ ...prev, image: value }))}
                  />
                  <Stack direction="row" spacing={1}>
                    <AppButton
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() =>
                        handleSectionSave({
                          form: featureForm,
                          editIndex: featureEditIndex,
                          list: detail.features,
                          endpointBase: 'features',
                          sectionKey: 'features',
                          resetForm: () => {
                            setFeatureForm(emptyFeature);
                            setFeatureEditIndex(-1);
                            setFeaturePage(1);
                          },
                        })
                      }
                    >
                      {featureEditIndex >= 0 ? 'Update' : 'Add Feature'}
                    </AppButton>
                    {featureEditIndex >= 0 && (
                      <AppButton variant="text" onClick={() => setFeatureEditIndex(-1)}>
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
              'Feature List',
              'Highlight key features with imagery and details.',
              [
                { key: 'title', label: 'Title' },
                { key: 'image', label: 'Image', type: 'image' },
                { key: 'description', label: 'Description', type: 'longtext' },
              ],
              detail.features,
              (index) => {
                const current = detail.features[index];
                setFeatureForm({
                  title: current.title,
                  description: current.description,
                  image: current.image,
                });
                setFeatureEditIndex(index);
                setActiveTab(3);
              },
              (index) =>
                handleSectionDelete({
                  sectionKey: 'features',
                  endpointBase: 'features',
                  itemId: detail.features[index]?.id,
                }),
              featurePage,
              setFeaturePage
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={challengeEditIndex >= 0 ? 'Edit Challenge' : 'Add Challenge'} />
              <CardContent>
                <Stack spacing={2}>
                  <AppTextField
                    label="Title"
                    value={challengeForm.title}
                    onChange={(e) => setChallengeForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <ImageUpload
                    label="Challenge Image"
                    value={challengeForm.image}
                    onChange={(value) => setChallengeForm((prev) => ({ ...prev, image: value }))}
                  />
                  <AppTextField
                    label="Solution Title"
                    value={challengeForm.solutionTitle}
                    onChange={(e) => setChallengeForm((prev) => ({ ...prev, solutionTitle: e.target.value }))}
                    fullWidth
                  />
                  <AppTextField
                    label="Solution Subtitle"
                    value={challengeForm.solutionSubtitle}
                    onChange={(e) => setChallengeForm((prev) => ({ ...prev, solutionSubtitle: e.target.value }))}
                    fullWidth
                  />
                  <AppTextField
                    label="Solution Description"
                    value={challengeForm.solutionDescription}
                    onChange={(e) => setChallengeForm((prev) => ({ ...prev, solutionDescription: e.target.value }))}
                    multiline
                    minRows={4}
                    fullWidth
                  />
                  <Stack direction="row" spacing={1}>
                    <AppButton
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() =>
                        handleSectionSave({
                          form: challengeForm,
                          editIndex: challengeEditIndex,
                          list: detail.developmentChallenges,
                          endpointBase: 'development-challenges',
                          sectionKey: 'developmentChallenges',
                          resetForm: () => {
                            setChallengeForm(emptyChallenge);
                            setChallengeEditIndex(-1);
                            setChallengePage(1);
                          },
                        })
                      }
                    >
                      {challengeEditIndex >= 0 ? 'Update' : 'Add Challenge'}
                    </AppButton>
                    {challengeEditIndex >= 0 && (
                      <AppButton variant="text" onClick={() => setChallengeEditIndex(-1)}>
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
              'Development Challenges',
              'Capture challenges and their supporting solution details.',
              [
                { key: 'title', label: 'Title' },
                { key: 'image', label: 'Image', type: 'image' },
                { key: 'solutionTitle', label: 'Solution Title' },
                { key: 'solutionSubtitle', label: 'Solution Subtitle' },
                { key: 'solutionDescription', label: 'Solution Description', type: 'longtext' },
              ],
              detail.developmentChallenges,
              (index) => {
                const current = detail.developmentChallenges[index];
                setChallengeForm({
                  title: current.title,
                  image: current.image,
                  solutionTitle: current.solutionTitle,
                  solutionSubtitle: current.solutionSubtitle,
                  solutionDescription: current.solutionDescription,
                });
                setChallengeEditIndex(index);
                setActiveTab(4);
              },
              (index) =>
                handleSectionDelete({
                  sectionKey: 'developmentChallenges',
                  endpointBase: 'development-challenges',
                  itemId: detail.developmentChallenges[index]?.id,
                }),
              challengePage,
              setChallengePage
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={impactEditIndex >= 0 ? 'Edit Impact' : 'Add Impact'} />
              <CardContent>
                <Stack spacing={2}>
                  <AppTextField
                    label="Title"
                    value={impactForm.title}
                    onChange={(e) => setImpactForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <ImageUpload
                    label="Impact Image"
                    value={impactForm.image}
                    onChange={(value) => setImpactForm((prev) => ({ ...prev, image: value }))}
                  />
                  <Stack direction="row" spacing={1}>
                    <AppButton
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() =>
                        handleSectionSave({
                          form: impactForm,
                          editIndex: impactEditIndex,
                          list: detail.impacts,
                          endpointBase: 'impacts',
                          sectionKey: 'impacts',
                          resetForm: () => {
                            setImpactForm(emptyImpact);
                            setImpactEditIndex(-1);
                            setImpactPage(1);
                          },
                        })
                      }
                    >
                      {impactEditIndex >= 0 ? 'Update' : 'Add Impact'}
                    </AppButton>
                    {impactEditIndex >= 0 && (
                      <AppButton variant="text" onClick={() => setImpactEditIndex(-1)}>
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
              'Impact List',
              'Add impact titles with supporting imagery.',
              [
                { key: 'title', label: 'Title' },
                { key: 'image', label: 'Image', type: 'image' },
              ],
              detail.impacts,
              (index) => {
                const current = detail.impacts[index];
                setImpactForm({
                  title: current.title,
                  image: current.image,
                });
                setImpactEditIndex(index);
                setActiveTab(5);
              },
              (index) =>
                handleSectionDelete({
                  sectionKey: 'impacts',
                  endpointBase: 'impacts',
                  itemId: detail.impacts[index]?.id,
                }),
              impactPage,
              setImpactPage
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={6}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title="App Section Header" subheader="Set the hero title, description, and image." />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Stack spacing={2}>
                    <AppTextField
                      label="Title"
                      value={detail.appConfig.title}
                      onChange={(e) =>
                        setDetail((prev) => ({
                          ...prev,
                          appConfig: { ...prev.appConfig, title: e.target.value },
                        }))
                      }
                      fullWidth
                      required
                    />
                    <AppTextField
                      label="Description"
                      value={detail.appConfig.description}
                      onChange={(e) =>
                        setDetail((prev) => ({
                          ...prev,
                          appConfig: { ...prev.appConfig, description: e.target.value },
                        }))
                      }
                      multiline
                      minRows={3}
                      fullWidth
                    />
                    <AppButton
                      variant="contained"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={() => handleSaveSectionConfig('appConfig', 'appConfig', 'App section')}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Section Header'}
                    </AppButton>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={5}>
                  <ImageUpload
                    label="App Section Image"
                    value={detail.appConfig.image}
                    onChange={(value) =>
                      setDetail((prev) => ({
                        ...prev,
                        appConfig: { ...prev.appConfig, image: value },
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardHeader title={appEditIndex >= 0 ? 'Edit App Entry' : 'Add App Entry'} />
                <CardContent>
                  <Stack spacing={2}>
                    <AppTextField
                      label="Title"
                      value={appForm.title}
                      onChange={(e) => setAppForm((prev) => ({ ...prev, title: e.target.value }))}
                      fullWidth
                    />
                    <AppTextField
                      label="Description"
                      value={appForm.description}
                      onChange={(e) => setAppForm((prev) => ({ ...prev, description: e.target.value }))}
                      multiline
                      minRows={4}
                      fullWidth
                    />
                    <MultiImageUpload
                      label="App Images"
                      values={appForm.images}
                      onChange={(value) => setAppForm((prev) => ({ ...prev, images: value }))}
                    />
                    <Stack direction="row" spacing={1}>
                      <AppButton
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() =>
                          handleSectionSave({
                            form: appForm,
                            editIndex: appEditIndex,
                            list: detail.apps,
                            endpointBase: 'apps',
                            sectionKey: 'apps',
                            resetForm: () => {
                              setAppForm(emptyApp);
                              setAppEditIndex(-1);
                              setAppPage(1);
                            },
                          })
                        }
                      >
                        {appEditIndex >= 0 ? 'Update' : 'Add App Entry'}
                      </AppButton>
                      {appEditIndex >= 0 && (
                        <AppButton variant="text" onClick={() => setAppEditIndex(-1)}>
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
                'Our App',
                'Store app descriptions with multiple screenshots.',
                [
                  { key: 'title', label: 'Title' },
                  { key: 'description', label: 'Description', type: 'longtext' },
                  { key: 'images', label: 'Images', type: 'images' },
                ],
                detail.apps,
                (index) => {
                  const current = detail.apps[index];
                  setAppForm({
                    title: current.title,
                    description: current.description,
                    images: Array.isArray(current.images) ? current.images : [],
                  });
                  setAppEditIndex(index);
                  setActiveTab(6);
                },
                (index) =>
                  handleSectionDelete({
                    sectionKey: 'apps',
                    endpointBase: 'apps',
                    itemId: detail.apps[index]?.id,
                  }),
                appPage,
                setAppPage
              )}
            </Grid>
          </Grid>
        </Stack>
      </TabPanel>

      <TabPanel value={activeTab} index={7}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={teamEditIndex >= 0 ? 'Edit Team Member' : 'Add Team Member'} />
              <CardContent>
                <Stack spacing={2}>
                  <AppTextField
                    label="Title"
                    value={teamForm.title}
                    onChange={(e) => setTeamForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <Stack direction="row" spacing={1}>
                    <AppButton
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() =>
                        handleSectionSave({
                          form: teamForm,
                          editIndex: teamEditIndex,
                          list: detail.teamMembers,
                          endpointBase: 'team-members',
                          sectionKey: 'teamMembers',
                          resetForm: () => {
                            setTeamForm(emptyTeamMember);
                            setTeamEditIndex(-1);
                            setTeamPage(1);
                          },
                        })
                      }
                    >
                      {teamEditIndex >= 0 ? 'Update' : 'Add Team Member'}
                    </AppButton>
                    {teamEditIndex >= 0 && (
                      <AppButton variant="text" onClick={() => setTeamEditIndex(-1)}>
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
              'Team Members',
              'Maintain the team member list titles.',
              [{ key: 'title', label: 'Title' }],
              detail.teamMembers,
              (index) => {
                const current = detail.teamMembers[index];
                setTeamForm({ title: current.title });
                setTeamEditIndex(index);
                setActiveTab(7);
              },
              (index) =>
                handleSectionDelete({
                  sectionKey: 'teamMembers',
                  endpointBase: 'team-members',
                  itemId: detail.teamMembers[index]?.id,
                }),
              teamPage,
              setTeamPage
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={8}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={timelineEditIndex >= 0 ? 'Edit Timeline' : 'Add Timeline'} />
              <CardContent>
                <Stack spacing={2}>
                  <AppTextField
                    label="Title"
                    value={timelineForm.title}
                    onChange={(e) => setTimelineForm((prev) => ({ ...prev, title: e.target.value }))}
                    fullWidth
                  />
                  <AppTextField
                    label="Description"
                    value={timelineForm.description}
                    onChange={(e) => setTimelineForm((prev) => ({ ...prev, description: e.target.value }))}
                    multiline
                    minRows={4}
                    fullWidth
                  />
                  <Stack direction="row" spacing={1}>
                    <AppButton
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() =>
                        handleSectionSave({
                          form: timelineForm,
                          editIndex: timelineEditIndex,
                          list: detail.timelines,
                          endpointBase: 'timelines',
                          sectionKey: 'timelines',
                          resetForm: () => {
                            setTimelineForm(emptyTimeline);
                            setTimelineEditIndex(-1);
                            setTimelinePage(1);
                          },
                        })
                      }
                    >
                      {timelineEditIndex >= 0 ? 'Update' : 'Add Timeline'}
                    </AppButton>
                    {timelineEditIndex >= 0 && (
                      <AppButton variant="text" onClick={() => setTimelineEditIndex(-1)}>
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
              'Timeline',
              'Add timeline milestones with description text.',
              [
                { key: 'title', label: 'Title' },
                { key: 'description', label: 'Description', type: 'longtext' },
              ],
              detail.timelines,
              (index) => {
                const current = detail.timelines[index];
                setTimelineForm({ title: current.title, description: current.description });
                setTimelineEditIndex(index);
                setActiveTab(8);
              },
              (index) =>
                handleSectionDelete({
                  sectionKey: 'timelines',
                  endpointBase: 'timelines',
                  itemId: detail.timelines[index]?.id,
                }),
              timelinePage,
              setTimelinePage
            )}
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default AdminCaseStudyDetailsPage;
