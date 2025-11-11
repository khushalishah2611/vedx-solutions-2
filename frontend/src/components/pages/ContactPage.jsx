import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { contactProjectTypes, servicesContactImage } from '../../data/servicesPage.js';

const contactLocation = {
  address: 'Suite 6, Shivam, Gujarat, India',
  mapUrl: 'https://maps.app.goo.gl/4eSx5vwd2B52r7SU6',
  embedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.931298711962!2d73.16464287503293!3d22.618272779458066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc92cc69482e9%3A0x4304382e37f95998!2sVedx%20solution%20Pvt%20ltd!5e0!3m2!1sen!2sin!4v1707162589470!5m2!1sen!2sin'
};

const contactDetails = [
  {
    label: 'Contact Phone Number',
    value: '9099968634',
    icon: <PhoneInTalkRoundedIcon fontSize="large" />,
    href: 'tel:9099968634'
  },
  {
    label: 'Our Email Address',
    value: 'contact@vedxsolution.com',
    icon: <MailOutlineRoundedIcon fontSize="large" />,
    href: 'mailto:contact@vedxsolution.com'
  },
  {
    label: 'Our Location',
    value: contactLocation.address,
    icon: <LocationOnRoundedIcon fontSize="large" />,
    href: contactLocation.mapUrl,
    external: true
  }
];

const ContactPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="main" sx={{ pt: { xs: 10, md: 14 } }}>
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(135deg, rgba(10, 13, 40, 0.85), rgba(12, 12, 20, 0.65)), url(https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'common.white',
          py: { xs: 12, md: 16 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={2} alignItems="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 36, md: 56 },
                textTransform: 'uppercase',
                letterSpacing: 2,
                backgroundImage: 'linear-gradient(90deg, #5ec2ff 0%, #a84dff 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Contact us
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.72),
                maxWidth: 640
              }}
            >
              We are here to discuss your ideas, understand your challenges, and build the next big thing together.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Stack spacing={{ xs: 6, md: 8 }}>
          <Stack spacing={3} alignItems="center">
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: 2
              }}
            >
              Contact Details
            </Typography>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                fontSize: { xs: 32, md: 42 }
              }}
            >
              Reach Out to Us @
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {contactDetails.map((detail) => (
              <Grid item xs={12} md={4} key={detail.label}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(33, 34, 55, 0.9), rgba(18, 18, 30, 0.95))'
                      : 'linear-gradient(135deg, rgba(250, 250, 255, 0.98), rgba(238, 240, 255, 0.92))',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                    boxShadow: '0 18px 45px rgba(14, 18, 68, 0.22)'
                  }}
                >
                  <CardContent>
                    <Stack spacing={2.5} alignItems="center" textAlign="center">
                      <Box
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          background: 'linear-gradient(135deg, #FF5E5E 0%, #A84DFF 100%)',
                          color: 'common.white'
                        }}
                      >
                        {detail.icon}
                      </Box>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {detail.label}
                        </Typography>
                        <Typography
                          component="a"
                          href={detail.href}
                          target={detail.external ? '_blank' : undefined}
                          rel={detail.external ? 'noopener noreferrer' : undefined}
                          sx={{
                            fontSize: 18,
                            fontWeight: 700,
                            textDecoration: 'none',
                            color: 'inherit'
                          }}
                        >
                          {detail.value}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  minHeight: { xs: 360, md: '100%' },
                  backgroundImage: `url(${servicesContactImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Stack
                spacing={3}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.9 : 1),
                  boxShadow: isDark ? '0 20px 45px rgba(4, 8, 34, 0.55)' : '0 16px 32px rgba(15, 23, 42, 0.12)',
                  p: { xs: 3, md: 4 }
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Share Your Project Brief
                  </Typography>
                  <Typography variant="body1" sx={{ color: subtleText }}>
                    Fill out the form and we will reach out within 24 hours with a tailored plan for your requirements.
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
                      alignSelf: { xs: 'stretch', sm: 'flex-start' },
                      background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                      color: '#fff',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 4, sm: 6 },
                      '&:hover': {
                        background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                      }
                    }}
                  >
                    Submit Now
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Box
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: isDark ? '0 30px 60px rgba(3, 7, 18, 0.75)' : '0 30px 45px rgba(15, 23, 42, 0.18)',
              '&::after': {
                content: '""',
                display: 'block',
                paddingBottom: { xs: '62%', md: '45%' }
              }
            }}
          >
            <Box
              component="iframe"
              title="VedX Solutions Pvt Ltd map"
              src={contactLocation.embedUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sx={{
                border: 0,
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%'
              }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ContactPage;
