import React from "react";
import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const CareerBenefitsSection = ({
  benefits = [],
  title = "Why You Will Love Working With Us",
  description = "The benefits, culture, and support you need to do your best work.",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box component="section">
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 700 }}>
          {title}
        </Typography>

        <Typography variant="body1" sx={{ color: subtleText, lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {benefits.map((benefit, idx) => {
          const key = benefit?.title ? `${benefit.title}-${idx}` : `benefit-${idx}`;

          return (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 1,
                  textAlign: "center",
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.78 : 0.97),
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                  boxShadow: isDark
                    ? "0 4px 30px rgba(2,6,23,0.35)"
                    : "0 4px 30px rgba(15,23,42,0.15)",
                  transition: "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                    boxShadow: isDark
                      ? "0 18px 55px rgba(2,6,23,0.55)"
                      : "0 18px 55px rgba(15,23,42,0.22)",
                  },

                  // Optional: on card hover, affect icon + title
                  "&:hover .benefitIcon": {
                    transform: "translateY(-2px) scale(1.05)",
                  },
                  "&:hover .benefitTitle": {
                    color: "transparent",
                    backgroundImage: "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                }}
              >
                <Stack spacing={2} alignItems="center">
                  {benefit?.icon ? (
                    <Box
                      component="img"
                      className="benefitIcon"
                      src={benefit.icon}
                      alt={benefit?.title || "Benefit"}
                      sx={{
                        width: 52,
                        height: 52,
                        objectFit: "contain",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  ) : null}

                  <Typography
                    variant="h6"
                    className="benefitTitle"
                    sx={{
                      fontWeight: 700,
                      transition: "color 0.3s ease, background-image 0.3s ease",
                    }}
                  >
                    {benefit?.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.6 }}>
                    {benefit?.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

CareerBenefitsSection.propTypes = {
  benefits: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  description: PropTypes.string,
};

export default CareerBenefitsSection;
