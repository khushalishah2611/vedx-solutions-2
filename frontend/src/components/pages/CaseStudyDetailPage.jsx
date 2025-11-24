import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  alpha,
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
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

  // Application screenshots – max 5, in a responsive grid
  const screenshotsToShow = useMemo(
    () => (caseStudy?.screenshots || []).slice(0, 5),
    [caseStudy]
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
                  background: alpha(accentColor, isDark ? 0.12 : 0.08),
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.5 : 0.22
                  )}`,
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
                    transform: animate ? 'translateX(0)' : 'translateX(-24px)',
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
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.5 : 0.22
                  )}`,
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
                    transform: animate ? 'translateX(0)' : 'translateX(24px)',
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
          >
            {caseStudy.coreFeatures?.slice(0, 4).map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: '10px',
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.5 : 0.22
                    )}`,
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
                    transform: animate ? 'translateY(0)' : 'translateY(18px)',
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
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition:
                        'color 0.3s ease, background-image 0.3s ease',
                      '&:hover': {
                        color: 'transparent',
                        backgroundImage:
                          'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      },
                    }}
                  >
                    {feature.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Solution Highlight ---------------------- */}
        <Box my={{ xs: 6, md: 10 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 0.5,
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
            <Stack
              spacing={2.5}
              alignItems={{ xs: 'center', md: 'flex-start' }}
              textAlign={{ xs: 'center', md: 'left' }}
            >
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

              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  maxWidth: 720,
                }}
              >
                {caseStudy.journeyHighlight?.title ||
                  'A journey that moves fast and stays reliable'}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.9,
                  maxWidth: 800,
                }}
              >
                {caseStudy.journeyHighlight?.description ||
                  'We launched quickly, iterated with user feedback, and kept performance tight across every platform.'}
              </Typography>

              {/* Advanced content chips */}
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                {(caseStudy.advancedContent || [])
                  .slice(0, 4)
                  .map((module, index) => (
                    <Box
                      key={module.title}
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
                        transition: `all 420ms ease ${60 + index * 60}ms`,
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
                        {module.title}
                      </Box>
                    </Box>
                  ))}
              </Stack>
            </Stack>
          </Paper>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Technology Stack ---------------------- */}
        <Box my={10}>
          <Stack spacing={3} alignItems="center" textAlign="center">
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
                mx: 'auto',
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
              {caseStudy.technologyStack?.map((tech, index) => {
                const techName = typeof tech === 'string' ? tech : tech?.name;
                const techIcon = typeof tech === 'object' ? tech?.icon : null;
                const displayName = techName || 'Technology';

                return (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    key={techName || `${displayName}-${index}`}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 0.5,
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          isDark ? 0.75 : 0.98
                        ),
                        border: `1px solid ${alpha(
                          theme.palette.divider,
                          isDark ? 0.4 : 0.5
                        )}`,
                        transition:
                          'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.45s ease',
                        boxShadow: isDark
                          ? '0 20px 35px rgba(15,23,42,0.35)'
                          : '0 20px 35px rgba(15,23,42,0.08)',
                        opacity: animate ? 1 : 0,
                        transform: animate
                          ? 'translateY(0)'
                          : 'translateY(18px)',
                        transitionDelay: `${150 + index * 80}ms`,
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                          boxShadow: isDark
                            ? '0 24px 40px rgba(15,23,42,0.6)'
                            : '0 24px 40px rgba(15,23,42,0.14)',
                        },
                      }}
                    >
                      <Stack spacing={1} alignItems="center">
                        {techIcon ? (
                          <Box
                            component="img"
                            src={techIcon}
                            alt={displayName}
                            loading="lazy"
                            sx={{ width: 36, height: 36, objectFit: 'contain' }}
                          />
                        ) : null}

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            transition:
                              'color 0.3s ease, background-image 0.3s ease',
                            '&:hover': {
                              color: 'transparent',
                              backgroundImage:
                                'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            },
                          }}
                        >
                          {displayName}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
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
                borderRadius: 0.5,
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
              <Stack spacing={2.5} alignItems="center" textAlign="center">
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
                          p: 1.5,
                          borderRadius: 0.75,
                          bgcolor: alpha('#0b1120', 0.4),
                          border: `1px solid ${alpha('#ffffff', 0.18)}`,
                          opacity: animate ? 1 : 0,
                          transform: animate
                            ? 'translateY(0)'
                            : 'translateY(14px)',
                          transition:
                            'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
                          transitionDelay: `${190 + index * 60}ms`,
                          boxShadow: '0 0 0 rgba(0,0,0,0)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            borderColor: alpha(
                              accentColor,
                              isDark ? 0.9 : 0.8
                            ),
                            boxShadow: isDark
                              ? '0 16px 26px rgba(0,0,0,0.7)'
                              : '0 14px 26px rgba(15,23,42,0.2)',
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            textDecoration: 'none',
                            cursor: 'pointer',
                            transition:
                              'color 0.3s ease, background-image 0.3s ease',
                            '&:hover': {
                              color: 'transparent',
                              backgroundImage:
                                'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            },
                          }}
                        >
                          {badge}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          ) : null}
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Application Screenshots ---------------------- */}
        {screenshotsToShow.length ? (
          <Box
            my={10}
            sx={{
              '@keyframes glowPulse': {
                '0%': {
                  boxShadow: isDark
                    ? '0 18px 32px rgba(0,0,0,0.65)'
                    : '0 18px 32px rgba(15,23,42,0.14)',
                },
                '50%': {
                  boxShadow: isDark
                    ? '0 24px 36px rgba(0,0,0,0.75)'
                    : '0 24px 38px rgba(15,23,42,0.2)',
                },
                '100%': {
                  boxShadow: isDark
                    ? '0 18px 32px rgba(0,0,0,0.65)'
                    : '0 18px 32px rgba(15,23,42,0.14)',
                },
              },
            }}
          >
            <Stack spacing={2} alignItems="center" textAlign="center">
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
                  Application Screenshots
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
                Bringing the experience to life
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 640,
                  lineHeight: 1.7,
                }}
              >
                Every case study surfaces immersive visuals with subtle motion so
                the story and UI details stay front and center.
              </Typography>

              <Grid container spacing={2}>
                {screenshotsToShow.map((shot, index) => {
                  const slideDistance = index % 2 === 0 ? '-22px' : '22px';
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={shot.src}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          height: '100%',
                          borderRadius: 0.5,
                          overflow: 'hidden',
                          border: `1px solid ${alpha(accentColor, 0.35)}`,
                          background: isDark
                            ? alpha('#0b1120', 0.75)
                            : alpha(accentColor, 0.08),
                          boxShadow: isDark
                            ? '0 18px 32px rgba(0,0,0,0.65)'
                            : '0 18px 32px rgba(15,23,42,0.14)',
                          position: 'relative',
                          isolation: 'isolate',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 0.5,
                            border: `1px solid ${alpha(accentColor, 0.35)}`,
                            opacity: 0.5,
                            filter: 'blur(0.5px)',
                            zIndex: -1,
                            animation: animate
                              ? 'glowPulse 4.8s ease-in-out infinite'
                              : 'none',
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
                            height: { xs: 220, sm: 240, md: 260 },
                            objectFit: 'cover',
                            display: 'block',
                            opacity: animate ? 1 : 0,
                            transform: animate
                              ? 'translateX(0)'
                              : `translateX(${slideDistance})`,
                            transition: `all 560ms ease ${
                              160 + index * 70
                            }ms`,
                          }}
                        />

                        <Stack spacing={1.2} sx={{ p: { xs: 2, md: 2.5 } }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 800,
                              color: isDark ? '#e2e8f0' : '#0f172a',
                              letterSpacing: 0.2,
                            }}
                          >
                            {shot.alt}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', lineHeight: 1.8 }}
                          >
                            {shot.caption}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          </Box>
        ) : null}

        <Divider sx={{ borderColor: dividerColor }} />

        {/* ---------------------- Related Case Studies ---------------------- */}
        <Box my={10}>
          {relatedCaseStudies.length ? (
            <Stack spacing={3} sx={{ mt: { xs: 5, md: 7 } }}>
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
