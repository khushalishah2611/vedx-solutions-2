import { useEffect, useState } from 'react';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const AdminResetPasswordPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '', server: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = sessionStorage.getItem('adminResetEmail');
  const otp = sessionStorage.getItem('adminResetOtp');

  useEffect(() => {
    if (!email || !otp) {
      navigate('/admin/forgot-password', { replace: true });
    }
  }, [email, navigate, otp]);

  const validate = () => {
    const nextErrors = { newPassword: '', confirmPassword: '', server: '' };

    if (!newPassword) {
      nextErrors.newPassword = 'Enter a new password.';
    } else {
      const meetsLength = newPassword.length >= 8;
      const hasLetters = /[A-Za-z]/.test(newPassword);
      const hasNumbers = /[0-9]/.test(newPassword);

      if (!meetsLength || !hasLetters || !hasNumbers) {
        nextErrors.newPassword = 'Password must be 8+ characters with letters and numbers.';
      }
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your new password.';
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);

    return Object.values(nextErrors).every((value) => !value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors((current) => ({ ...current, server: '' }));

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setErrors((current) => ({ ...current, server: payload?.message || 'Reset failed.' }));
        return;
      }

      sessionStorage.removeItem('adminResetEmail');
      sessionStorage.removeItem('adminResetOtp');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminSessionExpiry');
      navigate('/admin', { replace: true, state: { resetSuccess: true } });
    } catch (resetError) {
      console.error('Reset password failed', resetError);
      setErrors((current) => ({ ...current, server: 'Unable to update password right now.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top, rgba(79,70,229,0.35), rgba(15,23,42,0.95) 55%), linear-gradient(160deg, rgba(15,23,42,1), rgba(2,6,23,1))'
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }} elevation={12}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="overline" sx={{ letterSpacing: 3, color: 'secondary.main' }}>
                Reset password
              </Typography>
              <Typography variant="h4">Create a new password</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter a new password for your admin account. Use a mix of letters, numbers, and symbols to keep it secure.
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <TextField
                label="New password"
                type="password"
                fullWidth
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword}
                autoComplete="new-password"
              />
              <TextField
                label="Confirm new password"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                autoComplete="new-password"
              />
            </Stack>
            {errors.server ? (
              <Typography variant="body2" color="error">
                {errors.server}
              </Typography>
            ) : null}
            <Button variant="contained" size="large" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update password and login'}
            </Button>
            <Button component={RouterLink} to="/admin/forgot-password" color="secondary">
              Start over
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminResetPasswordPage;
