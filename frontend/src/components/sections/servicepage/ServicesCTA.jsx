// ServicesCTA.jsx ✅ (SINGLE FILE) — Category/Subcategory wise CTA
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Paper, Stack, Typography, alpha, useTheme, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../../shared/FormControls.jsx";
import { apiUrl } from "../../../utils/const.js";

/* ---------------- helpers ---------------- */
const norm = (v) => String(v ?? "").trim().toLowerCase();

const pickBestMatch = (list, category, subcategory) => {
  const c = norm(category);
  const s = norm(subcategory);

  if (!Array.isArray(list) || list.length === 0) return null;

  // exact category + subcategory
  if (c && s) {
    const exact = list.find(
      (it) => norm(it?.category) === c && norm(it?.subcategory) === s
    );
    if (exact) return exact;
  }

  // category only
  if (c) {
    const catOnly = list.find((it) => norm(it?.category) === c && !norm(it?.subcategory));
    if (catOnly) return catOnly;

    // if API stores subcategory but you only passed category, still allow any of that category
    const anyInCategory = list.find((it) => norm(it?.category) === c);
    if (anyInCategory) return anyInCategory;
  }

  // default item (no category & no subcategory)
  const def = list.find((it) => !norm(it?.category) && !norm(it?.subcategory));
  if (def) return def;

  // fallback
  return list[0];
};

const normalizeApiDataToList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") return [data];
  return [];
};

/* ---------------- component ---------------- */
const ServicesCTA = ({
  onContactClick,
  category,
  subcategory,
  // ✅ you can pass:
  // apiPath="/api/contact-buttons"
  // apiPath="/api/hire-developer/contact-buttons"
  apiPath = "/api/contact-buttons",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [ctaConfig, setCtaConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCtaConfig = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (subcategory) params.set("subcategory", subcategory);

      const requestPath = params.toString()
        ? `${apiPath}?${params.toString()}`
        : apiPath;

      const res = await fetch(apiUrl(requestPath));
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Unable to load contact CTA");

      const list = normalizeApiDataToList(json);

      // ✅ if API returns filtered list when query is passed, still safe:
      const best = pickBestMatch(list, category, subcategory);

      setCtaConfig(best);
    } catch (e) {
      console.error("Failed to load contact CTA", e);
      setCtaConfig(null);
    } finally {
      setLoading(false);
    }
  }, [apiPath, category, subcategory]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadCtaConfig();
    })();
    return () => {
      mounted = false;
    };
  }, [loadCtaConfig]);

  const backgroundImage = useMemo(() => {
    const img = ctaConfig?.image || ctaConfig?.backgroundImage || "";
    return typeof img === "string" ? img.trim() : "";
  }, [ctaConfig]);

  const title = ctaConfig?.title || "";
  const description = ctaConfig?.description || "";

  // Optional API fields (if available)
  const buttonText = ctaConfig?.buttonText || ctaConfig?.ctaText || "Contact Us";
  const buttonLink = ctaConfig?.buttonLink || ctaConfig?.ctaLink || ""; 

  const handleContactClick = () => {
    // if you have dialog open behavior
    onContactClick?.();

    // ✅ if API gives a link, use it
    if (buttonLink) {
      const link = String(buttonLink);
      const isExternal = /^https?:\/\//i.test(link);
      if (isExternal) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        navigate(link);
      }
      return;
    }

    // default fallback
    navigate("/contact");
  };

  return (
    <Box component="section" id="contact-section" sx={{ mt: { xs: 6, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 0.5,
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
          backgroundColor: "transparent",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: `1px solid ${alpha("#ffffff", isDark ? 0.1 : 0.35)}`,
        }}
      >
   
        {backgroundImage ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: alpha(isDark ? "#000" : "#fff", isDark ? 0.35 : 0.6),
              pointerEvents: "none",
            }}
          />
        ) : null}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          sx={{ position: "relative", zIndex: 1 }}
        >
          {/* Text block */}
          <Stack
            spacing={1.5}
            sx={{
              textAlign: "left",
              maxWidth: { xs: "100%", md: "70%" },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 22, md: 26 },
              }}
            >
              {loading ? " " : title}
            </Typography>

            {loading ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={18} />
                <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.75) }}>
                  Loading...
                </Typography>
              </Stack>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.78),
                  maxWidth: 620,
                }}
              >
                {description}
              </Typography>
            )}
          </Stack>

          {/* Button block */}
          <Box
            sx={{
              mt: { xs: 1, md: 0 },
              width: { xs: "100%", md: "auto" },
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <AppButton
              variant="contained"
              size="large"
              disabled={loading || (!title && !description)}
              onClick={handleContactClick}
              sx={{
                background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                color: "#fff",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 1.75 },
                width: { xs: "auto", md: "auto" },
              }}
            >
              {buttonText}
            </AppButton>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ServicesCTA;
