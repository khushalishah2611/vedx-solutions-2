import PropTypes from 'prop-types';
import {
  alpha,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

const heroOverlay =
  'linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.82) 45%, rgba(15, 23, 42, 0.96) 100%)';

const CaseStudyDetailHero = ({ caseStudy }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const hasCustomBreadcrumbs =
    Array.isArray(caseStudy.breadcrumbs) && caseStudy.breadcrumbs.length > 0;

  const accentColor = caseStudy.accentColor || theme.palette.secondary.main;
  const subtleText = alpha('#ffffff', 0.8);

  // Hero text fallbacks
  const heroTitle = caseStudy.heroTitle || caseStudy.title;
  const heroDescription =
    caseStudy.heroDescription ||
    caseStudy.excerpt ||
    `VedX Solutions delivers tailored solutions that help you achieve
     your business objectives with resilient, scalable digital products.`;

  // Treat meta as stats for the bottom row
  const stats = Array.isArray(caseStudy.meta) ? caseStudy.meta : [];

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: `
          ${heroOverlay},
          url(${caseStudy.heroImage})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'transform 0.6s ease, filter 0.6s ease',
        filter: isDark ? 'brightness(0.9)' : 'brightness(0.8)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '60vh', md: '70vh' },
        display: 'flex',
        alignItems: 'center',
        pb: { xs: 12, md: 14 },
        pt: { xs: 14, md: 18 },
     
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          rowSpacing={4}
        >
          {/* Breadcrumbs row */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Breadcrumbs
              separator={
                <NavigateNextIcon
                  fontSize="small"
                  sx={{ color: alpha('#fff', 0.75) }}
                />
              }
              aria-label="breadcrumb"
              sx={{
                color: alpha('#fff', 0.85),
                fontSize: { xs: 12, sm: 14, md: 16 },
                maxWidth: '100%',
                mb: { xs: 1, sm: 2 },
                '& .MuiBreadcrumbs-ol': {
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  rowGap: 0.5,
                },
                '& .MuiBreadcrumbs-li': {
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: { xs: '100%', sm: 'unset' },
                },
                '& a, & p': {
                  fontSize: { xs: 12, sm: 14, md: 16 },
                  textAlign: { xs: 'center', md: 'left' },
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: 1.4,
                },
              }}
            >
              {hasCustomBreadcrumbs ? (
                caseStudy.breadcrumbs.map((crumb) =>
                  crumb.href ? (
                    <MuiLink
                      key={crumb.label}
                      component={RouterLink}
                      underline="hover"
                      color="#fff"
                      to={crumb.href}
                    >
                      {crumb.label}
                    </MuiLink>
                  ) : (
                    <Typography
                      key={crumb.label}
                      sx={{ color: alpha('#fff', 0.85) }}
                    >
                      {crumb.label}
                    </Typography>
                  )
                )
              ) : (
                <>
                  <MuiLink
                    component={RouterLink}
                    underline="hover"
                    color="#fff"
                    to="/"
                  >
                    Home
                  </MuiLink>
                  <MuiLink
                    component={RouterLink}
                    underline="hover"
                    color="#fff"
                    to="/case-studies"
                  >
                    Case Studies
                  </MuiLink>
                  <Typography sx={{ color: alpha('#fff', 0.85) }}>
                    {caseStudy.title}
                  </Typography>
                </>
              )}
            </Breadcrumbs>
          </Grid>

          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Stack
              spacing={4}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              {/* Optional category pill */}
              {caseStudy.category && (
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
                    {caseStudy.category}
                  </Box>
                </Box>
              )}

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 32, sm: 40, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: '#fff',
                }}
              >
                {heroTitle}
              </Typography>
              
              <Typography
                variant="body1"
                sx={{ color: subtleText, maxWidth: 540, lineHeight: 1.7 }}
              >
                {heroDescription}
              </Typography>

              {caseStudy.cta && (
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to={caseStudy.cta.href}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background:
                      'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 1.75 },
                    '&:hover': {
                      background:
                        'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                    },
                  }}
                >
                  {caseStudy.cta.label}
                </Button>
              )}

          
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

CaseStudyDetailHero.propTypes = {
  caseStudy: PropTypes.shape({
    title: PropTypes.string.isRequired,
    heroTitle: PropTypes.string,
    heroDescription: PropTypes.string,
    category: PropTypes.string,
    tagline: PropTypes.string,
    excerpt: PropTypes.string,
    heroImage: PropTypes.string.isRequired,
    accentColor: PropTypes.string,
    breadcrumbs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string,
      })
    ),
    meta: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    cta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default CaseStudyDetailHero;
