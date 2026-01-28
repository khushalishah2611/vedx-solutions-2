import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Chip, Divider, Grid, FormHelperText, IconButton, MenuItem, InputAdornment, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Tab, Tabs } from '@mui/material';
import { AppButton, AppDialog, AppDialogActions, AppDialogContent, AppDialogTitle, AppSelectField, AppTextField } from '../shared/FormControls.jsx';

import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CloseIcon from '@mui/icons-material/Close';
import { apiUrl } from '../../utils/const.js';

const normalizeDateInput = (value) => {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().split('T')[0];
  return parsed.toISOString().split('T')[0];
};

const mapJobFromApi = (job) => ({
  id: job.id,
  title: job.title,
  position: job.position || '',
  experience: job.experience || '',
  employmentType: job.employmentType || 'Full-time',
  postedOn: job.postedOn ? normalizeDateInput(job.postedOn) : new Date().toISOString().split('T')[0],
  description: job.description || '',
});

const mapApplicationFromApi = (application) => ({
  id: application.id,
  name: application.name,
  email: application.email,
  contact: application.contact || '',
  experience: application.experience || '',
  employmentType: application.employmentType || 'Full-time',
  appliedOn: application.appliedOn ? normalizeDateInput(application.appliedOn) : new Date().toISOString().split('T')[0],
  resumeUrl: application.resumeUrl || '',
  resumeFile: null,
  notes: application.notes || '',
  jobId: application.jobId || '',
  job: application.job || null,
});

const dateFilterOptions = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' },
];

const defaultJobFilters = { position: '', type: 'all', date: 'all', start: '', end: '' };
const defaultApplicationFilters = {
  name: '',
  email: '',
  contact: '',
  experience: '',
  type: 'all',
  date: 'all',
  start: '',
  end: '',
};

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

const emptyJobForm = {
  id: '',
  title: '',
  position: '',
  experience: '',
  employmentType: 'Full-time',
  postedOn: new Date().toISOString().split('T')[0],
  description: '',
};

const emptyApplicationForm = {
  id: '',
  name: '',
  email: '',
  contact: '',
  experience: '',
  employmentType: 'Full-time',
  appliedOn: new Date().toISOString().split('T')[0],
  resumeUrl: '',
  resumeFile: null,
  notes: '',
  jobId: '',
};

const AdminCareersPage = () => {
  const employmentTypes = useMemo(() => ['Full-time', 'Part-time', 'Contract', 'Intern'], []);
  const token = useMemo(() => localStorage.getItem('adminToken'), []);

  const [jobPosts, setJobPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobsError, setJobsError] = useState('');
  const [applicationsError, setApplicationsError] = useState('');
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [activeSection, setActiveSection] = useState('job-posts');

  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [jobDialogMode, setJobDialogMode] = useState('create');
  const [activeJob, setActiveJob] = useState(null);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  const [jobDialogError, setJobDialogError] = useState('');
  const [savingJob, setSavingJob] = useState(false);

  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [applicationDialogMode, setApplicationDialogMode] = useState('create');
  const [activeApplication, setActiveApplication] = useState(null);
  const [applicationForm, setApplicationForm] = useState(emptyApplicationForm);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [viewApplication, setViewApplication] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [applicationDialogError, setApplicationDialogError] = useState('');
  const [savingApplication, setSavingApplication] = useState(false);

  const rowsPerPage = 5;
  const [jobFilterDraft, setJobFilterDraft] = useState(defaultJobFilters);
  const [jobAppliedFilters, setJobAppliedFilters] = useState(defaultJobFilters);
  const [jobPage, setJobPage] = useState(1);
  const [applicationFilterDraft, setApplicationFilterDraft] = useState(defaultApplicationFilters);
  const [applicationAppliedFilters, setApplicationAppliedFilters] = useState(defaultApplicationFilters);
  const [applicationPage, setApplicationPage] = useState(1);

  const matchesQuery = (value, query) => value.toLowerCase().includes(query.trim().toLowerCase());
  const resolveJobTitle = (application) => {
    if (application?.job?.title) return application.job.title;
    if (application?.jobId) {
      const matched = jobPosts.find((job) => job.id === application.jobId);
      return matched?.title || `Job #${application.jobId}`;
    }
    return 'General';
  };

  const loadJobPosts = async () => {
    setLoadingJobs(true);
    setJobsError('');
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl('/api/admin/careers/jobs'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load job posts.');
      setJobPosts((payload.jobs || []).map(mapJobFromApi));
    } catch (error) {
      console.error('Load job posts failed', error);
      setJobPosts([]);
      setJobsError(error?.message || 'Unable to load job posts right now.');
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApplications(true);
    setApplicationsError('');
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl('/api/admin/careers/applications'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to load applications.');
      setApplications((payload.applications || []).map(mapApplicationFromApi));
    } catch (error) {
      console.error('Load applications failed', error);
      setApplications([]);
      setApplicationsError(error?.message || 'Unable to load applications right now.');
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    loadJobPosts();
    loadApplications();
  }, []);

  const filteredJobPosts = useMemo(
    () =>
      jobPosts.filter((job) => {
        const positionMatch =
          !jobAppliedFilters.position ||
          matchesQuery(job.position, jobAppliedFilters.position) ||
          matchesQuery(job.title, jobAppliedFilters.position);
        const typeMatch =
          jobAppliedFilters.type === 'all' || job.employmentType === jobAppliedFilters.type;
        const dateMatch = matchesDateFilter(job.postedOn, jobAppliedFilters.date, jobAppliedFilters);
        return positionMatch && typeMatch && dateMatch;
      }),
    [jobAppliedFilters, jobPosts]
  );

  const pagedJobPosts = useMemo(() => {
    const start = (jobPage - 1) * rowsPerPage;
    return filteredJobPosts.slice(start, start + rowsPerPage);
  }, [filteredJobPosts, jobPage, rowsPerPage]);

  useEffect(() => {
    setJobPage(1);
  }, [jobAppliedFilters]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredJobPosts.length / rowsPerPage));
    setJobPage((prev) => Math.min(prev, maxPage));
  }, [filteredJobPosts.length, rowsPerPage]);

  const filteredApplications = useMemo(
    () =>
      applications.filter((application) => {
        const nameMatch =
          !applicationAppliedFilters.name || matchesQuery(application.name, applicationAppliedFilters.name);
        const emailMatch =
          !applicationAppliedFilters.email || matchesQuery(application.email, applicationAppliedFilters.email);
        const contactMatch =
          !applicationAppliedFilters.contact ||
          matchesQuery(application.contact, applicationAppliedFilters.contact);
        const experienceMatch =
          !applicationAppliedFilters.experience ||
          matchesQuery(application.experience, applicationAppliedFilters.experience);
        const typeMatch =
          applicationAppliedFilters.type === 'all' ||
          application.employmentType === applicationAppliedFilters.type;
        const dateMatch = matchesDateFilter(
          application.appliedOn,
          applicationAppliedFilters.date,
          applicationAppliedFilters
        );
        return nameMatch && emailMatch && contactMatch && experienceMatch && typeMatch && dateMatch;
      }),
    [applicationAppliedFilters, applications]
  );

  const pagedApplications = useMemo(() => {
    const start = (applicationPage - 1) * rowsPerPage;
    return filteredApplications.slice(start, start + rowsPerPage);
  }, [applicationPage, filteredApplications, rowsPerPage]);

  useEffect(() => {
    setApplicationPage(1);
  }, [applicationAppliedFilters]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredApplications.length / rowsPerPage));
    setApplicationPage((prev) => Math.min(prev, maxPage));
  }, [filteredApplications.length, rowsPerPage]);

  const applyJobFilters = () => setJobAppliedFilters(jobFilterDraft);

  const clearJobFilters = () => {
    setJobFilterDraft(defaultJobFilters);
    setJobAppliedFilters(defaultJobFilters);
  };

  const removeJobFilter = (key) => {
    const updated = { ...jobFilterDraft, [key]: defaultJobFilters[key] };
    if (key === 'date') {
      updated.start = '';
      updated.end = '';
    }
    setJobFilterDraft(updated);
    setJobAppliedFilters(updated);
  };

  const jobFilterChips = useMemo(() => {
    const chips = [];
    if (jobAppliedFilters.position)
      chips.push({ key: 'position', label: `Position/Title: ${jobAppliedFilters.position}` });
    if (jobAppliedFilters.type !== 'all') chips.push({ key: 'type', label: `Type: ${jobAppliedFilters.type}` });
    if (jobAppliedFilters.date !== 'all') {
      const rangeLabel =
        jobAppliedFilters.date === 'custom'
          ? ` (${jobAppliedFilters.start || 'any'} → ${jobAppliedFilters.end || 'any'})`
          : '';
      chips.push({ key: 'date', label: `Posted: ${jobAppliedFilters.date}${rangeLabel}` });
    }
    return chips;
  }, [jobAppliedFilters]);

  const applyApplicationFilters = () => setApplicationAppliedFilters(applicationFilterDraft);

  const clearApplicationFilters = () => {
    setApplicationFilterDraft(defaultApplicationFilters);
    setApplicationAppliedFilters(defaultApplicationFilters);
  };

  const removeApplicationFilter = (key) => {
    const updated = { ...applicationFilterDraft, [key]: defaultApplicationFilters[key] };
    if (key === 'date') {
      updated.start = '';
      updated.end = '';
    }
    setApplicationFilterDraft(updated);
    setApplicationAppliedFilters(updated);
  };

  const applicationFilterChips = useMemo(() => {
    const chips = [];
    if (applicationAppliedFilters.name) chips.push({ key: 'name', label: `Name: ${applicationAppliedFilters.name}` });
    if (applicationAppliedFilters.email) chips.push({ key: 'email', label: `Email: ${applicationAppliedFilters.email}` });
    if (applicationAppliedFilters.contact)
      chips.push({ key: 'contact', label: `Mobile: ${applicationAppliedFilters.contact}` });
    if (applicationAppliedFilters.experience)
      chips.push({ key: 'experience', label: `Experience: ${applicationAppliedFilters.experience}` });
    if (applicationAppliedFilters.type !== 'all')
      chips.push({ key: 'type', label: `Type: ${applicationAppliedFilters.type}` });
    if (applicationAppliedFilters.date !== 'all') {
      const rangeLabel =
        applicationAppliedFilters.date === 'custom'
          ? ` (${applicationAppliedFilters.start || 'any'} → ${applicationAppliedFilters.end || 'any'})`
          : '';
      chips.push({ key: 'date', label: `Applied: ${applicationAppliedFilters.date}${rangeLabel}` });
    }
    return chips;
  }, [applicationAppliedFilters]);

  const handleJobFormChange = (field, value) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplicationFormChange = (field, value) => {
    setApplicationForm((prev) => ({ ...prev, [field]: value }));
  };

  const openJobCreateDialog = () => {
    setJobDialogMode('create');
    setActiveJob(null);
    setJobDialogError('');
    setJobForm({
      ...emptyJobForm,
      employmentType: employmentTypes[0],
      postedOn: new Date().toISOString().split('T')[0],
    });
    setJobDialogOpen(true);
  };

  const openJobEditDialog = (job) => {
    setJobDialogMode('edit');
    setActiveJob(job);
    setJobDialogError('');
    setJobForm(job);
    setJobDialogOpen(true);
  };

  const closeJobDialog = () => {
    setJobDialogOpen(false);
    setActiveJob(null);
    setJobDialogError('');
  };

  const handleJobSubmit = async (event) => {
    event?.preventDefault();
    setJobDialogError('');

    const trimmedTitle = jobForm.title.trim();
    const trimmedPosition = jobForm.position.trim();
    const trimmedExperience = jobForm.experience.trim();
    const trimmedDescription = jobForm.description.trim();
    const postedOn = jobForm.postedOn;

    const requiredField = [
      { key: trimmedTitle, label: 'Title' },
      { key: trimmedPosition, label: 'Position' },
      { key: trimmedExperience, label: 'Experience' },
      { key: jobForm.employmentType, label: 'Employment type' },
      { key: postedOn, label: 'Posted on' },
      { key: trimmedDescription, label: 'Description' },
    ].find((entry) => !entry.key);

    if (requiredField) {
      setJobDialogError(`${requiredField.label} is required.`);
      return;
    }

    setSavingJob(true);
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const payload = {
        title: trimmedTitle,
        position: trimmedPosition,
        experience: trimmedExperience,
        employmentType: jobForm.employmentType,
        postedOn,
        description: trimmedDescription,
      };

      const response = await fetch(
        jobDialogMode === 'edit'
          ? apiUrl(`/api/admin/careers/jobs/${jobForm.id}`)
          : apiUrl('/api/admin/careers/jobs'),
        {
          method: jobDialogMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || 'Unable to save job.');

      const mapped = mapJobFromApi(result.job);
      setJobPosts((prev) => {
        if (jobDialogMode === 'edit') {
          return prev.map((job) => (job.id === mapped.id ? mapped : job));
        }
        return [mapped, ...prev];
      });

      closeJobDialog();
    } catch (error) {
      console.error('Save job failed', error);
      setJobDialogError(error?.message || 'Unable to save job right now.');
    } finally {
      setSavingJob(false);
    }
  };

  const openJobDeleteDialog = (job) => {
    setJobToDelete(job);
  };

  const closeJobDeleteDialog = () => {
    setJobToDelete(null);
  };

  const handleConfirmDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/careers/jobs/${jobToDelete.id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to delete job.');
      setJobPosts((prev) => prev.filter((job) => job.id !== jobToDelete.id));
    } catch (error) {
      console.error('Delete job failed', error);
      setJobsError(error?.message || 'Unable to delete job right now.');
    } finally {
      closeJobDeleteDialog();
    }
  };

  const handleViewJob = (job) => {
    setViewJob(job);
  };

  const closeViewJob = () => {
    setViewJob(null);
  };

  const openApplicationCreateDialog = () => {
    setApplicationDialogMode('create');
    setActiveApplication(null);
    setApplicationDialogError('');
    setApplicationForm({
      ...emptyApplicationForm,
      employmentType: employmentTypes[0],
      appliedOn: new Date().toISOString().split('T')[0],
      jobId: jobPosts[0]?.id || '',
    });
    setApplicationDialogOpen(true);
  };

  const openApplicationEditDialog = (application) => {
    setApplicationDialogMode('edit');
    setActiveApplication(application);
    setApplicationDialogError('');
    setApplicationForm({ ...application, resumeFile: null });
    setApplicationDialogOpen(true);
  };

  const closeApplicationDialog = () => {
    setApplicationDialogOpen(false);
    setActiveApplication(null);
    setResumeError('');
    setApplicationDialogError('');
  };

  const handleApplicationSubmit = async (event) => {
    event?.preventDefault();
    setApplicationDialogError('');

    const trimmedName = applicationForm.name.trim();
    const trimmedEmail = applicationForm.email.trim();
    const trimmedContact = applicationForm.contact.trim();
    const trimmedExperience = applicationForm.experience.trim();
    const trimmedNotes = applicationForm.notes.trim();

    const requiredField = [
      { key: trimmedName, label: 'Full name' },
      { key: trimmedEmail, label: 'Email' },
      { key: trimmedContact, label: 'Mobile number' },
      { key: applicationForm.employmentType, label: 'Employment type' },
      { key: applicationForm.appliedOn, label: 'Applied date' },
    ].find((entry) => !entry.key);

    if (requiredField) {
      setApplicationDialogError(`${requiredField.label} is required.`);
      return;
    }

    setSavingApplication(true);

    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        contact: trimmedContact,
        experience: trimmedExperience,
        employmentType: applicationForm.employmentType,
        appliedOn: applicationForm.appliedOn,
        resumeUrl: applicationForm.resumeUrl || applicationForm.resumeFile?.url || '',
        notes: trimmedNotes,
        jobId: applicationForm.jobId || null,
      };

      const response = await fetch(
        applicationDialogMode === 'edit'
          ? apiUrl(`/api/admin/careers/applications/${applicationForm.id}`)
          : apiUrl('/api/admin/careers/applications'),
        {
          method: applicationDialogMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || 'Unable to save applicant.');

      const mapped = mapApplicationFromApi(result.application);
      setApplications((prev) => {
        if (applicationDialogMode === 'edit') {
          return prev.map((application) => (application.id === mapped.id ? mapped : application));
        }
        return [mapped, ...prev];
      });

      closeApplicationDialog();
    } catch (error) {
      console.error('Save applicant failed', error);
      setApplicationDialogError(error?.message || 'Unable to save applicant right now.');
    } finally {
      setSavingApplication(false);
    }
  };

  const openApplicationDeleteDialog = (application) => {
    setApplicationToDelete(application);
  };

  const closeApplicationDeleteDialog = () => {
    setApplicationToDelete(null);
  };

  const handleConfirmDeleteApplication = async () => {
    if (!applicationToDelete) return;
    try {
      if (!token) throw new Error('Your session expired. Please log in again.');
      const response = await fetch(apiUrl(`/api/admin/careers/applications/${applicationToDelete.id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to delete applicant.');
      revokeResumeObjectUrl(applicationToDelete.resumeFile);
      setApplications((prev) => prev.filter((application) => application.id !== applicationToDelete.id));
    } catch (error) {
      console.error('Delete applicant failed', error);
      setApplicationsError(error?.message || 'Unable to delete applicant right now.');
    } finally {
      closeApplicationDeleteDialog();
    }
  };

  const handleViewApplication = (application) => {
    setViewApplication(application);
  };

  const closeViewApplication = () => {
    setViewApplication(null);
  };

  const revokeResumeObjectUrl = (file) => {
    if (file?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
  };

  const handleResumeFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      handleClearResumeFile();
      return;
    }

    if (file.type !== 'application/pdf') {
      setResumeError('Only PDF files are supported.');
      return;
    }

    setResumeError('');
    setApplicationForm((prev) => {
      revokeResumeObjectUrl(prev.resumeFile);
      return {
        ...prev,
        resumeFile: { name: file.name, url: URL.createObjectURL(file) },
        resumeUrl: '',
      };
    });
  };

  const handleClearResumeFile = () => {
    setApplicationForm((prev) => {
      revokeResumeObjectUrl(prev.resumeFile);
      return { ...prev, resumeFile: null };
    });
    setResumeError('');
  };

  const resolveResumeUrl = (application) => application?.resumeFile?.url || application?.resumeUrl;

  const handleResumeView = (application) => {
    const resumeUrl = resolveResumeUrl(application);
    if (!resumeUrl) return;
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0.5, bgcolor: 'background.paper' }}>
        <Tabs
          value={activeSection}
          onChange={(event, value) => setActiveSection(value)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="job-posts" label="Job posts" icon={<WorkOutlineIcon />} iconPosition="start" />
          <Tab value="applications" label="Applications" icon={<DownloadOutlinedIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {activeSection === 'job-posts' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Job posts"
            subheader="Add new openings, update details, or remove closed positions."
            action={
              <AppButton variant="contained" startIcon={<PersonAddAltIcon />} onClick={openJobCreateDialog}>
                New job
              </AppButton>
            }
          />
          <Divider />
          <CardContent>
            {jobsError && (
              <Typography color="error" variant="body2" mb={2}>
                {jobsError}
              </Typography>
            )}
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'flex-end' }} mb={2}>
              <AppTextField
                label="Position or title"
                value={jobFilterDraft.position}
                onChange={(event) => setJobFilterDraft((prev) => ({ ...prev, position: event.target.value }))}
                fullWidth
              />
              <AppSelectField
               
                label="Type"
                value={jobFilterDraft.type}
                onChange={(event) => setJobFilterDraft((prev) => ({ ...prev, type: event.target.value }))}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All types</MenuItem>
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </AppSelectField>
              <AppSelectField
               
                label="Date filter"
                value={jobFilterDraft.date}
                onChange={(event) => setJobFilterDraft((prev) => ({ ...prev, date: event.target.value }))}
                sx={{ minWidth: 180 }}
              >
                {dateFilterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </AppSelectField>
              {jobFilterDraft.date === 'custom' && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
                  <AppTextField
                    type="date"
                    label="From"
                    value={jobFilterDraft.start}
                    onChange={(event) => setJobFilterDraft((prev) => ({ ...prev, start: event.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <AppTextField
                    type="date"
                    label="To"
                    value={jobFilterDraft.end}
                    onChange={(event) => setJobFilterDraft((prev) => ({ ...prev, end: event.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mb={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                {jobFilterChips.map((chip) => (
                  <Chip key={chip.key} label={chip.label} onDelete={() => removeJobFilter(chip.key)} />
                ))}
                {jobFilterChips.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No filters applied
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={1}>
                <AppButton variant="outlined" color="inherit" onClick={clearJobFilters}>
                  Clear filters
                </AppButton>
                <AppButton variant="contained" onClick={applyJobFilters}>
                  Apply filters
                </AppButton>
              </Stack>
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Posted</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedJobPosts.map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{job.title}</TableCell>
                      <TableCell>{job.position}</TableCell>
                      <TableCell>{job.postedOn || '-'}</TableCell>
                      <TableCell>{job.experience}</TableCell>
                      <TableCell>
                        <Chip label={job.employmentType} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {job.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View details">
                            <IconButton size="small" onClick={() => handleViewJob(job)}>
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => openJobEditDialog(job)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openJobDeleteDialog(job)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loadingJobs && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Loading job posts...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loadingJobs && filteredJobPosts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No job posts yet. Click "New job" to add your first opening.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(filteredJobPosts.length / rowsPerPage))}
                page={jobPage}
                onChange={(event, value) => setJobPage(value)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeSection === 'applications' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Applications"
            subheader="Review candidates, update their details, or download their resumes."
            action={
              <AppButton variant="outlined" startIcon={<PersonAddAltIcon />} onClick={openApplicationCreateDialog}>
                Add applicant
              </AppButton>
            }
          />
          <Divider />
          <CardContent>
            {applicationsError && (
              <Typography color="error" variant="body2" mb={2}>
                {applicationsError}
              </Typography>
            )}
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'flex-end' }} mb={2}>
              <AppTextField
                label="Name"
                value={applicationFilterDraft.name}
                onChange={(event) =>
                  setApplicationFilterDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                fullWidth
              />
              <AppTextField
                label="Email"
                value={applicationFilterDraft.email}
                onChange={(event) =>
                  setApplicationFilterDraft((prev) => ({ ...prev, email: event.target.value }))
                }
                fullWidth
              />
              <AppTextField
                label="Mobile"
                value={applicationFilterDraft.contact}
                onChange={(event) =>
                  setApplicationFilterDraft((prev) => ({ ...prev, contact: event.target.value }))
                }
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'flex-end' }} mb={2}>
              <AppTextField
                label="Experience"
                value={applicationFilterDraft.experience}
                onChange={(event) =>
                  setApplicationFilterDraft((prev) => ({ ...prev, experience: event.target.value }))
                }
                fullWidth
              />
              <AppSelectField
               
                label="Type"
                value={applicationFilterDraft.type}
                onChange={(event) =>
                  setApplicationFilterDraft((prev) => ({ ...prev, type: event.target.value }))
                }
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="all">All types</MenuItem>
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </AppSelectField>
              <AppSelectField
               
                label="Applied date"
                value={applicationFilterDraft.date}
                onChange={(event) =>
                  setApplicationFilterDraft((prev) => ({ ...prev, date: event.target.value }))
                }
                sx={{ minWidth: 180 }}
              >
                {dateFilterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </AppSelectField>
              {applicationFilterDraft.date === 'custom' && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
                  <AppTextField
                    type="date"
                    label="From"
                    value={applicationFilterDraft.start}
                    onChange={(event) =>
                      setApplicationFilterDraft((prev) => ({ ...prev, start: event.target.value }))
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <AppTextField
                    type="date"
                    label="To"
                    value={applicationFilterDraft.end}
                    onChange={(event) =>
                      setApplicationFilterDraft((prev) => ({ ...prev, end: event.target.value }))
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mb={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                {applicationFilterChips.map((chip) => (
                  <Chip key={chip.key} label={chip.label} onDelete={() => removeApplicationFilter(chip.key)} />
                ))}
                {applicationFilterChips.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No filters applied
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={1}>
                <AppButton variant="outlined" color="inherit" onClick={clearApplicationFilters}>
                  Clear filters
                </AppButton>
                <AppButton variant="contained" onClick={applyApplicationFilters}>
                  Apply filters
                </AppButton>
              </Stack>
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Job</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Applied</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedApplications.map((application) => (
                    <TableRow key={application.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{application.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {resolveJobTitle(application)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {application.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{application.contact}</TableCell>
                      <TableCell>{application.appliedOn || '-'}</TableCell>
                      <TableCell>{application.experience}</TableCell>
                      <TableCell>
                        <Chip
                          label={application.employmentType}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View details">
                            <IconButton size="small" onClick={() => handleViewApplication(application)}>
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View resume">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleResumeView(application)}
                              disabled={!resolveResumeUrl(application)}
                            >
                              <DownloadOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openApplicationEditDialog(application)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openApplicationDeleteDialog(application)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loadingApplications && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Loading applications...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loadingApplications && filteredApplications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No applications received yet. Add applicants manually or import them later.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack mt={2} alignItems="flex-end">
              <Pagination
                count={Math.max(1, Math.ceil(filteredApplications.length / rowsPerPage))}
                page={applicationPage}
                onChange={(event, value) => setApplicationPage(value)}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      <AppDialog open={jobDialogOpen} onClose={closeJobDialog} maxWidth="sm" fullWidth>
        <AppDialogTitle>{jobDialogMode === 'edit' ? 'Edit job post' : 'New job post'}</AppDialogTitle>
        <AppDialogContent dividers>
          <Stack spacing={2} mt={1} component="form" onSubmit={handleJobSubmit}>
            <AppTextField
              label="Title"
              value={jobForm.title}
              onChange={(event) => handleJobFormChange('title', event.target.value)}
              fullWidth
              required
            />
            <AppTextField
              label="Position"
              value={jobForm.position}
              onChange={(event) => handleJobFormChange('position', event.target.value)}
              fullWidth
              required
            />
            <AppTextField
              label="Experience"
              placeholder="e.g. 3+ years"
              value={jobForm.experience}
              onChange={(event) => handleJobFormChange('experience', event.target.value)}
              fullWidth
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <AppSelectField
                 
                  label="Employment type"
                  value={jobForm.employmentType}
                  onChange={(event) => handleJobFormChange('employmentType', event.target.value)}
                  fullWidth
                  required
                >
                  {employmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </AppSelectField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppTextField
                  label="Posted on"
                  type="date"
                  value={jobForm.postedOn}
                  onChange={(event) => handleJobFormChange('postedOn', event.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
            <AppTextField
              label="Description"
              placeholder="Describe responsibilities, required skills, and perks"
              value={jobForm.description}
              onChange={(event) => handleJobFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={4}
              maxRows={10}
              required
            />
            {jobDialogError && (
              <Typography color="error" variant="body2">
                {jobDialogError}
              </Typography>
            )}
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeJobDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleJobSubmit} variant="contained" disabled={savingJob}>
            {jobDialogMode === 'edit' ? 'Save changes' : 'Create job'}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      <AppDialog open={Boolean(viewJob)} onClose={closeViewJob} maxWidth="sm" fullWidth>
        <AppDialogTitle>Job details</AppDialogTitle>
        <AppDialogContent dividers>
          {viewJob && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                {viewJob.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={viewJob.position} size="small" />
                <Chip label={viewJob.employmentType} size="small" color="primary" variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Experience: {viewJob.experience || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posted on: {viewJob.postedOn || '-'}
              </Typography>
              <Divider />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {viewJob.description || 'No description provided yet.'}
              </Typography>
            </Stack>
          )}
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeViewJob} color="inherit">
            Close
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      <AppDialog open={Boolean(jobToDelete)} onClose={closeJobDeleteDialog} maxWidth="xs" fullWidth>
        <AppDialogTitle>Delete job post</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeJobDeleteDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleConfirmDeleteJob} color="error" variant="contained" disabled={savingJob}>
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      <AppDialog open={applicationDialogOpen} onClose={closeApplicationDialog} maxWidth="sm" fullWidth>
        <AppDialogTitle sx={{ px: { xs: 3, sm: 4 }, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>

                {applicationDialogMode === 'edit' ? 'Edit applicant' : 'New applicant'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Match the Hire Now contact flow with applicant-friendly fields and uploads.
              </Typography>
            </Stack>
            <IconButton onClick={closeApplicationDialog}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </AppDialogTitle>
        <AppDialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              pr: { sm: 5 },
              pl: { xs: 1, sm: 2 },
              pt: 1,
              pb: 3,
            }}
          >
            <Stack spacing={2.5} component="form" onSubmit={handleApplicationSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <AppTextField
                    label="Full name"
                    value={applicationForm.name}
                    onChange={(event) => handleApplicationFormChange('name', event.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AppTextField
                    label="Email"
                    type="email"
                    value={applicationForm.email}
                    onChange={(event) => handleApplicationFormChange('email', event.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AppTextField
                    label="Mobile number"
                    value={applicationForm.contact}
                    onChange={(event) => handleApplicationFormChange('contact', event.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>🇮🇳</Box>
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AppTextField
                    label="Experience"
                    placeholder="e.g. 2 years"
                    value={applicationForm.experience}
                    onChange={(event) => handleApplicationFormChange('experience', event.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AppSelectField
                    label="Job type"
                    value={applicationForm.jobId}
                    onChange={(event) => handleApplicationFormChange('jobId', event.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">General / Not linked</MenuItem>
                    {jobPosts.map((job) => (
                      <MenuItem key={job.id} value={job.id}>
                        {job.title}
                      </MenuItem>
                    ))}
                  </AppSelectField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AppSelectField
                   
                    label="Employment type"
                    value={applicationForm.employmentType}
                    onChange={(event) => handleApplicationFormChange('employmentType', event.target.value)}
                    fullWidth
                    required
                  >
                    {employmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </AppSelectField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AppTextField
                    label="Applied on"
                    type="date"
                    value={applicationForm.appliedOn}
                    onChange={(event) => handleApplicationFormChange('appliedOn', event.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={0.5}>
                    <AppButton component="label" variant="outlined">
                      {applicationForm.resumeFile ? 'Change resume (PDF)' : 'Upload resume (PDF)'}
                      <input type="file" hidden accept="application/pdf" onChange={handleResumeFileChange} />
                    </AppButton>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="body2" color="text.secondary">
                        {applicationForm.resumeFile
                          ? `Selected: ${applicationForm.resumeFile.name}`
                          : applicationForm.resumeUrl
                            ? 'Existing resume on file'
                            : 'No file selected yet.'}
                      </Typography>
                      {applicationForm.resumeFile && (
                        <AppButton color="error" size="small" onClick={handleClearResumeFile}>
                          Remove file
                        </AppButton>
                      )}
                      {(applicationForm.resumeFile || applicationForm.resumeUrl) && (
                        <AppButton size="small" onClick={() => handleResumeView(applicationForm)}>
                          View resume
                        </AppButton>
                      )}
                    </Stack>
                    {resumeError && <FormHelperText error>{resumeError}</FormHelperText>}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <AppTextField
                    label="Notes"
                    placeholder="Add a quick summary or decision notes"
                    value={applicationForm.notes}
                    onChange={(event) => handleApplicationFormChange('notes', event.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={8}
                  />
                </Grid>
              </Grid>

              {applicationDialogError && (
                <Typography color="error" variant="body2">
                  {applicationDialogError}
                </Typography>
              )}

              <Box sx={{ textAlign: 'start', mt: 1 }}>
                <AppButton
                  variant="contained"
                  type="submit"
                  disabled={savingApplication}
                >
                  {applicationDialogMode === 'edit' ? 'Save applicant' : 'Submit applicant'}
                </AppButton>
              </Box>
            </Stack>
          </Box>
        </AppDialogContent>
      </AppDialog>

      <AppDialog
        open={Boolean(viewApplication)}
        onClose={closeViewApplication}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>Applicant details</AppDialogTitle>
        <AppDialogContent dividers>
          {viewApplication && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                {viewApplication.name}
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Email: {viewApplication.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Job type: {resolveJobTitle(viewApplication)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact: {viewApplication.contact || 'Not provided'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experience: {viewApplication.experience || 'Not specified'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employment type: {viewApplication.employmentType}
                </Typography>
              </Stack>
              <Divider />

              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {viewApplication.notes || 'No additional notes yet.'}
              </Typography>
              <AppButton
                variant="outlined"
                startIcon={<DownloadOutlinedIcon />}
                onClick={() => handleResumeView(viewApplication)}
                disabled={!resolveResumeUrl(viewApplication)}
              >
                View resume
              </AppButton>
            </Stack>
          )}
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeViewApplication} color="inherit">
            Close
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      <AppDialog open={Boolean(applicationToDelete)} onClose={closeApplicationDeleteDialog} maxWidth="xs" fullWidth>
        <AppDialogTitle>Delete applicant</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove "{applicationToDelete?.name}" from the applicant list? This action cannot be undone.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeApplicationDeleteDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleConfirmDeleteApplication} color="error" variant="contained" disabled={savingApplication}>
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>
    </Stack>
  );
};

export default AdminCareersPage;
