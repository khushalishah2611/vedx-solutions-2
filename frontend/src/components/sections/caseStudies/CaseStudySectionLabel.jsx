import React from 'react';
import { alpha, Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const CaseStudySectionLabel = ({ text, animate, delay = 60, sx }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 2,
        py: 1,
        borderRadius: 0.5,
        border: `1px solid ${alpha('#ffffff', 0.1)}`,
        background: !isDark ? alpha('#ddddddff', 0.9) : alpha('#0000007c', 0.9),
        color: alpha(accentColor, 0.9),
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontSize: 11,
        lineHeight: 1.3,
        width: 'fit-content',
        mx: { xs: 'auto', md: 0 },
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(10px)',
        transition: `all 420ms ease ${delay}ms`,
        ...sx,
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
        {text}
      </Box>
    </Box>
  );
};

CaseStudySectionLabel.propTypes = {
  text: PropTypes.string.isRequired,
  animate: PropTypes.bool,
  delay: PropTypes.number,
  sx: PropTypes.object,
};

export default CaseStudySectionLabel;
