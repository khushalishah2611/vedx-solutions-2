import { Box, Card, CardContent, Container, Grid, MenuItem, Stack, Typography, alpha, useTheme } from '@mui/material';
import { AppButton, AppSelectField, AppTextField } from '../shared/FormControls.jsx';

import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { contactProjectTypes } from '../../data/servicesPage.js';

const contactLocation = {
  address: 'Suite 6, Sharvari, Vadodra, India',
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
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box
      component="main"
      sx={{
        bgcolor: 'background.default',
        overflowX: 'hidden'
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.82)), url(https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: isDark ? 'brightness(0.9)' : 'brightness(0.85)',
         minHeight: { xs: "60vh", md: "70vh" },
          display: 'flex',
          alignItems: 'center',
          pb: { xs: 10, md: 14 },
          pt: { xs: 12, md: 18 },
          color: 'common.white'
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            zIndex: 1,
            px: { xs: 3, md: 20 }
          }}
        >
          <Stack
            spacing={2.5}
            alignItems={{ xs: 'center', md: 'flex-start' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 34, sm: 42, md: 56 },
                fontWeight: 800,
                lineHeight: 1.1,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Contact Us
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: alpha('#ffffff', 0.85),
                maxWidth: 640,
                fontSize: { xs: 14, md: 16 },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              We are here to discuss your ideas, understand your challenges, and
              build the next big thing together.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container
        id="contact"
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 }
        }}
      ><Box my={5}>
          <Stack spacing={{ xs: 6, md: 10 }}>
            {/* Section Title */}
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderRadius: 0.5,
                  border: `1px solid ${alpha('#ffffff', 0.1)}`,
                  background: !isDark
                    ? alpha('#ddddddff', 0.9)
                    : alpha('#0000007c', 0.9),
                  color: alpha(accentColor, 0.9),
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontSize: 11,
                  lineHeight: 1.3,
                  width: 'fit-content',
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Contact Details
                </Box>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: { xs: 26, sm: 30, md: 40 }
                }}
              >
                Reach Out to Us @
              </Typography>
            </Stack>

            {/* Contact Cards */}
            <Grid
              spacing={2}
              container
              sx={{
                p: { xs: 3, sm: 4 },
                m: 5
              }}
            >
              {contactDetails.map((detail) => (
                <Grid item xs={12} md={4} key={detail.label}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 0.5,
                      background: isDark
                        ? 'linear-gradient(160deg, #0f172a 0%, #111827 100%)'
                        : 'linear-gradient(160deg, #ffffff 0%, #f7f8ff 100%)',
                      border: `1px solid ${alpha(
                        isDark ? accentColor : theme.palette.primary.main,
                        0.3
                      )}`,
                      boxShadow: isDark
                        ? '0 18px 45px rgba(3, 7, 18, 0.65)'
                        : '0 18px 45px rgba(14, 18, 68, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2} alignItems="center" textAlign="center">
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
                              color: 'inherit',
                              wordBreak: 'break-word'
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
            <Grid
              container
              spacing={{ md: 2 }}
            >
              {/* Form column */}
              <Grid item xs={12} md={6}>
                <Stack
                  spacing={3}
                  sx={{
                    height: '100%',
                    borderRadius: 0.5,
                    p: { xs: 3, sm: 4 },
                    background: isDark
                      ? 'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))'
                      : 'linear-gradient(145deg, rgba(248,250,252,0.98), rgba(219,234,254,0.9))',
                    boxShadow: isDark
                      ? '0 24px 48px rgba(3,7,18,0.85)'
                      : '0 24px 48px rgba(15,23,42,0.15)'
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Share Your Project Brief
                    </Typography>
                    <Typography variant="body1" sx={{ color: subtleText }}>
                      Fill out the form and we will reach out within 24 hours with a tailored plan
                      for your requirements.
                    </Typography>
                  </Stack>

                  <Stack component="form" spacing={2} noValidate>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                      <AppTextField label="Name" fullWidth required variant="outlined" size="medium" />
                      <AppTextField label="Email" type="email" fullWidth required variant="outlined" size="medium" />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                      <AppTextField label="Mobile Number" fullWidth variant="outlined" size="medium" />
                      <AppSelectField
                       
                        label="Project Type"
                        fullWidth
                        defaultValue={contactProjectTypes?.[0] || ''}
                        variant="outlined"
                        size="medium"
                      >
                        {(contactProjectTypes || []).map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </AppSelectField>
                    </Stack>

                    <AppTextField
                      label="Description"
                      fullWidth
                      multiline
                      minRows={4}
                      variant="outlined"
                      size="medium"
                    />

                    <AppButton
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
                        py: 1.25,
                        '&:hover': {
                          background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                        }
                      }}
                    >
                      Submit Now
                    </AppButton>
                  </Stack>
                </Stack>
              </Grid>

              {/* Map column */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    borderRadius: 0.5,
                    overflow: 'hidden',
                    boxShadow: isDark
                      ? '0 30px 60px rgba(3, 7, 18, 0.75)'
                      : '0 30px 45px rgba(15, 23, 42, 0.18)',
                    height: { xs: 260, sm: 340, md: '100%' },
                    width: '100%',
                    maxWidth: '100%'
                  }}
                >
                  <Box
                    component="iframe"
                    title="Vedx Solution Pvt Ltd map"
                    src={contactLocation.embedUrl}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sx={{
                      display: 'block',
                      border: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
