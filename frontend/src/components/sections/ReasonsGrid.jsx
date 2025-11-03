import { Grid, Paper, Stack, Typography } from '@mui/material';
import { reasons } from '../../data/content.js';

const ReasonsGrid = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Why teams trust VEDX</Typography>
      <Grid container spacing={3}>
        {reasons.map((reason) => (
          <Grid item xs={12} md={6} key={reason.title}>
            <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
              <Stack spacing={1.5}>
                <Typography variant="h6">{reason.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {reason.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ReasonsGrid;