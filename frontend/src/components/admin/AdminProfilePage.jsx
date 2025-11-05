import { Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import adminProfile from '../../data/adminProfile.js';

const AdminProfilePage = () => {
  return (
    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Stack spacing={3}>
          <div>
            <Typography variant="h5" gutterBottom>
              Admin profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update the profile details used across the admin panel and notification emails.
            </Typography>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField label="First name" fullWidth defaultValue={adminProfile.firstName} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Last name" fullWidth defaultValue={adminProfile.lastName} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email address" type="email" fullWidth defaultValue={adminProfile.email} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Mobile number" type="tel" fullWidth defaultValue={adminProfile.phone} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Job title" fullWidth defaultValue={adminProfile.role} />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained">Save changes</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminProfilePage;
