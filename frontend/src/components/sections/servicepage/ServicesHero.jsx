import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { servicesHeroStats } from "../../../data/servicesPage.js";

const ServicesHero = ({ onContactClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)),
            url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80")
          `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.25)}`,
        transform: 'scale(1.05)',
        transition: 'transform 0.6s ease, filter 0.6s ease',
        filter: isDark ? 'brightness(0.55)' : 'brightness(0.8)',
        position: 'relative',
    
        overflow: 'hidden',
        minHeight: { xs: '70vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        pb: { xs: 12, md: 14 },
        pt: { xs: 14, md: 18 }
      }}
    >
      <Container maxWidth="lg" >
        <Grid
          container

          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 38, sm: 46, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                Full Stack Development Services
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: subtleText, maxWidth: 540, lineHeight: 1.7 }}
              >
                VedX Solutions offers full stack development services to help
                achieve your business objectives across platforms. Our agile
                squads deliver resilient, scalable solutions with zero
                disruption to your operations.
              </Typography>

              <Button
                variant="contained"
                size="large"
                href="#contact"
                sx={{
                  background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',

                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                  },
                }}
              >
                Contact us
              </Button>

              <Stack
                spacing={{ xs: 3, sm: 5 }}
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ sm: "center" }}
                pt={2}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 2.5, sm: 4 }}
                >
                  {servicesHeroStats.map((stat) => (
                    <Stack key={stat.label} spacing={0.5}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: 28, md: 32 },
                          fontWeight: 700,
                          color: accentColor,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: subtleText, fontWeight: 500 }}
                      >
                        {stat.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Grid>


        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesHero;
