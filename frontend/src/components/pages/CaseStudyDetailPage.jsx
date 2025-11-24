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
import CaseStudyCard from '../sections/caseStudies/CaseStudyCard.jsx';
import CaseStudyDetailHero from '../sections/caseStudies/CaseStudyDetailHero.jsx';
import { caseStudiesBySlug, caseStudiesList } from '../../data/caseStudies.js';

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const caseStudy = caseStudiesBySlug[slug] || null;
  const theme = useTheme();

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 40);
    return () => clearTimeout(timer);
  }, []);

  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
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
        {/* ---------------------- Project Overview ---------------------- */}
        <Box my={5}>
          <Grid container spacing={4} alignItems="center">
            {/* Left Side Image */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 0.5,
                  border: `1px solid ${alpha(accentColor, 0.3)}`,
                  background: alpha(accentColor, isDark ? 0.12 : 0.08),
                  transition: 'border-color 220ms ease, box-shadow 0.25s ease',
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                  '&:hover': {
                    borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                    boxShadow: isDark
                      ? '0 18px 30px rgba(0,0,0,0.7)'
                      : '0 18px 32px rgba(15,23,42,0.15)',
                  },
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
                    transform: animate
                      ? 'translateX(0)'
                      : 'translateX(-24px)', // slide in from left
                    transition: 'all 700ms ease',
                  }}
                />
              </Paper>
            </Grid>

            {/* Right Side Content */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                {/* Label */}
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
                    mx: { xs: 'auto', md: 0 },
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 400ms ease 80ms',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      background:
                        'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Project OverView
                  </Box>
                </Box>

                {/* Main heading */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(14px)',
                    transition: 'all 480ms ease 140ms',
                  }}
                >
                  Inspire more {caseStudy.category?.toLowerCase() || 'growth'}
                </Typography>

                {/* Excerpt */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.9,
                    maxWidth: 900,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'all 500ms ease 220ms',
                  }}
                >
                  {caseStudy.excerpt}
                </Typography>

                {/* Tagline */}
                {caseStudy.tagline && (
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
                      mx: { xs: 'auto', md: 0 },
                      opacity: animate ? 1 : 0,
                      transform: animate
                        ? 'translateY(0)'
                        : 'translateY(18px)',
                      transition: 'all 520ms ease 280ms',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        background:
                          'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {caseStudy.tagline}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Our Approach ---------------------- */}
        <Box my={10}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={2.5}>
                {/* Our Approach label */}
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
                    mx: { xs: 'auto', md: 0 },
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 420ms ease 60ms',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      background:
                        'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Our Approach
                  </Box>
                </Box>

                {/* Heading */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(14px)',
                    transition: 'all 480ms ease 140ms',
                  }}
                >
                  Building experiences that stay on the correct path
                </Typography>

                {/* Two paragraphs from clientRequirements */}
                <Stack spacing={1.5}>
                  {caseStudy.clientRequirements
                    ?.slice(0, 2)
                    .map((paragraph, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.9,
                          opacity: animate ? 1 : 0,
                          transform: animate
                            ? 'translateY(0)'
                            : 'translateY(16px)',
                          transition: `all 500ms ease ${220 + index * 80}ms`,
                        }}
                      >
                        {paragraph}
                      </Typography>
                    ))}
                </Stack>
              </Stack>
            </Grid>

            {/* Image with gentle left-to-right reveal */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  overflow: 'hidden',
                  borderRadius: 0.5,
                  background: alpha(accentColor, isDark ? 0.12 : 0.09),
                  minHeight: { xs: 240, md: 280 },
                  display: 'flex',
                  border: `1px solid ${alpha(accentColor, 0.3)}`,
                  transition: 'border-color 220ms ease, box-shadow 0.25s ease',
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                  '&:hover': {
                    borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                    boxShadow: isDark
                      ? '0 18px 30px rgba(0,0,0,0.7)'
                      : '0 18px 32px rgba(15,23,42,0.15)',
                  },
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
                    opacity: animate ? 1 : 0,
                    transform: animate
                      ? 'translateX(0)'
                      : 'translateX(24px)', // slide in from right
                    transition: 'all 650ms ease 140ms',
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* ---------------------- Core Features ---------------------- */}
        <Box my={10}>
          <Grid
            container
            spacing={{ xs: 2.5, md: 3 }}
            justifyContent="center"
            textAlign="center"
            sx={{ mt: { xs: 4, md: 5 } }}
          >
            {caseStudy.coreFeatures?.slice(0, 4).map((feature, index) => (
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
                    transition:
                      'border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.45s ease',
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                    opacity: animate ? 1 : 0,
                    transform: animate
                      ? 'translateY(0)'
                      : 'translateY(18px)',
                    transitionDelay: `${150 + index * 80}ms`,
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
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
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Challenges Section ---------------------- */}
        <Box my={10}>
          <Stack spacing={2.5} alignItems="center" textAlign="center">
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
                mx: { xs: 'auto', md: 0 },
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 420ms ease 60ms',
              }}
            >
              <Box
                component="span"
                sx={{
                  background:
                    'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Our Challenges
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                maxWidth: 820,
                color: 'text.primary',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 480ms ease 130ms',
              }}
            >
              Lack of time and knowledge in half-developed systems? We turned
              obstacles into momentum.
            </Typography>

            <Grid container spacing={{ xs: 2, md: 2.5 }}>
              {caseStudy.challenges?.map((challenge, index) => (
                <Grid item xs={12} md={6} key={challenge}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      borderRadius: 1,
                      height: '100%',
                      border: `1px solid ${alpha(accentColor, 0.35)}`,
                      bgcolor: isDark ? alpha('#0b1120', 0.8) : '#f8fafc',
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'flex-start',
                      transition:
                        'border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.45s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                        boxShadow: isDark
                          ? '0 14px 26px rgba(0,0,0,0.7)'
                          : '0 12px 24px rgba(15,23,42,0.14)',
                      },
                      opacity: animate ? 1 : 0,
                      transform: animate
                        ? 'translateY(0)'
                        : 'translateY(18px)',
                      transitionDelay: `${160 + index * 80}ms`,
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
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary', lineHeight: 1.8 }}
                    >
                      {challenge}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Solution Highlight ---------------------- */}
        <Box my={10}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 1,
              border: `1px solid ${alpha(accentColor, 0.4)}`,
              bgcolor: isDark ? alpha('#0b1120', 0.9) : '#f1f5f9',
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(18px)',
              transition:
                'border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.52s ease 120ms',
              '&:hover': {
                borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                boxShadow: isDark
                  ? '0 18px 30px rgba(0,0,0,0.7)'
                  : '0 18px 32px rgba(15,23,42,0.15)',
              },
            }}
          >
            <Stack spacing={2}>
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
                  mx: { xs: 'auto', md: 0 },
                  opacity: animate ? 1 : 0,
                  transform: animate
                    ? 'translateY(0)'
                    : 'translateY(10px)',
                  transition: 'all 420ms ease 60ms',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background:
                      'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Our Solution
                </Box>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {caseStudy.journeyHighlight?.title ||
                  'A journey that moves fast and stays reliable'}
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', lineHeight: 1.9 }}
              >
                {caseStudy.journeyHighlight?.description ||
                  'We launched quickly, iterated with user feedback, and kept performance tight across every platform.'}
              </Typography>

              {/* Advanced content chips */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(caseStudy.advancedContent || []).slice(0, 4).map((module, index) => (
                  <Chip
                    key={module.title}
                    icon={<CheckCircleRoundedIcon fontSize="small" />}
                    label={module.title}
                    sx={{
                      bgcolor: isDark
                        ? alpha('#22c55e', 0.14)
                        : alpha('#22c55e', 0.14),
                      color: isDark ? '#bbf7d0' : '#166534',
                      borderRadius: 999,
                      fontWeight: 600,
                      border: `1px solid ${alpha(accentColor, 0.4)}`,
                      transition:
                        'border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.46s ease',
                      opacity: animate ? 1 : 0,
                      transform: animate
                        ? 'translateY(0)'
                        : 'translateY(12px)',
                      transitionDelay: `${160 + index * 70}ms`,
                      '&:hover': {
                        borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                        boxShadow: isDark
                          ? '0 10px 18px rgba(0,0,0,0.6)'
                          : '0 10px 20px rgba(15,23,42,0.18)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Technology Stack ---------------------- */}
        <Box my={10}>
          <Stack spacing={3}>
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
                mx: { xs: 'auto', md: 0 },
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 420ms ease 60ms',
              }}
            >
              <Box
                component="span"
                sx={{
                  background:
                    'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Technology Stack
              </Box>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(14px)',
                transition: 'all 480ms ease 130ms',
              }}
            >
              The tools we chose to make this project a success
            </Typography>

            <Grid container spacing={{ xs: 2, md: 3 }}>
              {caseStudy.technologyStack?.map((tech, index) => (
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
                      transition:
                        'border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.45s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                        boxShadow: isDark
                          ? '0 18px 30px rgba(0,0,0,0.7)'
                          : '0 18px 32px rgba(15,23,42,0.15)',
                      },
                      opacity: animate ? 1 : 0,
                      transform: animate
                        ? 'translateY(0)'
                        : 'translateY(18px)',
                      transitionDelay: `${150 + index * 80}ms`,
                    }}
                  >
                    {tech}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Features ---------------------- */}
        <Box my={10}>
          {featureBadges.length ? (
            <Paper
              elevation={0}
              sx={{
                mt: { xs: 5, md: 7 },
                p: { xs: 3, md: 4 },
                borderRadius: 1,
                background: isDark
                  ? `linear-gradient(135deg, ${alpha(
                    '#0b1120',
                    0.95
                  )}, ${alpha('#0ea5e9', 0.16)})`
                  : `linear-gradient(135deg, ${alpha(
                    '#0f172a',
                    0.92
                  )}, ${alpha(accentColor, 0.28)})`,
                color: '#e2e8f0',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(18px)',
                transition: 'all 520ms ease 120ms',
                border: `1px solid ${alpha(accentColor, 0.45)}`,
              }}
            >
              <Stack spacing={2.5}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'all 460ms ease 160ms',
                  }}
                >
                  Features that make the app a success ✨
                </Typography>

                <Grid container spacing={1.5}>
                  {featureBadges.map((badge, index) => (
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
                          opacity: animate ? 1 : 0,
                          transform: animate
                            ? 'translateY(0)'
                            : 'translateY(14px)',
                          transition: `border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.46s ease ${190 + index * 60
                            }ms`,
                          '&:hover': {
                            borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                            boxShadow: isDark
                              ? '0 16px 26px rgba(0,0,0,0.7)'
                              : '0 14px 26px rgba(15,23,42,0.2)',
                            transform: 'translateY(-4px)',
                          },
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
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Related Case Studies ---------------------- */}
        <Box my={10}>
          {relatedCaseStudies.length ? (
            <Stack spacing={2.5} sx={{ mt: { xs: 5, md: 7 } }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, textAlign: 'center' }}
              >
                Related Case Studies
              </Typography>

              <Grid container spacing={2}>
                {relatedCaseStudies.map((study) => (
                  <Grid item xs={12} sm={6} md={4} key={study.slug}>
                    <CaseStudyCard caseStudy={study} />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
};

export default CaseStudyDetailPage;
