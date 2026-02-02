import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80";

const safeStr = (v) => String(v ?? "").trim();

const CaseStudyCard = ({ caseStudy = {} }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.9 : 0.75);

  // ✅ Normalize caseStudy safely (no undefined crashes)
  const normalized = useMemo(() => {
    const slug = safeStr(caseStudy?.slug);
    const title = safeStr(caseStudy?.title) || "Untitled Case Study";
    const category = safeStr(caseStudy?.category) || "Case Study";
    const summary = safeStr(caseStudy?.summary); // summary is optional now
    const heroImage = safeStr(caseStudy?.heroImage) || FALLBACK_IMAGE;

    const tags = Array.isArray(caseStudy?.tags)
      ? caseStudy.tags.map((t) => safeStr(t)).filter(Boolean)
      : [];

    const accentColor =
      safeStr(caseStudy?.accentColor) ||
      (isDark ? "#67e8f9" : theme.palette.primary.main);

    return { slug, title, category, summary, heroImage, tags, accentColor };
  }, [caseStudy, isDark, theme.palette.primary.main]);

  // ✅ If slug missing, avoid broken link (disable click)
  const isClickable = Boolean(normalized.slug);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 0.5,
        overflow: "hidden",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.6)}`,
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: isDark
            ? "0 18px 40px rgba(15,23,42,0.7)"
            : "0 18px 40px rgba(15,23,42,0.18)",
          borderColor: isDark ? "#67e8f9" : theme.palette.primary.main,
        },
      }}
    >
      <CardActionArea
        component={isClickable ? RouterLink : "div"}
        to={isClickable ? `/casestudy/${normalized.slug}` : undefined}
        sx={{
          height: "100%",
          cursor: isClickable ? "pointer" : "default",
        }}
      >
        {/* ---------- IMAGE ---------- */}
        <Box
          sx={{
            position: "relative",
            pt: "70%",
            backgroundImage: `url(${normalized.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                180deg,
                ${alpha("#0f172a", 0)} 0%,
                ${alpha("#0f172a", 0.85)} 100%
              )`,
            }}
          />

          {/* Category Badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              display: "inline-flex",
              alignItems: "center",
              px: 1.8,
              py: 0.8,
              borderRadius: 0.5,
              border: `1px solid ${alpha("#ffffff", 0.2)}`,
              background: isDark ? alpha("#000000", 0.5) : alpha("#e2e8f0", 0.85),
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              fontSize: 11,
              lineHeight: 1.3,
            }}
          >
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}
            >
              {normalized.category}
            </Box>
          </Box>
        </Box>

        {/* ---------- CONTENT ---------- */}
        <Stack spacing={2} sx={{ p: { xs: 3, md: 3.5 } }}>
          <Stack spacing={1}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textDecoration: "none",
                cursor: isClickable ? "pointer" : "default",
                transition: "color 0.3s ease, background-image 0.3s ease",
                "&:hover": {
                  ...(isClickable
                    ? {
                        color: "transparent",
                        backgroundImage:
                          "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : {}),
                },
              }}
            >
              {normalized.title}
            </Typography>

            {/* Summary / excerpt (optional) */}
            {normalized.summary ? (
              <Typography
                variant="body2"
                sx={{
                  color: subtleText,
                  lineHeight: 1.7,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {normalized.summary}
              </Typography>
            ) : null}
          </Stack>

          {/* ---------- TAGS ---------- */}
          {normalized.tags.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {normalized.tags.map((tag, index) => (
                <Box
                  key={`${tag}-${index}`}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.8,
                    py: 0.7,
                    borderRadius: 0.5,
                    border: `1px solid ${alpha("#ffffff", 0.15)}`,
                    background: isDark
                      ? alpha("#000000", 0.4)
                      : alpha("#e2e8f0", 0.75),
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    fontSize: 11,
                    lineHeight: 1.3,
                    width: "fit-content",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      background:
                        "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 700,
                    }}
                  >
                    {tag}
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </CardActionArea>
    </Card>
  );
};

CaseStudyCard.propTypes = {
  caseStudy: PropTypes.shape({
    slug: PropTypes.string, // ✅ optional now (if missing card becomes non-clickable)
    title: PropTypes.string,
    category: PropTypes.string, // ✅ optional now (fallback used)
    summary: PropTypes.string, // ✅ optional now
    heroImage: PropTypes.string, // ✅ optional now (fallback used)
    accentColor: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default CaseStudyCard;
