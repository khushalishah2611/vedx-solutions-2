import React, { useEffect, useRef, useState } from "react";
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

// --- HELPER FUNCTIONS ---
const norm = (v) => String(v || "").trim().toLowerCase();
const safeStr = (v) => String(v ?? "").trim();

const isHttpUrl = (value) => /^https?:\/\//i.test(value);
const isDataUrl = (value) => value.startsWith("data:");
const toAbsMaybe = (url) => {
  const raw = safeStr(url);
  if (!raw) return "";
  if (isHttpUrl(raw) || isDataUrl(raw)) return raw;
  return typeof apiUrl === "function" ? apiUrl(raw) : raw;
};

const splitHighlightsFromDescription = (text) => {
  const raw = String(text || "").trim();
  if (!raw) return [];
  return raw
    .replace(/\r/g, "")
    .split(/(?:\n{2,})/g)
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

const normalizeHireServicesResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const root = data?.data && typeof data.data === "object" && !Array.isArray(data.data) ? data.data : data;
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.results)) return root.results;
  if (Array.isArray(root?.hireServices)) return root.hireServices;
  if (Array.isArray(root?.services)) return root.services;
  if (typeof root === "object") return [root];
  return [];
};

// --- MAIN COMPONENT ---
function FullStackDeveloper({
  onContactClick,
  category,
  subcategory,
  image,
  title,
  description,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);

  const [apiData, setApiData] = useState({ title: "", description: "", image: "", highlights: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [leftRef, leftInView] = useInViewOnce();
  const [rightRef, rightInView] = useInViewOnce();
  const requestIdRef = useRef(0);

  useEffect(() => {
    let isActive = true;
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    const loadHireServices = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (subcategory) params.append("subcategory", subcategory);

        const url = `/api/hire-services${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(apiUrl(url), { signal: controller.signal });
        
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const json = await res.json();
        const list = normalizeHireServicesResponse(json);

        const match = list.find((it) => {
          const cOk = category ? norm(it?.category) === norm(category) : true;
          const sOk = subcategory ? norm(it?.subcategory) === norm(subcategory) : true;
          return cOk && sOk;
        }) || list[0];

        if (isActive && requestId === requestIdRef.current && match) {
          setApiData({
            title: safeStr(match?.title),
            description: safeStr(match?.description),
            image: safeStr(match?.image),
            highlights: Array.isArray(match?.highlights) 
              ? match.highlights 
              : splitHighlightsFromDescription(match?.description)
          });
        }
      } catch (e) {
        if (isActive && e.name !== "AbortError") {
          console.error("Fetch Error:", e);
          setError(e.message || "Unable to load service details.");
        }
      } finally {
        if (isActive && requestId === requestIdRef.current) setLoading(false);
      }
    };

    loadHireServices();
    return () => { 
      isActive = false; 
      controller.abort();
    };
  }, [category, subcategory]);

  // ડેટા બાઈન્ડિંગ લોજિક (API ડેટા પહેલા, પછી Props)
  const resolvedTitle = apiData.title || title;
  const resolvedDesc = apiData.description || description;
  const resolvedImage = toAbsMaybe(apiData.image || image);

  // લોડિંગ સ્ટેટ
  if (loading && !resolvedTitle) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          border: `1px solid ${dividerColor}`,
          p: { xs: 4, md: 8 },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* LEFT CONTENT */}
          <Grid
            item xs={12} md={6}
            ref={leftRef}
            sx={{
              opacity: leftInView ? 1 : 0,
              transform: leftInView ? "none" : "translateY(20px)",
              transition: "all 0.8s ease-out",
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h3" fontWeight={800} sx={{ color: theme.palette.text.primary }}>
                {resolvedTitle || "Service Title"}
              </Typography>
              
              <Divider sx={{ width: "80px", height: "4px", bgcolor: "primary.main", borderRadius: 2 }} />

              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, whiteSpace: "pre-line", fontSize: "1.1rem" }}>
                {resolvedDesc || "No description provided for this service."}
              </Typography>
              {error ? (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              ) : null}

              <AppButton
                variant="contained"
                onClick={onContactClick}
                sx={{
                  width: "fit-content",
                  background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
                  px: 4, py: 1.5, borderRadius: "10px",
                  fontWeight: 600,
                  textTransform: "none"
                }}
              >
                Hire {subcategory || category || "Expert"}
              </AppButton>
            </Stack>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid item xs={12} md={6} ref={rightRef}
            sx={{
              opacity: rightInView ? 1 : 0,
              transform: rightInView ? "none" : "scale(0.9)",
              transition: "all 0.8s ease-out",
            }}
          >
            {resolvedImage ? (
              <Box
                component="img"
                src={resolvedImage}
                alt={resolvedTitle}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 450,
                  borderRadius: 4,
                  boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.5)" : "0 20px 40px rgba(0,0,0,0.1)",
                  objectFit: "cover"
                }}
              />
            ) : (
              <Box sx={{ 
                height: 300, 
                bgcolor: alpha(theme.palette.divider, 0.1), 
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography color="text.secondary">No Image Available</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default FullStackDeveloper;
