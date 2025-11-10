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
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80";

const HERO_STATS = [
  { label: "Projects Delivered", value: "120+" },
  { label: "Client Satisfaction", value: "98%" },
  { label: "Avg. Time to Kick-off", value: "10 Days" },
];

const ServicesHero = ({ onContactClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: isDark ? alpha("#0f172a", 0.9) : "#f8fafc",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <Grid
          container
          spacing={{ xs: 6, md: 10 }}
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
                  {HERO_STATS.map((stat) => (
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
