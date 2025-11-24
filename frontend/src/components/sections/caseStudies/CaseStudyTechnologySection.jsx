import React from 'react';
import {
  alpha,
  Avatar,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';

// Optional fallback stack if a caseStudy has no technologyStack defined
const defaultTechnologies = [
  {
    name: 'HTML5',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  },
  {
    name: 'CSS3',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  },
  {
    name: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  },
  {
    name: 'TypeScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  {
    name: 'React.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'Redux',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  },
];

const CaseStudyTechnologySection = ({ caseStudy, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  const subtleText = alpha(
    theme.palette.text.secondary,
    isDark ? 0.9 : 0.8
  );

  // Use technologyStack from caseStudy if available, otherwise fall back
  const technologies =
    Array.isArray(caseStudy?.technologyStack) && caseStudy.technologyStack.length
      ? caseStudy.technologyStack
      : defaultTechnologies;

  return (
    <Box component="section" sx={{ mt: { xs: 6, md: 8 } }}>
      {/* Header Section */}
      <Stack
        spacing={2.5}
        alignItems="center"
        textAlign="center"
        sx={{ mb: { xs: 4, md: 5 }, px: { xs: 2, md: 0 } }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 28, md: 40 },
            fontWeight: 700,
          }}
        >
          Technologies We Support
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 760,
          }}
        >
          Choose from a comprehensive library of frontend, backend, UI/UX,
          database, and DevOps expertise to ship resilient platforms.
        </Typography>
      </Stack>

      {/* Technology Grid */}
      <Grid
        container
        spacing={2.5}
        sx={{
          mt: { xs: 4, md: 5 },
          px: { xs: 2, md: 0 },
        }}
      >
        {technologies.map((tech) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={2}
            key={tech.name}
          >
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.75 : 0.98
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.5
                )}`,
                transition:
                  'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                boxShadow: isDark
                  ? '0 20px 35px rgba(15,23,42,0.35)'
                  : '0 20px 35px rgba(15,23,42,0.08)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: isDark ? '#67e8f9' : accentColor,
                  boxShadow: isDark
                    ? '0 24px 40px rgba(15,23,42,0.6)'
                    : '0 24px 40px rgba(15,23,42,0.14)',
                },
              }}
            >
              <Avatar
                src={tech.icon}
                alt={tech.name}
                variant="rounded"
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  transition: 'color 0.3s ease, background-image 0.3s ease',
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
                {tech.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CaseStudyTechnologySection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

CaseStudyTechnologySection.defaultProps = {
  animate: false,
};

export default CaseStudyTechnologySection;
