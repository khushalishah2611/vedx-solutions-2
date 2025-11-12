import { Box, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';

const CareerTrustedSection = ({ logos }) => {
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
          borderRadius: { xs: 4, md: 6 },
          background: isDark
            ? 'linear-gradient(135deg, rgba(10,12,24,0.95) 0%, rgba(31,13,58,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(226,232,240,0.95) 0%, rgba(203,213,225,0.95) 100%)',
          border: '1px solid',
          borderColor: isDark ? alpha('#8B5CF6', 0.2) : alpha('#3B82F6', 0.3),
          boxShadow: isDark
            ? '0px 25px 80px rgba(139, 92, 246, 0.25)'
            : '0px 25px 80px rgba(79, 70, 229, 0.2)'
        }}
      >
        <Stack spacing={{ xs: 4, md: 6 }}>
          <Stack spacing={1.5} maxWidth={{ md: '65%' }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: isDark ? alpha('#F9FAFB', 0.75) : alpha('#0F172A', 0.6)
              }}
            >
              Work With Us, Grow With Us
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                color: isDark ? '#F8FAFC' : '#0F172A'
              }}
            >
              Trusted by teams that ship at scale
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? alpha('#E2E8F0', 0.75) : alpha('#1E293B', 0.75)
              }}
            >
              We are a mixed group of like-minded professionals who firmly believe in leading rather than following.
              Bacancy is a place where young aspirants enter and come out as enthusiastic leaders. We have formed a
              workplace where things get done right, and accomplishments get privileged accolades. Bacancy is thriving
              on strong systems and being an exemplary organization, and we are striving for new development objectives
              to add weight to your resume.
            </Typography>
          </Stack>
          <Grid
            container
            spacing={{ xs: 2.5, md: 3 }}
            justifyContent={{ xs: 'flex-start', md: 'space-between' }}
            alignItems="center"
          >
            {logos.map((brand) => (
              <Grid key={brand.name} item xs={6} sm={4} md={2}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2.5, md: 3 },
                    height: { xs: 96, md: 110 },
                    borderRadius: 3,
                    background: isDark ? alpha('#111827', 0.85) : alpha('#F1F5F9', 0.9),
                    border: '1px solid',
                    borderColor: isDark ? alpha('#8B5CF6', 0.3) : alpha('#6366F1', 0.25),
                    boxShadow: isDark
                      ? '0 0 0 1px rgba(139,92,246,0.15), 0 20px 40px rgba(17,24,39,0.65)'
                      : '0 0 0 1px rgba(79,70,229,0.1), 0 18px 36px rgba(100,116,139,0.25)',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: isDark
                        ? '0 0 0 1px rgba(168,85,247,0.3), 0 26px 52px rgba(17,24,39,0.75)'
                        : '0 0 0 1px rgba(59,130,246,0.35), 0 26px 52px rgba(148,163,184,0.35)'
                    },
                    '&::before, &::after': {
                      content: '""',
                      position: 'absolute',
                      width: 28,
                      height: 28,
                      border: '2px solid',
                      borderColor: isDark ? alpha('#A855F7', 0.7) : alpha('#4F46E5', 0.7)
                    },
                    '&::before': {
                      top: 10,
                      left: 10,
                      borderRight: 'none',
                      borderBottom: 'none',
                      borderTopLeftRadius: 8
                    },
                    '&::after': {
                      bottom: 10,
                      right: 10,
                      borderLeft: 'none',
                      borderTop: 'none',
                      borderBottomRightRadius: 8
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={brand.logo}
                    alt={brand.name}
                    sx={{
                      width: '100%',
                      maxWidth: { xs: 120, md: 140 },
                      height: 'auto',
                      objectFit: 'contain',
                      filter: isDark ? 'brightness(0) invert(1)' : 'grayscale(0.2)',
                      opacity: isDark ? 0.9 : 0.85
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
