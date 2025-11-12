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
  useTheme,
} from '@mui/material';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import {
  aboutHero,
  aboutHighlights,
  aboutMissionVision,
  cultureValues,
  timelineMilestones,
} from '../../data/company.js';
import {
  AboutHeroSection,
  AboutMissionVisionSection,
  AboutWhyChooseSection,
} from '../sections/aboutpage/index.js';

const AboutPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { openDialog: handleOpenContact } = useContactDialog();

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>
      <AboutHeroSection hero={aboutHero} onCtaClick={handleOpenContact} />

      <AboutWhyChooseSection highlights={aboutHighlights} />

      <AboutMissionVisionSection content={aboutMissionVision} />

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
              : alpha(theme.palette.primary.light, 0.1),
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
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
                        bgcolor: theme.palette.primary.main,
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

      <Container id="milestones" maxWidth="lg" sx={{ mt: { xs: 10, md: 12 }, pb: { xs: 10, md: 14 } }}>
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
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
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
                  <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: alpha(theme.palette.divider, 0.6) }} />
                )}
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
