import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80';

const HERO_STATS = [
  { label: 'Projects Delivered', value: '120+' },
  { label: 'Client Satisfaction', value: '98%' },
  { label: 'Avg. Time to Kick-off', value: '10 Days' }
];

const ServicesHero = ({ onContactClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: isDark ? alpha('#0f172a', 0.9) : '#f8fafc'
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 12, md: 16 } }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Chip
                label="Full Stack Development Company"
                sx={{
                  bgcolor: alpha(accentColor, 0.15),
                  color: accentColor,
                  fontWeight: 600,
                  letterSpacing: 0.75,
                  px: 1.5,
                  py: 1.5,
                  borderRadius: 999,
                  width: 'fit-content'
                }}
              />
              <Typography
                variant="h1"
                sx={{ fontSize: { xs: 40, md: 56 }, fontWeight: 800, lineHeight: 1.1 }}
              >
                Build Without Limits with Our Full Stack Development Company
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 540 }}>
                VedX Solutions offers full stack development services to help reach your business objectives across platforms.
                Our agile squads deliver resilient, scalable solutions with zero disruption to your operations.
              </Typography>
              <Stack spacing={{ xs: 3, sm: 5 }} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onContactClick}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 999,
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                    boxShadow: '0 20px 45px rgba(168,77,255,0.25)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)'
                    }
                  }}
                >
                  Contact Us
                </Button>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2.5, sm: 4 }}>
                  {HERO_STATS.map((stat) => (
                    <Stack key={stat.label} spacing={0.5}>
                      <Typography
                        component="span"
                        sx={{ fontSize: { xs: 28, md: 32 }, fontWeight: 700, color: accentColor }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography component="span" variant="body2" sx={{ color: subtleText, fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                height: { xs: 320, md: 460 },
                boxShadow: isDark
                  ? '0 40px 80px rgba(15,23,42,0.6)'
                  : '0 40px 80px rgba(15,23,42,0.18)'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'linear-gradient(135deg, rgba(79,70,229,0.65), rgba(236,72,153,0.65))',
                  zIndex: 1
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${HERO_IMAGE})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  mixBlendMode: 'overlay'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 24,
                  borderRadius: 3,
                  border: `1px solid ${alpha('#ffffff', 0.35)}`,
                  backdropFilter: 'blur(12px)',
                  backgroundColor: alpha('#ffffff', isDark ? 0.08 : 0.25),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 3,
                  zIndex: 2
                }}
              >
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                  Seamless Delivery Pods
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.85) }}>
                  Dedicated teams that plug into your roadmap, keeping execution transparent and dependable.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesHero;
