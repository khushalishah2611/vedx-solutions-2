import { useState } from 'react';
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

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({ identifier: '', password: '' });

  const validate = () => {
    const nextErrors = { identifier: '', password: '' };

    if (!formValues.identifier.trim()) {
      nextErrors.identifier = 'Enter your email address or mobile number to continue.';
    } else {
      const looksLikeEmail = /.+@.+\..+/.test(formValues.identifier);
      const looksLikePhone = /^\+?\d{7,15}$/.test(formValues.identifier);

      if (!looksLikeEmail && !looksLikePhone) {
        nextErrors.identifier = 'Use a valid email address or phone number.';
      }
    }

    if (!formValues.password) {
      nextErrors.password = 'Password is required.';
    } else if (formValues.password.length < 8) {
      nextErrors.password = 'Password should be at least 8 characters.';
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((message) => !message);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      navigate('/admin/dashboard');
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
        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 0.5 }} elevation={12}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="overline" sx={{ letterSpacing: 3, color: 'secondary.main' }}>
                Admin Login
              </Typography>
              <Typography variant="h4">Access your control panel</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sign in with your registered email address or mobile number to manage the Vedx Solutions platform.
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <TextField
                label="Email or mobile number"
                placeholder="name@company.com / 9XXXXXXXXX"
                fullWidth
                required
                value={formValues.identifier}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, identifier: event.target.value }))
                }
                error={Boolean(errors.identifier)}
                helperText={errors.identifier}
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
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Need help logging in?
              </Typography>
              <Link component={RouterLink} to="/admin/forgot-password" underline="hover">
                Forgot password
              </Link>
            </Stack>
            <Button variant="contained" size="large" fullWidth type="submit">
              Log in
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
