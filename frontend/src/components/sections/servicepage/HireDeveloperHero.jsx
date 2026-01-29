import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import {
  alpha,
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { AppButton } from "../../shared/FormControls.jsx";

const HireDeveloperHero = ({
  category,
  role,
  stats = [],
  onContactClick,
  dividerColor,
  heroTitle,
  heroDescription,
  categoryHref = "/hire-developers",

  // ✅ optional: pass hero image directly if you want
  heroImage: heroImageProp,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha("#ffffff", 0.8);

  const borderColor = useMemo(
    () => dividerColor ?? alpha(theme.palette.divider, isDark ? 0.4 : 0.25),
    [dividerColor, isDark, theme.palette.divider]
  );

  const categoryTitle = category?.title ?? category?.name ?? "Services";
  const serviceName = role?.name ?? role?.title;

  const resolvedHeroTitle =
    heroTitle || role?.heroTitle || role?.name || role?.title || "Full Stack Development Services";

  const resolvedHeroDescription =
    heroDescription ||
    role?.heroDescription ||
    category?.description ||
    `VedX Solutions offers full stack development services to help
achieve your business objectives across platforms. Our agile
squads deliver resilient, scalable solutions with zero disruption
to your operations.`;

  // ✅ Resolve hero image (you can adjust these keys as per your API)
  const heroImage =
    heroImageProp ||
    role?.heroImage ||
    role?.image ||
    role?.banner ||
    role?.hero?.image ||
    category?.heroImage ||
    category?.image ||
    "";

  const heroHasImage = Boolean(String(heroImage || "").trim());

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

      {/* Optional: subtle top glow */}
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
              separator={<NavigateNextIcon fontSize="small" sx={{ color: alpha("#fff", 0.75) }} />}
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

              {serviceName && (
                <Typography sx={{ color: alpha("#fff", 0.85) }}>{serviceName}</Typography>
              )}
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
                {resolvedHeroTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  maxWidth: 540,
                  lineHeight: 1.7,
                }}
              >
                {resolvedHeroDescription}
              </Typography>

              <AppButton
                variant="contained"
                size="large"
                onClick={onContactClick}
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

              {/* Divider line (optional) */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  height: 1,
                  bgcolor: borderColor,
                }}
              />

              {/* Stats */}
              {stats.length > 0 && (
                <Stack pt={0} width="100%" alignItems={{ xs: "center", sm: "flex-start" }}>
                  <Stack
                    direction="row"
                    spacing={{ xs: 3, sm: 4 }}
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                    alignItems="center"
                    sx={{
                      width: "100%",
                      overflowX: { xs: "auto", sm: "visible" },
                      pb: { xs: 1, sm: 0 },
                    }}
                  >
                    {stats.map((stat) => (
                      <Stack
                        key={stat.label}
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
                          {stat.value}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: subtleText, fontWeight: 500 }}
                        >
                          {stat.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Grid>

          {/* Right side space (optional) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }} />
        </Grid>
      </Container>
    </Box>
  );
};

export default HireDeveloperHero;
