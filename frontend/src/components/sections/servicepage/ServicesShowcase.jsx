import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  ButtonBase,
  Divider,
  Grid,
  IconButton,
  Slide,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { servicesShowcase } from "../../../data/content.js";

const ServicesShowcase = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;

  const { heading, services } = servicesShowcase;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex];

  // Mobile scroll container ref
  const scrollRef = useRef(null);

  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.children[index];
    if (!card) return;

    scrollRef.current.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  // Manual Navigation + scroll movement
  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % services.length;
      scrollToIndex(next);
      return next;
    });
  }, [scrollToIndex, services.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev - 1 + services.length) % services.length;
      scrollToIndex(next);
      return next;
    });
  }, [scrollToIndex, services.length]);

  const syncActiveIndexWithScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cards = Array.from(container.children);
    if (!cards.length) return;

    let closestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - scrollLeft);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    const handleScroll = () => syncActiveIndexWithScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [syncActiveIndexWithScroll]);

  const activeBorder = `2px solid ${alpha(accentColor, 0.9)}`;
  const inactiveBorder = `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`;

  const activeShadow = isDark
    ? "0 24px 48px rgba(5, 9, 18, 0.55)"
    : "0 24px 48px rgba(15, 23, 42, 0.18)";

  const baseShadow = isDark
    ? "0 16px 36px rgba(5, 9, 18, 0.4)"
    : "0 16px 32px rgba(15, 23, 42, 0.12)";

  const overlayGradient = isDark
    ? "linear-gradient(180deg, rgba(5,9,18,0.15) 10%, rgba(5,9,18,0.8) 85%)"
    : "linear-gradient(180deg, rgba(15,23,42,0.35) 15%, rgba(15,23,42,0.75) 90%)";

  const supportingTextColor = alpha(
    theme.palette.text.secondary,
    isDark ? 0.85 : 0.9
  );

  return (
    <Box id="services">
      <Stack spacing={6}>
        {/* HEADING */}
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 32, md: 44 },
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.1,
            }}
          >
            {heading}
          </Typography>
        </Stack>

        {/* LAYOUT */}
        <Grid
          container
          spacing={{ xs: 0, md: 0 }}
          alignItems="stretch"
          justifyContent="center"
        >
          {/* LEFT SIDE */}
          <Grid item xs={12} md={5.5}>
            {/* MOBILE SCROLL + ARROWS */}
            <Box sx={{ display: { xs: "block", md: "none" }, position: "relative" }}>
              <IconButton
                onClick={goPrev}
                aria-label="Previous service"
                sx={{
                  position: "absolute",
                  left: 4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: alpha("#000", 0.4),
                  color: "white",
                  "&:hover": { bgcolor: alpha("#000", 0.6) },
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={goNext}
                aria-label="Next service"
                sx={{
                  position: "absolute",
                  right: 4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: alpha("#000", 0.4),
                  color: "white",
                  "&:hover": { bgcolor: alpha("#000", 0.6) },
                }}
              >
                <ChevronRight />
              </IconButton>

              <Box
                ref={scrollRef}
                sx={{
                  display: { xs: "flex", md: "none" },
                  overflowX: "auto",
                  gap: 2,
                  pb: 1,
                  scrollSnapType: "x mandatory",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {services.map((service, index) => {
                  const active = index === activeIndex;

                  return (
                    <Box key={service.title} sx={{ minWidth: "75%", scrollSnapAlign: "center" }}>
                      <ButtonBase
                        onClick={() => {
                          setActiveIndex(index);
                          scrollToIndex(index);
                        }}
                        sx={{
                          width: "100%",
                          height: 220,
                          borderRadius: 1,
                          overflow: "hidden",
                          border: active ? activeBorder : inactiveBorder,
                          boxShadow: active ? activeShadow : baseShadow,
                          transition: "all 0.35s ease",
                          position: "relative",
                          color: "white",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${service.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transform: active ? "scale(1.06)" : "scale(1)",
                            transition: "0.4s ease",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background: overlayGradient,
                          }}
                        />

                        <Stack
                          sx={{
                            position: "relative",
                            p: 2,
                            height: "100%",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography sx={{ fontWeight: 700 }}>
                            {service.title}
                          </Typography>
                        </Stack>
                      </ButtonBase>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* DESKTOP GRID */}
            <Grid container spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
              {services.map((service, index) => {
                const active = index === activeIndex;

                return (
                  <Grid item xs={12} sm={4} key={service.title}>
                    <ButtonBase
                      onClick={() => setActiveIndex(index)}
                      sx={{
                        width: "100%",
                        height: 220,
                        borderRadius: 1,
                        overflow: "hidden",
                        border: active ? activeBorder : inactiveBorder,
                        boxShadow: active ? activeShadow : baseShadow,
                        transition: "all 0.35s ease",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${service.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: overlayGradient,
                        }}
                      />

                      <Stack
                        sx={{
                          position: "relative",
                          p: 2,
                          height: "100%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>
                          {service.title}
                        </Typography>
                      </Stack>
                    </ButtonBase>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          {/* DIVIDER DESKTOP */}
          <Grid
            item
            md="auto"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "stretch",
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: alpha(theme.palette.divider, 0.7),
                mx: 3,
              }}
            />
          </Grid>

          {/* RIGHT CONTENT */}
          <Grid item xs={12} md={6}>
            <Slide in={true} direction="left" timeout={500} key={activeService.title}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 220, md: 260 },
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: baseShadow,
                  }}
                >
                  <Box
                    component="img"
                    src={activeService.image}
                    alt={`${activeService.title} visual`}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: overlayGradient,
                    }}
                  />
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: 26, md: 34 },
                    fontWeight: 700,
                  }}
                >
                  {activeService.title}
                </Typography>

                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.7) }} />

                <Typography variant="body1" sx={{ color: supportingTextColor }}>
                  {activeService.blurb}
                </Typography>

                <Stack spacing={1.5}>
                  {activeService.capabilities.map((capability) => (
                    <Typography
                      key={capability}
                      variant="body2"
                      sx={{
                        fontWeight: 900,
                        cursor: "pointer",
                        transition: "0.3s",
                        color: supportingTextColor,
                        "&:hover": {
                          color: "transparent",
                          backgroundImage: "linear-gradient(90deg, #9c27b0, #2196f3)",
                          WebkitBackgroundClip: "text",
                        },
                      }}
                    >
                      {capability}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Slide>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ServicesShowcase;
