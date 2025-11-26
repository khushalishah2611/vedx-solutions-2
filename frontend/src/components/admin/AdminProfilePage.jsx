import { useState } from 'react';
import { Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { getStoredAdminProfile, setStoredAdminProfile } from '../../data/adminProfile.js';

const AdminProfilePage = () => {
  const [formValues, setFormValues] = useState(() => {
    const adminProfile = getStoredAdminProfile();
    return {
      firstName: adminProfile.firstName || '',
      lastName: adminProfile.lastName || '',
      email: adminProfile.email || '',
    };
  });

  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const nextErrors = { firstName: '', lastName: '', email: '' };

    if (!formValues.firstName.trim() && !formValues.lastName.trim()) {
      nextErrors.firstName = 'Enter at least a first name to continue.';
    }

    if (!formValues.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!/.+@.+\..+/.test(formValues.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      setServerError('Your session expired. Please log in again.');
      return;
    }

    setSaving(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formValues.firstName.trim(),
          lastName: formValues.lastName.trim(),
          email: formValues.email.trim(),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setServerError(payload?.message || 'Unable to update your profile. Please try again.');
        return;
      }

      if (payload.admin) {
        setStoredAdminProfile(payload.admin);
      }

      setSuccessMessage(payload?.message || 'Profile updated successfully.');
    } catch (error) {
      console.error('Profile update failed', error);
      setServerError('Unable to update your profile right now.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const adminProfile = getStoredAdminProfile();
    setFormValues({
      firstName: adminProfile.firstName || '',
      lastName: adminProfile.lastName || '',
      email: adminProfile.email || '',
    });
    setErrors({ firstName: '', lastName: '', email: '' });
    setServerError('');
    setSuccessMessage('');
  };

  return (
    <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Stack component="form" onSubmit={handleSubmit} spacing={3} noValidate>
          <div>
            <Typography variant="h5" gutterBottom>
              Admin profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update the profile details used across the admin panel and notification emails.
            </Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First name"
                fullWidth
                value={formValues.firstName}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, firstName: event.target.value }))
                }
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last name"
                fullWidth
                value={formValues.lastName}
                onChange={(event) => setFormValues((current) => ({ ...current, lastName: event.target.value }))}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                value={formValues.email}
                onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>

          </Grid>

          {serverError ? (
            <Typography variant="body2" color="error">
              {serverError}
            </Typography>
          ) : null}

          {successMessage ? (
            <Typography variant="body2" color="success.main">
              {successMessage}
            </Typography>
          ) : null}

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined" onClick={handleReset} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminProfilePage;
