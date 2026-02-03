import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { AppButton } from "../../shared/FormControls.jsx";

const CareerHeroSection = ({ hero, onCtaClick, rightContent }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const heroTitle = hero?.title || "Join our team";
  const heroDescription =
    hero?.description || "Explore exciting roles and grow your career with us.";
  const heroCaption = hero?.caption || "";
  const heroImage = hero?.image || "";
  const heroHasImage = Boolean(heroImage);

  const subtleText = useMemo(
    () => alpha(theme.palette.text.secondary, isDark ? 0.88 : 0.78),
    [theme.palette.text.secondary, isDark]
  );

  const buttonProps = onCtaClick
    ? { onClick: onCtaClick }
    : { href: hero?.ctaHref || "#contact" };

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
      {/* Background Layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: heroHasImage
            ? `url("${heroImage}")`
            : isDark
              ? "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 50%, rgba(2,6,23,1) 100%)"
              : "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(226,232,240,1) 50%, rgba(241,245,249,1) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: "scale(1.05)",
          // keep image readable in both modes
          filter: heroHasImage ? (isDark ? "brightness(0.85)" : "brightness(0.95)") : "none",
          transition: "filter 300ms ease",
        }}
      />

      {/* Overlay Layer */}
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
                rgba(5,9,18,0.25) 70%,
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

      {/* Soft Glow / Accent (optional but nice) */}
      <Box
        sx={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "50%",
          left: { xs: "50%", md: -140 },
          top: { xs: -220, md: -160 },
          transform: { xs: "translateX(-50%)", md: "none" },
          background: isDark
            ? "radial-gradient(circle at center, rgba(168,77,255,0.22), transparent 60%)"
            : "radial-gradient(circle at center, rgba(255,94,94,0.18), transparent 60%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Grid container alignItems="center" spacing={{ xs: 5, md: 8 }}>
          {/* Left */}
          <Grid item xs={12} md={rightContent ? 7 : 12}>
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
                  color: isDark ? "#fff" : "rgba(2,6,23,0.92)",
                }}
              >
                {heroTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: isDark ? subtleText : "rgba(2,6,23,0.72)",
                  maxWidth: 560,
                  lineHeight: 1.75,
                }}
              >
                {heroDescription}
              </Typography>

              {!!heroCaption && (
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? subtleText : "rgba(2,6,23,0.65)",
                    maxWidth: 560,
                    lineHeight: 1.7,
                  }}
                >
                  {heroCaption}
                </Typography>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  pt: 0.5,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <AppButton
                  variant="contained"
                  size="large"
                  {...buttonProps}
                  sx={{
                    background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                    color: "#fff",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 700,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 1.75 },
                    boxShadow: isDark
                      ? "0 14px 40px rgba(0,0,0,0.35)"
                      : "0 14px 40px rgba(2,6,23,0.16)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {hero?.ctaLabel || "Contact us"}
                </AppButton>

                {/* Optional secondary button if you ever need */}
                {/* <AppButton
                  variant="outlined"
                  size="large"
                  href="#open-roles"
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 700,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 1.75 },
                    borderColor: isDark ? "rgba(255,255,255,0.28)" : "rgba(2,6,23,0.18)",
                    color: isDark ? "#fff" : "rgba(2,6,23,0.85)",
                    "&:hover": {
                      borderColor: isDark ? "rgba(255,255,255,0.45)" : "rgba(2,6,23,0.28)",
                      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(2,6,23,0.04)",
                    },
                  }}
                >
                  View open roles
                </AppButton> */}
              </Stack>
            </Stack>
          </Grid>

          {/* Right (optional) */}
          {rightContent && (
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                {rightContent}
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

CareerHeroSection.propTypes = {
  hero: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    caption: PropTypes.string,
    ctaLabel: PropTypes.string,
    ctaHref: PropTypes.string,
    image: PropTypes.string,
  }),
  onCtaClick: PropTypes.func,
  rightContent: PropTypes.node,
};

CareerHeroSection.defaultProps = {
  hero: null,
  onCtaClick: null,
  rightContent: null,
};

export default CareerHeroSection;
