import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { AppButton } from "./FormControls.jsx";

import { apiUrl } from "../../utils/const.js";
import { useLoadingFetch } from "../../hooks/useLoadingFetch.js";

const PricingModels = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const { fetchWithLoading } = useLoadingFetch();

  const [apiPlans, setApiPlans] = useState([]);
  const [heroContent, setHeroContent] = useState({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadPricing = async () => {
      try {
        const response = await fetchWithLoading(
          apiUrl("/api/hire-developer/pricing")
        );
        if (!response.ok) {
          throw new Error("Failed to fetch hire developer pricing");
        }
        const data = await response.json();
        if (!isMounted) return;

        const popularIndex = data.length ? Math.min(1, data.length - 1) : -1;
        const mapped = (data || []).map((plan, index) => ({
          id: plan.id,
          title: plan.title || "",
          cadence: plan.subtitle || "",
          emphasis: plan.description || "",
          price: plan.price || "",
          features: Array.isArray(plan.services) ? plan.services : [],
          isPopular: index === popularIndex,
          heroTitle: plan.heroTitle || "",
          heroDescription: plan.heroDescription || "",
          heroImage: plan.heroImage || "",
        }));

        setApiPlans(mapped);

        const heroSource = mapped[0];
        if (heroSource) {
          setHeroContent({
            title: heroSource.heroTitle || "",
            description: heroSource.heroDescription || "",
            image: heroSource.heroImage || "",
          });
        }
      } catch (error) {
        console.error("Failed to load hire pricing", error);
      }
    };

    loadPricing();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  const resolvedPlans = useMemo(() => apiPlans, [apiPlans]);

  const highlightedIndex = useMemo(() => {
    const popularIndex = resolvedPlans.findIndex((plan) => plan.isPopular);
    if (popularIndex >= 0) return popularIndex;
    return resolvedPlans.length ? Math.min(1, resolvedPlans.length - 1) : -1;
  }, [resolvedPlans]);

  const resolvedHeroTitle = heroContent.title || "Our Pricing Models";
  const resolvedHeroDescription =
    heroContent.description ||
    "Choose the contract structure that aligns with your roadmap. Each plan includes vetted VedX talent, collaborative delivery, and proactive communication tailored to your operating hours.";

  // ✅ theme-based colors (works in dark + light)
  const pageText = isDark
    ? theme.palette.common.white
    : alpha(theme.palette.text.primary, 0.92);

  const heroDescColor = isDark
    ? alpha("#ffffff", 0.78)
    : alpha(theme.palette.text.secondary, 0.82);

  const pillBorder = alpha(
    isDark ? theme.palette.common.white : theme.palette.text.primary,
    isDark ? 0.12 : 0.12
  );

  const pillBg = isDark ? alpha("#000000", 0.38) : alpha("#ffffff", 0.78);

  const cardBaseBg = isDark ? "#0f172a" : "#ffffff";
  const cardShadowBase = isDark
    ? "rgba(15,23,42,0.28)"
    : "rgba(2,6,23,0.10)";
  const cardShadowHot = isDark
    ? "rgba(15,23,42,0.55)"
    : "rgba(2,6,23,0.18)";

  const cardBorderIdle = alpha(
    isDark ? "#334155" : theme.palette.divider,
    isDark ? 0.35 : 0.9
  );

  const cardBorderHot = alpha(accentColor, isDark ? 0.6 : 0.45);

  const mutedLabel = isDark
    ? alpha("#ffffff", 0.75)
    : alpha(theme.palette.text.secondary, 0.85);

  const featureText = isDark
    ? alpha("#ffffff", 0.85)
    : alpha(theme.palette.text.primary, 0.78);

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        color: pageText,
        py: { xs: 7, md: 9 },
        background: isDark
          ? "linear-gradient(180deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 60%, rgba(2,6,23,1) 100%)"
          : "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 60%, rgba(248,250,252,1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} textAlign="center" alignItems="center" sx={{ mb: 6 }}>
          {/* ✅ Top pill */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 2,
              py: 1,
              borderRadius: 0.5,
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              background: !isDark
                ? alpha('#ddddddff', 0.9)
                : alpha('#0000007c', 0.9),
              color: alpha(accentColor, 0.9),
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: 11,
              lineHeight: 1.3,
              width: 'fit-content',
              mx: { xs: 'auto', md: 0 },
            }}
          >
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Transparent Engagements
            </Box>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: 32, md: 42 },
              fontWeight: 800,
              color: pageText,
            }}
          >
            {resolvedHeroTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 720,
              color: heroDescColor,
              lineHeight: 1.7,
            }}
          >
            {resolvedHeroDescription}
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 4, md: 5 }}>
          {resolvedPlans.map((plan, index) => {
            const isHighlighted = index === highlightedIndex;

            return (
              <Grid item xs={12} md={4} key={plan.title}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    borderRadius: 0.5,
                    px: { xs: 4, md: 5 },
                    py: { xs: 5, md: 6 },

                    // ✅ card background
                    backgroundColor: isHighlighted
                      ? alpha(cardBaseBg, isDark ? 0.92 : 0.98)
                      : alpha(cardBaseBg, isDark ? 0.78 : 0.92),

                    // ✅ shadow
                    boxShadow: isHighlighted
                      ? `0 24px 60px ${cardShadowHot}`
                      : `0 16px 45px ${cardShadowBase}`,

                    // ✅ border
                    border: `1px solid ${isHighlighted ? cardBorderHot : cardBorderIdle
                      }`,

                    transform: isHighlighted
                      ? "translateY(-12px)"
                      : "translateY(0)",
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-16px) scale(1.01)",
                      boxShadow: isDark
                        ? "0 30px 65px rgba(15,23,42,0.6)"
                        : "0 30px 65px rgba(2,6,23,0.20)",
                    },
                  }}
                >
                  {isHighlighted && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 24,
                        right: 32,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 0.5,
                        background:
                          "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#fff",
                      }}
                    >
                      Most Popular
                    </Box>
                  )}

                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: 1.2,
                          color: mutedLabel,
                          fontWeight: 600,
                        }}
                      >
                        {plan.title}
                      </Typography>

                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: 36, md: 40 },
                          color: pageText,
                        }}
                      >
                        {plan.price}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: mutedLabel,
                          fontWeight: 500,
                        }}
                      >
                        {plan.cadence}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark
                          ? alpha("#ffffff", 0.82)
                          : alpha(theme.palette.text.secondary, 0.9),
                      }}
                    >
                      {plan.emphasis}
                    </Typography>

                    <List disablePadding sx={{ display: "grid", gap: 1 }}>
                      {plan.features.map((feature) => (
                        <ListItem
                          key={feature}
                          disableGutters
                          sx={{
                            display: "flex",
                            p: 0,
                            gap: 1.5,
                            alignItems: "flex-start",
                            color: featureText,
                            fontSize: 14,
                          }}
                        >
                          {feature}
                        </ListItem>
                      ))}
                    </List>

                    <AppButton
                      variant={isHighlighted ? "contained" : "outlined"}
                      color="inherit"
                      sx={{
                        mt: 2,
                        borderRadius: 0.5,
                        textTransform: "none",
                        fontWeight: 600,

                        borderColor: isHighlighted
                          ? "transparent"
                          : alpha(
                            isDark
                              ? theme.palette.common.white
                              : theme.palette.text.primary,
                            0.35
                          ),

                        color: isHighlighted
                          ? "#fff"
                          : isDark
                            ? "#fff"
                            : alpha(theme.palette.text.primary, 0.9),

                        background: isHighlighted
                          ? "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)"
                          : "transparent",

                        "&:hover": {
                          borderColor: isHighlighted
                            ? "transparent"
                            : alpha(
                              isDark
                                ? theme.palette.common.white
                                : theme.palette.text.primary,
                              0.55
                            ),
                          background: isHighlighted
                            ? "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)"
                            : alpha(
                              isDark
                                ? theme.palette.common.white
                                : theme.palette.text.primary,
                              isDark ? 0.12 : 0.06
                            ),
                        },
                      }}
                    >
                      Book Talent
                    </AppButton>
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default PricingModels;
