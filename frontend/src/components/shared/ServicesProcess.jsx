import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
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
import { keyframes } from "@mui/system";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { processSteps } from "../../data/servicesPage.js";

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
  const [isPaused, setIsPaused] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("right");
  const total = Array.isArray(processSteps) ? processSteps.length : 0;
  const maxIndex = Math.max(0, total - stepsPerView);

  const slideIn = useMemo(
    () =>
      keyframes`
        from { opacity: 0; transform: translateX(${animationDirection === "right" ? "24px" : "-24px"}); }
        to { opacity: 1; transform: translateX(0); }
      `,
    [animationDirection]
  );

  const animationBadges = useMemo(
    () => [
      { label: "Autoplay slider", color: accentColor, delay: "0ms" },
      { label: "Pause on hover", color: "#67e8f9", delay: "120ms" },
      { label: "Left & right controls", color: "#a855f7", delay: "240ms" },
      { label: "Cinematic transitions", color: "#22d3ee", delay: "360ms" },
    ],
    [accentColor]
  );

  const shimmer = keyframes`
    0% { transform: translateX(-40%); opacity: 0.55; }
    50% { transform: translateX(0%); opacity: 0.9; }
    100% { transform: translateX(40%); opacity: 0.55; }
  `;

  const floatY = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  `;

  const pulseBorder = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(103, 232, 249, 0.35); }
    70% { box-shadow: 0 0 0 12px rgba(103, 232, 249, 0); }
    100% { box-shadow: 0 0 0 0 rgba(103, 232, 249, 0); }
  `;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex, stepsPerView]);

  const handlePrev = useCallback(() => {
    setAnimationDirection("left");
    setCurrentIndex((prev) => Math.max(prev - stepsPerView, 0));
  }, [stepsPerView]);

  const handleNext = useCallback(() => {
    setAnimationDirection("right");
    setCurrentIndex((prev) =>
      prev + stepsPerView > maxIndex ? 0 : prev + stepsPerView
    );
  }, [maxIndex, stepsPerView]);

  const visibleSteps = (processSteps ?? []).slice(
    currentIndex,
    currentIndex + stepsPerView
  );

  const showNavigation = total > stepsPerView;

  // 🌀 Auto-scroll effect with pause support
  useEffect(() => {
    if (!showNavigation || isPaused) return undefined;

    const autoScroll = setInterval(() => {
      handleNext();
    }, 6500);

    return () => clearInterval(autoScroll);
  }, [handleNext, isPaused, showNavigation]);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: 0, md: 1.5 },
        background: `radial-gradient(circle at 10% 20%, ${alpha(
          accentColor,
          0.08
        )}, transparent 35%), radial-gradient(circle at 90% 10%, ${alpha(
          "#a855f7",
          0.08
        )}, transparent 32%)`,
        p: { xs: 1, md: 2 },
        "&::before": {
          content: "''",
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTc1dThybXBpdm41eGdzOGJtNHd3eWQ4OTZlcmZ5MWpyNTY5cTNyaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qgQUggAC3Pfv687qPC/giphy.gif')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          opacity: isDark ? 0.07 : 0.05,
          filter: "saturate(0.7)",
          pointerEvents: "none",
        },
        "&::after": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          width: "120%",
          height: "100%",
          background: `linear-gradient(120deg, transparent, ${alpha(
            accentColor,
            0.08
          )}, transparent)`,
          animation: `${shimmer} 11s ease-in-out infinite`,
          pointerEvents: "none",
        },
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <Stack spacing={3} sx={{ mb: 3, textAlign: "center", alignItems: "center" }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Process
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 780 }}>
          We choreograph every step with cinematic animations—auto-playing slides, hover pauses, and directional controls—so you
          can explore our delivery rhythm without missing a beat.
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
        >
          {animationBadges.map((badge) => (
            <Chip
              key={badge.label}
              label={badge.label}
              sx={{
                color: badge.color,
                backgroundColor: alpha(badge.color, isDark ? 0.16 : 0.1),
                border: `1px solid ${alpha(badge.color, 0.35)}`,
                fontWeight: 700,
                letterSpacing: 0.2,
                textTransform: "uppercase",
                animation: `${floatY} 6s ease-in-out infinite`,
                animationDelay: badge.delay,
              }}
            />
          ))}
        </Stack>
      </Stack>

      {/* Process Steps */}
      <Stack spacing={3} sx={{ position: "relative" }}>
        <Grid container spacing={2} sx={{ overflow: "hidden" }}>
          {visibleSteps.map((step, index) => (
            <Grid item xs={12} md={6} lg={4} key={step.title}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 1,
                  overflow: "hidden",
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    isDark ? 0.78 : 0.97
                  ),
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.4 : 0.6
                  )}`,
                  transition:
                    "transform 0.5s ease, box-shadow 0.5s ease, border-color 0.45s ease",
                  animation: `${slideIn} 0.65s ease, ${floatY} 8s ease-in-out infinite`,
                  animationDelay: `${index * 120}ms`,
                  boxShadow: isDark
                    ? "0 10px 50px rgba(2,6,23,0.35)"
                    : "0 20px 60px rgba(15,23,42,0.12)",
                  "&:hover": {
                    transform: "translateY(-10px) scale(1.02)",
                    borderColor: alpha(accentColor, 0.5),
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 300,
                    background: `url(${step.image}) center/cover no-repeat`,
                    isolation: "isolate",
                    "&::after": {
                      content: "''",
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(${animationDirection === "right" ? "90deg" : "-90deg"}, ${alpha(
                        accentColor,
                        0.28
                      )}, transparent 55%)`,
                      mixBlendMode: "screen",
                      pointerEvents: "none",
                    },
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
                      animation: `${pulseBorder} 4s ease-in-out infinite`,
                    }}
                  >
                    {currentIndex + index + 1}
                  </Box>
                </Box>

                <Stack spacing={1.5} sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "color 0.3s ease, background-image 0.3s ease",
                      "&:hover": {
                        color: "transparent",
                        backgroundImage: "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      },
                    }}
                  >
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

        {showNavigation && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              px: { xs: 1, md: 2 },
              pt: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: subtleText }}>
              Slide through the journey or let it autoplay—hover to pause and take a closer look.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                aria-label="Previous step"
                onClick={handlePrev}
                sx={{
                  border: `1px solid ${alpha(accentColor, 0.4)}`,
                  background: alpha(accentColor, isDark ? 0.12 : 0.18),
                  color: accentColor,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: alpha(accentColor, isDark ? 0.2 : 0.28),
                    transform: "translateX(-2px) scale(1.02)",
                  },
                }}
              >
                <KeyboardArrowLeftRoundedIcon />
              </IconButton>
              <IconButton
                aria-label="Next step"
                onClick={handleNext}
                sx={{
                  border: `1px solid ${alpha("#a855f7", 0.45)}`,
                  background: alpha("#a855f7", isDark ? 0.14 : 0.2),
                  color: "#a855f7",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: alpha("#a855f7", isDark ? 0.22 : 0.3),
                    transform: "translateX(2px) scale(1.02)",
                  },
                }}
              >
                <KeyboardArrowRightRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ServicesProcess;
