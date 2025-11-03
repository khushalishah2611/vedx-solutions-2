import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top, rgba(99,102,241,0.35), rgba(2,6,23,0.95) 55%), linear-gradient(160deg, rgba(2,6,23,1), rgba(15,23,42,1))'
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 4, md: 6 } }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="overline" sx={{ letterSpacing: 3, color: 'secondary.main' }}>
                Admin Console
              </Typography>
              <Typography variant="h4">Welcome back</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sign in to access campaign performance dashboards, automation controls, and governance settings.
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <TextField label="Email" type="email" fullWidth variant="outlined" />
              <TextField label="Password" type="password" fullWidth variant="outlined" />
            </Stack>
            <Button variant="contained" size="large">
              Log in
            </Button>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Need to go back to the website?{' '}
              <Button component={RouterLink} to="/" color="secondary" size="small">
                Return home
              </Button>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLayout;