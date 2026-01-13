import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';

const CaseStudyOverviewBlock = ({ overviewContent, animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        p: { xs: 3, md: 5 },
        background: isDark
          ? 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.25), transparent 55%), linear-gradient(135deg, #0f172a 0%, #05070c 100%)'
          : 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.15), transparent 55%), linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.45 : 0.35)}`,
      }}
    >
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={7}>
          <Stack spacing={2.5}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: isDark ? '#fff' : 'text.primary',
              }}
            >
              {overviewContent.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? alpha('#fff', 0.74) : 'text.secondary',
                lineHeight: 1.9,
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 500ms ease 200ms',
              }}
            >
              {overviewContent.description}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              borderRadius: 2.5,
              overflow: 'hidden',
              border: `1px solid ${alpha('#fff', isDark ? 0.1 : 0.4)}`,
              boxShadow: isDark
                ? '0 20px 60px rgba(15, 23, 42, 0.55)'
                : '0 20px 50px rgba(15, 23, 42, 0.15)',
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 600ms ease 220ms',
            }}
          >
            <Box
              component="img"
              src={overviewContent.image}
              alt={`${overviewContent.title} overview`}
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

CaseStudyOverviewBlock.propTypes = {
  overviewContent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyOverviewBlock;
