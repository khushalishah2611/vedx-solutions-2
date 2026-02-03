import React from "react";
import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { AppButton } from "../../shared/FormControls.jsx";

const CareerOpenRolesSection = ({
  roles = [],
  applyHref = null,
  title = "Open Positions",
  description = "Explore current opportunities to join our high-impact teams.",
  onApply = null,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;

  return (
    <Box component="section">
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 700 }}>
          {title}
        </Typography>

        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720, lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {roles.map((role, idx) => {
          const key = role?.id ?? (role?.title ? `${role.title}-${idx}` : `role-${idx}`);

          return (
            <Grid item xs={12} md={6} key={key}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.78 : 0.97),
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                  boxShadow: isDark
                    ? "0 16px 30px rgba(2,6,23,0.35)"
                    : "0 16px 30px rgba(15,23,42,0.12)",

                  // ✅ no lib animation: only transition + hover
                  transition: "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                    boxShadow: isDark
                      ? "0 18px 55px rgba(2,6,23,0.55)"
                      : "0 18px 55px rgba(15,23,42,0.22)",
                  },

                  // ✅ on card hover: title gradient
                  "&:hover .roleTitle": {
                    color: "transparent",
                    backgroundImage: "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                }}
              >
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    className="roleTitle"
                    sx={{
                      fontWeight: 800,
                      transition: "color 0.3s ease, background-image 0.3s ease",
                      display: "inline-block",

                      // optional: title hover even without card hover
                      "&:hover": {
                        color: "transparent",
                        backgroundImage: "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      },
                    }}
                  >
                    {role?.title}
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ flexWrap: "wrap" }}
                  >
                    {role?.experience ? (
                      <Typography variant="body2" sx={{ color: subtleText }}>
                        {role.experience}
                      </Typography>
                    ) : null}

                    {role?.positions ? (
                      <Typography variant="body2" sx={{ color: subtleText }}>
                        {role.positions}
                      </Typography>
                    ) : null}

                    {role?.type ? (
                      <Typography variant="body2" sx={{ color: subtleText }}>
                        {role.type}
                      </Typography>
                    ) : null}
                  </Stack>

                  {role?.description ? (
                    <Typography variant="body2" sx={{ color: subtleText, lineHeight: 1.6 }}>
                      {role.description}
                    </Typography>
                  ) : null}

                  {(applyHref || onApply) ? (
                    <Box>
                      <AppButton
                        variant="outlined"
                        href={onApply ? undefined : applyHref}
                        onClick={onApply ? () => onApply(role) : undefined}
                        sx={{
                          textTransform: "none",
                          borderRadius: "10px",
                          borderColor: alpha(accentColor, isDark ? 0.55 : 0.45),
                          color: accentColor,
                          "&:hover": {
                            borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
                            backgroundColor: alpha(accentColor, isDark ? 0.12 : 0.08),
                          },
                        }}
                      >
                        Apply Now
                      </AppButton>
                    </Box>
                  ) : null}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

CareerOpenRolesSection.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      experience: PropTypes.string,
      positions: PropTypes.string,
      type: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  applyHref: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onApply: PropTypes.func,
};

export default CareerOpenRolesSection;
