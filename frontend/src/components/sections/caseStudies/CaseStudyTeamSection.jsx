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

const CaseStudyTeamSection = ({ animate = true }) => {
  // Hardcoded gradient colors to match the image exactly
  const gradientStart = '#a855f7'; // Purple
  const gradientEnd = '#ec4899';   // Pink
  const gradientMain = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;

  return (
    <Box sx={{ bgcolor: '#000', py: 8, px: 2, overflow: 'hidden', minHeight: '100vh' }}>
      
      {/* --- HEADER SECTION --- */}
      <Stack alignItems="center" spacing={1} sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            fontWeight: 700, 
            color: '#fff',
            fontSize: { xs: '1.5rem', md: '2.5rem' }
          }}
        >
          Recommended Team : <Box component="span" sx={{ color: '#64748b', fontWeight: 400 }}>10 Team Members</Box>
        </Typography>
        
        {/* Gradient Underline */}
        <Box 
          sx={{ 
            height: '4px', 
            width: '150px', 
            background: gradientMain,
            borderRadius: '2px',
            mt: 2
          }} 
        />
      </Stack>

      {/* --- TIMELINE/TREE SECTION --- */}
      <Box sx={{ position: 'relative', maxWidth: '900px', mx: 'auto' }}>
        
        {/* Central Vertical Spine Line */}
        <Box
          sx={{
            position: 'absolute',
            left: { xs: '20px', md: '50%' }, // Left on mobile, Center on desktop
            transform: { xs: 'none', md: 'translateX(-50%)' },
            top: 0,
            bottom: 0,
            width: '2px',
            bgcolor: alpha('#fff', 0.2),
          }}
        />

        {teamRoles.map((role, index) => {
          const isLeft = index % 2 === 0; // Even numbers on left (0, 2, 4...)
          const number = index + 1;

          return (
            <Box
              key={role}
              sx={{
                display: 'flex',
                // Mobile: always row (icon left, text right). Desktop: alternates.
                flexDirection: { xs: 'row', md: isLeft ? 'row' : 'row-reverse' },
                alignItems: 'center',
                justifyContent: { xs: 'flex-start', md: 'center' },
                mb: 6, // Spacing between rows
                position: 'relative',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${index * 0.1}s`,
              }}
            >
              {/* 1. THE CARD (Text Box) */}
              <Box
                sx={{
                  width: { xs: 'auto', md: '40%' },
                  flex: { xs: 1, md: 'none' },
                  textAlign: 'center',
                  ml: { xs: 6, md: isLeft ? 0 : 0 }, // Mobile spacing fix
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    p: '1px', // Border width hack for gradient
                    borderRadius: '16px',
                    background: gradientMain, // The gradient border color
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: '#0f0f11', // Dark inner background
                      borderRadius: '15px', // Slightly smaller radius
                      py: 1.5,
                      px: 3,
                    }}
                  >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#fff', 
                            fontSize: '1rem', 
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                        }}
                    >
                      {role}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* 2. THE CONNECTOR LINE (Horizontal) */}
              <Box
                sx={{
                  width: { xs: '20px', md: '40px' },
                  height: '2px',
                  bgcolor: alpha('#fff', 0.2),
                  display: { xs: 'none', md: 'block' } // Hide connector on mobile usually, or adjust
                }}
              />

              {/* 3. THE NUMBER BADGE (Center Node) */}
              <Box
                sx={{
                  position: { xs: 'absolute', md: 'relative' },
                  left: { xs: '0px', md: 'auto' }, // Absolute left on mobile
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: gradientMain,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 15px ${alpha(gradientStart, 0.5)}`,
                  zIndex: 2,
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                  {number}
                </Typography>
              </Box>

               {/* Spacer for the other side (Desktop only) to keep balance */}
               <Box sx={{ width: { xs: 0, md: '40%' }, display: { xs: 'none', md: 'block' } }} />

            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

CaseStudyTeamSection.propTypes = {
  animate: PropTypes.bool,
};

export default CaseStudyTeamSection;