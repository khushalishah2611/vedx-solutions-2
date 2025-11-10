import {
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { aboutHero, aboutStats, aboutHighlights, cultureValues, timelineMilestones } from '../../data/company.js';

const iconComponents = {
  insights: InsightsRoundedIcon,
  groups: Groups2RoundedIcon,
  verified: VerifiedRoundedIcon
};

const AboutPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const heroGradient = isDark
    ? 'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,64,175,0.75) 55%, rgba(99,102,241,0.3) 100%)'
    : 'linear-gradient(135deg, rgba(226,232,255,0.96) 0%, rgba(191,219,254,0.85) 55%, rgba(79,70,229,0.12) 100%)';

  return (
    <Box sx={{ pt: { xs: 12, md: 14 }, pb: { xs: 10, md: 14 }, bgcolor: 'background.default' }}>
      <Container id="story" maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            px: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
            borderRadius: { xs: 4, md: 6 },
            background: heroGradient,
            border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`
          }}
        >
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Chip
                  label={aboutHero.eyebrow}
                  color="primary"
                  variant="outlined"
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: alpha('#fff', isDark ? 0.08 : 0.2),
                    borderColor: alpha('#fff', isDark ? 0.2 : 0.4),
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                  }}
                />
                <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 44 }, fontWeight: 700, color: '#fff' }}>
                  {aboutHero.title}
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#fff', 0.88), maxWidth: 520 }}>
                  {aboutHero.description}
                </Typography>
                <Grid container spacing={2}>
                  {aboutStats.map((stat) => (
                    <Grid key={stat.label} item xs={6} sm={3}>
                      <Stack spacing={0.5}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.75), letterSpacing: 0.5 }}>
                          {stat.label}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: { xs: 260, md: 360 },
                  boxShadow: isDark
                    ? '0 30px 60px rgba(15,23,42,0.55)'
                    : '0 40px 70px rgba(79,70,229,0.22)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(160deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.65) 65%, rgba(15,23,42,0.75) 100%)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={aboutHero.image}
                  alt="VedX team collaborating"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    position: 'absolute',
                    bottom: 24,
                    left: 24,
                    bgcolor: alpha('#0f172a', 0.72),
                    borderRadius: 999,
                    px: 2.5,
                    py: 1.25,
                    color: '#fff'
                  }}
                >
                  <TimelineRoundedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    From discovery workshops to launch squads
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {aboutHighlights.map((highlight) => {
            const Icon = iconComponents[highlight.icon] ?? StarRoundedIcon;
            return (
              <Grid key={highlight.title} item xs={12} md={4}>
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
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon color="primary" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {highlight.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                    {highlight.description}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Container id="culture" maxWidth="lg" sx={{ mt: { xs: 10, md: 12 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            background: isDark
              ? alpha('#0f172a', 0.8)
              : alpha(theme.palette.primary.light, 0.1)
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 600 }}>
                Culture & craft
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                What working with VedX feels like
              </Typography>
            </Box>
          </Stack>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {cultureValues.map((value) => (
              <Grid key={value.title} item xs={12} sm={6}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main
                      }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {value.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {value.description}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      <Container id="milestones" maxWidth="lg" sx={{ mt: { xs: 10, md: 12 } }}>
        <Stack spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.5, fontWeight: 600 }}>
            Our journey
          </Typography>
          <Typography variant="h4">Milestones that shaped VedX Solutions</Typography>
        </Stack>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          <Stack spacing={4}>
            {timelineMilestones.map((milestone, index) => (
              <Box key={milestone.year}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      label={milestone.year}
                      sx={{
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.15)
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {milestone.headline}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {milestone.description}
                  </Typography>
                </Stack>
                {index !== timelineMilestones.length - 1 && (
                  <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: alpha(theme.palette.divider, 0.6) }} />)
                }
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
