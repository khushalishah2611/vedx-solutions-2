import { useState } from 'react';
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';

const AdminChangePasswordPage = () => {
  const [formValues, setFormValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const nextErrors = { currentPassword: '', newPassword: '', confirmPassword: '' };

    if (!formValues.currentPassword) {
      nextErrors.currentPassword = 'Current password is required.';
    }

    if (!formValues.newPassword) {
      nextErrors.newPassword = 'Enter a new password.';
    } else if (formValues.newPassword.length < 8 || !/[A-Za-z]/.test(formValues.newPassword) || !/[0-9]/.test(formValues.newPassword)) {
      nextErrors.newPassword = 'Use at least 8 characters with letters and numbers.';
    }

    if (formValues.confirmPassword !== formValues.newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
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

    setSubmitting(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setServerError(payload?.message || 'Unable to update your password.');
        return;
      }

      setSuccessMessage(payload?.message || 'Password updated successfully.');
      setFormValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change failed', error);
      setServerError('Unable to update your password right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setServerError('');
    setSuccessMessage('');
  };

  return (
    <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Stack component="form" onSubmit={handleSubmit} spacing={3} noValidate>
          <div>
            <Typography variant="h5" gutterBottom>
              Change password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Protect your account by updating your password regularly. Choose a strong passphrase that you do not reuse elsewhere.
            </Typography>
          </div>
          <Stack spacing={2}>
            <TextField
              label="Current password"
              type="password"
              fullWidth
              required
              value={formValues.currentPassword}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, currentPassword: event.target.value }))
              }
              error={Boolean(errors.currentPassword)}
              helperText={errors.currentPassword}
              autoComplete="current-password"
            />
            <TextField
              label="New password"
              type="password"
              fullWidth
              required
              value={formValues.newPassword}
              onChange={(event) => setFormValues((current) => ({ ...current, newPassword: event.target.value }))}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword}
              autoComplete="new-password"
            />
            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              required
              value={formValues.confirmPassword}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, confirmPassword: event.target.value }))
              }
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              autoComplete="new-password"
            />
          </Stack>

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
            <Button variant="outlined" onClick={handleReset} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update password'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminChangePasswordPage;
