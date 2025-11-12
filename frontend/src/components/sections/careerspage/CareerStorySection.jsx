import { Box, Chip, Container, Grid, Stack, Typography, alpha, useTheme } from '@mui/material';

const CareerStorySection = ({ story }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Chip
              label={story.badge}
              sx={{
                alignSelf: 'flex-start',
                fontWeight: 600,
                letterSpacing: 1,
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.22 : 0.12),
                color: theme.palette.primary.main
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: 28, md: 36 } }}>
              {story.title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {story.description}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {story.body}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {story.culture}
            </Typography>
            <Stack spacing={1.5}>
              {story.highlights.map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      mt: 1,
                      bgcolor: theme.palette.primary.main
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 5,
              overflow: 'hidden',
              minHeight: { xs: 260, md: 420 },
              backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.65)), url(${story.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: isDark
                ? '0px 45px 80px rgba(15,23,42,0.6)'
                : '0px 40px 70px rgba(15,118,110,0.25)'
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CareerStorySection;
