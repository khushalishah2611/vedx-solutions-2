import PropTypes from 'prop-types';
import {
  alpha,
  Box,
  Breadcrumbs,
  Button,
  Container,
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
  const accentColor = caseStudy.accentColor || theme.palette.secondary.main;

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box
        sx={{
          position: 'relative',
          color: 'common.white',
          backgroundImage: `${heroOverlay}, url(${caseStudy.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`,
          overflow: 'hidden',
          minHeight: { xs: '90vh', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
      
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={5}
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              alignItems: { xs: 'center', md: 'flex-start' },
              position: 'relative',
              zIndex: 1,
            }}
          >
            {caseStudy.breadcrumbs?.length ? (
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" sx={{ color: alpha('#e2e8f0', 0.9) }} />}
                aria-label="breadcrumb"
                sx={{ color: alpha('#e2e8f0', 0.9) }}
              >
                {caseStudy.breadcrumbs.map((crumb) =>
                  crumb.href ? (
                    <MuiLink
                      key={crumb.label}
                      component={RouterLink}
                      underline="hover"
                      color="inherit"
                      to={crumb.href}
                    >
                      {crumb.label}
                    </MuiLink>
                  ) : (
                    <Typography key={crumb.label} color="inherit">
                      {crumb.label}
                    </Typography>
                  ),
                )}
              </Breadcrumbs>
            ) : null}

            <Stack spacing={3} sx={{ maxWidth: 720 }}>
              {caseStudy.category ? (
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
                      background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {caseStudy.category}
                  </Box>
                </Box>
              ) : null}

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 38, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.15,
                }}
              >
                {caseStudy.title}
              </Typography>

              {caseStudy.tagline ? (
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: alpha('#f8fafc', 0.9),
                    fontWeight: 600,
                    letterSpacing: 0.4,
                  }}
                >
                  {caseStudy.tagline}
                </Typography>
              ) : null}

              {caseStudy.excerpt ? (
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha('#f8fafc', 0.82),
                    lineHeight: 1.8,
                    maxWidth: { xs: '100%', md: 620 },
                  }}
                >
                  {caseStudy.excerpt}
                </Typography>
              ) : null}

              {caseStudy.cta ? (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2.5}
                  sx={{ pt: 1, alignItems: { xs: 'center', md: 'flex-start' } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to={caseStudy.cta.href}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                      color: '#fff',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { sm: 5 },
                      '&:hover': {
                        background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                      },
                    }}
                  >
                    {caseStudy.cta.label}
                  </Button>
                </Stack>
              ) : null}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

CaseStudyDetailHero.propTypes = {
  caseStudy: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    tagline: PropTypes.string,
    excerpt: PropTypes.string,
    heroImage: PropTypes.string.isRequired,
    accentColor: PropTypes.string,
    breadcrumbs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string,
      }),
    ),
    meta: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
    cta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default CaseStudyDetailHero;
