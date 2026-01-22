import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { alpha, Box, Grid, IconButton, Paper, Stack, Typography, useTheme } from "@mui/material";

import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import WifiOffOutlinedIcon from "@mui/icons-material/WifiOffOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const CaseStudyChallengesSection = ({ caseStudy, animate = true, accentColor = "#a855f7" }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const safeAccent = accentColor && accentColor.trim() ? accentColor : "#a855f7";
  const tealAccent = "#22d3ee";
  const scrollRef = useRef(null);

  const cards = useMemo(() => {
    if (caseStudy?.challengeHighlights?.length > 0) return caseStudy.challengeHighlights;
    return [
      {
        title: "Fast Third-Party API Integrations",
        description: "Implemented API caching and async request handling for reliable partner syncs.",
      },
      {
        title: "Adaptive AI Travel Model",
        description: "Feedback loops retrain recommendations so every itinerary stays relevant.",
      },
      {
        title: "Offline Access for Travelers",
        description: "Local data storage with periodic sync keeps maps and bookings available.",
      },
      {
        title: "Security & Reliability",
        description: "Geo-fencing, role-based access, and 99.9% uptime monitoring ensure trust.",
      },
    ];
  }, [caseStudy]);

  const icons = [BoltOutlinedIcon, AutoAwesomeOutlinedIcon, WifiOffOutlinedIcon, ShieldOutlinedIcon];

  const scrollByAmount = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.75));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // ✅ arrow button style helper (exact look like screenshot)
  const arrowBtnSx = (ringColor) => ({
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: `1px solid ${alpha(ringColor, 0.55)}`,
    color: ringColor,
    bgcolor: isDark ? alpha("#0b1120", 0.35) : alpha("#ffffff", 0.75),
    backdropFilter: "blur(10px)",
    boxShadow: `0 0 0 3px ${alpha(ringColor, 0.10)}`,
    transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
    "&:hover": {
      transform: "translateY(-1px)",
      borderColor: alpha(ringColor, 0.85),
      boxShadow: `0 0 0 4px ${alpha(ringColor, 0.16)}`,
      bgcolor: isDark ? alpha("#0b1120", 0.55) : alpha("#ffffff", 0.95),
    },
  });

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Stack spacing={1} alignItems="center" sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
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
            }}
          >
            <Box
              component="span"
              sx={{
                background:
                  'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Development Challenge and Solution
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }} />

        <Typography
          variant="body1"
          sx={{
            color: isDark ? alpha("#fff", 0.74) : "text.secondary",
            lineHeight: 1.9,
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(12px)",
            transition: "all 500ms ease 200ms",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {`Our Client is a travel enthusiast who wants to design and develop a
          solution that consolidates all travel activities and information in
          one place. He also wanted to integrate AI into his application,
          where personalised travel recommendations can be made based on your
          preferences and previous journeys.`}
        </Typography>
      </Stack>

      {/* Slider area */}
      <Box sx={{ position: "relative" }}>
        {/* ✅ TOP BAR (Text left + Arrows right) */}




        {/* Scroll container */}
        <Box
          ref={scrollRef}
          sx={{
            overflowX: "auto",
            scrollBehavior: "smooth",
            pb: 1,
            px: { xs: 1.5, md: 0 },
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.text.primary, isDark ? 0.25 : 0.18),
              borderRadius: 8,
            },
          }}
        >
          <Grid
            container
            spacing={2.5}
            wrap="nowrap"
            sx={{
              minWidth: { xs: 860, md: "100%" },
              pr: 2,
            }}
          >
            {cards.map((card, index) => {
              const Icon = icons[index % icons.length];

              return (
                <Grid item key={`${card.title}-${index}`} xs={12} sm={6} md={3} sx={{ minWidth: 260 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      p: 2.5,
                      borderRadius: 0.5,
                      bgcolor: isDark ? alpha("#0b1120", 0.9) : "#f8fafc",
                      border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.3)}`,
                      minHeight: 190,
                      opacity: animate ? 1 : 0,
                      transform: animate ? "translateY(0)" : "translateY(16px)",
                      transition: `all 450ms ease ${160 + index * 90}ms`,
                      "&:hover": {
                        borderColor: alpha(safeAccent, 0.5),
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    {card.image ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: 120,
                          borderRadius: 1.5,
                          overflow: "hidden",
                          mb: 2,
                          border: `1px solid ${alpha(safeAccent, 0.45)}`,
                          bgcolor: alpha(safeAccent, isDark ? 0.12 : 0.1),
                        }}
                      >
                        <Box
                          component="img"
                          src={card.image}
                          alt={card.title}
                          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                          border: `1px solid ${alpha(safeAccent, 0.45)}`,
                          bgcolor: alpha(safeAccent, isDark ? 0.12 : 0.10),
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: safeAccent }} />
                      </Box>
                    )}

                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {card.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? alpha("#fff", 0.7) : "text.secondary", lineHeight: 1.7 }}
                    >
                      {card.description}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        {/* Divider line like screenshot */}
        <Box sx={{ height: 1, bgcolor: alpha("#ffffff", isDark ? 0.12 : 0.18), mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
            px: { xs: 1, md: 0 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isDark ? alpha("#fff", 0.75) : alpha("#000", 0.65),
              letterSpacing: 0.2,
            }}
          >
            Slide through the journey or let it autoplay—hover to pause and take a closer look.
          </Typography>

          <Stack direction="row" spacing={1.2}>
            <IconButton onClick={() => scrollByAmount(-1)} sx={arrowBtnSx(tealAccent)} aria-label="Scroll left">
              <ChevronLeftRoundedIcon />
            </IconButton>

            <IconButton onClick={() => scrollByAmount(1)} sx={arrowBtnSx(safeAccent)} aria-label="Scroll right">
              <ChevronRightRoundedIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

CaseStudyChallengesSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
  accentColor: PropTypes.string,
};

export default CaseStudyChallengesSection;
