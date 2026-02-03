import { Box, Grid, Stack, Typography, alpha, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const CareerTrustedSection = ({ logos, title, description }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ✅ theme-wise palette
  const cornerColor = isDark ? "#d946ef" : theme.palette.primary.main; // purple in dark, primary in light
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.78 : 0.85);

  const sectionBg = isDark
    ? "radial-gradient(ellipse at center, #0f172a 0%, #020617 70%)"
    : "radial-gradient(ellipse at center, #ffffff 0%, #f3f4f6 70%)";

  const cardBg = isDark ? "#020617" : "#ffffff";
  const cardBorder = isDark
    ? alpha("#ffffff", 0.08)
    : alpha(theme.palette.text.primary, 0.08);

  const hoverShadow = isDark
    ? `0 0 22px ${alpha(cornerColor, 0.35)}`
    : `0 10px 26px ${alpha(theme.palette.text.primary, 0.14)}`;

  const logoFilter = isDark ? "grayscale(100%)" : "grayscale(30%)";
  const logoOpacity = isDark ? 0.85 : 0.95;

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, background: sectionBg }}>
      {/* Heading */}
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 26, md: 38 },
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 720,
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      </Stack>

      {/* Logos */}
      <Grid container spacing={4} justifyContent="center">
        {logos.map((logo) => (
          <Grid item xs={6} sm={4} md={3} key={logo.name}>
            <Box
              sx={{
                position: "relative",
                height: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cardBg,
                borderRadius: 1.5,
                border: `1px solid ${cardBorder}`,
                overflow: "hidden",
                transition: "all .25s ease",

                "&:hover": {
                  boxShadow: hoverShadow,
                  transform: "translateY(-2px)",
                },

                /* 2 corners using pseudo */
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  width: 14,
                  height: 14,
                },
                "&::before": {
                  top: 10,
                  left: 10,
                  borderTop: `2px solid ${cornerColor}`,
                  borderLeft: `2px solid ${cornerColor}`,
                },
                "&::after": {
                  bottom: 10,
                  right: 10,
                  borderBottom: `2px solid ${cornerColor}`,
                  borderRight: `2px solid ${cornerColor}`,
                },
              }}
            >
              {/* Extra two corners */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 14,
                  height: 14,
                  borderTop: `2px solid ${cornerColor}`,
                  borderRight: `2px solid ${cornerColor}`,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  width: 14,
                  height: 14,
                  borderBottom: `2px solid ${cornerColor}`,
                  borderLeft: `2px solid ${cornerColor}`,
                }}
              />

              {/* Logo */}
              <Box
                component="img"
                src={logo.logo}
                alt={logo.name}
                sx={{
                  maxHeight: 42,
                  maxWidth: "70%",
                  objectFit: "contain",
                  opacity: logoOpacity,
                  filter: logoFilter,
                  transition: "all .25s ease",

                  "&:hover": {
                    filter: "none",
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CareerTrustedSection.propTypes = {
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      logo: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  description: PropTypes.string,
};

CareerTrustedSection.defaultProps = {
  logos: [],
  title: "Trusted Technology Partners",
  description: "We collaborate with platforms and tools our teams love working with.",
};

export default CareerTrustedSection;
