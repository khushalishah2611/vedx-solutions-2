import { Box, Container, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';

const CareerTrustedSection = ({ logos = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
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
          boxShadow: isDark
            ? '0 20px 45px rgba(124, 58, 237, 0.25)'
            : '0 18px 40px rgba(59, 130, 246, 0.18)',
        }}
      >
        <Stack spacing={{ xs: 4, md: 6 }}>
          {/* === Header Section === */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 28, md: 36 },
                color: isDark ? alpha('#ffffff', 0.95) : alpha('#000000', 0.95),
                flex: 1,
              }}
            >
              Work With Us, Grow With Us
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: isDark ? alpha('#E2E8F0', 0.82) : alpha('#1E293B', 0.75),
                flex: 1,
                lineHeight: 1.7,
              }}
            >
              We are a mixed group of like-minded professionals who firmly believe in leading rather than following.
              Bacancy is a place where young aspirants enter and come out as enthusiastic leaders. We have formed a
              workplace where things get done right, and accomplishments get privileged accolades. Bacancy is thriving
              on strong systems and being an exemplary organization, and we are striving for new development objectives
              to add weight to your resume.
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
                background: isDark
                  ? 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.5) 20%, rgba(168, 85, 247, 0.6) 80%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, rgba(79, 70, 229, 0.35) 20%, rgba(79, 70, 229, 0.45) 80%, transparent 100%)',
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
              {logos.map((brand) => (
                <Box
                  key={brand.name}
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

                    '&::before, &::after, & .extraCorner::before, & .extraCorner::after': {
                      content: '""',
                      position: 'absolute',
                      width: 28,
                      height: 28,
                      border: '2px solid',
                      borderColor: isDark ? alpha('#A855F7', 0.7) : alpha('#4F46E5', 0.7),
                      pointerEvents: 'none',
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
                  }}
                >
                  <Box className="extraCorner" sx={{ position: 'absolute', inset: 0 }} />

                  <Box
                    component="img"
                    src={brand.logo}
                    alt={brand.name}
                    sx={{
                      width: { xs: '72%', md: '80%' },
                      height: '72%',
                      objectFit: 'contain',
                      filter: isDark ? 'brightness(0) invert(1)' : 'grayscale(0.2)',
                      opacity: isDark ? 0.92 : 0.85,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CareerTrustedSection;
