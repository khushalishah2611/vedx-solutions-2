import { Box, Button, Card, CardContent, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import adminProfile from '../../data/adminProfile.js';

const metrics = [
  { label: 'Active Campaigns', value: 8, trend: '+2 this week' },
  { label: 'Pending Approvals', value: 3, trend: 'Awaiting review' },
  { label: 'New Leads', value: 42, trend: '+18% vs last week' }
];

const AdminDashboardPage = () => {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {adminProfile.firstName}. Review the latest activity and quick stats from your administration panel.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Account owner
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                <Typography variant="h5">{adminProfile.fullName}</Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Username: @{adminProfile.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {adminProfile.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mobile: {adminProfile.phone}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {metrics.map((metric) => (
          <Grid item xs={12} md={4} key={metric.label}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h3" sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {metric.trend}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account completion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete your profile information and verify contact details to reach 100% account readiness.
          </Typography>
          <LinearProgress variant="determinate" value={78} sx={{ mt: 3, height: 10, borderRadius: 5 }} />
        </CardContent>
      </Card>
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick actions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Jump directly to the most-used admin tools once you have signed in.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={RouterLink}
              to="/admin/contacts"
              variant="contained"
              color="primary"
            >
              View contacts
            </Button>
            <Button component={RouterLink} to="/admin/profile" variant="outlined">
              Manage profile
            </Button>
            <Button component={RouterLink} to="/admin/change-password" variant="outlined" color="secondary">
              Change password
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AdminDashboardPage;
