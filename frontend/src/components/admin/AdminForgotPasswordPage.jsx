import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { apiUrl } from "../../utils/const";

const AdminForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Enter your registered email address.');
      return false;
    }

    const looksLikeEmail = /.+@.+\..+/.test(email.trim());
    if (!looksLikeEmail) {
      setError('Provide a valid email address.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    if (!validate()) return;

    setServerMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const contentType = response.headers.get('content-type');
      const payload = contentType?.includes('application/json')
        ? await response.json()
        : null;

      const fallbackMessage = !payload ? await response.text() : '';

      if (!response.ok) {
        const message =
          payload?.message || fallbackMessage || 'Unable to send verification code.';
        setServerMessage(message);
        return;
      }

      // Store session

      sessionStorage.setItem('adminResetEmail', email.trim());
      sessionStorage.removeItem('adminResetOtp');

      setServerMessage('Verification code sent to your email.');

      navigate('/admin/verify-otp');
    } catch (error) {
      console.error('Failed to start reset', error);
      setServerMessage('Unable to send verification code right now.');
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
                Forgot password
              </Typography>
              <Typography variant="h4">Send reset link</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter the email linked with your administrator account. We will send a verification code to reset your password.
              </Typography>
            </Stack>

            <TextField
              label="Registered email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(error)}
              helperText={error}
              autoComplete="username"
            />

            {serverMessage && (
              <Typography variant="body2" color="error">
                {serverMessage}
              </Typography>
            )}

            <Button variant="contained" size="large" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send verification code'}
            </Button>

            <Button component={RouterLink} to="/admin" color="secondary">
              Back to login
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminForgotPasswordPage;
