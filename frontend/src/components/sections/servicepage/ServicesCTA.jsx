// ServicesCTA.jsx ✅ (SINGLE FILE) — Category/Subcategory wise CTA (with bullet formatting like your image)
// ✅ Removed CircularProgress loading block

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
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
    const catOnly = list.find(
      (it) => norm(it?.category) === c && !norm(it?.subcategory)
    );
    if (catOnly) return catOnly;

    // allow any within category
    const anyInCategory = list.find((it) => norm(it?.category) === c);
    if (anyInCategory) return anyInCategory;
  }

  // default item
  const def = list.find((it) => !norm(it?.category) && !norm(it?.subcategory));
  if (def) return def;

  return list[0];
};

const normalizeApiDataToList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") return [data];
  return [];
};

const looksLikeHtml = (s) =>
  typeof s === "string" && /<\/?[a-z][\s\S]*>/i.test(s);

const parseDescription = (text) => {
  const raw = String(text || "");
  if (!raw.trim()) return { paragraphs: "", bullets: [] };

  const lines = raw.replace(/\r/g, "").split("\n");
  const isBullet = (line) => /^(\s*)(\*|-|•)\s+/.test(line);

  const bulletLines = [];
  const paraLines = [];

  for (const ln of lines) {
    if (isBullet(ln)) {
      bulletLines.push(ln.replace(/^(\s*)(\*|-|•)\s+/, "").trim());
    } else {
      paraLines.push(ln);
    }
  }

  const paragraphs = paraLines.join("\n").trim();
  const bullets = bulletLines.filter(Boolean);

  return { paragraphs, bullets };
};

/* ---------------- component ---------------- */
const ServicesCTA = ({
  onContactClick,
  category,
  subcategory,
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

  const buttonText = ctaConfig?.buttonText || ctaConfig?.ctaText || "Contact Us";
  const buttonLink = ctaConfig?.buttonLink || ctaConfig?.ctaLink || "";

  const { paragraphs, bullets } = useMemo(() => {
    if (looksLikeHtml(description)) return { paragraphs: "", bullets: [] };
    return parseDescription(description);
  }, [description]);

  const handleContactClick = () => {
    onContactClick?.();

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

    navigate("/contact");
  };

  const hasContent = Boolean(title || description);

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
        {/* overlay */}
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
              maxWidth: { xs: "100%", md: "72%" },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 22, md: 26 },
                minHeight: 32, // keeps layout stable even while loading
              }}
            >
              {loading ? " " : title}
            </Typography>

            {/* ✅ Removed CircularProgress block */}
            {!loading ? (
              <Box>
                {looksLikeHtml(description) ? (
                  <Box
                    sx={{
                      color: alpha(theme.palette.text.primary, 0.78),
                      "& p": { m: 0, mb: 1.25 },
                      "& ul, & ol": { m: 0, pl: 2.5 },
                      "& li": { mb: 0.5 },
                    }}
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <>
                    {paragraphs ? (
                      <Typography
                        variant="body1"
                        sx={{
                          color: alpha(theme.palette.text.primary, 0.78),
                          maxWidth: 760,
                          whiteSpace: "pre-line",
                          lineHeight: 1.6,
                        }}
                      >
                        {paragraphs}
                      </Typography>
                    ) : null}

                    {bullets?.length ? (
                      <Stack sx={{ mt: paragraphs ? 2 : 0.5 }} spacing={0.6}>
                        {bullets.map((b, idx) => (
                          <Typography
                            key={`${idx}-${b}`}
                            variant="body1"
                            sx={{
                              color: alpha(theme.palette.text.primary, 0.85),
                              lineHeight: 1.55,
                            }}
                          >
                            {"* "}
                            {b}
                          </Typography>
                        ))}
                      </Stack>
                    ) : null}
                  </>
                )}
              </Box>
            ) : (
              // optional: keep height stable without showing loader text
              <Box sx={{ minHeight: 44 }} />
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
              disabled={loading || !hasContent}
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
