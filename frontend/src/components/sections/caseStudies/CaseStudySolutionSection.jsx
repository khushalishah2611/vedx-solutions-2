import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { alpha, Box, Grid, Paper, Stack, Typography, useTheme } from "@mui/material";

const FALLBACK_CARDS = [
  {
    description:
      "Applies machine learning to recommend destinations, create and share itineraries in real time, and surface local events based on user profiles, preferences, and travel history.",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    description:
      "It integrates real-time event data, weather updates and forecasts, local news, recommended local food options, and notable places to visit.",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    description:
      "Enables users to find fellow travel enthusiasts and receive advice from experienced travelers. Users can connect, discover, and discuss with like-minded individuals.",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    description:
      "Integrated safety features such as emergency contacts, permission-based live tracking, and offline access.",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
  },
];

function ConnectorSvg({ accent }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: { xs: "none", md: "block" },
        opacity: 0.85,
      }}
    >
      <Box component="svg" viewBox="0 0 1200 360" preserveAspectRatio="none" sx={{ width: "100%", height: "100%" }}>
        <path
          d="M180,220 C260,140 320,140 400,220"
          fill="none"
          stroke={alpha(accent, 0.35)}
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
        <path
          d="M500,220 C580,140 640,140 720,220"
          fill="none"
          stroke={alpha(accent, 0.35)}
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
        <path
          d="M820,220 C900,140 960,140 1040,220"
          fill="none"
          stroke={alpha(accent, 0.35)}
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
      </Box>
    </Box>
  );
}

const CaseStudySolutionSection = ({ caseStudy, animate = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const accent = "#a855f7";
  const accent2 = "#ec4899";
  const accent3 = "#22d3ee";
  const accentColor = "#a855f7";

  const solutionCards = useMemo(() => {
    const primary =
      caseStudy?.solutionHighlights?.length > 0
        ? caseStudy.solutionHighlights
        : caseStudy?.coreFeatures?.length > 0
          ? caseStudy.coreFeatures
          : [];

    const merged = [...primary, ...FALLBACK_CARDS]
      .map((c, idx) => ({
        title: c.title || `Card ${idx + 1}`,
        description: c.description || FALLBACK_CARDS[idx]?.description,
        image: c.image || FALLBACK_CARDS[idx]?.image,
      }))
      .slice(0, 4);

    return merged;
  }, [caseStudy]);

  /* ✅ theme colors only */
  const outerBg = isDark ? "#0b1020" : "#f8fafc";
  const outerBorder = isDark ? alpha("#ffffff", 0.08) : alpha("#0b1220", 0.08);

  const bodyText = isDark ? alpha("#ffffff", 0.72) : alpha("#0b1220", 0.72);
  const cardText = isDark ? alpha("#ffffff", 0.78) : alpha("#0b1220", 0.78);

  const cardBg = isDark ? alpha("#0f172a", 0.6) : alpha("#ffffff", 0.9);
  const cardBorder = isDark ? alpha("#ffffff", 0.10) : alpha("#0b1220", 0.10);

  const imgBorder = isDark ? alpha("#ffffff", 0.10) : alpha("#0b1220", 0.10);
  const imgBg = isDark ? alpha("#000", 0.25) : alpha("#0b1220", 0.04);
  const imgShadow = isDark ? "0 10px 24px rgba(0,0,0,0.35)" : "0 10px 24px rgba(2,6,23,0.10)";

  return (
    <Box sx={{ my: { xs: 6, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 0.5,
          bgcolor: outerBg,
          px: { xs: 2, sm: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          border: `1px solid ${outerBorder}`,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 520ms ease, transform 520ms ease",
        }}
      >
        <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ position: "relative" }}>
          {/* HEADER */}
          <Stack spacing={1.2} textAlign="center" alignItems="center">
            <Box sx={{ mx: "auto", display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderRadius: 0.5,
                  border: `1px solid ${alpha('#ffffff', 0.1)}`,
                  background: isDark
                    ? alpha('#000000', 0.55)
                    : alpha('#dddddd', 0.9),
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontSize: 11,
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
                  Our Solution
                </Box>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: bodyText,
                lineHeight: 1.8,
                maxWidth: 860,
                px: { xs: 0.5, sm: 0 },
              }}
            >
              {caseStudy?.journeyHighlight?.description ||
                "VedX Solutions designed and developed an AI-based personalised travelling application that:"}
            </Typography>
          </Stack>

          <ConnectorSvg accent={accent3} />

          {/* CARD GRID */}
          <Box sx={{ px: "10px" }}>
            <Grid container spacing={2}>
              {solutionCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={`${card.title}-${index}`}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                      overflow: "hidden",
                      bgcolor: cardBg,
                      border: `1px solid ${cardBorder}`,
                      opacity: animate ? 1 : 0,
                      transform: animate ? "translateY(0)" : "translateY(14px)",
                      transition:
                        "transform 220ms ease, border-color 220ms ease, opacity 520ms ease",
                      transitionDelay: `${140 + index * 90}ms`,
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: alpha(accent3, 0.35),
                      },
                    }}
                  >
                    <Box sx={{ p: 2.25 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: cardText,
                          lineHeight: 1.7,
                          fontSize: 13.5,
                        }}
                      >
                        {card.description}
                      </Typography>
                    </Box>

                    <Box sx={{ px: 2.25, pb: 2.25, pt: 0.25 }}>
                      <Box
                        sx={{
                          borderRadius: 1,
                          overflow: "hidden",
                          border: `1px solid ${imgBorder}`,
                          background: imgBg,
                          boxShadow: imgShadow,
                        }}
                      >
                        <Box
                          component="img"
                          src={card.image}
                          alt={card.title}
                          loading="lazy"
                          sx={{
                            width: "100%",
                            height: { xs: 190, sm: 190, md: 170 },
                            objectFit: "cover",
                            display: "block",
                            filter: "saturate(1.05) contrast(1.02)",
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Corner decoration */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              right: 14,
              bottom: 14,
              width: 46,
              height: 46,
              opacity: isDark ? 0.35 : 0.22,
              display: { xs: "none", sm: "block" },
              background: `linear-gradient(135deg, ${alpha(accent, 0.0)} 0%, ${alpha(accent2, 0.35)} 100%)`,
              clipPath: "polygon(55% 20%, 100% 50%, 55% 80%, 65% 50%)",
              filter: "blur(0.1px)",
            }}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

CaseStudySolutionSection.propTypes = {
  caseStudy: PropTypes.object,
  animate: PropTypes.bool,
};

export default CaseStudySolutionSection;
