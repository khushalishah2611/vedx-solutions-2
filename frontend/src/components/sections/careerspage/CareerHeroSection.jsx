import { Box, Button, Container, Stack, Typography, alpha, useTheme } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const CareerHeroSection = ({ hero }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        position: 'relative',
        color: '#fff',
        pt: { xs: 14, md: 18 },
        pb: { xs: 12, md: 16 },
        minHeight: { xs: '90vh', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(120deg, rgba(8,13,35,0.85) 10%, rgba(42,11,80,0.75) 55%, rgba(0,136,204,0.7) 100%), url(${hero.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        filter: isDark ? 'brightness(0.55)' : 'brightness(0.8)',
        transform: 'scale(1.05)',
        transition: 'transform 0.6s ease, filter 0.6s ease'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3.5} sx={{ maxWidth: { xs: '100%', md: 720 } }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 34, md: 48 }, fontWeight: 700, lineHeight: 1.2 }}>
            {hero.title}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: 16, md: 18 }, color: alpha('#ffffff', 0.9) }}>
            {hero.description}
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8), maxWidth: 560 }}>
            {hero.caption}
          </Typography>
          <Button
            variant="contained"
            size="large"
            component="a"
            href={hero.ctaHref}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              alignSelf: 'flex-start',
              px: 4,
              py: 1.25,
              borderRadius: 999,
              bgcolor: '#f43f5e',
              color: '#fff',
              fontWeight: 600,
              '&:hover': {
                bgcolor: alpha('#f43f5e', 0.85)
              }
            }}
          >
            {hero.ctaLabel}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default CareerHeroSection;
