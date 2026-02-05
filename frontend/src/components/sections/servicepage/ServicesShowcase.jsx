import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { apiUrl } from "../../../utils/const.js";
import { useLoadingFetch } from "../../../hooks/useLoadingFetch.js";
import { createSlug } from "../../../utils/formatters.js";

function ServiceDetails({ activeService, theme, supportingTextColor, categorySlug }) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const capabilitiesList = useMemo(() => {
    const raw =
      (Array.isArray(activeService?.capabilities) && activeService.capabilities.length
        ? activeService.capabilities
        : null) ??
      activeService?.capabilitiesText ??
      activeService?.title ??
      "";

    if (Array.isArray(raw)) {
      return raw.map((s) => String(s).trim()).filter(Boolean);
    }

    return String(raw)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }, [activeService]);

  const title = activeService?.sliderTitle ?? activeService?.title ?? "Service";
  const description = activeService?.sliderDescription ?? activeService?.description ?? "";

  const renderCapabilityText = (capability) => {
    const capabilitySlug = createSlug(capability);
    const hasLink = Boolean(categorySlug && capabilitySlug);

    return (
      <Typography
        key={capability}
        variant="body2"
        component={hasLink ? Link : "span"}
        to={hasLink ? `/services/${categorySlug}/${capabilitySlug}` : undefined}
        sx={{
          fontWeight: 600,
          cursor: "pointer",
          transition: "0.3s",
          color: supportingTextColor,
          textDecoration: "none",
          "&:hover": {
            color: "transparent",
            backgroundImage: "linear-gradient(90deg, #9c27b0, #2196f3)",
            WebkitBackgroundClip: "text",
          },
        }}
      >
        {capability}
      </Typography>
    );
  };

  return (
    <Grid item xs={12} md={6} sx={{ mt: { xs: 5, md: 0 } }}>
      <Slide in={true} direction="left" timeout={500} key={title}>
        <Stack spacing={3}>
          <Typography
            variant="h4"
            component={categorySlug ? Link : "span"}
            to={categorySlug ? `/services/${categorySlug}` : undefined}
            sx={{
              fontSize: { xs: 26, md: 34 },
              fontWeight: 700,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {title}
          </Typography>

          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.7) }} />

          <Typography variant="body1" sx={{ color: supportingTextColor }}>
            {description}
          </Typography>


          {capabilitiesList.length > 0 && (
            isMobile ? (
              capabilitiesList.length < 10 ? (

                <Stack spacing={1.2}>{capabilitiesList.map(renderCapabilityText)}</Stack>
              ) : (

                <Grid container spacing={1.5}>
                  {capabilitiesList.map((capability) => (
                    <Grid item xs={6} key={capability}>
                      {renderCapabilityText(capability)}
                    </Grid>
                  ))}
                </Grid>
              )
            ) : (
              capabilitiesList.length < 10 ? (

                <Stack spacing={1.2}>{capabilitiesList.map(renderCapabilityText)}</Stack>
              ) : (

                <Grid container spacing={1.5}>
                  {capabilitiesList.map((capability) => (
                    <Grid item xs={6} sm={4} md={6} key={capability}>
                      {renderCapabilityText(capability)}
                    </Grid>
                  ))}
                </Grid>
              )
            )
          )}
        </Stack>
      </Slide>
    </Grid>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
const ServicesShowcase = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const { fetchWithLoading } = useLoadingFetch();

  const [apiSliders, setApiSliders] = useState([]);
  const [apiServices, setApiServices] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);


  const resolvedServices = useMemo(() => apiServices ?? [], [apiServices]);


  const resolvedSliders = useMemo(() => apiSliders ?? [], [apiSliders]);


  const leftItems = useMemo(() => {
    if (resolvedSliders.length > 0) return resolvedSliders;
    return (resolvedServices ?? []).map((s) => ({
      id: s?.sliderId ?? s?.slider?.id ?? null,
      title: s?.sliderTitle ?? s?.title ?? "",
      image: s?.sliderImage ?? s?.image ?? "",
    }));
  }, [resolvedSliders, resolvedServices]);

  const leftItemsLength = leftItems.length;

  const safeServiceIndex = useMemo(() => {
    if (!resolvedServices.length) return 0;
    return Math.min(activeIndex, Math.max(0, resolvedServices.length - 1));
  }, [activeIndex, resolvedServices.length]);


  const activeServiceFromServices = useMemo(() => {
    if (!resolvedServices.length) return null;

    const left = leftItems?.[activeIndex];
    const leftId = left?.id;

    if (leftId != null) {
      const match = resolvedServices.find((s) => s?.sliderId === leftId);
      if (match) return match;
    }

    return resolvedServices[safeServiceIndex] ?? null;
  }, [resolvedServices, leftItems, activeIndex, safeServiceIndex]);

  const activeService = useMemo(() => {
    const fallbackLeft = leftItems?.[activeIndex] ?? null;

    return {
      ...(activeServiceFromServices ?? {}),


      sliderTitle:
        activeServiceFromServices?.sliderTitle ||
        activeServiceFromServices?.title ||
        fallbackLeft?.title ||
        "Service",


      sliderDescription:
        activeServiceFromServices?.sliderDescription ||
        activeServiceFromServices?.blurb ||
        activeServiceFromServices?.description ||
        "",
    };
  }, [activeServiceFromServices, leftItems, activeIndex]);

  const categorySlug = useMemo(() => {
    const title = activeService?.sliderTitle ?? activeService?.title ?? "";
    return createSlug(title);
  }, [activeService]);

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
    if (!leftItemsLength) return;
    setActiveIndex((prev) => {
      const next = (prev + 1) % leftItemsLength;
      scrollToIndex(next);
      return next;
    });
  }, [leftItemsLength, scrollToIndex]);

  const goPrev = useCallback(() => {
    if (!leftItemsLength) return;
    setActiveIndex((prev) => {
      const next = (prev - 1 + leftItemsLength) % leftItemsLength;
      scrollToIndex(next);
      return next;
    });
  }, [leftItemsLength, scrollToIndex]);

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

    return () => container.removeEventListener("scroll", handleScroll);
  }, [syncActiveIndexWithScroll]);

  useEffect(() => {
    if (activeIndex >= leftItemsLength && leftItemsLength > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, leftItemsLength]);

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

        const activeSliders = (slidersData ?? [])
          .filter((item) => (item?.isActive ?? true) === true)
          .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
          .map((item) => ({
            id: item?.id ?? item?._id ?? null,
            title: item?.sliderTitle ?? item?.title ?? "",
            image: item?.sliderImage ?? item?.image ?? "",
          }))
          .filter((x) => x?.title || x?.image);

        setApiSliders(activeSliders);

        const mappedServices = (servicesData ?? [])
          .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
          .map((item) => {
            const sliderObj = item?.slider ?? null;

            const sliderId = sliderObj?.id ?? item?.sliderId ?? null;
            const sliderTitle = sliderObj?.sliderTitle ?? item?.sliderTitle ?? item?.title ?? "";
            const sliderDescription =
              sliderObj?.sliderDescription ??
              item?.sliderDescription ??
              item?.subtitle ??
              item?.description ??
              "";

            return {
              sliderId,
              sliderTitle,
              sliderDescription,
              sliderImage: sliderObj?.sliderImage ?? item?.sliderImage ?? item?.image ?? "",

              title: item?.title ?? "",
              image: item?.image ?? "",
              blurb: item?.subtitle || item?.description || "",

              capabilities: Array.isArray(item?.capabilities)
                ? item.capabilities
                : typeof item?.capabilities === "string"
                  ? item.capabilities
                  : [],
            };
          })
          .filter((x) => x?.sliderTitle || x?.title || x?.sliderDescription || x?.blurb || x?.image);

        setApiServices(mappedServices);
      } catch (error) {
        console.error("Failed to load services showcase", error);
        setApiSliders([]);
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
                {leftItems.map((item, index) => {
                  const active = index === activeIndex;
                  return (
                    <Box
                      key={`${item?.title ?? "item"}-${index}`}
                      sx={{ minWidth: "75%", scrollSnapAlign: "center" }}
                    >
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
                          "&:hover .hover-img": { transform: "scale(1.09)" },
                        }}
                      >
                        <Box
                          className="hover-img"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${item?.image || ""})`,
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
                              px: 2,
                              pb: 1.5,
                               color: "#fff",
                              "&:hover": {
                                color: "transparent",
                                backgroundImage: "linear-gradient(90deg, #9c27b0, #2196f3)",
                                WebkitBackgroundClip: "text",
                              },
                            }}
                          >
                            {item?.title}
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
              {leftItems.map((item, index) => {
                const active = index === activeIndex;
                return (
                  <Grid item xs={12} sm={4} key={`${item?.title ?? "item"}-${index}`}>
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
                        "&:hover .hover-img": { transform: "scale(1.09)" },
                      }}
                    >
                      <Box
                        className="hover-img"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${item?.image || ""})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.45s ease",
                          transform: active ? "scale(1.06)" : "scale(1)",
                        }}
                      />
                      <Box sx={{ position: "absolute", inset: 0, background: overlayGradient }} />
                      <Stack sx={{ position: "relative", mb: 5, height: "100%", justifyContent: "flex-end" }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            px: 2,
                            pb: 1.5,
                             color: "#fff",
                            "&:hover": {
                              color: "transparent",
                              backgroundImage: "linear-gradient(90deg, #9c27b0, #2196f3)",
                              WebkitBackgroundClip: "text",
                            },
                          }}
                        >
                          {item?.title}
                        </Typography>
                      </Stack>
                    </ButtonBase>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          <Grid item md="auto" sx={{ display: { xs: "none", md: "flex" }, alignItems: "stretch" }}>
            <Divider orientation="vertical" flexItem sx={{ borderColor: alpha(theme.palette.divider, 0.7), mx: 3 }} />
          </Grid>
          <ServiceDetails
            activeService={activeService}
            theme={theme}
            supportingTextColor={supportingTextColor}
            categorySlug={categorySlug}
          />
        </Grid>
      </Stack>
    </Box>
  );
};

export default ServicesShowcase;
