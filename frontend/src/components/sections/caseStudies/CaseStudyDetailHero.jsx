import PropTypes from "prop-types";
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { AppButton } from "../../shared/FormControls.jsx";

const CONTACT_ROUTE = "/contact";
const CASE_STUDIES_ROUTE = "/case-studies";

const BreadcrumbLink = ({ to, children }) => (
  <MuiLink
    component={RouterLink}
    to={to}
    underline="none"
    sx={{
      color: alpha("#fff", 0.9),
      fontWeight: 500,
      "&:hover": { color: "#fff", textDecoration: "underline" },
    }}
  >
    {children}
  </MuiLink>
);

BreadcrumbLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const CaseStudyDetailHero = ({ caseStudy }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ✅ only bind from API/data (no fallback strings)
  const heroTitle = caseStudy?.heroTitle || caseStudy?.title || "";
  const heroDescription = caseStudy?.heroDescription || caseStudy?.excerpt || "";

  const heroImage = (caseStudy?.heroImage || "").trim();
  const heroHasImage = Boolean(heroImage);

  // optional details route (kept for future use)
  const slugOrId = caseStudy?.slug || caseStudy?.id;
  const detailsRoute = slugOrId ? `${CASE_STUDIES_ROUTE}/${slugOrId}` : null;

  const resolvedBreadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Case Studies", href: CASE_STUDIES_ROUTE },
    {
      label: caseStudy?.title || "Details",
      href: null,
      // if you want clickable current page later:
      // href: detailsRoute,
    },
  ];

  // ✅ CTA label from API else minimal fallback
  const ctaLabel = caseStudy?.cta?.label || "Contact Us";

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
      {/* ✅ Background Image (absolute) - only if exists */}
      {heroHasImage && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.05)",
            filter: isDark ? "brightness(0.85)" : "brightness(0.7)",
          }}
        />
      )}

      {/* ✅ Overlay (absolute) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: isDark
            ? `linear-gradient(90deg, rgba(5,9,18,0.85) 0%, rgba(5,9,18,0.65) 40%, rgba(5,9,18,0.2) 70%, rgba(5,9,18,0) 100%)`
            : `linear-gradient(90deg, rgba(241,245,249,0.9) 0%, rgba(241,245,249,0.7) 40%, rgba(241,245,249,0.3) 70%, rgba(241,245,249,0) 100%)`,
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 2.5, sm: 3, md: 16, lg: 20 },
        }}
      >
        {/* ✅ Breadcrumbs bar */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: { xs: 1.25, sm: 1.5 },
            py: 0.75,
            mb: { xs: 2.5, md: 3.5 },
            maxWidth: "100%",
          }}
        >
          <Breadcrumbs
            separator={
              <NavigateNextIcon
                fontSize="small"
                sx={{ color: alpha("#e2e8f0", 0.9) }}
              />
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
                minWidth: 0,
              },
              "& a, & p, & span": {
                fontSize: { xs: 12, sm: 18 },
                textAlign: { xs: "center", md: "left" },
              },
            }}
          >
            {resolvedBreadcrumbs.map((crumb, idx) => {
              const isLast = idx === resolvedBreadcrumbs.length - 1;
              const label = crumb?.label ?? "";

              if (!isLast && crumb?.href) {
                return (
                  <Box
                    key={`${label}-${idx}`}
                    sx={{
                      minWidth: 0,
                      maxWidth: { xs: 220, sm: 320, md: 520 },
                    }}
                  >
                    <BreadcrumbLink to={crumb.href}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: 12, sm: 18 },
                          lineHeight: 1.35,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {label}
                      </Typography>
                    </BreadcrumbLink>
                  </Box>
                );
              }

              // last crumb -> text
              if (!crumb?.href) {
                return (
                  <Typography
                    key={`${label}-${idx}`}
                    sx={{
                      color: alpha("#fff", 0.78),
                      fontSize: { xs: 12, sm: 18 },
                      lineHeight: 1.35,
                      maxWidth: { xs: 240, sm: 380, md: 620 },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={label}
                  >
                    {label}
                  </Typography>
                );
              }

              return (
                <BreadcrumbLink key={`${label}-${idx}`} to={crumb.href}>
                  <Typography
                    component="span"
                    sx={{
                      color: alpha("#fff", 0.78),
                      fontSize: { xs: 12, sm: 18 },
                      lineHeight: 1.35,
                      maxWidth: { xs: 240, sm: 380, md: 620 },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={label}
                  >
                    {label}
                  </Typography>
                </BreadcrumbLink>
              );
            })}
          </Breadcrumbs>
        </Box>

        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          rowSpacing={4}
        >
          <Grid item xs={12} md={7} lg={6}>
            <Stack
              spacing={3.2}
              sx={{
                textAlign: { xs: "center", md: "left" },
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              {!!caseStudy?.category && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 2,
                    py: 0.9,
                    borderRadius: 999,
                    border: `1px solid ${alpha("#ffffff", 0.14)}`,
                    background: alpha("#0b1220", isDark ? 0.35 : 0.22),
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      background:
                        "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {caseStudy.category}
                  </Typography>
                </Box>
              )}

              {/* ✅ only show title if available */}
              {!!heroTitle && (
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: 28, sm: 38, md: 54 },
                    fontWeight: 900,
                    lineHeight: 1.08,
                    color: "#fff",
                  }}
                >
                  {heroTitle}
                </Typography>
              )}

              {/* ✅ only show description if available */}
              {!!heroDescription && (
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha("#fff", 0.82),
                    maxWidth: 620,
                    lineHeight: 1.75,
                    fontSize: { xs: 14.5, sm: 16, md: 16.5 },
                  }}
                >
                  {heroDescription}
                </Typography>
              )}

              {/* ✅ CTA always -> /contact */}
              <AppButton
                variant="contained"
                size="large"
                component={RouterLink}
                to={CONTACT_ROUTE}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  px: { xs: 3.5, md: 5.5 },
                  py: { xs: 1.3, md: 1.6 },
                  boxShadow: `0 14px 40px ${alpha("#000", 0.28)}`,
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                  },
                }}
              >
                {ctaLabel}
              </AppButton>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5} lg={6} />
        </Grid>
      </Container>
    </Box>
  );
};

CaseStudyDetailHero.propTypes = {
  caseStudy: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    heroTitle: PropTypes.string,
    heroDescription: PropTypes.string,
    category: PropTypes.string,
    excerpt: PropTypes.string,
    heroImage: PropTypes.string,
    accentColor: PropTypes.string,
    cta: PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string,
    }),
  }),
};

export default CaseStudyDetailHero;
