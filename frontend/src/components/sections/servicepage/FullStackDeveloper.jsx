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

import { apiUrl } from "../../../utils/const.js";


const norm = (v) => String(v || "").trim().toLowerCase();
const safeStr = (v) => String(v ?? "").trim();

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

/** ✅ normalize any backend shape into an array */
const normalizeHireServicesResponse = (data) => {
  if (Array.isArray(data)) return data;

  // common wrappers
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.hireServices)) return data.hireServices;
  if (Array.isArray(data?.services)) return data.services;

  // single object
  if (data?.hireService && typeof data.hireService === "object")
    return [data.hireService];
  if (data && typeof data === "object") return [data];

  return [];
};

function FullStackDeveloper({
  onContactClick,
  category,
  subcategory,
  highlights,
  image,
  title,
  description,
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
    const controller = new AbortController();

    const loadHireServices = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (subcategory) params.append("subcategory", subcategory);

        const url = `/api/hire-services${params.toString() ? `?${params.toString()}` : ""}`;

        const res = await fetch(apiUrl(url), { signal: controller.signal });
        const data = await res.json().catch(() => null);

        if (!res.ok) throw new Error(data?.error || "Failed to load hire-services");

        const list = normalizeHireServicesResponse(data);

        const match =
          list.find((it) => {
            const cOk = category ? norm(it?.category) === norm(category) : true;
            const sOk = subcategory ? norm(it?.subcategory) === norm(subcategory) : true;
            return cOk && sOk;
          }) || list[0];

        if (!match) return;

        setApiTitle(match?.title || "");
        setApiDesc(match?.description || "");
        setApiImage(match?.image || "");

        const fromArr = Array.isArray(match?.highlights)
          ? match.highlights
              .map((x) => (typeof x === "string" ? x : x?.title || x?.text))
              .map((x) => String(x || "").trim())
              .filter(Boolean)
          : [];

        const fromDesc = splitHighlightsFromDescription(match?.description);

        setApiHighlights(fromArr.length ? fromArr : fromDesc);
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.error("Hire services load failed:", e);
      }
    };

    loadHireServices();
    return () => controller.abort();
  }, [category, subcategory]);

  const resolvedTitle = safeStr(apiTitle) || safeStr(title);
  const resolvedDesc = safeStr(apiDesc) || safeStr(description);

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

  const hasAnyContent =
    !!resolvedTitle || !!resolvedDesc || !!resolvedImage || resolvedHighlights.length > 0;
  if (!hasAnyContent) return null;

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
                  : alpha(theme.palette.background.paper, isDark ? 0.15 : 0.7),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.3 : 0.35)}`,
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default FullStackDeveloper;
