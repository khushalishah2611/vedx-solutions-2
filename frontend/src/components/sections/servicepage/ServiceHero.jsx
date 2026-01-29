

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
  stats = [], // [{ label, value }]
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.75);
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;

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
      {/* Background Image (or gradient if no image) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: heroHasImage
            ? `url("${heroImage}")`
            : "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 50%, rgba(2,6,23,1) 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: "scale(1.05)",
          filter: isDark ? "brightness(0.85)" : "brightness(0.7)",
          transition: "transform 0.6s ease, filter 0.6s ease",
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: isDark
            ? "linear-gradient(90deg, rgba(5,9,18,0.85) 0%, rgba(5,9,18,0.65) 40%, rgba(5,9,18,0.2) 70%, rgba(5,9,18,0) 100%)"
            : "linear-gradient(90deg, rgba(241,245,249,0.9) 0%, rgba(241,245,249,0.7) 40%, rgba(241,245,249,0.3) 70%, rgba(241,245,249,0) 100%)",
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
        <Grid container alignItems="center" justifyContent="space-between" rowSpacing={4}>
          {/* Breadcrumbs row */}
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
                <NavigateNextIcon fontSize="small" sx={{ color: alpha("#fff", 0.75) }} />
              }
              aria-label="breadcrumb"
              sx={{
                color: alpha("#fff", 0.85),
                fontSize: { xs: 12, sm: 18 },
                "& .MuiBreadcrumbs-ol": {
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                },
                "& .MuiBreadcrumbs-li": {
                  display: "flex",
                  alignItems: "center",
                },
                "& a, & p": {
                  fontSize: { xs: 12, sm: 18 },
                  textAlign: { xs: "center", md: "left" },
                },
              }}
            >
              <MuiLink component={RouterLink} underline="hover" color="#fff" to="/">
                Home
              </MuiLink>

              <MuiLink component={RouterLink} underline="hover" color="#fff" to={categoryHref}>
                {categoryTitle}
              </MuiLink>

              {serviceName ? (
                <Typography sx={{ color: alpha("#fff", 0.85) }}>{serviceName}</Typography>
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
                  color: "#fff",
                }}
              >
                {heroTitle || "Full Stack Development Services"}
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: subtleText, maxWidth: 540, lineHeight: 1.7 }}
              >
                {heroDescription ||
                  `VedX Solutions offers full stack development services to help
achieve your business objectives across platforms. Our agile
squads deliver resilient, scalable solutions with zero disruption
to your operations.`}
              </Typography>

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
                    background: "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                  },
                }}
              >
                Contact us
              </AppButton>

              {/* Stats */}
              {Array.isArray(stats) && stats.length > 0 ? (
                <Stack pt={2} width="100%" alignItems={{ xs: "center", sm: "flex-start" }}>
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
                        background: alpha("#fff", 0.25),
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
                          sx={{ color: subtleText, fontWeight: 500 }}
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
