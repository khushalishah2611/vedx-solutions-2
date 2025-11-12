import { Button, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const CareerOpenRolesSection = ({ roles, applyHref }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container id="open-roles" maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      <Stack spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }} textAlign={{ xs: 'left', md: 'center' }} sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2 }}>
          Does your skill fit the job post?
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Explore opportunities that match your craft
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 640 }}>
          We're always on the lookout for passionate innovators. Choose the role that aligns with your strengths and let's build impactful products together.
        </Typography>
      </Stack>
      <Grid container spacing={{ xs: 4, md: 4 }}>
        {roles.map((role) => (
          <Grid key={role.title} item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 4,
                p: { xs: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`,
                bgcolor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.7)
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {role.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {role.description}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', fontWeight: 600, flexWrap: 'wrap' }}>
                <Typography variant="caption">{role.experience}</Typography>
                <Typography variant="caption">{role.positions}</Typography>
                <Typography variant="caption">{role.type}</Typography>
              </Stack>
              <Button
                variant="contained"
                component="a"
                href={applyHref}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: 999,
                  px: 3,
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.85)
                  }
                }}
              >
                Apply Now
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CareerOpenRolesSection;
