import React, { useMemo, useState } from 'react';
import { Box, IconButton, InputAdornment, MenuItem, FormHelperText, Stack, Typography, alpha, useTheme } from '@mui/material';
import { AppButton, AppDialog, AppDialogActions, AppDialogContent, AppDialogTitle, AppSelectField, AppTextField } from './FormControls.jsx';

import CloseIcon from '@mui/icons-material/Close';
import { contactProjectTypes } from '../../data/servicesPage.js';
import { apiUrl } from '../../utils/const.js';
import { fileToDataUrl } from '../../utils/files.js';

const ContactDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const employmentTypes = useMemo(() => ['Full-time', 'Part-time', 'Contract'], []);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: contactProjectTypes[0],
    experience: '',
    employmentType: employmentTypes[0],
    notes: '',
    resume: null,
  });
  const [resumeError, setResumeError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      phone: '',
      projectType: contactProjectTypes[0],
      experience: '',
      employmentType: employmentTypes[0],
      notes: '',
      resume: null,
    });
    setResumeError('');
    setSubmitError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormState((prev) => ({ ...prev, resume: null }));
      setResumeError('');
      return;
    }

    if (file.type !== 'application/pdf') {
      setResumeError('Only PDF resumes are supported.');
      return;
    }

    setResumeError('');
    setFormState((prev) => ({ ...prev, resume: { file, name: file.name } }));
  };

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplicationSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const trimmedName = formState.name.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedPhone = formState.phone.trim();
    const trimmedExperience = formState.experience.trim();
    const trimmedNotes = formState.notes.trim();

    if (!trimmedName || !trimmedEmail) {
      setSubmitError('Name and email are required.');
      return;
    }

    setSubmitting(true);

    try {
      const resumeUrl = formState.resume?.file ? await fileToDataUrl(formState.resume.file) : '';

      const response = await fetch(apiUrl('/api/careers/applications'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          contact: trimmedPhone,
          experience: trimmedExperience,
          employmentType: formState.employmentType,
          appliedOn: new Date().toISOString().split('T')[0],
          resumeUrl,
          notes: trimmedNotes || `Project type: ${formState.projectType}`,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to submit application.');

      resetForm();
      onClose?.();
    } catch (error) {
      console.error('Contact dialog submit failed', error);
      setSubmitError(error?.message || 'Unable to submit application right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0.5,
        },
      }}
    >
      {/* Header */}
      <AppDialogTitle sx={{ px: { xs: 3, sm: 4 }, pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: subtleText }}>
              Share your requirements and we&apos;ll get back within one business day.
            </Typography>
          </Stack>
          <IconButton onClick={onClose} aria-label="Close contact dialog">
            <CloseIcon />
          </IconButton>
        </Stack>
      </AppDialogTitle>

      {/* Content */}
      <AppDialogContent dividers>
        <Stack
          spacing={2}
          mt={1}
          component="form"
          id="application-form"
          onSubmit={handleApplicationSubmit}
        >
          <AppTextField
            label="Name"
            value={formState.name}
            onChange={(event) => handleFieldChange('name', event.target.value)}
            required
            fullWidth
          />
          <AppTextField
            label="Email"
            type="email"
            value={formState.email}
            onChange={(event) => handleFieldChange('email', event.target.value)}
            required
            fullWidth
          />
          <AppTextField
            label="Mobile Number"
            value={formState.phone}
            onChange={(event) => handleFieldChange('phone', event.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>🇮🇳</Box>
                </InputAdornment>
              ),
            }}
          />
          <AppSelectField
           
            label="Project Type"
            value={formState.projectType}
            onChange={(event) => handleFieldChange('projectType', event.target.value)}
            fullWidth
          >
            {contactProjectTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </AppSelectField>
          <AppTextField
            label="Experience"
            placeholder="e.g. 3 years"
            value={formState.experience}
            onChange={(event) => handleFieldChange('experience', event.target.value)}
            fullWidth
          />
          <AppSelectField
           
            label="Employment type"
            value={formState.employmentType}
            onChange={(event) => handleFieldChange('employmentType', event.target.value)}
            fullWidth
          >
            {employmentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </AppSelectField>
          <Stack spacing={0.5}>
            <AppButton component="label" variant="outlined">
              {formState.resume ? 'Change resume (PDF)' : 'Upload resume (PDF)'}
              <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
            </AppButton>
            <Typography variant="body2" color="text.secondary">
              {formState.resume ? `Selected: ${formState.resume.name}` : 'Upload your resume to speed up review.'}
            </Typography>
            {resumeError && <FormHelperText error>{resumeError}</FormHelperText>}
          </Stack>
          <AppTextField
            label="Notes"
            value={formState.notes}
            onChange={(event) => handleFieldChange('notes', event.target.value)}
            fullWidth
            multiline
            minRows={4}
          />
          {submitError && (
            <Typography color="error" variant="body2">
              {submitError}
            </Typography>
          )}
        </Stack>
      </AppDialogContent>

      {/* Actions */}
      <AppDialogActions sx={{ px: { xs: 3, sm: 4 }, pb: 3 }}>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <AppButton
            form="application-form"
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            sx={{
              background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
              color: '#fff',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 5, md: 6 },
              py: { xs: 1.5, md: 1.75 },
            
            }}
          >
            Submit Now
          </AppButton>
        </Box>
      </AppDialogActions>
    </AppDialog>
  );
};

export default ContactDialog;
