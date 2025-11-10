import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { careerHero, careerPerks, careerOpenings, hiringJourney } from '../../data/company.js';

const CareersPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const heroGradient = isDark
    ? 'linear-gradient(135deg, rgba(10,12,26,0.98) 0%, rgba(37,99,235,0.85) 45%, rgba(12,74,110,0.75) 100%)'
    : 'linear-gradient(135deg, rgba(219,234,254,0.95) 0%, rgba(191,219,254,0.82) 45%, rgba(125,211,252,0.75) 100%)';

  const applyHref = 'mailto:talent@vedxsolution.com?subject=VedX%20Careers%20-%20Application';

  return (
    <Box sx={{ pt: { xs: 12, md: 14 }, pb: { xs: 10, md: 14 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            px: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
            borderRadius: { xs: 4, md: 6 },
            background: heroGradient,
            border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.35 : 0.55)}`,
            overflow: 'hidden'
          }}
        >
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Chip
                  label={careerHero.eyebrow}
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: alpha('#fff', isDark ? 0.12 : 0.2),
                    borderColor: alpha('#fff', 0.4),
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                  }}
                />
                <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 42 }, fontWeight: 700, color: '#fff' }}>
                  {careerHero.title}
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#fff', 0.88), maxWidth: 520 }}>
                  {careerHero.description}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    component="a"
                    href={applyHref}
                    endIcon={<RocketLaunchRoundedIcon />}
                    sx={{
                      bgcolor: '#fff',
                      color: '#0f172a',
                      '&:hover': { bgcolor: alpha('#fff', 0.85) }
                    }}
                  >
                    Share your profile
                  </Button>
                  <Button
                    variant="text"
                    size="large"
                    color="inherit"
                    endIcon={<ChevronRightRoundedIcon />}
                    component="a"
                    href="#open-roles"
                    sx={{ color: alpha('#fff', 0.92) }}
                  >
                    Explore open roles
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: { xs: 260, md: 340 },
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: isDark
                    ? '0 30px 60px rgba(15,23,42,0.55)'
                    : '0 40px 70px rgba(14,116,144,0.25)'
                }}
              >
                <Stack
                  spacing={1}
                  sx={{
                    position: 'absolute',
                    bottom: 24,
                    left: 24,
                    bgcolor: alpha('#0f172a', 0.72),
                    borderRadius: 3,
                    px: 2.5,
                    py: 2,
                    color: '#fff',
                    maxWidth: 260
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Hybrid collaboration, remote-first rituals
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.78) }}>
                    Squads sync weekly, demo often, and celebrate learning together.
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container id="open-roles" maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Stack spacing={3} alignItems="flex-start" sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 600 }}>
            Now hiring
          </Typography>
          <Typography variant="h4">Open roles across our remote hubs</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 520 }}>
            We assemble squads around outcomes. Tell us where you create the most impact—even if you don&apos;t see a perfect fit
            listed here.
          </Typography>
        </Stack>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {careerOpenings.map((role) => (
            <Grid key={role.title} item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <WorkOutlineRoundedIcon color="primary" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {role.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {role.description}
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ color: 'text.secondary', fontSize: 14 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {role.location}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    •
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {role.type}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  component="a"
                  href={`${applyHref}&body=Role%3A%20${encodeURIComponent(role.title)}`}
                  endIcon={<ChevronRightRoundedIcon />}
                >
                  Apply now
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container id="benefits" maxWidth="lg" sx={{ mt: { xs: 10, md: 12 } }}>
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
          <Stack spacing={3} alignItems="flex-start">
            <Typography variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 600 }}>
              Why people love working here
            </Typography>
            <Typography variant="h4">Benefits that support you and your craft</Typography>
          </Stack>
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: { xs: 3, md: 4 } }}>
            {careerPerks.map((perk) => (
              <Grid key={perk.title} item xs={12} sm={6}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.secondary.main, isDark ? 0.18 : 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FavoriteRoundedIcon color="secondary" />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {perk.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {perk.description}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      <Container id="journey" maxWidth="lg" sx={{ mt: { xs: 10, md: 12 } }}>
        <Stack spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 600 }}>
            Hiring journey
          </Typography>
          <Typography variant="h4">What to expect when you apply</Typography>
        </Stack>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {hiringJourney.map((step) => (
            <Grid key={step.step} item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.12),
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    {step.step}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {step.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mt: { xs: 10, md: 12 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 3, md: 6 }
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 600 }}>
              Ready to build with us?
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Send across your portfolio or CV and let us know the impact you want to create.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              We review every application thoughtfully and respond within five business days.
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="large"
            color="primary"
            component="a"
            href={applyHref}
            endIcon={<TrendingUpRoundedIcon />}
          >
            Connect with talent team
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default CareersPage;
