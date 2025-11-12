import { Box, Container, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import * as React from 'react';

const CareerTrustedSection = ({
  logos = [],
  contactHref = '/contact',
  tileClickable = true, // set false if you don't want tile click to redirect
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container id="trusted" maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 4, md: 6 },
          borderRadius: 0.5,
          background: isDark
            ? 'linear-gradient(140deg, rgba(6, 9, 24, 0.95) 0%, rgba(41, 9, 72, 0.92) 50%, rgba(73, 19, 110, 0.9) 100%)'
            : 'linear-gradient(140deg, rgba(226, 232, 240, 0.96) 0%, rgba(214, 226, 255, 0.94) 50%, rgba(196, 210, 245, 0.92) 100%)',
          border: '1px solid',
          borderColor: isDark ? alpha('#A855F7', 0.35) : alpha('#4F46E5', 0.35),

          '@keyframes fadeUp': {
            '0%': { opacity: 0, transform: 'translateY(16px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          '@keyframes floaty': {
            '0%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-3px)' },
            '100%': { transform: 'translateY(0)' },
          },
        }}
      >
        <Stack spacing={{ xs: 4, md: 6 }}>
          {/* === Header Section === */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            sx={{ animation: 'fadeUp 700ms ease forwards' }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 28, md: 36 },
                color: isDark ? alpha('#ffffff', 0.95) : alpha('#000000', 0.95),
                flex: 1,
                lineHeight: 1.2,
              }}
            >
              Work With Us, Grow With Us
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: isDark ? alpha('#E2E8F0', 0.82) : alpha('#1E293B', 0.78),
                lineHeight: 1.7,
                flex: 1,
              }}
            >
              We are a mixed group of like-minded professionals who firmly believe in leading rather than
              following. Bacancy is a place where young aspirants enter and come out as enthusiastic leaders.
              We have formed a workplace where things get done right, and accomplishments get privileged
              accolades. Bacancy is thriving on strong systems and being an exemplary organization, and we are
              striving for new development objectives to add weight to your resume.
            </Typography>
          </Stack>

          {/* === Logos Grid === */}
          <Box
            sx={{
              position: 'relative',
              px: { xs: 1, md: 2 },
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                height: 1,
                width: '100%',
                left: 0,
              },
              '&::before': { top: 4 },
              '&::after': { bottom: 4 },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'grid',
                gap: { xs: 2.5, md: 3 },
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  sm: 'repeat(3, minmax(0, 1fr))',
                  lg: 'repeat(5, minmax(0, 1fr))',
                },
                justifyItems: 'center',
              }}
            >
              {logos.map((brand, idx) => {
                const clickableProps = tileClickable
                  ? {
                    component: 'a',
                    href: contactHref,
                    // Accessible focus + semantics:
                    'aria-label': `Contact us about ${brand?.name || 'brand'}`,
                  }
                  : {};

                return (
                  <Box
                    key={brand?.name ?? idx}
                    {...clickableProps}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: { xs: 160, md: 180 },
                      aspectRatio: '5 / 3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: { xs: 2, md: 3 },
                      py: { xs: 2, md: 2.5 },
                      mx: 'auto',
                      opacity: 0,
                      textDecoration: 'none',
                      cursor: tileClickable ? 'pointer' : 'default',
                      animation: `fadeUp 650ms ease ${100 + idx * 60}ms forwards, floaty 5s ease-in-out ${idx *
                        120}ms infinite`,
                      // corner brackets
                      '&::before, &::after, & .extraCorner::before, & .extraCorner::after': {
                        content: '""',
                        position: 'absolute',
                        width: 28,
                        height: 28,
                        border: '2px solid',
                        borderColor: isDark ? alpha('#A855F7', 0.7) : alpha('#4F46E5', 0.7),
                        pointerEvents: 'none',
                        transition: 'border-color 220ms ease',
                      },
                      '&::before': {
                        top: 6,
                        left: 6,
                        borderRight: 'none',
                        borderBottom: 'none',
                        borderTopLeftRadius: 8,
                      },
                      '&::after': {
                        bottom: 6,
                        right: 6,
                        borderLeft: 'none',
                        borderTop: 'none',
                        borderBottomRightRadius: 8,
                      },
                      '& .extraCorner::before': {
                        top: 6,
                        right: 6,
                        borderLeft: 'none',
                        borderBottom: 'none',
                        borderTopRightRadius: 8,
                      },
                      '& .extraCorner::after': {
                        bottom: 6,
                        left: 6,
                        borderRight: 'none',
                        borderTop: 'none',
                        borderBottomLeftRadius: 8,
                      },
                      ...(tileClickable && {
                        transition: 'transform 220ms ease, box-shadow 220ms ease, opacity 220ms ease',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: isDark
                            ? '0 14px 36px rgba(168,85,247,0.22)'
                            : '0 14px 36px rgba(79,70,229,0.18)',
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: isDark ? alpha('#A855F7', 0.9) : alpha('#4F46E5', 0.9),
                          outlineOffset: 2,
                          transform: 'translateY(-2px)',
                        },
                      }),
                    }}
                  >
                    <Box className="extraCorner" sx={{ position: 'absolute', inset: 0 }} />

                    {/* Centered, clickable image */}
                    <Box
                      component="img"
                      src={brand.logo}
                      alt={brand.name}
                      sx={{
                        display: 'block',
                        width: { xs: '72%', md: '80%' }, // fixed from 850%
                        height: '72%',
                        objectFit: 'contain',
                        mx: 'auto', // perfect horizontal centering
                        my: 'auto', // vertical centering within the flex box
                        filter: isDark ? 'brightness(0) invert(1)' : 'grayscale(0.2)',
                        opacity: isDark ? 0.92 : 0.85,
                        userSelect: 'none',
                        cursor: tileClickable ? 'inherit' : 'default',
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CareerTrustedSection;
