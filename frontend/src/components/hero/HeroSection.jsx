import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  alpha
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { heroContent } from '../../data/content.js';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pb: { xs: 10, md: 14 },
        pt: { xs: 12, md: 16 },
        background: 'radial-gradient(circle at top left, rgba(99,102,241,0.45), transparent 45%)'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: '-20% -10% auto',
          background:
            'linear-gradient(120deg, rgba(236,72,153,0.15), rgba(99,102,241,0.12), rgba(14,165,233,0.1))',
          filter: 'blur(120px)',
          height: '60%',
          transform: 'rotate(-5deg)'
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Chip
                label={heroContent.eyebrow}
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: alpha('#6366f1', 0.16),
                  color: 'primary.light',
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  borderRadius: 2
                }}
              />
              <Typography variant="h2" sx={{ fontSize: { xs: 38, md: 56 }, lineHeight: 1.1 }}>
                {heroContent.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: 16, md: 18 } }}>
                {heroContent.description}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" color="primary" size="large">
                  {heroContent.ctaPrimary}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  startIcon={<PlayArrowRoundedIcon />}
                >
                  {heroContent.ctaSecondary}
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} pt={2}>
                {heroContent.stats.map((stat) => (
                  <Box key={stat.label}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                background:
                  'linear-gradient(140deg, rgba(30,64,175,0.55) 0%, rgba(17,24,39,0.9) 60%, rgba(76,29,149,0.6) 100%)',
                p: { xs: 3, md: 4 },
                minHeight: 360,
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 2 }}>
                  Client spotlight
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  "From stagnation to breakout growth in one quarter."
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  A commerce brand scaled revenue 3.4x with VEDX orchestrating experimentation across paid, product, and
                  lifecycle moments.
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;