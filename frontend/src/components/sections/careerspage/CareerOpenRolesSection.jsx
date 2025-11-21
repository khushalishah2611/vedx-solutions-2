import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PropTypes from 'prop-types';

const CareerOpenRolesSection = ({ roles = [], applyHref }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const employmentTypes = useMemo(() => ['Full-time', 'Part-time', 'Contract'], []);

  const hasRoles = Array.isArray(roles) && roles.length > 0;

  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    contact: '',
    experience: '',
    employmentType: employmentTypes[0],
    resumeFile: null,
    notes: '',
  });

  const resolveHref = (role) => {
    if (!applyHref) return undefined;
    return typeof applyHref === 'function' ? applyHref(role) : applyHref;
  };

  const revokeResumeObjectUrl = (file) => {
    if (file?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
  };

  const openApplicationCreateDialog = (role) => {
    setSelectedRole(role);
    setApplicationForm({
      name: '',
      email: '',
      contact: '',
      experience: '',
      employmentType: employmentTypes[0],
      resumeFile: null,
      notes: '',
    });
    setResumeError('');
    setApplicationDialogOpen(true);
  };

  const closeApplicationDialog = () => {
    revokeResumeObjectUrl(applicationForm.resumeFile);
    setApplicationDialogOpen(false);
    setSelectedRole(null);
    setResumeError('');
  };

  const handleApplicationFormChange = (field, value) => {
    setApplicationForm((prev) => ({ ...prev, [field]: value }));
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

  const handleApplicationSubmit = (event) => {
    event.preventDefault();

    if (!applicationForm.name.trim() || !applicationForm.email.trim()) return;

    // TODO: integrate with your submit API / handler here

    closeApplicationDialog();
  };

  return (
    <Container id="open-roles">
      {/* Header */}
      <Stack
        spacing={3}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        textAlign={{ xs: 'left', md: 'center' }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Does your skill fit the job post?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 640 }}>
          We&apos;re always on the lookout for passionate innovators. Choose the role that aligns
          with your strengths and let&apos;s build impactful products together.
        </Typography>
      </Stack>

      {!hasRoles ? (
        <Paper
          elevation={0}
          role="status"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 0.5,
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`,
            bgcolor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.7),
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No open roles at the moment. Please check back soon.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {roles.map((role, idx) => {
            const key = `${role?.title || 'role'}-${idx}`;
            const href = resolveHref(role);
            const disabledApply = false;

            return (
              <Grid key={key} item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  component="article"
                  tabIndex={0}
                  sx={{
                    height: '100%',
                    borderRadius: 0.5,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isDark
                      ? '0 8px 24px rgba(0,0,0,0.35)'
                      : '0 8px 24px rgba(0,0,0,0.12)',
                    gap: 2.5,
                    border: `1px solid ${alpha(
                      isDark ? '#67e8f9' : theme.palette.primary.main,
                      isDark ? 0.5 : 0.25
                    )}`,
                    bgcolor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.7),
                    outline: 'none',
                    transition:
                      'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    '&:hover, &:focus-visible': {
                      transform: 'translateY(-3px)',
                      borderColor: alpha(
                        isDark ? '#67e8f9' : theme.palette.primary.main,
                        0.4
                      ),
                    },
                  }}
                >
                  <Stack spacing={1.5}>
                    {!!role?.title && (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'color 0.3s ease, background-image 0.3s ease',
                          '&:hover': {
                            color: 'transparent',
                            backgroundImage:
                              'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          },
                        }}
                      >
                        {role.title}
                      </Typography>
                    )}
                    {!!role?.description && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {role.description}
                      </Typography>
                    )}
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ color: 'text.secondary', fontWeight: 600, flexWrap: 'wrap' }}
                  >
                    {!!role?.experience && (
                      <Typography variant="caption">{role.experience}</Typography>
                    )}
                    {!!role?.positions && (
                      <Typography variant="caption">{role.positions}</Typography>
                    )}
                    {!!role?.type && <Typography variant="caption">{role.type}</Typography>}
                    {!!role?.location && (
                      <Typography variant="caption">{role.location}</Typography>
                    )}
                  </Stack>

                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Button
                      component="button"
                      onClick={() => openApplicationCreateDialog(role)}
                      disabled={disabledApply}
                      variant="contained"
                      size="large"
                      startIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                        color: '#fff',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2,
                        '&:hover': {
                          background:
                            'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                        },
                        '&:disabled': {
                          opacity: 0.6,
                          cursor: 'not-allowed',
                        },
                      }}
                      aria-label={
                        href
                          ? `Apply for ${role?.title || 'this role'}`
                          : 'Apply link unavailable'
                      }
                    >
                      Apply Now
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Application dialog */}
      <Dialog
        open={applicationDialogOpen}
        onClose={closeApplicationDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
          },
        }}
      >
        <DialogTitle sx={{ px: { xs: 3, sm: 4 }, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                New applicant
              </Typography>
              {selectedRole?.title && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Applying for: {selectedRole.title}
                </Typography>
              )}
            </Stack>
            <IconButton
              onClick={closeApplicationDialog}
              aria-label="Close application dialog"
              size="small"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack
            spacing={2}
            mt={1}
            component="form"
            id="application-form"
            onSubmit={handleApplicationSubmit}
          >
            <TextField
              label="Full name"
              value={applicationForm.name}
              onChange={(event) =>
                handleApplicationFormChange('name', event.target.value)
              }
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={applicationForm.email}
              onChange={(event) =>
                handleApplicationFormChange('email', event.target.value)
              }
              fullWidth
              required
            />
            <TextField
              label="Contact number"
              value={applicationForm.contact}
              onChange={(event) =>
                handleApplicationFormChange('contact', event.target.value)
              }
              fullWidth
            />
            <TextField
              label="Experience"
              placeholder="e.g. 2 years"
              value={applicationForm.experience}
              onChange={(event) =>
                handleApplicationFormChange('experience', event.target.value)
              }
              fullWidth
            />
            <TextField
              select
              label="Employment type"
              value={applicationForm.employmentType}
              onChange={(event) =>
                handleApplicationFormChange('employmentType', event.target.value)
              }
              fullWidth
            >
              {employmentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <Stack spacing={0.5}>
              <Button component="label" variant="outlined">
                {applicationForm.resumeFile ? 'Change resume (PDF)' : 'Upload resume (PDF)'}
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={handleResumeFileChange}
                />
              </Button>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ color: 'text.secondary' }}
              >
                <Typography variant="body2">
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

            <TextField
              label="Notes"
              placeholder="Add a quick summary or decision notes"
              value={applicationForm.notes}
              onChange={(event) =>
                handleApplicationFormChange('notes', event.target.value)
              }
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 3, sm: 4 }, py: 2 }}>
          <Button onClick={closeApplicationDialog} color="inherit">
            Cancel
          </Button>
          <Button
            form="application-form"
            type="submit"
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
              color: '#fff',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 5, md: 6 },
              py: { xs: 1.5, md: 1.75 },
              '&:hover': {
                background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)',
              },
            }}
          >
            Submit Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

CareerOpenRolesSection.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      experience: PropTypes.string,
      positions: PropTypes.string,
      type: PropTypes.string,
      location: PropTypes.string,
    })
  ),
  /** Either a URL string or a function that receives the role and returns a URL string */
  applyHref: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default React.memo(CareerOpenRolesSection);
