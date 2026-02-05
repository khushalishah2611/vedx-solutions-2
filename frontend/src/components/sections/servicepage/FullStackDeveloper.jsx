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
} from "@mui/material";
import { AppButton } from "../../shared/FormControls.jsx";
import { apiUrl } from "../../../utils/const.js";

// ---------- helpers ----------
const safeStr = (v) => String(v ?? "").trim();
const norm = (v) => String(v || "").trim().toLowerCase();

const isHttpUrl = (v) => /^https?:\/\//i.test(v);
const isDataUrl = (v) => String(v || "").startsWith("data:");

const toAbsMaybe = (url) => {
  const raw = safeStr(url);
  if (!raw) return "";
  if (isHttpUrl(raw) || isDataUrl(raw)) return raw;
  return apiUrl(raw.startsWith("/") ? raw : `/${raw}`);
};

const normalizeList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  const root =
    data?.data && typeof data.data === "object" && !Array.isArray(data.data)
      ? data.data
      : data;

  return (
    root?.data ||
    root?.items ||
    root?.results ||
    root?.hireServices ||
    root?.services ||
    []
  );
};

// ---------- component ----------
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
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.35 : 0.25);

  const [serviceData, setServiceData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const requestIdRef = useRef(0);

  useEffect(() => {
    let active = true;
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    (async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (subcategory) params.append("subcategory", subcategory);

        const res = await fetch(
          apiUrl(`/api/hire-services${params.toString() ? `?${params}` : ""}`),
          { signal: controller.signal }
        );

        const json = await res.json().catch(() => null);
        const list = normalizeList(json);

        const match =
          list.find((it) => {
            const cOk = category ? norm(it?.category) === norm(category) : true;
            const sOk = subcategory
              ? norm(it?.subcategory) === norm(subcategory)
              : true;
            return cOk && sOk;
          }) || list[0];

        if (!active || requestId !== requestIdRef.current) return;

        setServiceData({
          title: safeStr(match?.title),
          description: safeStr(match?.description),
          image: safeStr(match?.image),
        });
      } catch (e) {
        if (e?.name !== "AbortError") console.error(e);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [category, subcategory]);

  const resolvedTitle = serviceData.title || safeStr(title);
  const resolvedDesc =
    serviceData.description ||
    safeStr(description) ||
    "No description provided.";
  const resolvedImage = toAbsMaybe(serviceData.image || image);

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 1,
          p: { xs: 3, md: 6 },
          background: isDark
            ? "linear-gradient(135deg,#0f172a,#1e293b)"
            : "linear-gradient(135deg,#f8fafc,#e2e8f0)",
          border: `1px solid ${dividerColor}`,
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* LEFT CONTENT */}
          <Grid item xs={12} md={6}>
            <Stack
              spacing={2.5}
              sx={{
                textAlign: { xs: "center", md: "left" },
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.9rem", sm: "2.2rem", md: "2.6rem" },
                  lineHeight: 1.15,
                }}
              >
                {resolvedTitle}
              </Typography>

              <Divider
                sx={{
                  width: { xs: "70%", md: "50%" },
                  height: "4px",
                  borderRadius: 999,
                  borderColor: "primary.main",
                  mx: { xs: "auto", md: 0 },
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: "text.secondary",
                  whiteSpace: "pre-line",
                  maxWidth: 560,
                }}
              >
                {resolvedDesc}
              </Typography>

              <AppButton
                variant="contained"
                onClick={onContactClick}
                sx={{
                  mt: 1,
                  px: 4,
                  py: 1.4,
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "none",
                   background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                }}
              >
                Hire {subcategory || category || "Expert"}
              </AppButton>
            </Stack>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={resolvedImage}
                alt={resolvedTitle}
                sx={{
                  width: "100%",
                  maxWidth: 560,
                  height: { xs: 240, sm: 320, md: 420 },
                  objectFit: "cover",
                  borderRadius: 1,
                  boxShadow: isDark
                    ? "0 20px 40px rgba(0,0,0,0.45)"
                    : "0 20px 40px rgba(0,0,0,0.12)",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default FullStackDeveloper;
