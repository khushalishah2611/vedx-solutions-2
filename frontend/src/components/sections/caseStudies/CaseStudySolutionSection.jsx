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
  // Dotted curved connectors (only for md+)
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
      <Box
        component="svg"
        viewBox="0 0 1200 360"
        preserveAspectRatio="none"
        sx={{ width: "100%", height: "100%" }}
      >
        {/* Curves between card 1->2, 2->3, 3->4 */}
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

  // Accent used for glow/border
  const accent = "#a855f7"; // purple
  const accent2 = "#ec4899"; // pink
  const accent3 = "#22d3ee"; // cyan
  const accentColor = '#a855f7';
  const solutionCards = useMemo(() => {
    const primary =
      caseStudy?.solutionHighlights?.length > 0
        ? caseStudy.solutionHighlights
        : caseStudy?.coreFeatures?.length > 0
          ? caseStudy.coreFeatures
          : [];

    // normalize & ensure 4
    const merged = [...primary, ...FALLBACK_CARDS]
      .map((c, idx) => ({
        title: c.title || `Card ${idx + 1}`,
        description: c.description || FALLBACK_CARDS[idx]?.description,
        image: c.image || FALLBACK_CARDS[idx]?.image,
      }))
      .slice(0, 4);

    return merged;
  }, [caseStudy]);

  return (
    <Box sx={{ my: { xs: 6, md: 10 } }}>
      {/* OUTER CONTAINER */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 0.5,
          bgcolor: "#0b1020",
          px: { xs: 2, sm: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          border: `1px solid ${alpha("#ffffff", 0.08)}`,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 520ms ease, transform 520ms ease",
        }}
      >
        <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ position: "relative" }}>
          {/* HEADER */}
          <Stack spacing={1.2} textAlign="center" alignItems="center">
            {/* Small badge */}
            <Box sx={{ mx: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderRadius: 0.5,
                  border: `1px solid ${alpha('#ffffff', 0.1)}`,
                  background: !isDark ? alpha('#ddddddff', 0.9) : alpha('#0000007c', 0.9),
                  color: alpha(accentColor, 0.9),
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontSize: 11,
                  lineHeight: 1.3,
                  width: 'fit-content',
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Our Solution
                </Box>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: alpha("#ffffff", 0.72),
                lineHeight: 1.8,
                maxWidth: 860,
                px: { xs: 0.5, sm: 0 },
              }}
            >
              {caseStudy?.journeyHighlight?.description ||
                "VedX Solutions designed and developed an AI-based personalised travelling application that:"}
            </Typography>
          </Stack>

          {/* Dotted connectors (desktop only) */}
          <ConnectorSvg accent={accent3} />

          {/* CARD GRID */}
          <Box sx={{ px: "10px" }}>
            <Grid
              container
              spacing={2}
            >
              {solutionCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={`${card.title}-${index}`}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 1,
                      overflow: "hidden",
                      bgcolor: alpha("#0f172a", 0.6),
                      border: `1px solid ${alpha("#ffffff", 0.10)}`,
                      transition: "transform 220ms ease, border-color 220ms ease",
                      opacity: animate ? 1 : 0,
                      transform: animate ? "translateY(0)" : "translateY(14px)",
                      transitionDelay: `${140 + index * 90}ms`,
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: alpha(accent3, 0.35),
                      },
                    }}
                  >
                    {/* Top text */}
                    <Box sx={{ p: 2.25 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha("#ffffff", 0.78),
                          lineHeight: 1.7,
                          fontSize: 13.5,
                        }}
                      >
                        {card.description}
                      </Typography>
                    </Box>

                    {/* Bottom image */}
                    <Box sx={{ px: 2.25, pb: 2.25, pt: 0.25 }}>
                      <Box
                        sx={{
                          borderRadius: 1,
                          overflow: "hidden",
                          border: `1px solid ${alpha("#ffffff", 0.10)}`,
                          background: alpha("#000", 0.25),
                          boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
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
          {/* Tiny corner decoration (like screenshot bottom-right triangles) */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              right: 14,
              bottom: 14,
              width: 46,
              height: 46,
              opacity: 0.35,
              display: { xs: "none", sm: "block" },
              background: `linear-gradient(135deg, ${alpha(accent, 0.0)} 0%, ${alpha(
                accent2,
                0.35
              )} 100%)`,
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
