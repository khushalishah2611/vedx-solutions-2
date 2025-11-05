import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';

const AdminChangePasswordPage = () => {
  return (
    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
      <CardContent>
        <Stack spacing={3}>
          <div>
            <Typography variant="h5" gutterBottom>
              Change password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Protect your account by updating your password regularly. Choose a strong passphrase that you do not reuse elsewhere.
            </Typography>
          </div>
          <Stack spacing={2}>
            <TextField label="Current password" type="password" fullWidth required />
            <TextField label="New password" type="password" fullWidth required />
            <TextField label="Confirm new password" type="password" fullWidth required />
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined">Cancel</Button>
            <Button variant="contained">Update password</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminChangePasswordPage;
