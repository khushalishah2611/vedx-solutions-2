import { alpha, Grid, Paper, Stack, Typography } from '@mui/material';
import { metrics } from '../../data/content.js';

const MetricsBar = () => {
  return (
    <Paper
      sx={{
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 5 },
        backgroundImage:
          'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(236,72,153,0.2), rgba(14,165,233,0.2))'
      }}
    >
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Stack spacing={0.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Typography variant="h4">{metric.value}</Typography>
              <Typography variant="body2" sx={{ color: alpha('#f9fafb', 0.7) }}>
                {metric.label}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default MetricsBar;