
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { fullStackServiceFeatures } from "../../../data/servicesPage.js";

const ServicesHighlights = ({ onContactClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  return (
    <Box
      component="section"
     
    >
      {/* Background overlay if needed */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Content stack */}
      <Stack spacing={6} sx={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 32, md: 42 },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Benefits of a Full Stack Development Company 
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: subtleText,
              maxWidth: 760,
              lineHeight: 1.7,
            }}
          >
            From strategy to support, VedX Solutions unifies design, engineering,
            DevOps, and analytics to deliver outcome-driven digital products.
          </Typography>
        </Stack>

        {/* Feature grid */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
        
        >
          {fullStackServiceFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 0.5,
                  p: { xs: 1.5, md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    isDark ? 0.75 : 0.98
                  ),
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.4 : 0.5
                  )}`,
                  transition:
                    "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
                  boxShadow: isDark
                    ? "0 24px 45px rgba(15,23,42,0.45)"
                    : "0 24px 45px rgba(15,23,42,0.12)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: alpha(accentColor, 0.6),
                    boxShadow: isDark
                      ? "0 28px 60px rgba(103,232,249,0.18)"
                      : "0 28px 60px rgba(59,130,246,0.18)",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 18, md: 20 },
                      color: isDark
                        ? "#e2e8f0"
                        : theme.palette.text.primary,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: subtleText, lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* CTA Button */}
        <Stack alignItems="center">
          <Button
            variant="contained"
            size="large"
            onClick={onContactClick}
            sx={{
              background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
              color: "#fff",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: { xs: 4, md: 8 },
              py: { xs: 1.5, md: 2 },
            
            }}
          >
            Request a Quote
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ServicesBenefits;
