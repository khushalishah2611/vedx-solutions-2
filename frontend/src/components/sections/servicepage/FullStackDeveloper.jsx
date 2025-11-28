import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { fullStackDeveloperHighlights } from '../../../data/servicesPage.js';

// Simple hook to detect when an element enters the viewport
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.2, ...options }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
};

function FullStackDeveloper({ onContactClick }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();

  return (
    <Box component="section">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0.5,
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.8))'
            : 'linear-gradient(135deg, rgba(250,250,255,0.98), rgba(191,219,254,0.95))',
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.35 : 0.4)}`,
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
        >
          {/* LEFT SIDE – TEXT */}
          <Grid
            item
            xs={12}
            md={6}
            ref={leftRef}
            sx={{
              opacity: leftInView ? 1 : 0,
              transform: leftInView ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <Stack
              spacing={2.5}
              alignItems={{ xs: 'center', md: 'flex-start' }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: 26, md: 36 },
                  fontWeight: 700,
                  color: isDark ? '#fff' : '#0f172a',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                FULL STACK DEVELOPMENT SERVICE
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: alpha(isDark ? '#fff' : '#0f172a', 0.85),
                  maxWidth: 520,
                  textAlign: { xs: 'center', md: 'left' },
                  lineHeight: 1.7,
                }}
              >
                From product discovery to secure deployments, our cross-functional
                engineers, designers, and architects unite every layer of the stack
                so your product ships faster and performs flawlessly.
              </Typography>

              <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 520 }}>
                {fullStackDeveloperHighlights.map((highlight) => (
                  <Stack
                    key={highlight}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: alpha(isDark ? '#fff' : '#0f172a', 0.9),
                        mt: 1,
                        flexShrink: 0,
                      }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha(isDark ? '#fff' : '#0f172a', 0.88),
                        lineHeight: 1.6,
                        textAlign: { xs: 'left', md: 'left' },
                      }}
                    >
                      {highlight}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Button
                variant="contained"
                size="large"
                onClick={onContactClick}
                sx={{
                  alignSelf: { xs: 'center', md: 'flex-start' },
                  background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 1.75 },
                  boxShadow: '0 18px 35px rgba(15,23,42,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                    boxShadow: '0 20px 40px rgba(15,23,42,0.4)',
                  },
                }}
              >
                Hire Full Stack Expert
              </Button>
            </Stack>
          </Grid>

          {/* RIGHT SIDE – IMAGE */}
          <Grid
            item
            xs={12}
            md={6}
            ref={rightRef}
            sx={{
              opacity: rightInView ? 1 : 0,
              transform: rightInView ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: 0.5,
                overflow: 'hidden',
                height: { xs: 260, md: 360 },
                backgroundImage: 'url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: isDark
                  ? '0 30px 60px rgba(15,23,42,0.55)'
                  : '0 30px 60px rgba(15,23,42,0.18)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: isDark
                    ? '0 36px 72px rgba(15,23,42,0.7)'
                    : '0 36px 72px rgba(15,23,42,0.24)',
                },
              }} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default FullStackDeveloper;
