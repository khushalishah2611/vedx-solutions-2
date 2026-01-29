// ServicesProcess.jsx ✅ (SINGLE FILE) - API only (no category/subcategory, no static/fallback steps)
// Usage: <ServicesProcess apiPath="/api/hire-developer/processes" />

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { keyframes } from "@mui/system";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import { apiUrl } from "../../utils/const.js";
import { useLoadingFetch } from "../../hooks/useLoadingFetch.js";

/* ---------------- helpers ---------------- */
const safeStr = (v) => String(v ?? "").trim();

const resolveImg = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val.trim();

  if (typeof val === "object") {
    const direct =
      val.url ||
      val.src ||
      val.path ||
      val.href ||
      val.image ||
      val.icon ||
      val.logo ||
      val.file ||
      val.location;
    if (typeof direct === "string") return direct.trim();
  }
  return "";
};

const ServicesProcess = ({
  apiPath = "/api/service-processes",
  title = "Process",
  subtitle = "Slide through the journey or let it autoplay—hover to pause and take a closer look.",
  description = "We choreograph every step with cinematic animations—auto-playing slides, hover pauses, and directional controls—so you can explore our delivery rhythm without missing a beat.",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { fetchWithLoading, loading } = useLoadingFetch();

  const [apiSteps, setApiSteps] = useState([]);
  const [error, setError] = useState("");

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

  const resolvedSteps = useMemo(() => apiSteps ?? [], [apiSteps]);
  const total = resolvedSteps.length;
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
    setCurrentIndex((prev) => (prev + stepsPerView > maxIndex ? 0 : prev + stepsPerView));
  }, [maxIndex, stepsPerView]);

  const visibleSteps = useMemo(
    () => resolvedSteps.slice(currentIndex, currentIndex + stepsPerView),
    [resolvedSteps, currentIndex, stepsPerView]
  );

  const showNavigation = total > stepsPerView;

  // 🌀 Auto-scroll with pause support
  useEffect(() => {
    if (!showNavigation || isPaused) return undefined;

    const autoScroll = setInterval(() => {
      handleNext();
    }, 6500);

    return () => clearInterval(autoScroll);
  }, [handleNext, isPaused, showNavigation]);

  // ✅ Load from API (NO category/subcategory, NO static fallback)
  useEffect(() => {
    let isMounted = true;

    const loadSteps = async () => {
      try {
        setError("");

        const response = await fetchWithLoading(apiUrl(apiPath));
        if (!response?.ok) throw new Error("Failed to fetch service processes");

        const data = await response.json();
        if (!isMounted) return;

        // Accept either array OR { data: [...] } OR { processes: [...] }
        const list = Array.isArray(data) ? data : data?.data || data?.processes || [];

        const mapped = (Array.isArray(list) ? list : [])
          .filter((item) => item?.isActive ?? true)
          .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
          .map((item) => ({
            title: safeStr(item?.title) || "Step",
            description: safeStr(item?.description),
            image: resolveImg(item?.image),
          }))
          .filter((x) => x.title);

        setApiSteps(mapped);
      } catch (e) {
        console.error("Failed to load process steps", e);
        if (!isMounted) return;
        setApiSteps([]);
        setError("Process steps not available right now.");
      }
    };

    loadSteps();

    return () => {
      isMounted = false;
    };
  }, [apiPath, fetchWithLoading]);

  return (
    <Box
      component="section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      sx={{ py: { xs: 4, md: 6 } }}
    >
      {/* Section Header */}
      <Stack spacing={3} sx={{ mb: 3, textAlign: "center", alignItems: "center" }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          {title}
        </Typography>

        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 980 }}>
          {description}
        </Typography>
      </Stack>

      {/* Loading / Empty */}
      {total === 0 ? (
        <Stack alignItems="center" sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ color: subtleText }}>
            No process steps found.
          </Typography>
        </Stack>
      ) : (
        <Stack sx={{ position: "relative" }}>
          <Grid container spacing={2}>
            {visibleSteps.map((step, index) => (
              <Grid item xs={12} md={6} lg={4} key={`${step.title}-${index}`}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 0.5,
                    overflow: "hidden",
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.78 : 0.97),
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                    transition: "transform 0.5s ease, box-shadow 0.5s ease, border-color 0.45s ease",
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
                      background: step.image ? `url(${step.image}) center/cover no-repeat` : "none",
                      bgcolor: step.image ? "transparent" : alpha(accentColor, 0.12),
                      isolation: "isolate",
                      "&::after": {
                        content: "''",
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(${
                          animationDirection === "right" ? "90deg" : "-90deg"
                        }, ${alpha(accentColor, 0.28)}, transparent 55%)`,
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
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              sx={{ px: { xs: 1, md: 2 }, pt: 1 }}
            >
              <Typography variant="body2" sx={{ color: subtleText }}>
                {subtitle}
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
      )}
    </Box>
  );
};

export default ServicesProcess;
