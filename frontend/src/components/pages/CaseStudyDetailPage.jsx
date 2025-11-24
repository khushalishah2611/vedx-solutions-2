import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  alpha,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import { caseStudiesBySlug, caseStudiesList } from '../../data/caseStudies.js';

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const caseStudy = caseStudiesBySlug[slug] || null;
  const theme = useTheme();

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(timer);
  }, []);

  const isDark = theme.palette.mode === 'dark';
  const accentColor = caseStudy?.accentColor || theme.palette.primary.main;
  const dividerColor = alpha(theme.palette.divider, 0.6);

  const featureBadges = useMemo(() => {
    const badges = [
      ...(caseStudy?.coreFeatures?.map((feature) => feature.title) || []),
      ...(caseStudy?.advancedContent?.map((module) => module.title) || []),
    ];

    return Array.from(new Set(badges)).slice(0, 12);
  }, [caseStudy]);

  const relatedCaseStudies = useMemo(
    () => caseStudiesList.filter((item) => item.slug !== slug).slice(0, 3),
    [slug]
  );

  if (!caseStudy) {
    return <Navigate to="/casestudy" replace />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <CaseStudyDetailHero caseStudy={caseStudy} />

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 20 },
          py: { xs: 6, md: 10 },
        }}
      >
        {/* ---------------------- Wrapper Stack ---------------------- */}
        <Stack spacing={{ xs: 5, md: 8 }}>
          {/* ---------------------- Project Overview ---------------------- */}
          <Grid container spacing={4} alignItems="center">
            {/* Left Side Image */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: `1px solid ${alpha(accentColor, 0.35)}`,
                  background: alpha(accentColor, isDark ? 0.12 : 0.08),
                }}
              >
                <Box
                  component="img"
                  src={caseStudy.heroImage}
                  alt="overview image"
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'scale(1)' : 'scale(1.04)',
                    transition: 'all 700ms ease',
                  }}
                />
              </Paper>
            </Grid>

            {/* Right Side Content */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Chip
                  label="Project Overview"
                  sx={{
                    width: 'fit-content',
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    bgcolor: isDark ? alpha('#ffffff', 0.08) : '#ffffff',
                    color: isDark ? '#ffffff' : theme.palette.text.primary,
                    borderRadius: 999,
                    px: 1.5,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'all 500ms ease',
                  }}
                />

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'all 500ms ease 120ms',
                  }}
                >
                  Inspire more {caseStudy.category?.toLowerCase() || 'growth'}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.9,
                    maxWidth: 900,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'all 500ms ease 220ms',
                  }}
                >
                  {caseStudy.excerpt}
                </Typography>

                {caseStudy.tagline && (
                  <Chip
                    icon={<BoltRoundedIcon fontSize="small" />}
                    label={caseStudy.tagline}
                    sx={{
                      alignSelf: { xs: 'stretch', sm: 'flex-start' },
                      bgcolor: isDark ? alpha('#0ea5e9', 0.18) : alpha('#0ea5e9', 0.12),
                      color: isDark ? '#e0f2fe' : '#0f172a',
                      borderRadius: 999,
                      py: 1.2,
                      px: 1.8,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateY(0)' : 'translateY(12px)',
                      transition: 'all 500ms ease 320ms',
                    }}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Divider sx={{ borderColor: dividerColor, my: { xs: 5, md: 7 } }} />

        {/* ---------------------- Our Approach ---------------------- */}
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <Chip
                label="Our Approach"
                sx={{
                  width: 'fit-content',
                  fontWeight: 700,
                  bgcolor: isDark ? alpha('#ffffff', 0.08) : '#ffffff',
                  color: isDark ? '#ffffff' : theme.palette.text.primary,
                  borderRadius: 999,
                  px: 1.5,
                }}
              />

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Building experiences that stay on the correct path
              </Typography>

              <Stack spacing={1.5}>
                {caseStudy.clientRequirements?.slice(0, 2).map((paragraph, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.9,
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateY(0)' : 'translateY(12px)',
                      transition: `all 500ms ease ${index * 80}ms`,
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 0,
                overflow: 'hidden',
                borderRadius: 2,
                border: `1px solid ${alpha(accentColor, 0.35)}`,
                background: alpha(accentColor, isDark ? 0.12 : 0.09),
                minHeight: { xs: 240, md: 280 },
                display: 'flex',
              }}
            >
              <Box
                component="img"
                src={caseStudy.heroImage}
                alt={`${caseStudy.title} journey visual`}
                loading="lazy"
                sx={{
                  width: '100%',
                  objectFit: 'cover',
                  mixBlendMode: isDark ? 'screen' : 'normal',
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* ---------------------- Core Features ---------------------- */}
        <Grid
          container
          spacing={{ xs: 2.5, md: 3 }}
          justifyContent="center"
          textAlign="center"
          sx={{ mt: { xs: 4, md: 5 } }}
        >
          {caseStudy.coreFeatures?.slice(0, 4).map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 1,
                  border: `1px solid ${alpha(accentColor, 0.4)}`,
                  bgcolor: isDark ? alpha('#0b1120', 0.8) : '#f7fafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: isDark ? '#e2e8f0' : '#0f172a',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: isDark
                      ? '0 18px 30px rgba(0,0,0,0.7)'
                      : '0 18px 32px rgba(15,23,42,0.15)',
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {feature.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: dividerColor, my: { xs: 5, md: 7 } }} />

        {/* ---------------------- Challenges Section ---------------------- */}
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <Chip
            label="Our Challenges"
            sx={{
              width: 'fit-content',
              fontWeight: 700,
              bgcolor: isDark ? alpha('#ffffff', 0.08) : '#ffffff',
              color: isDark ? '#ffffff' : theme.palette.text.primary,
              borderRadius: 999,
              px: 1.5,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              maxWidth: 820,
              color: 'text.primary',
            }}
          >
            Lack of time and knowledge in half-developed systems? We turned obstacles into momentum.
          </Typography>

          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {caseStudy.challenges?.map((challenge) => (
              <Grid item xs={12} md={6} key={challenge}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 1,
                    height: '100%',
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.35)}`,
                    bgcolor: isDark ? alpha('#0b1120', 0.8) : '#f8fafc',
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: isDark
                        ? '0 14px 26px rgba(0,0,0,0.7)'
                        : '0 12px 24px rgba(15,23,42,0.14)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: alpha(accentColor, 0.22),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? '#e2e8f0' : '#0f172a',
                      flexShrink: 0,
                      fontWeight: 800,
                    }}
                  >
                    !
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {challenge}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>

        <Divider sx={{ borderColor: dividerColor, my: { xs: 5, md: 7 } }} />

        {/* ---------------------- Solution Highlight ---------------------- */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 1,
            border: `1px solid ${alpha(accentColor, 0.4)}`,
            bgcolor: isDark ? alpha('#0b1120', 0.9) : '#f1f5f9',
          }}
        >
          <Stack spacing={2}>
            <Chip
              label="Our Solution"
              sx={{
                width: 'fit-content',
                fontWeight: 700,
                bgcolor: isDark ? alpha('#ffffff', 0.08) : '#ffffff',
                color: isDark ? '#ffffff' : theme.palette.text.primary,
                borderRadius: 999,
                px: 1.5,
              }}
            />

            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {caseStudy.journeyHighlight?.title || 'A journey that moves fast and stays reliable'}
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
              {caseStudy.journeyHighlight?.description ||
                'We launched quickly, iterated with user feedback, and kept performance tight across every platform.'}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(caseStudy.advancedContent || []).slice(0, 4).map((module) => (
                <Chip
                  key={module.title}
                  icon={<CheckCircleRoundedIcon fontSize="small" />}
                  label={module.title}
                  sx={{
                    bgcolor: isDark ? alpha('#22c55e', 0.14) : alpha('#22c55e', 0.14),
                    color: isDark ? '#bbf7d0' : '#166534',
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>

        <Divider sx={{ borderColor: dividerColor, my: { xs: 5, md: 7 } }} />

        {/* ---------------------- Technology Stack ---------------------- */}
        <Stack spacing={3}>
          <Chip
            label="Technology Stack"
            sx={{
              width: 'fit-content',
              fontWeight: 700,
              bgcolor: isDark ? alpha('#ffffff', 0.08) : '#ffffff',
              color: isDark ? '#ffffff' : theme.palette.text.primary,
              borderRadius: 999,
              px: 1.5,
            }}
          />

          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            The tools we chose to make this project a success
          </Typography>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {caseStudy.technologyStack?.map((tech) => (
              <Grid item xs={6} sm={4} md={3} key={tech}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    height: '100%',
                    borderRadius: 1,
                    border: `1px solid ${alpha(accentColor, 0.35)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isDark ? alpha('#0b1120', 0.8) : '#ffffff',
                    color: isDark ? '#e2e8f0' : '#0f172a',
                    textAlign: 'center',
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: isDark
                        ? '0 18px 30px rgba(0,0,0,0.7)'
                        : '0 18px 32px rgba(15,23,42,0.15)',
                    },
                  }}
                >
                  {tech}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* ---------------------- Features ---------------------- */}
        {featureBadges.length ? (
          <Paper
            elevation={0}
            sx={{
              mt: { xs: 5, md: 7 },
              p: { xs: 3, md: 4 },
              borderRadius: 1,
              background: isDark
                ? `linear-gradient(135deg, ${alpha('#0b1120', 0.95)}, ${alpha('#0ea5e9', 0.16)})`
                : `linear-gradient(135deg, ${alpha('#0f172a', 0.92)}, ${alpha(accentColor, 0.28)})`,
              color: '#e2e8f0',
            }}
          >
            <Stack spacing={2.5}>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                Features that make the app a success ✨
              </Typography>

              <Grid container spacing={1.5}>
                {featureBadges.map((badge) => (
                  <Grid item xs={12} sm={6} md={4} key={badge}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.2,
                        borderRadius: 0.75,
                        bgcolor: alpha('#0b1120', 0.4),
                        border: `1px solid ${alpha('#ffffff', 0.12)}`,
                        color: '#e2e8f0',
                        textAlign: 'center',
                        fontWeight: 700,
                        letterSpacing: 0.4,
                      }}
                    >
                      {badge}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Paper>
        ) : null}

        {/* ---------------------- Related Case Studies ---------------------- */}
        {relatedCaseStudies.length ? (
          <Stack spacing={2.5} sx={{ mt: { xs: 5, md: 7 } }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Related Case Studies
            </Typography>

            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {relatedCaseStudies.map((related) => (
                <Grid item xs={12} sm={6} md={4} key={related.slug}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: `1px solid ${alpha(
                        theme.palette.divider,
                        isDark ? 0.6 : 0.35
                      )}`,
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: isDark
                          ? '0 16px 28px rgba(0,0,0,0.75)'
                          : '0 16px 30px rgba(15,23,42,0.16)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={related.heroImage}
                      alt={related.title}
                      loading="lazy"
                      sx={{
                        width: '100%',
                        height: 170,
                        objectFit: 'cover',
                      }}
                    />

                    <Stack spacing={1} sx={{ p: 2.5 }}>
                      <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
                        {related.category}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {related.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        {related.summary}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        ) : null}
      </Container>
    </Box>
  );
};

export default CaseStudyDetailPage;
