import React, { useMemo } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import { AppButton } from "../../shared/FormControls.jsx";

const ServiceHero = ({
  categoryTitle = "Services",
  serviceName,
  heroTitle,
  heroDescription,
  backgroundImage,
  categoryHref = "/services",
  onContactClick,
  onRequestContact,
  contactAnchorId = "contact-section",
  stats = [],
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ✅ theme-aware colors for dark + light
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;

  const titleColor = isDark
    ? theme.palette.common.white
    : alpha(theme.palette.text.primary, 0.92);

  const descColor = isDark
    ? alpha(theme.palette.common.white, 0.82)
    : alpha(theme.palette.text.secondary, 0.9);

  const breadText = isDark
    ? alpha(theme.palette.common.white, 0.92)
    : alpha(theme.palette.text.primary, 0.78);

  const breadMuted = isDark
    ? alpha(theme.palette.common.white, 0.82)
    : alpha(theme.palette.text.secondary, 0.78);

  const breadSep = isDark
    ? alpha(theme.palette.common.white, 0.72)
    : alpha(theme.palette.text.primary, 0.35);

  const heroImage = useMemo(() => {
    const v = typeof backgroundImage === "string" ? backgroundImage.trim() : "";
    return v; // ✅ no fallback
  }, [backgroundImage]);

  const heroHasImage = Boolean(heroImage);

  const handleContactClick = () => {
    onRequestContact?.(serviceName || "");
    onContactClick?.();
    const anchor = document.getElementById(contactAnchorId);
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ breadcrumb link sx (so it looks same in both themes)
  const breadLinkSx = {
    color: breadText,
    fontWeight: 600,
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
    maxWidth: { xs: 220, sm: 320, md: 520 },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <Box
      component="section"
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
      {/* ✅ Static Background Wrapper (Image + Overlay) */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* ✅ Background Image OR fallback gradient */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: heroHasImage
              ? `url("${heroImage}")`
              : isDark
                ? "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 55%, rgba(2,6,23,1) 100%)"
                : "linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 55%, rgba(248,250,252,1) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.05)",
            filter: isDark ? "brightness(0.85)" : "brightness(0.92)",
            transition: "transform 0.6s ease, filter 0.6s ease",
          }}
        />

        {/* ✅ Overlay (dark/light) */}
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
                  rgba(241,245,249,0.92) 0%,
                  rgba(241,245,249,0.75) 40%,
                  rgba(241,245,249,0.35) 70%,
                  rgba(241,245,249,0) 100%
                )
              `,
          }}
        />

        {/* ✅ Optional: subtle top glow */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: isDark
              ? "radial-gradient(900px 500px at 15% 20%, rgba(103,232,249,0.12), transparent 60%)"
              : "radial-gradient(900px 500px at 15% 20%, rgba(168,85,247,0.10), transparent 60%)",
          }}
        />
      </Box>

      {/* Content */}
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, md: 20 },
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          rowSpacing={4}
        >
          {/* ✅ Breadcrumbs row */}
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Breadcrumbs
              separator={
                <NavigateNextIcon fontSize="small" sx={{ color: breadSep }} />
              }
              aria-label="breadcrumb"
              sx={{
                color: breadMuted,
                fontSize: { xs: 12, sm: 18 },
                "& .MuiBreadcrumbs-ol": {
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                },
                "& .MuiBreadcrumbs-li": {
                  display: "flex",
                  alignItems: "center",
                  minWidth: 0,
                },
                "& a, & p, & span": {
                  fontSize: { xs: 12, sm: 18 },
                  textAlign: { xs: "center", md: "left" },
                },
              }}
            >
              <MuiLink component={RouterLink} to="/" sx={breadLinkSx}>
                Home
              </MuiLink>

              <MuiLink component={RouterLink} to={categoryHref} sx={breadLinkSx}>
                {categoryTitle}
              </MuiLink>

              {serviceName ? (
                <Typography
                  sx={{
                    color: breadMuted,
                    maxWidth: { xs: 240, sm: 380, md: 620 },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={serviceName}
                >
                  {serviceName}
                </Typography>
              ) : null}
            </Breadcrumbs>
          </Grid>

          {/* Left Content */}
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
                  fontSize: { xs: 38, sm: 46, md: 56 },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: titleColor, // ✅ dark/light
                }}
              >
                {heroTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: descColor, // ✅ dark/light
                  maxWidth: 540,
                  lineHeight: 1.7,
                }}
              >
                {heroDescription}
              </Typography>

              <AppButton
                variant="contained"
                size="large"
                onClick={handleContactClick}
                sx={{
                  background:
                    "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
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
                Contact us
              </AppButton>

              {/* Stats */}
              {Array.isArray(stats) && stats.length > 0 ? (
                <Stack
                  pt={2}
                  width="100%"
                  alignItems={{ xs: "center", sm: "flex-start" }}
                >
                  <Stack
                    direction="row"
                    spacing={{ xs: 3, sm: 4 }}
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                    alignItems="center"
                    sx={{
                      width: "100%",
                      overflowX: { xs: "auto", sm: "visible" },
                      pb: { xs: 1, sm: 0 },
                      "&::-webkit-scrollbar": { height: 6 },
                      "&::-webkit-scrollbar-thumb": {
                        background: alpha(
                          isDark ? "#ffffff" : theme.palette.text.primary,
                          isDark ? 0.25 : 0.18
                        ),
                        borderRadius: 999,
                      },
                    }}
                  >
                    {stats.map((stat, idx) => (
                      <Stack
                        key={`${stat?.label || "stat"}-${idx}`}
                        spacing={0.5}
                        sx={{
                          minWidth: { xs: 110, sm: "auto" },
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontSize: { xs: 24, md: 30 },
                            fontWeight: 700,
                            color: accentColor,
                          }}
                        >
                          {stat?.value ?? ""}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: descColor, fontWeight: 500 }}
                        >
                          {stat?.label ?? ""}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ServiceHero;
