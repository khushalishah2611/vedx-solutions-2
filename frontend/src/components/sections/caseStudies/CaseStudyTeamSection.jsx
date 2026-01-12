import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Stack, Typography, useTheme } from '@mui/material';

const teamRoles = [
  'Project Manager',
  'Business Analyst',
  'UI/UX Designer',
  'Frontend Developers',
  'Backend Developers',
  'DevOps & Cloud Architect',
  'AI & Data Scientist',
  'Quality Assurance and Security Specialist',
];

const CaseStudyTeamSection = ({ animate }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#a855f7' : theme.palette.primary.main;

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Recommended Team : <Box component="span" sx={{ color: 'text.secondary' }}>10 Team Members</Box>
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
          position: 'relative',
          pl: { xs: 0, md: 4 },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: { xs: 8, md: 24 },
            top: 8,
            bottom: 8,
            width: 2,
            bgcolor: alpha(accentColor, 0.6),
            display: { xs: 'none', md: 'block' },
          },
        }}
      >
        {teamRoles.map((role, index) => (
          <Stack
            key={role}
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 420ms ease ${140 + index * 70}ms`,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(accentColor, 0.2),
                border: `1px solid ${alpha(accentColor, 0.7)}`,
                color: accentColor,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {index + 1}
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                border: `1px solid ${alpha(accentColor, 0.5)}`,
                bgcolor: isDark ? alpha('#0f172a', 0.85) : '#f8fafc',
                minWidth: { xs: 'auto', md: 220 },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {role}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
};

CaseStudyTeamSection.propTypes = {
  animate: PropTypes.bool,
};

export default CaseStudyTeamSection;
