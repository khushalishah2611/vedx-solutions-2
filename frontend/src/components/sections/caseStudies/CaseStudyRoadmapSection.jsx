import React from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Stack, Typography, Card, CardContent } from '@mui/material';

const steps = [
  { label: 'Discovery & planning Phase', duration: '4 Weeks', detail: 'Deliverables: FRD, SRD, Technology Architecture Blueprint' },
  { label: 'UI/UX', duration: '7 Weeks', detail: 'Finalised UI screens, Interactive prototype for developer reference' },
  { label: 'Backend Development', duration: '6 Weeks', detail: 'Fully functional backend API, AI model with initial training data, API documentation' },
  { label: 'Frontend Development', duration: '12 Weeks', detail: 'Fully functional mobile app (Android & iOS), connected and tested with backend APIs' },
  { label: 'AI & Feature Enhancement', duration: '5 Week', detail: 'AI model fine-tuning for travel recommendations, Real-time event updates & personalisation.' },
  { label: 'Quality Assurance', duration: '2 Weeks', detail: 'Bug-free release, QA Report' },
];

const RoadmapStep = ({ step, index, isEven }) => {
  const mainGradient = 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        mb: { xs: 4, md: -4 }, // Negative margin to "nest" the circles
      }}
    >
      {/* 1. TEXT CONTENT */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: isEven ? 'flex-end' : 'flex-start',
        px: 4,
        zIndex: 10
      }}>
        <Card sx={{
          bgcolor: '#1a1a1a',
          color: 'white',
          borderRadius: 0.5,
          border: '1px solid #333',
          maxWidth: 400,
          width: '100%'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700}>
              {step.label} <Typography component="span" sx={{ color: '#aaa', fontWeight: 400 }}>{step.duration}</Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
              {step.detail}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 2. CENTER GRAPHIC ELEMENT */}
      <Box sx={{
        position: 'relative',
        width: 160,
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* Background Semi-Circle (The Black "Snake" Body) */}
        <Box sx={{
          position: 'absolute',
          width: 140,
          height: 140,
          bgcolor: '#fff',
          borderRadius: '50%',
          zIndex: 1,
          // Clip half to create the "snake" curve look
          clipPath: isEven ? 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' : 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
          display: { xs: 'none', md: 'block' }
        }} />

        {/* The Colored Wing / Arrow */}
        <Box sx={{
          position: 'absolute',
          width: 140,
          height: 60,
          background: mainGradient,
          zIndex: 2,
          left: isEven ? 'auto' : -40,
          right: isEven ? -40 : 'auto',
          borderRadius: isEven ? '0 40px 40px 0' : '40px 0 0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isEven ? 'flex-end' : 'flex-start',
          px: 2,

        }} />

        {/* The Number Circle */}
        <Box sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: '#1e263d',
          border: '6px solid #121212',
          boxShadow: '0 0 0 4px #4fc3f7', // Blue Ring
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>
            {String(index + 1).padStart(2, '0')}
          </Typography>
        </Box>
      </Box>

      {/* 3. SPACER */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
    </Box>
  );
};

const CaseStudyRoadmapSection = () => {
  return (
    <Box sx={{ bgcolor: '#000', py: 10, minHeight: '100vh', overflow: 'hidden' }}>
      <Typography variant="h3" align="center" sx={{ color: 'white', mb: 8, fontWeight: 700 }}>
        Execution Roadmap & Timeline: <Box component="span" sx={{ opacity: 0.5 }}>34 Weeks</Box>
      </Typography>

      <Box sx={{ maxWidth: 1200, mx: 'auto', position: 'relative' }}>
        <Stack alignItems="center">
          {steps.map((step, index) => (
            <RoadmapStep key={index} step={step} index={index} isEven={index % 2 === 0} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default CaseStudyRoadmapSection;