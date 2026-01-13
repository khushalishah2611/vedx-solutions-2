import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';

const impactIcons = [
  TimerOutlinedIcon,
  FavoriteBorderOutlinedIcon,
  HubOutlinedIcon,
  HealthAndSafetyOutlinedIcon,
  MedicationOutlinedIcon,
];

const CaseStudyImpactBlock = ({ impactMetrics, accentColor }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Stack spacing={3} alignItems="center">
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Impact
      </Typography>
      <Box
        sx={{
          width: 64,
          height: 3,
          borderRadius: 999,
          backgroundColor: accentColor,
        }}
      />
      <Grid container spacing={2.5} justifyContent="center" columns={{ xs: 1, sm: 12, md: 10 }}>
        {impactMetrics.map((metric, index) => {
          const Icon = impactIcons[index % impactIcons.length];
          return (
            <Grid item xs={1} sm={6} md={2} key={metric.label}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: 2.5,
                  borderRadius: 2.5,
                  textAlign: 'center',
                  bgcolor: isDark ? alpha('#0b1120', 0.9) : '#fff',
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.3)}`,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    mx: 'auto',
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(accentColor, 0.15),
                    border: `1px solid ${alpha(accentColor, 0.4)}`,
                  }}
                >
                  <Icon sx={{ color: accentColor }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {metric.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {metric.label}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

CaseStudyImpactBlock.propTypes = {
  impactMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  accentColor: PropTypes.string.isRequired,
};

export default CaseStudyImpactBlock;
