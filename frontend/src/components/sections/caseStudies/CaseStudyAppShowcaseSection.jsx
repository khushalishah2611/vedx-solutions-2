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
    <Stack spacing={1} alignItems="center" textAlign="center">
      <Stack  >
        <Box sx={{ mx: "auto", display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderRadius: 0.5,
              border: `1px solid ${alpha("#ffffff", 0.1)}`,
              background: !isDark
                ? alpha("#ddddddff", 0.9)
                : alpha("#0000007c", 0.9),
              color: alpha(accentColor, 0.9),
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontSize: 11,
              lineHeight: 1.3,
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

        <Box mt={10} />

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.8 }}
        >
          {caseStudy?.appDescription ||
            "The Anveshaka App simplifies every aspect of trip planning by allowing users to search, compare, and book flights, hotels, and transportation — all in one place. With AI-powered recommendations, users receive personalized travel options based on their preferences, budget, and past trips. The app ensures a smooth booking experience with secure payments, real-time availability updates, and instant confirmations. Integrated maps and itinerary management help travelers stay organized, while 24/7 customer support provides assistance anytime, anywhere — making travel smarter, faster, and stress-free."}
        </Typography>
      </Stack>

        <Box mt={10} />
      {/* 🔥 SAME spacing as card image */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",

        }}
      >
        {screenshots.map((shot, index) => (
          <Box
            key={`${shot.src}-${index}`}
            sx={{
              width: { xs: 160, sm: 180, md: 220 },
             
              borderRadius: 0.5,
              overflow: "hidden",
              position: "relative",
              backgroundColor: isDark
                ? alpha("#000", 0.25)
                : alpha("#fff", 0.75),
              boxShadow: isDark
                ? "0 16px 35px rgba(0,0,0,0.45)"
                : "0 16px 35px rgba(15,23,42,0.18)",
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(16px)",
              transition: `all 500ms ease ${160 + index * 120}ms`,
            }}
          >
            <Box
              component="img"
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
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
