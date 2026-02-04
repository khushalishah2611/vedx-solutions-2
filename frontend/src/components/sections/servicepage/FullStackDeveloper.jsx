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
  CircularProgress,
} from "@mui/material";
import { AppButton } from "../../shared/FormControls.jsx";
import { apiUrl } from "../../../utils/const.js";

const norm = (v) => String(v || "").trim().toLowerCase();
const safeStr = (v) => String(v ?? "").trim();

/** ✅ Works if apiUrl is string OR function */
const buildApiUrl = (path = "") => {
  const p = String(path || "");

  // apiUrl function (your current style)
  if (typeof apiUrl === "function") return apiUrl(p);

  // apiUrl string base URL (common style)
  const base = String(apiUrl || "").replace(/\/+$/, "");
  const clean = p.startsWith("/") ? p : `/${p}`;
  return `${base}${clean}`;
};

/** ✅ make image absolute if backend gives relative path */
const toAbsMaybe = (url) => {
  const u = safeStr(url);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("data:")) return u;
  return buildApiUrl(u.startsWith("/") ? u : `/${u}`);
};

/** ✅ Removed bullet parsing logic as requested */
const splitHighlightsFromDescription = (text) => {
  const raw = String(text || "").trim();
  if (!raw) return [];

  return raw
    .replace(/\r/g, "")
    .split(/(?:\n{2,})/g) // split by paragraph breaks
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

/** ✅ normalize any backend response into an array */
const normalizeHireServicesResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  const root =
    data?.data && typeof data.data === "object" && !Array.isArray(data.data)
      ? data.data
      : data;

  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.results)) return root.results;
  if (Array.isArray(root?.hireServices)) return root.hireServices;
  if (Array.isArray(root?.services)) return root.services;

  if (root?.hireService && typeof root.hireService === "object")
    return [root.hireService];

  if (typeof root === "object") return [root];
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
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);

  const [apiTitle, setApiTitle] = useState("");
  const [apiDesc, setApiDesc] = useState("");
  const [apiHighlights, setApiHighlights] = useState([]);
  const [apiImage, setApiImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [leftRef, leftInView] = useInViewOnce();
  const [rightRef, rightInView] = useInViewOnce();

  const requestIdRef = useRef(0);

  useEffect(() => {
    let isActive = true;
    const requestId = ++requestIdRef.current;

    const loadHireServices = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (subcategory) params.append("subcategory", subcategory);

        const url = `/api/hire-services${
          params.toString() ? `?${params.toString()}` : ""
        }`;

        const res = await fetch(buildApiUrl(url));

        // if server returns non-json sometimes, handle safely
        const text = await res.text();
        const json = (() => {
          try {
            return text ? JSON.parse(text) : null;
          } catch {
            return null;
          }
        })();

        if (!res.ok) {
          throw new Error(
            json?.error || json?.message || `Failed to load hire-services (${res.status})`
          );
        }

        const list = normalizeHireServicesResponse(json);

        const match =
          list.find((it) => {
            const cOk = category ? norm(it?.category) === norm(category) : true;
            const sOk = subcategory
              ? norm(it?.subcategory) === norm(subcategory)
              : true;
            return cOk && sOk;
          }) || list[0];

        if (!isActive || requestId !== requestIdRef.current) return;

        if (!match) {
          setError("No matching hire-service found.");
          return;
        }

        setApiTitle(safeStr(match?.title));
        setApiDesc(safeStr(match?.description));
        setApiImage(safeStr(match?.image));

        const fromArr = Array.isArray(match?.highlights)
          ? match.highlights
              .map((x) => (typeof x === "string" ? x : x?.title || x?.text))
              .map((x) => safeStr(x))
              .filter(Boolean)
          : [];

        const fromDesc = splitHighlightsFromDescription(match?.description);

        setApiHighlights(fromArr.length ? fromArr : fromDesc);
      } catch (e) {
        if (!isActive || requestId !== requestIdRef.current) return;
        console.error("Hire services load failed:", e);
        setError(e?.message || "Something went wrong");
      } finally {
        if (isActive && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    loadHireServices();
    return () => {
      isActive = false;
    };
  }, [category, subcategory]);

  // ✅ resolved content (API first, then props fallback)
  const resolvedTitle = safeStr(apiTitle) || safeStr(title);
  const resolvedDesc = safeStr(apiDesc) || safeStr(description);

  const resolvedHighlights = useMemo(() => {
    if (Array.isArray(highlights) && highlights.length) return highlights;
    if (apiHighlights.length) return apiHighlights;
    return [];
  }, [apiHighlights, highlights]);

  const resolvedImage = useMemo(() => {
    const raw = image || apiImage || "";
    return toAbsMaybe(raw);
  }, [image, apiImage]);

  const hireButtonText = useMemo(() => {
    const c = safeStr(category);
    const s = safeStr(subcategory);
    if (c && s) return `Hire ${s} Expert`;
    if (c) return `Hire ${c} Expert`;
    return "Hire Expert";
  }, [category, subcategory]);

  const hasAnyContent =
    !!resolvedTitle ||
    !!resolvedDesc ||
    !!resolvedImage ||
    resolvedHighlights.length > 0;

  // ✅ Loader
  if (!hasAnyContent && loading) {
    return (
      <Box component="section" sx={{ py: 4 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 180 }}>
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  // ✅ Show error instead of blank
  if (!hasAnyContent && error) {
    return (
      <Box component="section" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
          }}
        >
          <Typography fontWeight={700}>Section load failed</Typography>
          <Typography sx={{ mt: 0.5, color: "error.main" }}>{error}</Typography>
        </Paper>
      </Box>
    );
  }

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

              {/* (Optional) If you want highlights to show, uncomment this
              {!!resolvedHighlights.length && (
                <Stack spacing={1}>
                  {resolvedHighlights.map((h, i) => (
                    <Typography key={i} sx={{ color: alpha("#fff", isDark ? 0.85 : 0.75) }}>
                      • {safeStr(h)}
                    </Typography>
                  ))}
                </Stack>
              )}
              */}

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
