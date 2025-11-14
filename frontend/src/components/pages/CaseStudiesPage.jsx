import {
  alpha,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
import { artOfLivingCaseStudy } from '../../data/caseStudies.js';

const CaseStudiesPage = () => {
  const theme = useTheme();
  const caseStudy = artOfLivingCaseStudy;

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <CaseStudyDetailHero caseStudy={caseStudy} />

      <PageSectionsContainer spacing={{ xs: 8, md: 10 }}>
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Client Requirements
          </Typography>
          <Stack spacing={2}>
            {caseStudy.clientRequirements.map((paragraph) => (
              <Typography key={paragraph} variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {paragraph}
              </Typography>
            ))}
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.secondary.main, 0.12)
                : alpha(theme.palette.secondary.main, 0.08),
          }}
        >
          <Stack spacing={1.5} textAlign={{ xs: 'center', md: 'left' }} alignItems={{ xs: 'center', md: 'flex-start' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {caseStudy.founderHighlight.name}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720 }}>
              {caseStudy.founderHighlight.message}
            </Typography>
          </Stack>
        </Paper>

        <Stack spacing={4}>
          <Stack spacing={1.5} textAlign={{ xs: 'center', md: 'left' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Core Product Features
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, mx: { xs: 'auto', md: 0 } }}>
              The app consolidates instruction, practice, and community in one place—making sustained wellbeing effortless for millions of practitioners worldwide.
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {caseStudy.coreFeatures.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    height: '100%',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 0.2)}`,
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: theme.palette.mode === 'dark' ? alpha('#3E7CCE', 0.18) : alpha('#3E7CCE', 0.12),
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 600 }}>
            Signature Journey
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {caseStudy.journeyHighlight.title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            {caseStudy.journeyHighlight.description}
          </Typography>
        </Paper>

        <Stack spacing={3}>
          <Stack spacing={1.5} textAlign={{ xs: 'center', md: 'left' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Advanced Content & Community Modules
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, mx: { xs: 'auto', md: 0 } }}>
              Beyond daily practice, Art of Living members deepen their journey through wisdom drops, group meditations, and premium workshops hosted worldwide.
            </Typography>
          </Stack>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {caseStudy.advancedContent.map((module) => (
              <Grid item xs={12} md={4} key={module.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    height: '100%',
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 0.2)}`,
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {module.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>

        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Colors & Typography
          </Typography>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 3.5 },
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 0.2)}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="overline" sx={{ letterSpacing: 2, color: 'text.secondary' }}>
                    Typography
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {caseStudy.typography.family}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {caseStudy.typography.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={{ xs: 3, md: 4 }}>
                {caseStudy.colors.map((color) => (
                  <Grid item xs={12} sm={4} key={color.value}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 0.2)}`,
                      }}
                    >
                      <Box sx={{ bgcolor: color.value, height: 96 }} />
                      <Stack spacing={1} sx={{ p: 2.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {color.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {color.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                          {color.usage}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Stack>

        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Challenges We Solved
          </Typography>
          <Stack spacing={2}>
            {caseStudy.challenges.map((challenge) => (
              <Paper
                key={challenge}
                elevation={0}
                sx={{
                  p: { xs: 3, md: 3.5 },
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 0.2)}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {challenge}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Technology Stack
          </Typography>
          <Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {caseStudy.technologyStack.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: alpha(theme.palette.secondary.main, 0.12),
                    color: theme.palette.secondary.main,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed', borderColor: alpha(theme.palette.text.secondary, 0.2) }} />

        <Stack spacing={2} textAlign={{ xs: 'center', md: 'left' }} alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Ready to craft your next wellness experience?
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 680 }}>
            We partner with mission-driven organizations to translate purposeful ideas into delightful digital journeys.
          </Typography>
        </Stack>
      </PageSectionsContainer>
    </Box>
  );
};

export default CaseStudiesPage;
