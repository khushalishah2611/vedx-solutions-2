import React from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import { AppButton } from "../../shared/FormControls.jsx";

const DEFAULT_HERO_TITLE = "About Us";
const DEFAULT_DESC =
  "Empowering your vision: unleashing dedicated resources for Success";

const AboutHeroSection = ({
  hero = null,
  stats = [],
  onCtaClick = null,

  // ✅ optional fallbacks if hero is null
  heroTitle = DEFAULT_HERO_TITLE,
  heroDescription = DEFAULT_DESC,
  heroImage = "",
  heroHasImage = true,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78);
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;

  // ✅ final resolved content
  const resolvedTitle = hero?.title || heroTitle;
  const resolvedDesc = hero?.description || heroDescription;
  const resolvedImage = hero?.baseImage || heroImage;
  const hasImage = Boolean(resolvedImage) && heroHasImage;

  const buttonProps = onCtaClick ? { onClick: onCtaClick } : { href: "#contact" };
  const ctaLabel = hero?.ctaLabel || "Contact us";

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "60vh", md: "70vh" },
        display: "flex",
        alignItems: "center",
        pb: { xs: 10, md: 14 },
        pt: { xs: 14, md: 18 },
      }}
    >
      {/* ✅ Background layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: hasImage
            ? `url("${resolvedImage}")`
            : isDark
              ? "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 50%, rgba(2,6,23,1) 100%)"
              : "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(226,232,240,1) 50%, rgba(241,245,249,1) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: hasImage ? "scale(1.05)" : "none",
          filter: hasImage
            ? isDark
              ? "brightness(0.85)"
              : "brightness(0.95)"
            : "none",
        }}
      />

      {/* ✅ Overlay layer (separate from background) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: isDark
            ? `linear-gradient(
                90deg,
                rgba(5,9,18,0.85) 0%,
                rgba(5,9,18,0.65) 40%,
                rgba(5,9,18,0.2) 70%,
                rgba(5,9,18,0) 100%
              )`
            : `linear-gradient(
                90deg,
                rgba(255,255,255,0.92) 0%,
                rgba(255,255,255,0.75) 40%,
                rgba(255,255,255,0.35) 70%,
                rgba(255,255,255,0) 100%
              )`,
        }}
      />

      {/* ✅ Content */}
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack
              spacing={3}
              sx={{
                textAlign: { xs: "center", md: "left" },
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
           
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 38, sm: 46, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  // ✅ readable on both overlays
                  color: isDark ? "#fff" : theme.palette.text.primary,
                }}
              >
                {resolvedTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: 560,
                  lineHeight: 1.7,
                  // ✅ don’t override subtleText accidentally
                  color: isDark ? alpha("#fff", 0.92) : subtleText,
                }}
              >
                {resolvedDesc}
              </Typography>

              <AppButton
                variant="contained"
                size="large"
                {...buttonProps}
                sx={{
                  background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 1.75 },
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                  },
                }}
              >
                {ctaLabel}
              </AppButton>

            
            </Stack>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

AboutHeroSection.propTypes = {
  hero: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    extendedDescription: PropTypes.string,
    baseImage: PropTypes.string,
    overlayImage: PropTypes.string,
    ctaLabel: PropTypes.string,
  }),
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  onCtaClick: PropTypes.func,

  // optional fallbacks
  heroTitle: PropTypes.string,
  heroDescription: PropTypes.string,
  heroImage: PropTypes.string,
  heroHasImage: PropTypes.bool,
};

export default AboutHeroSection;
