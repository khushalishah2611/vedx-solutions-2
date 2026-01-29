// HeroSection.jsx ✅ (SINGLE FILE)
// ✅ NO fallback slides (API only)
// ✅ Autoplay runs only when slides exist
// ✅ Safe keys + safe currentSlide (avoids crash when no data)

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  ButtonBase,
  Container,
  Fade,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../../shared/FormControls.jsx";
import { useBannersByType } from "../../../hooks/useBannersByType.js";

const SLIDE_INTERVAL = 7000;

const HeroSection = ({ onRequestContact }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const { banners = [] } = useBannersByType("home");

  // ✅ API slides only
  const slides = useMemo(() => {
    if (!Array.isArray(banners) || banners.length === 0) return [];

    const apiSlides = banners.flatMap((banner) => {
      const bannerTitle = String(banner?.title ?? "").trim();
      const images = Array.isArray(banner?.images) ? banner.images : [];

      return images
        .map((img) => {
          const image = typeof img === "string" ? img.trim() : "";
          if (!image) return null;

          return {
            image,
            title: bannerTitle, // title from API
            highlight: "", // highlight not used in API mode
          };
        })
        .filter(Boolean);
    });

    return apiSlides;
  }, [banners]);

  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!slides.length) return;

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    // keep slide index valid when API data changes
    setActiveSlide((prev) => (slides.length ? prev % slides.length : 0));
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, startAutoplay]);

  const handleSelectSlide = (index) => {
    setActiveSlide(index);
    startAutoplay();
  };

  const currentSlide = slides[activeSlide];
  const hasHighlight = Boolean(currentSlide?.highlight);

  const handleContactClick = () => {
    onRequestContact?.("");
    navigate("/contact");

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 120);
  };

  // ✅ If no API data, hide hero completely (no UI)
  if (!slides.length) return null;

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
      {/* Background Images */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {slides.map((slide, index) => (
          <Box
            key={`${slide.image}-${index}`}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.05)",
              transition: "opacity 1.2s ease-in-out",
              opacity: index === activeSlide ? 1 : 0,
              filter: isDark ? "brightness(0.9)" : "brightness(0.8)",
            }}
          />
        ))}

        {/* Overlay */}
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

      {/* CONTENT */}
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Stack spacing={{ xs: 6, md: 8 }}>
          <Fade in key={`${currentSlide?.title}-${activeSlide}`} timeout={900}>
            <Stack
              spacing={4}
              maxWidth={{ xs: "100%", md: 720 }}
              sx={{
                textAlign: { xs: "center", md: "left" },
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: 44, md: 64 }, lineHeight: 1.05 }}
              >
                {currentSlide?.title}
                {hasHighlight && (
                  <Box
                    component="span"
                    sx={{
                      background:
                        "linear-gradient(90deg, #67e8f9 0%, #a855f7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      display: "inline-block",
                      ml: 1,
                    }}
                  >
                    {currentSlide?.highlight}
                  </Box>
                )}
              </Typography>

              {/* CTA */}
              <AppButton
                variant="contained"
                size="large"
                onClick={handleContactClick}
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
                Let&apos;s Build Together
              </AppButton>
            </Stack>
          </Fade>
        </Stack>
      </Container>

      {/* Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 40, md: 60 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        <Stack direction="row" spacing={1.2}>
          {slides.map((slide, index) => {
            const active = index === activeSlide;
            return (
              <ButtonBase
                key={`${slide.image}-${index}`}
                onClick={() => handleSelectSlide(index)}
                sx={{
                  width: active ? 14 : 10,
                  height: active ? 14 : 10,
                  borderRadius: "50%",
                  backgroundColor: active
                    ? "secondary.main"
                    : alpha("#ffffff", 0.4),
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default HeroSection;
