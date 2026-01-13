import React from 'react';
import { Box, Stack, Typography, Card, CardContent } from '@mui/material';

const steps = [
  { label: 'Discovery & planning Phase', duration: '4 Weeks', detail: 'Deliverables: FRD, SRD, Technology Architecture Blueprint' },
  { label: 'UI/UX', duration: '7 Weeks', detail: 'Finalised UI screens, Interactive prototype for developer reference' },
  { label: 'Backend Development', duration: '6 Weeks', detail: 'Fully functional backend API, AI model with initial training data, API documentation' },
  { label: 'Frontend Development', duration: '12 Weeks', detail: 'Fully functional mobile app (Android & iOS), connected and tested with backend APIs' },
  { label: 'AI & Feature Enhancement', duration: '5 Week', detail: 'AI model fine-tuning for travel recommendations, Real-time event updates & personalisation.' },
  { label: 'Quality Assurance', duration: '2 Weeks', detail: 'Bug-free release, QA Report' },
];

const RoadmapStep = ({ step, index, isEven }) => {
  const mainGradient = 'linear-gradient(90deg, #5b5fe8 0%, #a855f7 100%)';
  const ringGradient = 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        mb: { xs: 4, md: -5 }, // Negative margin to "nest" the circles
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
          bgcolor: '#151515',
          color: 'white',
          borderRadius: 3,
          border: '1px solid #262626',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          maxWidth: 440,
          width: '100%'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700}>
              {step.label}{' '}
              <Typography component="span" sx={{ color: '#a1a1aa', fontWeight: 400 }}>
                {step.duration}
              </Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
              {step.detail}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 2. CENTER GRAPHIC ELEMENT */}
      <Box sx={{
        position: 'relative',
        width: 180,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* Background Semi-Circle (The Black "Snake" Body) */}
        <Box sx={{
          position: 'absolute',
          width: 170,
          height: 170,
          bgcolor: '#0f1114',
          borderRadius: '50%',
          zIndex: 1,
          // Clip half to create the "snake" curve look
          clipPath: isEven ? 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' : 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
          display: { xs: 'none', md: 'block' }
        }} />

        {/* The Colored Wing / Arrow */}
        <Box sx={{
          position: 'absolute',
          width: 160,
          height: 70,
          background: mainGradient,
          zIndex: 2,
          left: isEven ? 'auto' : -50,
          right: isEven ? -50 : 'auto',
          borderRadius: isEven ? '0 48px 48px 0' : '48px 0 0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isEven ? 'flex-end' : 'flex-start',
          px: 2,
          boxShadow: '0 10px 30px rgba(88, 80, 236, 0.35)'
        }} />

        {/* The Number Circle */}
        <Box sx={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          bgcolor: '#1b1f2a',
          border: '8px solid #0b0f14',
          boxShadow: '0 0 0 6px #dbeafe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            background: ringGradient,
            opacity: 0.65
          }
        }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'white', position: 'relative', zIndex: 2 }}>
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
