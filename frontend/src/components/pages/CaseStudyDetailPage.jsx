import { Navigate, useParams } from 'react-router-dom';
import { alpha, Box, Divider, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import PageSectionsContainer from '../shared/PageSectionsContainer.jsx';
import { caseStudiesBySlug } from '../../data/caseStudies.js';
import React, { useEffect, useState } from "react";

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const caseStudy = caseStudiesBySlug[slug];
  const theme = useTheme();

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(timer);
  }, []);

  const isDark = theme.palette.mode === 'dark';
  const accentColor = theme.palette.primary.main;
  const dividerColor = alpha(theme.palette.divider, 0.6);

  if (!caseStudy) {
    return <Navigate to="/casestudy" replace />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <CaseStudyDetailHero caseStudy={caseStudy} />

      <PageSectionsContainer>

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
                        transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                        boxShadow: '0 0 0 rgba(0,0,0,0)',
                        '& img': {
                          transition: 'transform 0.5s ease',
                        },
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: isDark
                            ? '0 22px 40px rgba(0,0,0,0.8)'
                            : '0 20px 40px rgba(15,23,42,0.18)',
                          borderColor: alpha(accentColor, 0.8),
                        },
                        '&:hover img': {
                          transform: 'scale(1.04)',
                        },
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

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Client Requirements ---------------------- */}
        <Stack spacing={6} alignItems="center" sx={{ mt: 5 }}>
          <Box
            sx={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateX(0)" : "translateX(-30px)",
              transition: "all 600ms cubic-bezier(.2,.9,.2,1)",
              textAlign: "center"
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Client Requirements
            </Typography>
          </Box>

          <Stack spacing={2} maxWidth={720} textAlign="center">
            {caseStudy.clientRequirements.map((paragraph, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  opacity: animate ? 1 : 0,
                  transform: animate ? "translateY(0)" : "translateY(10px)",
                  transition: `all 600ms cubic-bezier(.2,.9,.2,1) ${index * 120}ms`,
                }}
              >
                {paragraph}
              </Typography>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: dividerColor }} />

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
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease',
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: isDark
                        ? '0 18px 34px rgba(0,0,0,0.85)'
                        : '0 16px 30px rgba(15,23,42,0.16)',
                      borderColor: alpha(accentColor, 0.9),
                      bgcolor: isDark
                        ? alpha('#020617', 0.85)
                        : alpha('#e0f2fe', 0.4),
                    },
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.3s ease, background-image 0.3s ease',
                        '&:hover': {
                          color: 'transparent',
                          backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        },
                      }}
                    >
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

        <Divider sx={{ borderColor: dividerColor }} />

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
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDark
                ? '0 18px 32px rgba(0,0,0,0.8)'
                : '0 15px 28px rgba(15,23,42,0.15)',
            },
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

        <Divider sx={{ borderColor: dividerColor }} />

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
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease',
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: isDark
                        ? '0 18px 34px rgba(0,0,0,0.85)'
                        : '0 16px 30px rgba(15,23,42,0.16)',
                      borderColor: alpha(accentColor, 0.9),
                      bgcolor: isDark
                        ? alpha('#020617', 0.85)
                        : alpha('#e0f2fe', 0.4),
                    },
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.3s ease, background-image 0.3s ease',
                        '&:hover': {
                          color: 'transparent',
                          backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        },
                      }}
                    >
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

        <Divider sx={{ borderColor: dividerColor }} />

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
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: isDark
                      ? '0 18px 34px rgba(0,0,0,0.85)'
                      : '0 16px 30px rgba(15,23,42,0.16)',
                    borderColor: alpha(accentColor, 0.9),
                  },
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
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: isDark
                            ? '0 18px 34px rgba(0,0,0,0.85)'
                            : '0 16px 30px rgba(15,23,42,0.16)',
                          borderColor: alpha(accentColor, 0.9),
                        },
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

        <Divider sx={{ borderColor: dividerColor }} />

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
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isDark
                      ? '0 14px 26px rgba(0,0,0,0.7)'
                      : '0 12px 22px rgba(15,23,42,0.14)',
                    borderColor: alpha(accentColor, 0.85),
                  },
                }}
              >
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {challenge}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: dividerColor }} />

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
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                    cursor: 'default',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: isDark
                        ? '0 10px 20px rgba(0,0,0,0.8)'
                        : '0 10px 20px rgba(15,23,42,0.16)',
                      background: isDark
                        ? alpha('#020617', 0.9)
                        : alpha('#e0f2fe', 0.9),
                    },
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

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Final CTA ---------------------- */}
        <Stack
          spacing={2}
          textAlign={{ xs: 'center', md: 'left' }}
          alignItems={{ xs: 'center', md: 'flex-start' }}
        >
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
