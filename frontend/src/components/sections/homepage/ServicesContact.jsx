import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { contactProjectTypes, servicesContactImage } from '../../../data/servicesPage.js';

const ServicesContact = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
          <Stack spacing={3} sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
         Conatct us
        </Typography>
      </Stack>

      <Grid container>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            minHeight: { xs: 220, md: '100%' },
            backgroundImage: `url(${servicesContactImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <Grid item xs={12} md={7}>
          <Stack spacing={3} sx={{ p: { xs: 4, md: 6 } }}>
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Ready to build something remarkable?
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText }}>
                Tell us about your next project and we will assemble the right team within 48 hours.
              </Typography>
            </Stack>
            <Stack component="form" spacing={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField label="Name" fullWidth required variant="outlined" />
                <TextField label="Email" type="email" fullWidth required variant="outlined" />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField label="Mobile Number" fullWidth variant="outlined" />
                <TextField select label="Project Type" fullWidth defaultValue={contactProjectTypes[0]}>
                  {contactProjectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <TextField label="Description" fullWidth multiline minRows={4} variant="outlined" />

              <Button
                variant="contained"
                size="large"


                sx={{
                  background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                  },
                }}
              >
                Submit Now
              </Button>


            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServicesContact;
