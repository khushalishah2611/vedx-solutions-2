import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AdminForgotPasswordPage = () => {
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
                Forgot password
              </Typography>
              <Typography variant="h4">Send reset link</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter the email address linked with your administrator account. We will send a verification code to reset your password.
              </Typography>
            </Stack>
            <TextField label="Registered email" type="email" fullWidth required />
            <Button variant="contained" size="large" component={RouterLink} to="/admin/verify-otp">
              Send verification code
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
