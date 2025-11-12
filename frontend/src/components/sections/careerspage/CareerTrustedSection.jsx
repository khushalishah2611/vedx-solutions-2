import { Box, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';

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
            ? 'linear-gradient(135deg, rgba(10,12,24,0.95) 0%, rgba(31,13,58,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(226,232,240,0.95) 0%, rgba(203,213,225,0.95) 100%)',
          border: '1px solid',
          borderColor: isDark ? alpha('#8B5CF6', 0.2) : alpha('#3B82F6', 0.3),
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
                color: isDark ? alpha('#E2E8F0', 0.75) : alpha('#1E293B', 0.75),
                flex: 1,
              }}
            >
              We are a mixed group of like-minded professionals who firmly believe in leading rather than following.
              Bacancy is a place where young aspirants enter and come out as enthusiastic leaders. We have formed a
              workplace where things get done right, and accomplishments get privileged accolades. Bacancy is thriving
              on strong systems and being an exemplary organization, and we are striving for new development objectives
              to add weight to your resume.
            </Typography>
          </Stack>

          {/* === Logos Grid (3×3 layout) === */}
          <Grid
            container
            spacing={{ xs: 2.5, md: 3 }}
            justifyContent="center"
            alignItems="center"
          >
            {logos.map((brand) => (
              <Grid key={brand.name} item xs={6} sm={4} md={4}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                   
                    p: 1,

                    '&::before, &::after, & .extraCorner::before, & .extraCorner::after': {
                      content: '""',
                      position: 'absolute',
                      width: 28,
                      height: 28,
                      border: '2px solid',
                      borderColor: isDark ? alpha('#A855F7', 0.7) : alpha('#4F46E5', 0.7),
                      pointerEvents: 'none',
                    },

                    // Top-Left
                    '&::before': {
                      top: 10,
                      left: 10,
                      borderRight: 'none',
                      borderBottom: 'none',
                      borderTopLeftRadius: 8,
                    },
                    // Bottom-Right
                    '&::after': {
                      bottom: 10,
                      right: 10,
                      borderLeft: 'none',
                      borderTop: 'none',
                      borderBottomRightRadius: 8,
                    },
                    // Top-Right
                    '& .extraCorner::before': {
                      top: 10,
                      right: 10,
                      borderLeft: 'none',
                      borderBottom: 'none',
                      borderTopRightRadius: 8,
                    },
                    // Bottom-Left
                    '& .extraCorner::after': {
                      bottom: 10,
                      left: 10,
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
                      width: 120,  // ✅ Fixed width
                      height: 80,  // ✅ Fixed height
                      objectFit: 'contain',
                      filter: isDark ? 'brightness(0) invert(1)' : 'grayscale(0.2)',
                      opacity: isDark ? 0.9 : 0.85,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CareerTrustedSection;
