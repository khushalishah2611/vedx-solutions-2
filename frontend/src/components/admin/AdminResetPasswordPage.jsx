import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AdminResetPasswordPage = () => {
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
                Reset password
              </Typography>
              <Typography variant="h4">Create a new password</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter a new password for your admin account. Use a mix of letters, numbers, and symbols to keep it secure.
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <TextField label="New password" type="password" fullWidth required />
              <TextField label="Confirm new password" type="password" fullWidth required />
            </Stack>
            <Button variant="contained" size="large" component={RouterLink} to="/admin">
              Update password and login
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminResetPasswordPage;
