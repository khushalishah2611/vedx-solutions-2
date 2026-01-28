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
import { apiUrl } from "../../utils/const.js";
import { useLoadingFetch } from "../../hooks/useLoadingFetch.js";

const ServicesProcess = ({ apiPath = "/api/service-processes", category, subcategory }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { fetchWithLoading } = useLoadingFetch();
  const [apiSteps, setApiSteps] = useState([]);

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
  const resolvedSteps = apiSteps;
  const total = Array.isArray(resolvedSteps) ? resolvedSteps.length : 0;
  const maxIndex = Math.max(0, total - stepsPerView);


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

  const visibleSteps = (resolvedSteps ?? []).slice(
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

  useEffect(() => {
    let isMounted = true;

    const loadSteps = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (subcategory) params.append("subcategory", subcategory);
        const requestPath = params.toString()
          ? `${apiPath}?${params.toString()}`
          : apiPath;
        const response = await fetchWithLoading(apiUrl(requestPath));
        if (!response.ok) {
          throw new Error("Failed to fetch service processes");
        }
        const data = await response.json();
        if (!isMounted) return;
        const mapped = (data ?? [])
          .filter((item) => item?.isActive ?? true)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((item) => ({
            title: item.title,
            description: item.description || "",
            image: item.image,
          }));
        setApiSteps(mapped);
      } catch (error) {
        console.error("Failed to load process steps", error);
      }
    };

    loadSteps();

    return () => {
      isMounted = false;
    };
  }, [apiPath, category, subcategory, fetchWithLoading]);

  return (
    <Box
      component="section"
    >
      {/* Section Header */}
      <Stack spacing={3} sx={{ mb: 3, textAlign: "center", alignItems: "center" }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          Process
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, }}>
          We choreograph every step with cinematic animations—auto-playing slides, hover pauses, and directional controls—so you
          can explore our delivery rhythm without missing a beat.
        </Typography>
      </Stack>

      {/* Process Steps */}
      <Stack sx={{ position: "relative" }}>
        <Grid container spacing={2} >
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
                    isDark ? 0.78 : 0.97
                  ),
                    border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.6
                )}`,
                  transition:
                    "transform 0.5s ease, box-shadow 0.5s ease, border-color 0.45s ease",
               
                  "&:hover": {
                    transform: "translateY(-10px) scale(1.02)",
                       borderColor: alpha(accentColor, isDark ? 0.9 : 0.8),
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
