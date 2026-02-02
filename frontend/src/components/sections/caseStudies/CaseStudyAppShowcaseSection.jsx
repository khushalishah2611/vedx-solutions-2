import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";

const CaseStudyAppShowcaseSection = ({ caseStudy, animate = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const accentColor = "#a855f7";

  const screenshots = useMemo(() => {
    return (caseStudy?.screenshots || [])
      .map((shot, index) => {
        if (typeof shot === "string") {
          return { src: shot, alt: `App screenshot ${index + 1}` };
        }
        if (shot && typeof shot === "object") {
          return {
            src: shot.src || shot.image || "",
            alt: shot.alt || `App screenshot ${index + 1}`,
          };
        }
        return null;
      })
      .filter((shot) => shot?.src)
      .slice(0, 5);
  }, [caseStudy]);

  return (
    <Stack spacing={4} alignItems="center" textAlign="center">
      {/* Header + Description */}
      <Stack spacing={2} sx={{ maxWidth: 980 }}>
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
              Our App
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: isDark ? alpha("#fff", 0.78) : alpha("#0b1220", 0.72),
            lineHeight: 1.8,
          }}
        >
          {caseStudy?.appDescription ||
            "The Anveshaka App simplifies every aspect of trip planning by allowing users to search, compare, and book flights, hotels, and transportation — all in one place. With AI-powered recommendations, users receive personalized travel options based on their preferences, budget, and past trips. The app ensures a smooth booking experience with secure payments, real-time availability updates, and instant confirmations. Integrated maps and itinerary management help travelers stay organized, while 24/7 customer support provides assistance anytime, anywhere — making travel smarter, faster, and stress-free."}
        </Typography>
      </Stack>

      {/* Screenshots */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          width: "100%",
          maxWidth: 1200,
          px: { xs: 1, sm: 2 },
          py: 1,
        }}
      >
        {screenshots.map((shot, index) => (
          <Box
            key={`${shot.src}-${index}`}
            sx={{
              width: { xs: 160, sm: 180, md: 220 },

              // ✅ IMPORTANT: add minHeight so container doesn't collapse
              minHeight: { xs: 280, sm: 320, md: 360 },

              borderRadius: 0.5,
              overflow: "hidden",
              position: "relative",
              border: `1px solid ${isDark ? alpha("#ffffff", 0.12) : alpha("#0b1220", 0.10)
                }`,
              backgroundColor: isDark
                ? alpha("#000", 0.25)
                : alpha("#fff", 0.85),
              boxShadow: isDark
                ? "0 16px 35px rgba(0,0,0,0.45)"
                : "0 16px 35px rgba(15,23,42,0.18)",
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(16px)",
              transition: `all 500ms ease ${160 + index * 120}ms`,

              // ✅ PERFECT CENTER (widget container)
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
            }}
          >
            <Box
              component="img"
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              sx={{
                // ✅ perfect center + keep aspect ratio
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

CaseStudyAppShowcaseSection.propTypes = {
  caseStudy: PropTypes.object.isRequired,
  animate: PropTypes.bool,
};

export default CaseStudyAppShowcaseSection;
