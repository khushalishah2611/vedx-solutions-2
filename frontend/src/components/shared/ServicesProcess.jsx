import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const toAbsMaybe = (url) => {
  const u = safeStr(url);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("data:")) return u; // base64 image support
  return apiUrl(u.startsWith("/") ? u : `/${u}`);
};

const ServicesProcess = ({
  apiPath = "/api/service-processes",
  title = "Process",
  subtitle = "Slide through the journey or let it autoplay—hover to pause and take a closer look.",
  description = "We choreograph every step with cinematic animations—auto-playing slides, hover pauses, and directional controls—so you can explore our delivery rhythm without missing a beat.",
  autoplayMs = 500, // ✅ milliseconds
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { fetchWithLoading } = useLoadingFetch();

  const [apiSteps, setApiSteps] = useState([]);
  const [error, setError] = useState("");

  // ✅ your requested icon colors
  const leftColor = isDark ? "#67e8f9" : theme.palette.primary.main; // cyan / theme primary
  const rightColor = "#a855f7"; // purple

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.3 : 0.6);

  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const stepsPerView = useMemo(() => {
    if (isLgUp) return 3;
    if (isMdUp) return 2;
    return 1;
  }, [isLgUp, isMdUp]);

  // ✅ Page-based carousel
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("right");

  // ✅ optional: pause for a moment after manual click
  const [manualPauseUntil, setManualPauseUntil] = useState(0);

  const resolvedSteps = useMemo(() => apiSteps ?? [], [apiSteps]);
  const total = resolvedSteps.length;

  const totalPages = useMemo(() => {
    if (!total) return 0;
    return Math.ceil(total / stepsPerView);
  }, [total, stepsPerView]);

  const showNavigation = totalPages > 1;

  // keep page in range when responsive changes
  useEffect(() => {
    if (!totalPages) {
      setPage(0);
      return;
    }
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  const startIndex = useMemo(() => page * stepsPerView, [page, stepsPerView]);

  const visibleSteps = useMemo(() => {
    if (!total) return [];
    return resolvedSteps.slice(startIndex, startIndex + stepsPerView);
  }, [resolvedSteps, startIndex, stepsPerView, total]);

  const handlePrev = useCallback(() => {
    if (!showNavigation) return;
    setAnimationDirection("left");
    setPage((p) => (p - 1 < 0 ? totalPages - 1 : p - 1));
    setManualPauseUntil(Date.now() + 1200);
  }, [showNavigation, totalPages]);

  const handleNext = useCallback(() => {
    if (!showNavigation) return;
    setAnimationDirection("right");
    setPage((p) => (p + 1 >= totalPages ? 0 : p + 1));
    setManualPauseUntil(Date.now() + 1200);
  }, [showNavigation, totalPages]);

  const pulseBorder = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(103, 232, 249, 0.35); }
    70% { box-shadow: 0 0 0 12px rgba(103, 232, 249, 0); }
    100% { box-shadow: 0 0 0 0 rgba(103, 232, 249, 0); }
  `;

  /* ✅ Better autoplay (setTimeout) */
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const ms = Number(autoplayMs);
    const autoplayEnabled = Number.isFinite(ms) && ms > 0;

    if (!autoplayEnabled) return;
    if (!showNavigation) return;
    if (isPaused) return;

    const now = Date.now();
    if (manualPauseUntil > now) {
      timerRef.current = setTimeout(() => {
        setManualPauseUntil(0);
      }, manualPauseUntil - now);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    timerRef.current = setTimeout(() => {
      setAnimationDirection("right");
      setPage((p) => (p + 1 >= totalPages ? 0 : p + 1));
    }, ms);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoplayMs, showNavigation, isPaused, totalPages, manualPauseUntil]);

  // ✅ Load from API
  useEffect(() => {
    let isMounted = true;

    const loadSteps = async () => {
      try {
        setError("");

        const response = await fetchWithLoading(apiUrl(apiPath));
        if (!response?.ok) throw new Error("Failed to fetch service processes");

        const data = await response.json();
        if (!isMounted) return;

        const list = Array.isArray(data) ? data : data?.data || data?.processes || [];

        const mapped = (Array.isArray(list) ? list : [])
          .filter((item) => item?.isActive ?? true)
          .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
          .map((item) => {
            const img = resolveImg(item?.image);
            return {
              title: safeStr(item?.title) || "Step",
              description: safeStr(item?.description),
              image: img ? toAbsMaybe(img) : "",
            };
          })
          .filter((x) => x.title);

        setApiSteps(mapped);
        setPage(0);
      } catch (e) {
        console.error("Failed to load process steps", e);
        if (!isMounted) return;
        setApiSteps([]);
        setError("Process steps not available right now.");
        setPage(0);
      }
    };

    loadSteps();

    return () => {
      isMounted = false;
    };
  }, [apiPath, fetchWithLoading]);

  // ✅ base nav button style (positioning/shape)
  const navBtnBaseSx = useMemo(
    () => ({
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 5,
      width: { xs: 42, md: 48 },
      height: { xs: 42, md: 48 },
      borderRadius: "50%",
      backdropFilter: "blur(10px)",
      boxShadow: `0 10px 26px ${alpha("#000", 0.35)}`,
      transition: "all 0.3s ease",
    }),
    []
  );

  return (
    <Box
      component="section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      sx={{ py: { xs: 4, md: 6 } }}
    >
      {/* Section Header */}
      <Stack spacing={2.2} sx={{ mb: 3, textAlign: "center", alignItems: "center" }}>
        <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
          {title}
        </Typography>

        {!!subtitle && (
          <Typography variant="body1" sx={{ color: subtleText, maxWidth: 980 }}>
            {subtitle}
          </Typography>
        )}

        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 980 }}>
          {description}
        </Typography>

        {!!error && (
          <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
            {error}
          </Typography>
        )}
      </Stack>

      {/* Empty */}
      {total === 0 ? (
        <Stack alignItems="center" sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ color: subtleText }}>
            No process steps found.
          </Typography>
        </Stack>
      ) : (
        <Stack sx={{ position: "relative" }}>
          {/* ✅ LEFT/RIGHT arrows (your requested icon color styles) */}
          {showNavigation && (
            <>
              <IconButton
                aria-label="Previous steps"
                onClick={handlePrev}
                sx={{
                  ...navBtnBaseSx,
                  left: { xs: 6, md: -18 },
                  border: `1px solid ${alpha(leftColor, 0.4)}`,
                  background: alpha(leftColor, isDark ? 0.12 : 0.18),
                  color: leftColor,
                  "&:hover": {
                    background: alpha(leftColor, isDark ? 0.2 : 0.28),
                    transform: "translateY(-50%) translateX(-2px) scale(1.06)",
                  },
                  "&:active": {
                    transform: "translateY(-50%) scale(0.98)",
                  },
                }}
              >
                <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 28 }} />
              </IconButton>

              <IconButton
                aria-label="Next steps"
                onClick={handleNext}
                sx={{
                  ...navBtnBaseSx,
                  right: { xs: 6, md: -18 },
                  border: `1px solid ${alpha(rightColor, 0.45)}`,
                  background: alpha(rightColor, isDark ? 0.14 : 0.2),
                  color: rightColor,
                  "&:hover": {
                    background: alpha(rightColor, isDark ? 0.22 : 0.3),
                    transform: "translateY(-50%) translateX(2px) scale(1.06)",
                  },
                  "&:active": {
                    transform: "translateY(-50%) scale(0.98)",
                  },
                }}
              >
                <KeyboardArrowRightRoundedIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </>
          )}

          <Grid container spacing={2}>
            {visibleSteps.map((step, index) => (
              <Grid item xs={12} md={6} lg={4} key={`${step.title}-${startIndex + index}`}>
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
                      borderColor: alpha(leftColor, isDark ? 0.9 : 0.8),
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: 300,
                      background: step.image ? `url(${step.image}) center/cover no-repeat` : "none",
                      bgcolor: step.image ? "transparent" : alpha(leftColor, 0.12),
                      isolation: "isolate",
                      "&::after": {
                        content: "''",
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(${
                          animationDirection === "right" ? "90deg" : "-90deg"
                        }, ${alpha(leftColor, 0.28)}, transparent 55%)`,
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
                      {startIndex + index + 1}
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
        </Stack>
      )}
    </Box>
  );
};

export default ServicesProcess;
