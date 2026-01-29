import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
  Divider,
} from "@mui/material";
import { AppButton } from "../../shared/FormControls.jsx";

import { fullStackDeveloperHighlights } from "../../../data/servicesPage.js";
import { apiUrl } from "../../../utils/const.js";

/* ---------------- helpers ---------------- */
const norm = (v) => String(v || "").trim().toLowerCase();
const safeStr = (v) => String(v ?? "").trim();

// ✅ Always return clean highlight lines (NO * / - / •)
const splitHighlightsFromDescription = (text) => {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const lines = raw
    .replace(/\r/g, "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const bulletLines = lines
    .map((l) => l.replace(/^(\*|-|•)\s+/, "").trim())
    .filter((_, i) => /^(\*|-|•)\s+/.test(lines[i]));

  if (bulletLines.length) return bulletLines;

  return raw
    .split(/(?:\n{2,}|•|\*)/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);
};

// Viewport animation hook
const useInViewOnce = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

function FullStackDeveloper({
  onContactClick,
  category,
  subcategory,
  highlights,
  image,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [apiTitle, setApiTitle] = useState("");
  const [apiDesc, setApiDesc] = useState("");
  const [apiHighlights, setApiHighlights] = useState([]);
  const [apiImage, setApiImage] = useState("");

  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);

  const [leftRef, leftInView] = useInViewOnce();
  const [rightRef, rightInView] = useInViewOnce();

  useEffect(() => {
    let isMounted = true;

    const loadHireServices = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (subcategory) params.append("subcategory", subcategory);

        const res = await fetch(
          apiUrl(`/api/hire-services${params.toString() ? `?${params}` : ""}`)
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error);

        if (!isMounted) return;

        const list = Array.isArray(data) ? data : [];

        const match =
          list.find((it) => {
            const cOk = category ? norm(it?.category) === norm(category) : true;
            const sOk = subcategory
              ? norm(it?.subcategory) === norm(subcategory)
              : true;
            return cOk && sOk;
          }) || list[0];

        if (!match) return;

        setApiTitle(match?.title || "");
        setApiDesc(match?.description || "");
        setApiImage(match?.image || "");

        const fromArr = Array.isArray(match?.highlights)
          ? match.highlights
              .map((x) => (typeof x === "string" ? x : x?.title || x?.text))
              .filter(Boolean)
          : [];

        const fromDesc = splitHighlightsFromDescription(match?.description);

        setApiHighlights(fromArr.length ? fromArr : fromDesc);
      } catch (e) {
        console.error("Hire services load failed:", e);
      }
    };

    loadHireServices();
    return () => {
      isMounted = false;
    };
  }, [category, subcategory]);

  /* ❌ STATIC REMOVED */
  const resolvedTitle = apiTitle;
  const resolvedDesc = apiDesc;

  const resolvedHighlights = useMemo(() => {
    if (Array.isArray(highlights) && highlights.length) return highlights;
    if (apiHighlights.length) return apiHighlights;
    return fullStackDeveloperHighlights;
  }, [apiHighlights, highlights]);

  const resolvedImage = image || apiImage || "";

  const hireButtonText = useMemo(() => {
    const c = safeStr(category);
    const s = safeStr(subcategory);
    if (c && s) return `Hire ${s} Expert`;
    if (c) return `Hire ${c} Expert`;
    return "Hire Expert";
  }, [category, subcategory]);

  // ⛔ if API sends nothing, don't render block
  if (!resolvedTitle && !resolvedDesc && !resolvedImage) return null;

  return (
    <Box component="section">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0.5,
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.8))"
            : "linear-gradient(135deg, rgba(250,250,255,0.98), rgba(191,219,254,0.95))",
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.35 : 0.4)}`,
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* LEFT */}
          <Grid
            item
            xs={12}
            md={6}
            ref={leftRef}
            sx={{
              opacity: leftInView ? 1 : 0,
              transform: leftInView ? "none" : "translateX(-40px)",
              transition: "all .7s ease",
            }}
          >
            <Stack spacing={2.5}>
              {!!resolvedTitle && (
                <Typography variant="h3" fontWeight={700}>
                  {resolvedTitle}
                </Typography>
              )}

              <Divider sx={{ borderColor: dividerColor, width: "55%" }} />

              {!!resolvedDesc && (
                <Typography
                  sx={{
                    color: alpha(isDark ? "#fff" : "#0f172a", 0.85),
                    lineHeight: 1.7,
                    whiteSpace: "pre-line",
                  }}
                >
                  {resolvedDesc}
                </Typography>
              )}

              <AppButton
                variant="contained"
                size="large"
                onClick={onContactClick}
                sx={{
                  alignSelf: { xs: "center", md: "flex-start" },
                  background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 1.75 },
                  boxShadow: "0 18px 35px rgba(15,23,42,0.35)",
                 
                }}
              >
                {hireButtonText}
              </AppButton>

              
            </Stack>
          </Grid>

          {/* RIGHT */}
          <Grid
            item
            xs={12}
            md={6}
            ref={rightRef}
            sx={{
              opacity: rightInView ? 1 : 0,
              transform: rightInView ? "none" : "translateX(40px)",
              transition: "all .7s ease",
            }}
          >
            <Box
              sx={{
                height: { xs: 260, md: 360 },
                borderRadius: 0.5,
                background: resolvedImage
                  ? `url(${resolvedImage}) center/cover`
                  : "transparent",
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default FullStackDeveloper;
