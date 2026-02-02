import React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { Box, Stack, Typography, useTheme } from "@mui/material";

const CaseStudyConclusionBlock = ({ conclusion, accentColor = "" }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const safeAccent = accentColor || theme.palette.primary.main;

  return (
    <Stack spacing={2} alignItems="center">
      {/* Badge */}
      <Box sx={{ mx: "auto", display: "flex", justifyContent: "center" }}>
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
            Conclusion
          </Box>
        </Box>
      </Box>

      {/* Accent underline */}
      <Box
        sx={{
          width: 72,
          height: 3,
      
        }}
      />

      {/* Text */}
      <Typography
        variant="body1"
        sx={{
          maxWidth: 720,
          textAlign: "center",
          color: alpha(theme.palette.text.primary, 0.7),
          lineHeight: 1.8,
        }}
      >
        {conclusion}
      </Typography>
    </Stack>
  );
};

CaseStudyConclusionBlock.propTypes = {
  conclusion: PropTypes.string.isRequired,
  accentColor: PropTypes.string, // optional (fallback to theme primary)
};

export default CaseStudyConclusionBlock;
