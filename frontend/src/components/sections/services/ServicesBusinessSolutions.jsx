import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { Box, Button, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { businessSolutions } from '../../../data/servicesPage.js';

const ServicesBusinessSolutions = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box component="section">
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Tech solutions for all business types
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
          Whether you are validating an idea or optimising global operations, our playbooks adapt to your stage and
          ambition.
        </Typography>
      </Stack>
      <Grid container spacing={4}>
        {businessSolutions.map((solution) => (
          <Grid item xs={12} sm={6} md={3} key={solution.title}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.95),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {solution.title}
                </Typography>
                <Typography variant="body2" sx={{ color: subtleText }}>
                  {solution.description}
                </Typography>
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="text"
                color="inherit"
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  color: accentColor,
                  textTransform: 'none'
                }}
              >
                {solution.cta}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesBusinessSolutions;
