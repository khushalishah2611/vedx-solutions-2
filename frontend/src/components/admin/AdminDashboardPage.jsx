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

    </Stack>
  );
};

export default AdminDashboardPage;
