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
import { Link as RouterLink } from 'react-router-dom';

const AdminLoginPage = () => {
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
              />
              <TextField label="Password" type="password" fullWidth required />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Need help logging in?
              </Typography>
              <Link component={RouterLink} to="/admin/forgot-password" underline="hover">
                Forgot password
              </Link>
            </Stack>
            <Button
              variant="contained"
              size="large"
              fullWidth
              component={RouterLink}
              to="/admin/dashboard"
            >
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
