import { Button, Container, Paper, Stack, Typography, alpha } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const CareerPrimaryCTASection = ({ cta }) => {
  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 5,
          px: { xs: 4, md: 6 },
          py: { xs: 5, md: 7 },
          backgroundImage: `linear-gradient(120deg, rgba(59,7,100,0.8), rgba(14,116,144,0.7)), url(${cta.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff'
        }}
      >
        <Stack spacing={2.5} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
          <Stack spacing={1.5} sx={{ maxWidth: 520 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {cta.title}
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.9) }}>
              {cta.description}
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.75) }}>
              {cta.caption}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="large"
            component="a"
            href={cta.ctaHref}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              borderRadius: 999,
              px: 4,
              bgcolor: '#f43f5e',
              color: '#fff',
              fontWeight: 600,
              '&:hover': {
                bgcolor: alpha('#f43f5e', 0.85)
              }
            }}
          >
            {cta.ctaLabel}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CareerPrimaryCTASection;
