import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from "@mui/material";

const CaseStudyTechnologiesSection = ({ caseStudy, animate = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ✅ hover highlight color (change if needed)
  const hoverBorder = isDark ? "#67e8f9" : theme.palette.primary.main;

  const technologies = useMemo(() => {
    if (caseStudy?.technologyHighlights?.length) return caseStudy.technologyHighlights;

    return [];
  }, [caseStudy]);

  return (
    <Stack spacing={3} alignItems="center">
      {/* Section chip */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderRadius: 0.5,
          border: `1px solid ${alpha("#fff", 0.12)}`,
          background: isDark ? alpha("#000", 0.55) : alpha("#ddd", 0.9),
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        <Box
          component="span"
          sx={{
            background: "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Technologies
        </Box>
      </Box>
  <Box mt={10} />
      <Box sx={{ width: "100%", maxWidth: 1100 }}>
        <Grid container spacing={2.5} justifyContent="center">
          {technologies.map((technology, index) => {
            const title = technology?.title || "Technology";

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${title}-${index}`}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 0.5,
                    textAlign: "center",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",

                    // ✅ base
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.98),
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.5)}`,
                    boxShadow: isDark
                      ? "0 20px 35px rgba(15,23,42,0.35)"
                      : "0 20px 35px rgba(15,23,42,0.08)",

                    // ✅ animate in (fix: do NOT override transform twice)
                    opacity: animate ? 1 : 0,
                    transform: animate ? "none" : "translateY(14px)",

                    // ✅ transitions (fix: remove duplicate transition)
                    transition: `opacity 500ms ease ${120 + index * 80}ms,
                                 transform 500ms ease ${120 + index * 80}ms,
                                 box-shadow 0.35s ease,
                                 border-color 0.35s ease`,

                    // ✅ hover highlight like screenshot
                    "&:hover": {
                      transform: animate ? "translateY(-6px)" : "translateY(8px)",
                      borderColor: hoverBorder,
                      boxShadow: isDark
                        ? `0 24px 40px rgba(15,23,42,0.6), 0 0 0 1px ${alpha(hoverBorder, 0.25)}`
                        : `0 24px 40px rgba(15,23,42,0.14), 0 0 0 1px ${alpha(
                          hoverBorder,
                          0.22
                        )}`,
                    },

                    // ✅ hover effect: gradient text on title
                    "&:hover .tech-title": {
                      color: "transparent",
                      backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',

                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    },


                  }}
                >
                  {/* icon/image */}
                  {technology?.image ? (
                    <Box
                      className="tech-media"
                      sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 1.5,
                        borderRadius: 0.5,
                        overflow: "hidden",
                       
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box
                        component="img"
                        src={technology.image}
                        alt={title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </Box>
                  ) : (
                    <Box
                      className="tech-media"
                      sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 1.5,
                        borderRadius: 0.5,
                        border: `1px solid ${alpha(hoverBorder, 0.35)}`,
                        background: `linear-gradient(135deg, ${alpha(
                          hoverBorder,
                          0.18
                        )}, ${alpha("#9333EA", 0.12)})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: alpha(hoverBorder, 0.9),
                        fontWeight: 800,
                        letterSpacing: 0.5,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {title.slice(0, 2).toUpperCase()}
                    </Box>
                  )}

                  {/* title */}
                  <Typography
                    variant="subtitle1"
                    className="tech-title"
                    sx={{
                      fontWeight: 700,
                      transition: "color 0.3s ease, background-image 0.3s ease",
                      wordBreak: "break-word",
                    }}
                  >
                    {title}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Stack>
  );
};

CaseStudyTechnologiesSection.propTypes = {
  caseStudy: PropTypes.object,
  animate: PropTypes.bool,
};

export default CaseStudyTechnologiesSection;
