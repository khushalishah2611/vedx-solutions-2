/* ONLY HOVER ANIMATION ADDED — NO OTHER CHANGES */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { apiUrl } from "../../../utils/const.js";
import { useLoadingFetch } from "../../../hooks/useLoadingFetch.js";

const ServicesShowcase = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const { fetchWithLoading } = useLoadingFetch();

  const [apiSliders, setApiSliders] = useState([]);
  const [apiServices, setApiServices] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ ONLY API DATA (static removed)
  const resolvedServices = useMemo(() => apiServices ?? [], [apiServices]);

  const activeService = resolvedServices[activeIndex] ?? resolvedServices[0];

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

  const goNext = useCallback(() => {
    if (!resolvedServices.length) return;
    setActiveIndex((prev) => {
      const next = (prev + 1) % resolvedServices.length;
      scrollToIndex(next);
      return next;
    });
  }, [resolvedServices.length, scrollToIndex]);

  const goPrev = useCallback(() => {
    if (!resolvedServices.length) return;
    setActiveIndex((prev) => {
      const next = (prev - 1 + resolvedServices.length) % resolvedServices.length;
      scrollToIndex(next);
      return next;
    });
  }, [resolvedServices.length, scrollToIndex]);

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

  useEffect(() => {
    if (activeIndex >= resolvedServices.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, resolvedServices.length]);

  useEffect(() => {
    let isMounted = true;

    const loadShowcase = async () => {
      try {
        const [slidersResponse, servicesResponse] = await Promise.all([
          fetchWithLoading(apiUrl("/api/our-services/sliders")),
          fetchWithLoading(apiUrl("/api/our-services/services")),
        ]);

        if (!slidersResponse.ok || !servicesResponse.ok) {
          throw new Error("Failed to fetch services showcase");
        }

        const slidersData = await slidersResponse.json();
        const servicesData = await servicesResponse.json();

        if (!isMounted) return;

        const activeSliders = (slidersData ?? []).filter((item) => item?.isActive ?? true);
        setApiSliders(activeSliders);

        const mappedServices = (servicesData ?? [])
          .filter((item) => item?.isFeatured ?? true)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((item) => ({
            title: item.title,
            image: item.image,
            blurb: item.subtitle || item.description || "",
            capabilities: item.capabilities ?? [],
          }));

        setApiServices(mappedServices);
      } catch (error) {
        console.error("Failed to load services showcase", error);
        setApiServices([]);
      }
    };

    loadShowcase();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

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

  const supportingTextColor = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.9);

  // ✅ if API empty
  if (!resolvedServices.length) {
    return (
      <Box id="services">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 700 }}>
            Our Services
          </Typography>
          <Typography sx={{ color: supportingTextColor }}>
            No services found. Please add featured services from admin or check API.
          </Typography>
        </Stack>
      </Box>
    );
  }

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
            Our Services
          </Typography>
        </Stack>

        {/* LAYOUT */}
        <Grid container spacing={{ xs: 0, md: 0 }} alignItems="stretch" justifyContent="center">
          {/* LEFT SIDE */}
          <Grid item xs={12} md={5.5}>
            {/* MOBILE SLIDER */}
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
                  border: `1px solid ${alpha(accentColor, 0.4)}`,
                  background: alpha(accentColor, isDark ? 0.12 : 0.18),
                  color: accentColor,
                  transition: "all 0.3s ease",
                  "&:hover": { background: alpha(accentColor, isDark ? 0.2 : 0.28) },
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
                  border: `1px solid ${alpha("#a855f7", 0.45)}`,
                  background: alpha("#a855f7", isDark ? 0.14 : 0.2),
                  color: "#a855f7",
                  transition: "all 0.3s ease",
                  "&:hover": { background: alpha("#a855f7", isDark ? 0.22 : 0.3) },
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
                {resolvedServices.map((service, index) => {
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
                          borderRadius: 0.5,
                          overflow: "hidden",
                          border: active ? activeBorder : inactiveBorder,
                          boxShadow: active ? activeShadow : baseShadow,
                          transition: "all 0.35s ease",
                          position: "relative",
                          /* --- HOVER ANIMATION ADDED --- */
                          "&:hover .hover-img": { transform: "scale(1.09)" },
                        }}
                      >
                        <Box
                          className="hover-img"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${service.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transform: active ? "scale(1.06)" : "scale(1)",
                            transition: "transform 0.45s ease",
                          }}
                        />
                        <Box sx={{ position: "absolute", inset: 0, background: overlayGradient }} />
                        <Stack sx={{ position: "relative", mb: 5, height: "100%", justifyContent: "flex-end" }}>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              "&:hover": {
                                color: "transparent",
                                backgroundImage: "linear-gradient(90deg, #9c27b0, #2196f3)",
                                WebkitBackgroundClip: "text",
                              },
                            }}
                          >
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
              {resolvedServices.map((service, index) => {
                const active = index === activeIndex;
                return (
                  <Grid item xs={12} sm={4} key={service.title}>
                    <ButtonBase
                      onClick={() => setActiveIndex(index)}
                      sx={{
                        width: "100%",
                        height: 220,
                        borderRadius: 0.5,
                        overflow: "hidden",
                        border: active ? activeBorder : inactiveBorder,
                        boxShadow: active ? activeShadow : baseShadow,
                        transition: "all 0.35s ease",
                        position: "relative",
                        /* --- HOVER ANIMATION ADDED --- */
                        "&:hover .hover-img": { transform: "scale(1.09)" },
                      }}
                    >
                      <Box
                        className="hover-img"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${service.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.45s ease",
                        }}
                      />
                      <Box sx={{ position: "absolute", inset: 0, background: overlayGradient }} />
                      <Stack sx={{ position: "relative", mb: 5, height: "100%", justifyContent: "flex-end" }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            "&:hover": {
                              color: "transparent",
                              backgroundImage: "linear-gradient(90deg, #9c27b0, #2196f3)",
                              WebkitBackgroundClip: "text",
                            },
                          }}
                        >
                          {service.title}
                        </Typography>
                      </Stack>
                    </ButtonBase>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          {/* DIVIDER */}
          <Grid item md="auto" sx={{ display: { xs: "none", md: "flex" }, alignItems: "stretch" }}>
            <Divider orientation="vertical" flexItem sx={{ borderColor: alpha(theme.palette.divider, 0.7), mx: 3 }} />
          </Grid>

          {/* RIGHT SIDE CONTENT */}
          <Grid item xs={12} md={6} sx={{ mt: { xs: 5, md: 0 } }}>
            <Slide in={true} direction="left" timeout={500} key={activeService?.title}>
              <Stack spacing={3}>
                <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 34 }, fontWeight: 700 }}>
                  {activeService?.title}
                </Typography>

                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.7) }} />

                <Typography variant="body1" sx={{ color: supportingTextColor }}>
                  {activeService?.blurb}
                </Typography>

                {activeService?.capabilities?.length > 0 && (
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
                )}
              </Stack>
            </Slide>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ServicesShowcase;
