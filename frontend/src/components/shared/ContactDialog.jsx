import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { contactProjectTypes } from '../../data/servicesPage.js';

const ContactDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: subtleText }}>
              Share your requirements and we will get back within one business day.
            </Typography>
          </Stack>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 0, pb: 4 }}>
        <Stack spacing={2.5} component="form">
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" type="email" required fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>🇮🇳</Box>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Project Type" fullWidth defaultValue={contactProjectTypes[0]}>
                {contactProjectTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" fullWidth multiline minRows={4} />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            size="large"
            sx={{
              alignSelf: 'flex-start',
              background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
              color: '#fff',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 1.75 },
              '&:hover': {
                background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)'
              }
            }}
          >
            Submit Now
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
