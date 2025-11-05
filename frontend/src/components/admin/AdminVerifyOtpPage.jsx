import { Box, Button, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AdminVerifyOtpPage = () => {
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
                  <TextField inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem' } }} />
                </Grid>
              ))}
            </Grid>
            <Stack spacing={1}>
              <Button variant="contained" size="large" component={RouterLink} to="/admin/reset-password">
                Verify code
              </Button>
              <Button component={RouterLink} to="/admin/forgot-password" color="secondary">
                Resend code
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminVerifyOtpPage;
