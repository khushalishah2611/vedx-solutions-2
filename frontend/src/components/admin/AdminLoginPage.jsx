import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { setStoredAdminProfile } from '../../data/adminProfile.js';

import { API_BASE } from "../../utils/const"; 
const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------------
  // CHECK ACTIVE SESSION
  // ---------------------
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    let cancelled = false;

    const verifySession = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/admin/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminSessionExpiry');
          localStorage.removeItem('adminProfile');
          return;
        }

        const payload = await response.json();

        if (!cancelled && payload?.valid) {
          if (payload.admin) {
            setStoredAdminProfile(payload.admin);
          }
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Failed to validate session', error);
      }
    };

    verifySession();
    return () => (cancelled = true);
  }, [navigate]);

  // ---------------------
  // FORM VALIDATION
  // ---------------------
  const validate = () => {
    const nextErrors = { email: '', password: '' };

    if (!formValues.email.trim()) {
      nextErrors.email = 'Enter your email address to continue.';
    } else if (!/.+@.+\..+/.test(formValues.email)) {
      nextErrors.email = 'Use a valid email address.';
    }

    if (!formValues.password) {
      nextErrors.password = 'Password is required.';
    } else if (formValues.password.length < 8) {
      nextErrors.password = 'Password should be at least 8 characters.';
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  // ---------------------
  // LOGIN SUBMIT HANDLER
  // ---------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setServerError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formValues.email.trim(),
          password: formValues.password,
        }),
      });

      const contentType = response.headers.get('content-type');
      const payload = contentType?.includes('application/json')
        ? await response.json()
        : null;

      const fallbackMessage = !payload ? await response.text() : '';

      if (!response.ok) {
        const message =
          payload?.message ||
          fallbackMessage ||
          `Unable to log in (status ${response.status}).`;
        setServerError(message);
        return;
      }

      // Store session
      localStorage.setItem('adminToken', payload.token);
      localStorage.setItem('adminSessionExpiry', payload.expiresAt);

      if (payload.admin) {
        setStoredAdminProfile(payload.admin);
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setServerError('Unable to log in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------
  // UI
  // ---------------------
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
        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 0.5 }} elevation={12}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="overline" sx={{ letterSpacing: 3, color: 'secondary.main' }}>
                Admin Login
              </Typography>
              <Typography variant="h4">Access your control panel</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sign in with your registered email address to manage the Vedx Solutions platform.
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <TextField
                label="Email address"
                placeholder="name@company.com"
                fullWidth
                required
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, email: event.target.value }))
                }
                error={Boolean(errors.email)}
                helperText={errors.email}
                autoComplete="username"
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={formValues.password}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, password: event.target.value }))
                }
                error={Boolean(errors.password)}
                helperText={errors.password}
                autoComplete="current-password"
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              <Typography variant="body2" color="text.secondary">
                Need help logging in?
              </Typography>
              <Link component={RouterLink} to="/admin/forgot-password" underline="hover">
                Forgot password
              </Link>
            </Stack>

            {serverError && (
              <Typography variant="body2" color="error">
                {serverError}
              </Typography>
            )}

            <Button variant="contained" size="large" fullWidth type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </Button>

            <Button component={RouterLink} to="/" color="secondary">
              Back to website
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLoginPage;
