import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { Box, Grid, Paper, Stack, Typography, useTheme } from "@mui/material";

import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";

const impactIcons = [
  TimerOutlinedIcon,
  FavoriteBorderOutlinedIcon,
  HubOutlinedIcon,
  HealthAndSafetyOutlinedIcon,
  MedicationOutlinedIcon,
];

const CaseStudyImpactBlock = ({ impactMetrics, accentColor }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ✅ fallback accent (your earlier safeAccent)
  const safeAccent =  "#a855f7";

  // ✅ animation trigger
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect(); // ✅ run once
        }
      },
      { threshold: 0.2 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  const accentGradient = useMemo(
    () => `linear-gradient(90deg, ${safeAccent} 0%, #2196f3 100%)`,
    [safeAccent]
  );

  return (
    <Stack ref={rootRef} spacing={3} alignItems="center">
      {/* Badge */}
      <Box
        sx={{
          mx: "auto",
          display: "flex",
          justifyContent: "center",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0px)" : "translateY(12px)",
          transition: "opacity 700ms ease, transform 700ms ease",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 2,
            py: 1,
            borderRadius: 0.5,
            border: `1px solid ${alpha("#ffffff", 0.1)}`,
            background: isDark ? alpha("#000000", 0.55) : alpha("#dddddd", 0.9),
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: 11,
            lineHeight: 1.3,
            width: "fit-content",
            mx: { xs: "auto", md: 0 },
          }}
        >
          <Box
            component="span"
            sx={{
              background: accentGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Impact
          </Box>
        </Box>
      </Box>

      {/* Accent line */}
      <Box
        sx={{
          width: 64,
          height: 3,
       
        }}
      />

      {/* Cards */}
      <Grid container spacing={2.5} justifyContent="center">
        {impactMetrics.map((metric, index) => {
          const Icon = impactIcons[index % impactIcons.length];

          return (
            <Grid item xs={12} sm={6} md={2.4} key={`${metric.label}-${index}`}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 2.5,
                  borderRadius: 0.5,
                  textAlign: "center",
                  bgcolor: isDark ? alpha("#0b1120", 0.9) : "#fff",
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.6 : 0.3
                  )}`,

                  // ✅ on-scroll animation + stagger
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0px)" : "translateY(18px)",
                  transitionProperty:
                    "opacity, transform, border-color, box-shadow",
                  transitionDuration: "700ms, 700ms, 200ms, 200ms",
                  transitionTimingFunction: "ease, ease, ease, ease",
                  transitionDelay: `${160 + index * 90}ms`,

                  // ✅ hover animation (still works)
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: alpha(safeAccent, 0.55),
                    boxShadow: isDark
                      ? `0 10px 35px ${alpha("#000", 0.35)}`
                      : `0 10px 30px ${alpha("#000", 0.12)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    mx: "auto",
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(safeAccent, 0.15),
                    border: `1px solid ${alpha(safeAccent, 0.4)}`,
                  }}
                >
                  <Icon sx={{ color: safeAccent }} />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {metric.value}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.65),
                    lineHeight: 1.6,
                  }}
                >
                  {metric.label}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

CaseStudyImpactBlock.propTypes = {
  impactMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  accentColor: PropTypes.string,
};

CaseStudyImpactBlock.defaultProps = {
  accentColor: "",
};

export default CaseStudyImpactBlock;
