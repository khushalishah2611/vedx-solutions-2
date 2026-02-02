import React from "react";
import PropTypes from "prop-types";
import { alpha, Box, Container, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../../shared/FormControls.jsx";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DEFAULT_BACKGROUND =
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80";

const DEFAULT_TITLE = "Explore Our Case Studies Gallery, Where Ideas Flourish.";

const CaseStudiesHero = ({ banner }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.75);

  const bannerImage = banner?.image || DEFAULT_BACKGROUND;
  const bannerTitle = banner?.title || DEFAULT_TITLE;

  const onContact = () => {
    navigate("/contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "60vh", md: "70vh" },
        display: "flex",
        alignItems: "center",
        pb: { xs: 12, md: 14 },
        pt: { xs: 14, md: 18 },
      }}
    >
      {/* ✅ Static Background Image */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.05)",
            filter: isDark ? "brightness(0.9)" : "brightness(0.8)",
          }}
        />

        {/* ✅ Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: isDark
              ? `
                linear-gradient(
                  90deg,
                  rgba(5,9,18,0.85) 0%,
                  rgba(5,9,18,0.65) 40%,
                  rgba(5,9,18,0.2) 70%,
                  rgba(5,9,18,0) 100%
                )
              `
              : `
                linear-gradient(
                  90deg,
                  rgba(241,245,249,0.9) 0%,
                  rgba(241,245,249,0.7) 40%,
                  rgba(241,245,249,0.3) 70%,
                  rgba(241,245,249,0) 100%
                )
              `,
          }}
        />
      </Box>

      {/* ✅ Content */}
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Stack
              spacing={4}
              sx={{
                textAlign: { xs: "center", md: "left" },
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 32, sm: 40, md: 52 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: isDark ? "#f9fafb" : "#0f172a",
                }}
              >
                {bannerTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  maxWidth: 540,
                  lineHeight: 1.7,
                }}
              >
                Explore the best of VedX Solutions by diving into our tech-powered
                transformations. Each partnership blends domain expertise, design
                thinking, and reliable engineering to move mission-ready solutions
                into market.
              </Typography>

              <AppButton
                variant="contained"
                size="large"
                onClick={onContact}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 1.75 },
                  "&:hover": {
                    background: "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                  },
                }}
              >
                Let’s Build Together
              </AppButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

CaseStudiesHero.propTypes = {
  banner: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
  }),
};

CaseStudiesHero.defaultProps = {
  banner: null,
};

export default CaseStudiesHero;
