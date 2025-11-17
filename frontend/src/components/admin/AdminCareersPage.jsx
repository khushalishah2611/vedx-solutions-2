import { useMemo, useState } from 'react';
import {
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
  FormHelperText,
  IconButton,
  MenuItem,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Tab,
  Tabs
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CloseIcon from '@mui/icons-material/Close';

const initialJobPosts = [
  {
    id: 'senior-fe-dev',
    title: 'Senior Frontend Developer',
    position: 'Frontend Engineer',
    experience: '5+ years',
    employmentType: 'Full-time',
    description:
      'Lead UI development for SaaS dashboards, mentor junior engineers, and collaborate with designers on component systems.'
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    position: 'Design',
    experience: '3+ years',
    employmentType: 'Full-time',
    description:
      'Work closely with engineering and product to craft thoughtful user experiences and run usability studies.'
  }
];

const initialApplications = [
  {
    id: 'app-01',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    contact: '+91 98765 43210',
    experience: '4 years',
    employmentType: 'Full-time',
    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    notes: 'Interested in remote-first teams and prefers frontend-heavy roles.'
  },
  {
    id: 'app-02',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    contact: '+91 91234 56789',
    experience: '2 years',
    employmentType: 'Part-time',
    resumeUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
    notes: 'Has prior startup experience and contributed to design systems.'
  }
];

const emptyJobForm = {
  id: '',
  title: '',
  position: '',
  experience: '',
  employmentType: 'Full-time',
  description: ''
};

const emptyApplicationForm = {
  id: '',
  name: '',
  email: '',
  contact: '',
  experience: '',
  employmentType: 'Full-time',
  resumeUrl: '',
  resumeFile: null,
  notes: ''
};

const AdminCareersPage = () => {
  const employmentTypes = useMemo(() => ['Full-time', 'Part-time', 'Contract'], []);
  const [jobPosts, setJobPosts] = useState(initialJobPosts);
  const [applications, setApplications] = useState(initialApplications);
  const [activeSection, setActiveSection] = useState('job-posts');

  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [jobDialogMode, setJobDialogMode] = useState('create');
  const [activeJob, setActiveJob] = useState(null);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [viewJob, setViewJob] = useState(null);

  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [applicationDialogMode, setApplicationDialogMode] = useState('create');
  const [activeApplication, setActiveApplication] = useState(null);
  const [applicationForm, setApplicationForm] = useState(emptyApplicationForm);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [viewApplication, setViewApplication] = useState(null);
  const [resumeError, setResumeError] = useState('');

  const handleJobFormChange = (field, value) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplicationFormChange = (field, value) => {
    setApplicationForm((prev) => ({ ...prev, [field]: value }));
  };

  const openJobCreateDialog = () => {
    setJobDialogMode('create');
    setActiveJob(null);
    setJobForm({ ...emptyJobForm, employmentType: employmentTypes[0] });
    setJobDialogOpen(true);
  };

  const openJobEditDialog = (job) => {
    setJobDialogMode('edit');
    setActiveJob(job);
    setJobForm(job);
    setJobDialogOpen(true);
  };

  const closeJobDialog = () => {
    setJobDialogOpen(false);
    setActiveJob(null);
  };

  const handleJobSubmit = (event) => {
    event?.preventDefault();
    if (!jobForm.title.trim() || !jobForm.position.trim()) return;

    if (jobDialogMode === 'edit' && activeJob) {
      setJobPosts((prev) => prev.map((job) => (job.id === activeJob.id ? { ...jobForm } : job)));
    } else {
      const newJob = { ...jobForm, id: `job-${Date.now()}` };
      setJobPosts((prev) => [newJob, ...prev]);
    }
    closeJobDialog();
  };

  const openJobDeleteDialog = (job) => {
    setJobToDelete(job);
  };

  const closeJobDeleteDialog = () => {
    setJobToDelete(null);
  };

  const handleConfirmDeleteJob = () => {
    if (!jobToDelete) return;
    setJobPosts((prev) => prev.filter((job) => job.id !== jobToDelete.id));
    closeJobDeleteDialog();
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
    setApplicationForm({ ...emptyApplicationForm, employmentType: employmentTypes[0] });
    setApplicationDialogOpen(true);
  };

  const openApplicationEditDialog = (application) => {
    setApplicationDialogMode('edit');
    setActiveApplication(application);
    setApplicationForm({ ...application, resumeFile: application.resumeFile ?? null });
    setApplicationDialogOpen(true);
  };

  const closeApplicationDialog = () => {
    setApplicationDialogOpen(false);
    setActiveApplication(null);
    setResumeError('');
  };

  const handleApplicationSubmit = (event) => {
    event?.preventDefault();
    if (!applicationForm.name.trim() || !applicationForm.email.trim()) return;

    if (applicationDialogMode === 'edit' && activeApplication) {
      setApplications((prev) =>
        prev.map((application) =>
          application.id === activeApplication.id ? { ...applicationForm } : application
        )
      );
    } else {
      const newApplication = { ...applicationForm, id: `application-${Date.now()}` };
      setApplications((prev) => [newApplication, ...prev]);
    }
    closeApplicationDialog();
  };

  const openApplicationDeleteDialog = (application) => {
    setApplicationToDelete(application);
  };

  const closeApplicationDeleteDialog = () => {
    setApplicationToDelete(null);
  };

  const handleConfirmDeleteApplication = () => {
    if (!applicationToDelete) return;
    revokeResumeObjectUrl(applicationToDelete.resumeFile);
    setApplications((prev) => prev.filter((application) => application.id !== applicationToDelete.id));
    closeApplicationDeleteDialog();
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
        resumeUrl: ''
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

  const handleResumeDownload = (application) => {
    const resumeUrl = application?.resumeFile?.url || application?.resumeUrl;
    if (!resumeUrl) return;
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.download = 'resume.pdf';
    link.click();
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
              <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={openJobCreateDialog}>
                New job
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
                    <TableCell>Position</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobPosts.map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{job.title}</TableCell>
                      <TableCell>{job.position}</TableCell>
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
                  {jobPosts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No job posts yet. Click "New job" to add your first opening.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeSection === 'applications' && (
        <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
          <CardHeader
            title="Applications"
            subheader="Review candidates, update their details, or download their resumes."
            // action={
            //   <Button variant="outlined" startIcon={<PersonAddAltIcon />} onClick={openApplicationCreateDialog}>
            //     Add applicant
            //   </Button>
            // }
          />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{application.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {application.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{application.contact}</TableCell>
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
                          <Tooltip title="Download resume">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleResumeDownload(application)}
                              disabled={!application.resumeFile?.url && !application.resumeUrl}
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
                  {applications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No applications received yet. Add applicants manually or import them later.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Dialog open={jobDialogOpen} onClose={closeJobDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{jobDialogMode === 'edit' ? 'Edit job post' : 'New job post'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1} component="form" onSubmit={handleJobSubmit}>
            <TextField
              label="Title"
              value={jobForm.title}
              onChange={(event) => handleJobFormChange('title', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Position"
              value={jobForm.position}
              onChange={(event) => handleJobFormChange('position', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Experience"
              placeholder="e.g. 3+ years"
              value={jobForm.experience}
              onChange={(event) => handleJobFormChange('experience', event.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Employment type"
              value={jobForm.employmentType}
              onChange={(event) => handleJobFormChange('employmentType', event.target.value)}
              fullWidth
            >
              {employmentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              placeholder="Describe responsibilities, required skills, and perks"
              value={jobForm.description}
              onChange={(event) => handleJobFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={4}
              maxRows={10}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJobDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleJobSubmit} variant="contained">
            {jobDialogMode === 'edit' ? 'Save changes' : 'Create job'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(viewJob)} onClose={closeViewJob} maxWidth="sm" fullWidth>
        <DialogTitle>Job details</DialogTitle>
        <DialogContent dividers>
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
              <Divider />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {viewJob.description || 'No description provided yet.'}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewJob} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(jobToDelete)} onClose={closeJobDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete job post</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJobDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteJob} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={applicationDialogOpen} onClose={closeApplicationDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ px: { xs: 3, sm: 4 }, pb: 1 }}>
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
        </DialogTitle>
        <DialogContent
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
                  <TextField
                    label="Full name"
                    value={applicationForm.name}
                    onChange={(event) => handleApplicationFormChange('name', event.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    value={applicationForm.email}
                    onChange={(event) => handleApplicationFormChange('email', event.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Experience"
                    placeholder="e.g. 2 years"
                    value={applicationForm.experience}
                    onChange={(event) => handleApplicationFormChange('experience', event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Employment type"
                    value={applicationForm.employmentType}
                    onChange={(event) => handleApplicationFormChange('employmentType', event.target.value)}
                    fullWidth
                  >
                    {employmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Resume link (optional)"
                    placeholder="https://..."
                    value={applicationForm.resumeUrl}
                    onChange={(event) => handleApplicationFormChange('resumeUrl', event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={0.5}>
                    <Button component="label" variant="outlined">
                      {applicationForm.resumeFile ? 'Change resume (PDF)' : 'Upload resume (PDF)'}
                      <input type="file" hidden accept="application/pdf" onChange={handleResumeFileChange} />
                    </Button>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="body2" color="text.secondary">
                        {applicationForm.resumeFile
                          ? `Selected: ${applicationForm.resumeFile.name}`
                          : 'No file selected yet.'}
                      </Typography>
                      {applicationForm.resumeFile && (
                        <Button color="error" size="small" onClick={handleClearResumeFile}>
                          Remove file
                        </Button>
                      )}
                    </Stack>
                    {resumeError && <FormHelperText error>{resumeError}</FormHelperText>}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <TextField
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

              <Box sx={{ textAlign: 'start', mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  onClick={handleApplicationSubmit}
                  sx={{
                    background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 4, md: 5 },
                    py: { xs: 1.25, md: 1.5 },
                    '&:hover': {
                      background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)',
                    },
                  }}
                >
                  {applicationDialogMode === 'edit' ? 'Save applicant' : 'Submit applicant'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(viewApplication)}
        onClose={closeViewApplication}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Applicant details</DialogTitle>
        <DialogContent dividers>
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
              <Button
                variant="outlined"
                startIcon={<DownloadOutlinedIcon />}
                onClick={() => handleResumeDownload(viewApplication)}
                disabled={!viewApplication.resumeFile?.url && !viewApplication.resumeUrl}
              >
                Download resume
              </Button>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewApplication} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(applicationToDelete)} onClose={closeApplicationDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete applicant</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove "{applicationToDelete?.name}" from the applicant list? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeApplicationDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteApplication} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AdminCareersPage;
