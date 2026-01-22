import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

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

const CaseStudyImpactBlock = ({ impactMetrics }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const safeAccent = "#38bdf8";

  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  const accentGradient = useMemo(
    () => `linear-gradient(90deg, ${safeAccent}, #2196f3)`,
    []
  );

  return (
    <Stack ref={rootRef} spacing={3} alignItems="center">
      {/* Badge */}
      <Box
        sx={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "all 700ms ease",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 0.5,
            border: `1px solid ${alpha("#fff", 0.12)}`,
            background: isDark
              ? alpha("#000", 0.55)
              : alpha("#ddd", 0.9),
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
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

      {/* Cards wrapper → fixes left/right spacing */}
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
        <Grid container spacing={2.5} justifyContent="center">
          {impactMetrics.map((metric, index) => {
            const Icon = impactIcons[index % impactIcons.length];
            const title = metric.title || metric.value || "";
            const caption = metric.label || "";

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2.4} // 👈 visual equivalent, layout fixed by maxWidth
                key={`${metric.label || metric.title || "impact"}-${index}`}
                sx={{
                  display: "flex",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2.5,
                    borderRadius: 0.5,
                    textAlign: "center",
                    bgcolor: isDark ? alpha("#0b1120", 0.9) : "#fff",
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.6 : 0.3
                    )}`,

                    opacity: inView ? 1 : 0,
                    transform: inView ? "none" : "translateY(18px)",
                    transition: "all 700ms ease",
                    transitionDelay: `${160 + index * 90}ms`,

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
                      mx: "auto",
                      mb: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1.5,


                      overflow: "hidden",
                    }}
                  >
                    {metric.image ? (
                      <Box
                        component="img"
                        src={metric.image}
                        alt={title || `Impact ${index + 1}`}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Icon sx={{ color: safeAccent }} />
                    )}
                  </Box>
                  {title ? (
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: 'inherit',
                        transition: 'color 0.3s ease, background-image 0.3s ease',
                        '&:hover': {
                          color: 'transparent',
                          backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        },
                      }}
                    >
                      {title}
                    </Typography>
                  ) : null}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Stack>
  );
};

CaseStudyImpactBlock.propTypes = {
  impactMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      image: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
};

export default CaseStudyImpactBlock;
