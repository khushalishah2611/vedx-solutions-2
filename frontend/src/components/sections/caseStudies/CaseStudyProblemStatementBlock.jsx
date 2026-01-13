import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';

const CaseStudyProblemStatementBlock = ({ problemStatements, accentColor, image }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: { xs: 3, md: 5 },
        background: isDark
          ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%)'
          : '#f8fafc',
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.35)}`,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Stack spacing={1} alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Problem Statement
          </Typography>
          <Box
            sx={{
              width: 64,
              height: 3,
              borderRadius: 999,
              backgroundColor: accentColor,
            }}
          />
        </Stack>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                borderRadius: 3,
                p: 3,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                  ? 'linear-gradient(140deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))'
                  : 'linear-gradient(140deg, #e2e8f0, #f8fafc)',
                border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
              }}
            >
              <Box
                component="img"
                src={image}
                alt="Problem statement illustration"
                loading="lazy"
                sx={{ width: '100%', borderRadius: 2, objectFit: 'cover' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={1.5}>
              {problemStatements.map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      mt: 0.8,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: accentColor,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

CaseStudyProblemStatementBlock.propTypes = {
  problemStatements: PropTypes.arrayOf(PropTypes.string).isRequired,
  accentColor: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default CaseStudyProblemStatementBlock;
