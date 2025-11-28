import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const AdminVerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedEmail = useMemo(
    () => location.state?.email || sessionStorage.getItem('adminResetEmail') || '',
    [location.state]
  );
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!storedEmail) {
      navigate('/admin/forgot-password', { replace: true });
    }
  }, [navigate, storedEmail]);

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    setOtpDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const validateOtp = () => {
    const code = otpDigits.join('');

    if (code.length !== 6) {
      setError('Enter the 6 digit code sent to your email.');
      return null;
    }

    setError('');
    return code;
  };

  const handleVerify = async () => {
    const code = validateOtp();

    if (!code) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail, otp: code }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.message || 'OTP verification failed.');
        return;
      }

      sessionStorage.setItem('adminResetEmail', storedEmail);
      sessionStorage.setItem('adminResetOtp', code);
      setMessage('Code verified. Continue to create a new password.');
      navigate('/admin/reset-password');
    } catch (verifyError) {
      console.error('OTP verification failed', verifyError);
      setError('Unable to verify the code right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!storedEmail) return;

    setIsResending(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.message || 'Unable to resend code.');
        return;
      }

      setMessage('A new verification code has been sent.');
    } catch (resendError) {
      console.error('Resend code failed', resendError);
      setError('Unable to resend the code right now.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box
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
                Verify OTP
              </Typography>
              <Typography variant="h4">Enter verification code</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                We have emailed you a 6 digit one-time password. Enter the digits below to continue resetting your password.
              </Typography>
            </Stack>
            <Grid container spacing={1.5} justifyContent="center">
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={2} key={index}>
                  <TextField
                    inputRef={(element) => {
                      inputsRef.current[index] = element;
                    }}
                    value={otpDigits[index]}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: 'center', fontSize: '1.5rem' },
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            {error ? (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            ) : null}
            {message ? (
              <Typography variant="body2" color="primary">
                {message}
              </Typography>
            ) : null}
            <Stack spacing={1}>
              <Button variant="contained" size="large" onClick={handleVerify} disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify code'}
              </Button>
              <Button onClick={handleResend} color="secondary" disabled={isResending}>
                {isResending ? 'Resending...' : 'Resend code'}
              </Button>
              <Button component={RouterLink} to="/admin/forgot-password" color="secondary">
                Back to email step
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminVerifyOtpPage;
