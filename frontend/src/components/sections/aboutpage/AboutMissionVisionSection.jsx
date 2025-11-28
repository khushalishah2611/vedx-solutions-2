import { Container, Grid, Typography, alpha, useTheme, Box } from "@mui/material";

const AboutMissionVisionSection = ({ content }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const mission = content?.mission;
  const vision = content?.vision;

  if (!mission && !vision) return null;

  return (
    <Box
      sx={{
        width: "100%",
    

        // ANIMATION KEYFRAMES
        "@keyframes slideLeftToRight": {
          "0%": { opacity: 0, transform: "translateX(-60px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "@keyframes slideRightToLeft": {
          "0%": { opacity: 0, transform: "translateX(60px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      }}
    >
      <Container maxWidth="xl">
        {/* ---------------- MISSION SECTION ---------------- */}
        {mission && (
          <Grid container spacing={6} alignItems="flex-start">
            {/* Mission Title */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 28, sm: 32, md: 44 },
                  color: "#fff",
                  animation: "slideLeftToRight 0.9s ease-out both",
                }}
              >
                {mission.title}
              </Typography>
            </Grid>

            {/* Mission Text */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="body1"
                sx={{
                  color: alpha("#ffffff", 0.88),
                  fontSize: { xs: 14, sm: 16, md: 18 },
                  lineHeight: 1.9,
                  maxWidth: 1000,
                  animation: "slideRightToLeft 1s ease-out both",
                }}
              >
                {mission.description}
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* Spacing Between Mission & Vision */}
        {mission && vision && <Box sx={{ height: { xs: 40, md: 70 } }} />}

        {/* ---------------- VISION SECTION ---------------- */}
        {vision && (
          <Grid container spacing={6} alignItems="center">
            {/* Vision Title – mobile first, desktop right */}
            <Grid
              item
              xs={12}
              md={4}
              order={{ xs: 1, md: 2 }} // xs: first, md: second (right side)
              sx={{ textAlign: { xs: "left", md: "right" } }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 28, sm: 32, md: 44 },
                  color: "#fff",
                  animation: "slideRightToLeft 0.9s ease-out both",
                }}
              >
                {vision.title}
              </Typography>
            </Grid>

            {/* Vision Description – mobile second, desktop left */}
            <Grid
              item
              xs={12}
              md={8}
              order={{ xs: 2, md: 1 }} 
            >
              <Typography
                variant="body1"
                sx={{
                  color: alpha("#ffffff", 0.88),
                  fontSize: { xs: 14, sm: 16, md: 18 },
                  lineHeight: 1.9,
                  maxWidth: 1000,
                  animation: "slideLeftToRight 1s ease-out both",
                }}
              >
                {vision.description}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AboutMissionVisionSection;
