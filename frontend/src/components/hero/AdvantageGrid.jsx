import { Grid, Paper, Stack, Typography } from '@mui/material';
import { advantages } from '../../data/content.js';
import * as Icons from '@mui/icons-material';

const resolveIcon = (iconName) => {
  const pascal = iconName
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
  return Icons[pascal] || Icons.AutoAwesome;
};

const AdvantageGrid = () => {
  return (
    <Grid container spacing={3}>
      {advantages.map((advantage) => {
        const Icon = resolveIcon(advantage.icon);
        return (
          <Grid item xs={12} md={6} key={advantage.title}>
            <Paper
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Icon sx={{ color: 'secondary.main', fontSize: 36 }} />
                <Typography variant="h5">{advantage.title}</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {advantage.description}
              </Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AdvantageGrid;