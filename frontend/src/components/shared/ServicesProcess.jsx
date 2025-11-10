import {
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Divider,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { processSteps } from "../../data/servicesPage.js";
import { useEffect, useMemo, useState } from "react";

const ServicesProcess = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.3 : 0.6);

  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const stepsPerView = useMemo(() => {
    if (isLgUp) return 3;
    if (isMdUp) return 2;
    return 1;
  }, [isLgUp, isMdUp]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = Array.isArray(processSteps) ? processSteps.length : 0;
  const maxIndex = Math.max(0, total - stepsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex, stepsPerView]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - stepsPerView, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + stepsPerView, maxIndex));
  };

  const visibleSteps = (processSteps ?? []).slice(
    currentIndex,
    currentIndex + stepsPerView
  );
  const showNavigation = total > stepsPerView;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        px: { xs: 1, md: 0 },
        py: { xs: 4, md: 6 },
      }}
    >
      {/* Section Header */}
      <Stack spacing={3} sx={{ mb: 4, textAlign: "center", alignItems: "center" }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Process
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
          We follow a transparent roadmap—from discovery to deployment—so you always know what is happening next.
        </Typography>
      </Stack>

      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          {/* Left Arrow */}
          <IconButton
            aria-label="Previous process"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            sx={{
              position: "absolute",
              top: "60%",
              left: { xs: 4, md: -48 },
              transform: "translateY(-60%)",
              zIndex: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.6)}`,
              boxShadow: isDark
                ? "0 4px 10px rgba(255,255,255,0.05)"
                : "0 4px 10px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.background.paper, 0.98),
                transform: "translateY(-50%) scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowLeftRoundedIcon />
          </IconButton>

          {/* Right Arrow */}
          <IconButton
            aria-label="Next process"
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            sx={{
              position: "absolute",
              top: "60%",
              right: { xs: 4, md: -48 },
              transform: "translateY(-60%)",
              zIndex: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.6)}`,
              boxShadow: isDark
                ? "0 4px 10px rgba(255,255,255,0.05)"
                : "0 4px 10px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.background.paper, 0.98),
                transform: "translateY(-50%) scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowRightRoundedIcon />
          </IconButton>
        </>
      )}

      {/* Process Steps */}
      <Grid container spacing={4} sx={{ overflow: "hidden" }}>
        {visibleSteps.map((step, index) => (
          <Grid item xs={12} md={6} lg={4} key={step.title}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 0.5,
                overflow: "hidden",
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.75 : 0.97
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                transition:
                  "transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease",
                boxShadow: isDark
                  ? "0 4px 30px rgba(2,6,23,0.35)"
                  : "0 4px 30px rgba(15,23,42,0.15)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: isDark
                    ? "0 12px 40px rgba(255,255,255,0.12)"
                    : "0 12px 40px rgba(0,0,0,0.12)",
                  borderColor: alpha(accentColor, 0.5),
                },
              }}
            >
              {/* Step Image */}
              <Box
                sx={{
                  position: "relative",
                  height: 300,
                  background: `url(${step.image}) center/cover no-repeat`,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    px: 2,
                    py: 0.5,
                    borderRadius: 999,
                    background: alpha(theme.palette.common.black, 0.6),
                    color: theme.palette.common.white,
                    fontWeight: 600,
                  }}
                >
                  {currentIndex + index + 1}
                </Box>
              </Box>

              {/* Step Text */}
              <Stack spacing={1.5} sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {step.title}
                </Typography>

                <Divider sx={{ borderColor: dividerColor }} />

                <Typography variant="body2" sx={{ color: subtleText }}>
                  {step.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesProcess;
