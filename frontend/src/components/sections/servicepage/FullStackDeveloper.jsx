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

// ✅ Always return clean highlight lines (NO * / - / •), UI will render dot (•)
const splitHighlightsFromDescription = (text) => {
  const raw = String(text || "").trim();
  if (!raw) return [];

  // split by new lines
  const lines = raw
    .replace(/\r/g, "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  // pick bullet-like lines first (*, -, •)
  const bulletLines = lines
    .map((l) => l.replace(/^(\*|-|•)\s+/, "").trim())
    .filter((l, i) => /^(\*|-|•)\s+/.test(lines[i]));

  // if bullets found, use them
  if (bulletLines.length) return bulletLines;

  // else: try splitting by "•" or "*"
  const chunks = raw
    .split(/(?:\n{2,}|•|\*)/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return chunks.slice(0, 10);
};

// Simple hook to detect when an element enters the viewport (animate once)
const useInViewOnce = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ don't depend on options object

  return [ref, inView];
};

function FullStackDeveloper({ onContactClick, category, subcategory, highlights, image }) {
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

        const response = await fetch(
          apiUrl(`/api/hire-services${params.toString() ? `?${params.toString()}` : ""}`)
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Unable to load hire services");
        if (!isMounted) return;

        const list = Array.isArray(data) ? data : [];

        // ✅ bind exact item by category/subcategory (fallback first item)
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

        // ✅ highlights priority:
        // 1) item.highlights array
        // 2) description bullets (* / - / • / new lines)
        const fromArr = Array.isArray(match?.highlights)
          ? match.highlights
              .map((x) => (typeof x === "string" ? x : x?.title || x?.text))
              .filter(Boolean)
          : [];

        const fromDesc = splitHighlightsFromDescription(match?.description);

        const finalHighlights = (fromArr.length ? fromArr : fromDesc)
          .map((s) => String(s).trim())
          .filter(Boolean);

        setApiHighlights(finalHighlights);
      } catch (error) {
        console.error("Failed to load hire services", error);
      }
    };

    loadHireServices();
    return () => {
      isMounted = false;
    };
  }, [category, subcategory]);

  const resolvedTitle = apiTitle || "FULL STACK DEVELOPMENT SERVICE";
  const resolvedDesc =
    apiDesc ||
    "From product discovery to secure deployments, our cross-functional engineers, designers, and architects unite every layer of the stack so your product ships faster and performs flawlessly.";

  const resolvedHighlights = useMemo(() => {
    if (Array.isArray(highlights) && highlights.length) return highlights;
    if (apiHighlights.length) return apiHighlights;
    return fullStackDeveloperHighlights;
  }, [apiHighlights, highlights]);

  const resolvedImage = image || apiImage || "";

  // ✅ normalize highlight strings (remove any leading bullets just in case)
  const cleanHighlights = useMemo(() => {
    return (resolvedHighlights || [])
      .map((h) => (typeof h === "string" ? h : h?.title || h?.text || ""))
      .map((s) => String(s).replace(/^(\*|-|•)\s+/, "").trim())
      .filter(Boolean);
  }, [resolvedHighlights]);

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
          {/* LEFT SIDE – TEXT */}
          <Grid
            item
            xs={12}
            md={6}
            ref={leftRef}
            sx={{
              opacity: leftInView ? 1 : 0,
              transform: leftInView ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <Stack spacing={2.5} alignItems={{ xs: "center", md: "flex-start" }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: 26, md: 36 },
                  fontWeight: 700,
                  color: isDark ? "#fff" : "#0f172a",
                  textAlign: { xs: "center", md: "left" },
                  textTransform: "uppercase",
                }}
              >
                {resolvedTitle}
              </Typography>

              <Divider sx={{ borderColor: dividerColor, width: { xs: "70%", md: "55%" } }} />

              <Typography
                variant="body1"
                sx={{
                  color: alpha(isDark ? "#fff" : "#0f172a", 0.85),
                  maxWidth: 520,
                  textAlign: { xs: "center", md: "left" },
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {resolvedDesc}
              </Typography>


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
                Hire Full Stack Expert
              </AppButton>
            </Stack>
          </Grid>

          {/* RIGHT SIDE – IMAGE */}
          <Grid
            item
            xs={12}
            md={6}
            ref={rightRef}
            sx={{
              opacity: rightInView ? 1 : 0,
              transform: rightInView ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: 0.5,
                overflow: "hidden",
                height: { xs: 260, md: 360 },
                background: resolvedImage
                  ? `url(${resolvedImage}) center / cover no-repeat`
                  : isDark
                  ? "linear-gradient(135deg, rgba(255,94,94,0.25), rgba(168,77,255,0.25))"
                  : "linear-gradient(135deg, rgba(255,94,94,0.18), rgba(33,150,243,0.18))",
                boxShadow: isDark
                  ? "0 30px 60px rgba(15,23,42,0.55)"
                  : "0 30px 60px rgba(15,23,42,0.18)",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: isDark
                    ? "0 36px 72px rgba(15,23,42,0.7)"
                    : "0 36px 72px rgba(15,23,42,0.24)",
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default FullStackDeveloper;
