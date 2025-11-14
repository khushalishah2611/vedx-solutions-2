import { Navigate, useParams } from 'react-router-dom';
import { alpha, Box, Chip, Divider, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
import { caseStudiesBySlug } from '../../data/caseStudies.js';

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const caseStudy = caseStudiesBySlug[slug];
  const theme = useTheme();

  const isDark = theme.palette.mode === 'dark';
  const accentColor = theme.palette.primary.main; // fallback accent color

  if (!caseStudy) {
    return <Navigate to="/casestudy" replace />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <CaseStudyDetailHero caseStudy={caseStudy} />

      <PageSectionsContainer spacing={{ xs: 8, md: 10 }}>

        {/* ---------------------- Screenshots Section ---------------------- */}
        {caseStudy.screenshots?.length ? (
          <Stack spacing={3} textAlign="center" alignItems="center">
            <Stack spacing={1.5} textAlign="center" alignItems="center">
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Application Screenshots
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 720,
                  mx: 'auto',
                  lineHeight: 1.8,
                }}
              >
                A glimpse into the experiences we crafted—from onboarding to practice
                streaks—captured directly from the live application.
              </Typography>
            </Stack>

            <Grid
              container
              spacing={{ xs: 2.5, md: 3 }}
              justifyContent="center"
              textAlign="center"
            >
              {caseStudy.screenshots.map((shot, index) => {
                const isFeatured = index === 0;

                return (
                  <Grid
                    item
                    key={shot.src}
                    xs={12}
                    sm={isFeatured ? 12 : 6}
                    md={isFeatured ? 6 : 3}
                    display="flex"
                    justifyContent="center"
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 0.5,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: `1px solid ${alpha(
                          theme.palette.divider,
                          isDark ? 0.6 : 0.25
                        )}`,
                        bgcolor: theme.palette.background.paper,
                      }}
                    >
                      <Box
                        component="img"
                        src={shot.src}
                        alt={shot.alt}
                        loading="lazy"
                        sx={{
                          width: '100%',
                          height: {
                            xs: 220,
                            sm: isFeatured ? 320 : 260,
                            md: isFeatured ? 360 : 260,
                          },
                          objectFit: 'cover',
                        }}
                      />

                      <Stack spacing={1} sx={{ p: { xs: 2.5, md: 3 }, textAlign: 'center' }}>
                        <Typography
                          variant="overline"
                          sx={{
                            letterSpacing: 1.8,
                            color: alpha(theme.palette.text.secondary, 0.9),
                          }}
                        >
                          Screen {index + 1}
                        </Typography>

                        {shot.caption && (
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                            {shot.caption}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        ) : null}

        {/* ---------------------- Client Requirements ---------------------- */}
        <Stack spacing={3} textAlign="center" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Client Requirements
          </Typography>

          <Stack spacing={2} maxWidth={720} textAlign="center">
            {caseStudy.clientRequirements.map((paragraph, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{ color: 'text.secondary', lineHeight: 1.8 }}
              >
                {paragraph}
              </Typography>
            ))}
          </Stack>
        </Stack>

        {/* ---------------------- Founder Highlight ---------------------- */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 0.5,
            bgcolor:
              isDark
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

        {/* ---------------------- Core Features ---------------------- */}
        <Stack spacing={4}>
          <Stack spacing={1.5} textAlign="center" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Core Product Features
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 720,
                mx: 'auto'
              }}
            >
              The app consolidates instruction, practice, and community in one place.
            </Typography>
          </Stack>


          <Grid container spacing={2}>
            {caseStudy.coreFeatures.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    height: '100%',
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.2)}`,
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

        {/* ---------------------- Journey Highlight ---------------------- */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 0.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: isDark ? alpha('#3E7CCE', 0.18) : alpha('#3E7CCE', 0.12),
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

        {/* ---------------------- Advanced Content ---------------------- */}
        <Stack spacing={3}>
          <Stack spacing={1.5} textAlign="center" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Advanced Content & Community Modules
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 720,
                mx: 'auto'
              }}
            >
              Beyond daily practice, members deepen their journey through wisdom drops & meditations.
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
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.2)}`,
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

        {/* ---------------------- Colors & Typography ---------------------- */}
        <Stack spacing={3}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
            textAlign="center"
          >
            Colors & Typography
          </Typography>


          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 3.5 },
                  height: '100%',
                  borderRadius: 0.5,
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.2)}`,
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
                        borderRadius: 0.5,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.2)}`,
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

        {/* ---------------------- Challenges Section ---------------------- */}
        <Stack spacing={3}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
            textAlign="center"
          >
            Challenges We Solved
          </Typography>
          <Stack spacing={2}>
            {caseStudy.challenges.map((challenge) => (
              <Paper
                key={challenge}
                elevation={0}
                sx={{
                  p: { xs: 1, md: 1.5 },
                  borderRadius: 0.5,
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.2)}`,
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

        {/* ---------------------- Technology Stack ---------------------- */}
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Technology Stack
          </Typography>

          <Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {caseStudy.technologyStack.map((tech) => (
                <Box
                  key={tech}
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
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {tech}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>



        {/* ---------------------- Final CTA ---------------------- */}
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

export default CaseStudyDetailPage;
