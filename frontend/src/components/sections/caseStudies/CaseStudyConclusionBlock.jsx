import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';

const CaseStudyConclusionBlock = ({ conclusion, accentColor }) => (
  <Stack spacing={2} alignItems="center">
    <Typography variant="h4" sx={{ fontWeight: 700 }}>
      Conclusion
    </Typography>
    <Box
      sx={{
        width: 72,
        height: 3,
        borderRadius: 999,
        backgroundColor: accentColor,
      }}
    />
    <Typography
      variant="body1"
      sx={{
        maxWidth: 720,
        textAlign: 'center',
        color: 'text.secondary',
        lineHeight: 1.8,
      }}
    >
      {conclusion}
    </Typography>
  </Stack>
);

CaseStudyConclusionBlock.propTypes = {
  conclusion: PropTypes.string.isRequired,
  accentColor: PropTypes.string.isRequired,
};

export default CaseStudyConclusionBlock;
