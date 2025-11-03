import { Grid, Paper, Stack, Typography } from '@mui/material';
import { differentiators } from '../../data/content.js';

const DifferentiatorPanels = () => {
  return (
    <Grid container spacing={3}>
      {differentiators.map((item) => (
        <Grid item xs={12} md={6} key={item.title}>
          <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
            <Stack spacing={2}>
              <Typography variant="overline" sx={{ color: 'secondary.light', letterSpacing: 3 }}>
                {item.subtitle}
              </Typography>
              <Typography variant="h4">{item.title}</Typography>
              <Stack component="ul" spacing={1.5} sx={{ m: 0, pl: 2 }}>
                {item.bullets.map((bullet) => (
                  <Typography component="li" variant="body2" key={bullet} sx={{ color: 'text.secondary' }}>
                    {bullet}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DifferentiatorPanels;