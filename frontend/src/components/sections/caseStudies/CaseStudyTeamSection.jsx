import React from "react";
import PropTypes from "prop-types";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";

const teamRoles = [
  "Project Manager",
  "Business Analyst",
  "UI/UX Designer",
  "Frontend Developers",
  "Backend Developers",
  "DevOps & Cloud Architect",
  "AI & Data Scientist",
  "Quality Assurance and Security Specialist",
];

const CaseStudyTeamSection = ({ animate = true }) => {
  // Hardcoded gradient colors to match the image exactly
  const gradientStart = "#a855f7"; // Purple
  const gradientEnd = "#ec4899"; // Pink
  const gradientMain = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = "#a855f7";

  /* ✅ theme-wise colors only (no other changes) */
  const pageBg = isDark ? "transparent" : "transparent";
  const spineColor = isDark ? alpha("#fff", 0.2) : alpha("#0b1220", 0.16);
  const connectorColor = isDark ? alpha("#fff", 0.2) : alpha("#0b1220", 0.16);

  const innerCardBg = isDark ? "#0f0f11" : alpha("#ffffff", 0.92);
  const roleTextColor = isDark ? "#fff" : alpha("#0b1220", 0.9);

  return (
    <Box sx={{ overflow: "hidden", minHeight: "100vh", bgcolor: pageBg }}>
      {/* --- HEADER SECTION --- */}
      <Stack alignItems="center" spacing={1} sx={{ mb: 8 }}>
        <Box sx={{ mx: "auto", display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderRadius: 0.5,
              border: `1px solid ${
                isDark ? alpha("#ffffff", 0.1) : alpha("#0b1220", 0.12)
              }`,
              background: isDark
                ? alpha("#0000007c", 0.9)
                : alpha("#ffffff", 0.9),
              color: alpha(accentColor, 0.9),
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontSize: 11,
              lineHeight: 1.3,
              width: "fit-content",
              mx: { xs: "auto", md: 0 },
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
              Recommended Team : 10 Team Members
            </Box>
          </Box>
        </Box>
      </Stack>

      {/* --- TIMELINE/TREE SECTION --- */}
      <Box sx={{ position: "relative", maxWidth: "900px", mx: "auto" }}>
        {/* Central Vertical Spine Line */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: "20px", md: "50%" }, // Left on mobile, Center on desktop
            transform: { xs: "none", md: "translateX(-50%)" },
            top: 20,
            bottom: 20,
            width: "2px",
            bgcolor: spineColor,
          }}
        />

        {teamRoles.map((role, index) => {
          const isLeft = index % 2 === 0; // Even numbers on left
          const number = index + 1;

          return (
            <Box
              key={role}
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: isLeft ? "row" : "row-reverse" },
                alignItems: "center",
                justifyContent: { xs: "flex-start", md: "center" },
                mb: 6,
                position: "relative",
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${index * 0.1}s`,
              }}
            >
              {/* 1. THE CARD (Text Box) */}
              <Box
                sx={{
                  width: { xs: "auto", md: "40%" },
                  flex: { xs: 1, md: "none" },
                  textAlign: "center",
                  ml: { xs: 6, md: isLeft ? 0 : 0 },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    p: "1px",
                    borderRadius: "16px",
                    background: gradientMain,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: innerCardBg,
                      borderRadius: "15px",
                      py: 1.5,
                      px: 3,
                      // ✅ light mode subtle inner border for crisp look
                      border: isDark
                        ? "none"
                        : `1px solid ${alpha("#0b1220", 0.06)}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: roleTextColor,
                        fontSize: "1rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {role}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* 2. THE CONNECTOR LINE (Horizontal) */}
              <Box
                sx={{
                  width: { xs: "20px", md: "40px" },
                  height: "2px",
                  bgcolor: connectorColor,
                  display: { xs: "none", md: "block" },
                }}
              />

              {/* 3. THE NUMBER BADGE (Center Node) */}
              <Box
                sx={{
                  position: { xs: "absolute", md: "relative" },
                  left: { xs: "0px", md: "auto" },
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: gradientMain,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 15px ${alpha(gradientStart, isDark ? 0.5 : 0.35)}`,
                  zIndex: 2,
                }}
              >
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>
                  {number}
                </Typography>
              </Box>

              {/* Spacer for the other side (Desktop only) */}
              <Box
                sx={{
                  width: { xs: 0, md: "40%" },
                  display: { xs: "none", md: "block" },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

CaseStudyTeamSection.propTypes = {
  animate: PropTypes.bool,
};

export default CaseStudyTeamSection;
