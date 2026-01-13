import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import CaseStudySectionLabel from "./CaseStudySectionLabel.jsx";

const FALLBACK_CARDS = [
  {
    title: "AI-powered personalisation",
    description:
      "Apps machine learning to recommend destinations, create share itineraries in real time, and surface local events based on user profiles, preferences, and travel history.",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Always-on updates",
    description:
      "It integrates real-time event data, weather updates and forecasts, local news, recommended local food and stay options, and notable places to visit.",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Loved by explorers",
    description:
      "Excites users to find local travel enthusiasts and receive advice from experienced travelers. Users can connect, discover, and discuss with like-minded individuals.",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Integrated safety",
    description:
      "Integrated safety features such as emergency contacts, permission-based live tracking, and offline access.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
  },
];

const CaseStudySolutionSection = ({ caseStudy, animate = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = isDark ? "#67e8f9" : theme.palette.primary.main;

  const solutionCards = useMemo(() => {
    const primary =
      caseStudy?.solutionHighlights?.length > 0
        ? caseStudy.solutionHighlights
        : caseStudy?.coreFeatures?.length > 0
          ? caseStudy.coreFeatures
          : [];

    // normalize & ensure image
    const merged = [...primary, ...FALLBACK_CARDS]
      .map((c, idx) => ({
        title: c.title || FALLBACK_CARDS[idx]?.title,
        description: c.description || FALLBACK_CARDS[idx]?.description,
        image: c.image || FALLBACK_CARDS[idx]?.image,
      }))
      .slice(0, 4);

    return merged;
  }, [caseStudy]);

  return (
    <Box my={{ xs: 6, md: 10 }}>
      {/* OUTER CONTAINER */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 0.5,
          border: `1px solid ${alpha(accent, 0.35)}`,
          bgcolor: isDark ? alpha("#0b1120", 0.92) : "#0b1120",
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(18px)",
          transition:
            "border-color 220ms ease, transform 0.25s ease, box-shadow 0.25s ease, opacity 0.52s ease 120ms",
          "&:hover": {
            borderColor: alpha(accent, 0.85),
            boxShadow: "0 18px 38px rgba(0,0,0,0.55)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -2,
            background: `radial-gradient(800px 260px at 50% 0%, ${alpha(
              accent,
              0.18
            )}, transparent 55%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ position: "relative" }}>
          {/* HEADER */}
          <Stack spacing={1.2} textAlign="center" alignItems="center">
            <CaseStudySectionLabel text="Our Solution" animate={animate} />
            <Typography
              variant="body2"
              sx={{
                color: alpha("#ffffff", 0.75),
                lineHeight: 1.8,
                maxWidth: 820,
              }}
            >
              {caseStudy?.journeyHighlight?.description ||
                "VedX Solutions designed and developed an AI-based personalised travelling application that:"}
            </Typography>
          </Stack>

          {/* ✅ YOUR CARD GRID LAYOUT */}
          <Grid
            container
            spacing={{ xs: 2, md: 2.5 }}
            sx={{
              px: { xs: 1, sm: 1.5, md: 0 }, // 👈 left-right equal space
            }}>
            {solutionCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={`${card.title}-${index}`}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 0,
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.6 : 0.3)}`,
                    bgcolor: isDark ? alpha("#0f172a", 0.85) : "#ffffff",
                    opacity: animate ? 1 : 0,
                    transform: animate ? "translateY(0)" : "translateY(16px)",
                    transition: `all 480ms ease ${160 + index * 80}ms`,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* Content */}
                  <Box sx={{ p: 2.5, flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? alpha("#ffffff", 0.78) : "text.secondary",
                        lineHeight: 1.7,
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>

                  {/* Bottom Image */}
                  <Box
                    component="img"
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};

CaseStudySolutionSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudySolutionSection;
