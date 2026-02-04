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

// --- helpers ---
const safeStr = (v) => String(v ?? "").trim();
const norm = (v) => String(v || "").trim().toLowerCase();

const isHttpUrl = (value) => /^https?:\/\//i.test(value);
const isDataUrl = (value) => String(value || "").startsWith("data:");

const toAbsMaybe = (url) => {
  const raw = safeStr(url);
  if (!raw) return "";
  if (isHttpUrl(raw) || isDataUrl(raw)) return raw;
  return typeof apiUrl === "function" ? apiUrl(raw) : raw;
};

const normalizeList = (data) => {
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

  return [];
};

function FullStackDeveloper({
  onContactClick,
  category,
  subcategory,

  // ✅ fallback props
  image,
  title,
  description,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.25);

  const [serviceData, setServiceData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const requestIdRef = useRef(0);

  useEffect(() => {
    let isActive = true;
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    const loadService = async () => {
      try {
        const serviceParams = new URLSearchParams();
        if (category) serviceParams.append("category", category);
        if (subcategory) serviceParams.append("subcategory", subcategory);

        const serviceUrl = `/api/hire-services${
          serviceParams.toString() ? `?${serviceParams.toString()}` : ""
        }`;

        const serviceRes = await fetch(apiUrl(serviceUrl), {
          signal: controller.signal,
        });

        const serviceJson = await serviceRes.json().catch(() => null);
        const serviceList = normalizeList(serviceJson);

        const matchedService =
          serviceList.find((it) => {
            const cOk = category ? norm(it?.category) === norm(category) : true;
            const sOk = subcategory
              ? norm(it?.subcategory) === norm(subcategory)
              : true;
            return cOk && sOk;
          }) || serviceList[0];

        if (!isActive || requestId !== requestIdRef.current) return;

        setServiceData({
          title: safeStr(matchedService?.title) || "",
          description: safeStr(matchedService?.description) || "",
          image: safeStr(matchedService?.image) || "",
        });
      } catch (e) {
        if (!isActive || e?.name === "AbortError") return;
        console.error("Load Error:", e);
      }
    };

    loadService();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [category, subcategory]);

  // ✅ binding priority: API first, fallback to props
  const resolvedTitle = serviceData.title || safeStr(title) || "Service Title";
  const resolvedDesc =
    serviceData.description ||
    safeStr(description) ||
    "No description provided for this service.";
  const resolvedImage = toAbsMaybe(serviceData.image || image);

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0.5,
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          border: `1px solid ${dividerColor}`,
          p: { xs: 4, md: 8 },
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* LEFT */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ color: theme.palette.text.primary }}
              >
                {resolvedTitle}
              </Typography>

              <Divider
                sx={{
                  width: "80px",
                  height: "4px",
                  bgcolor: "primary.main",
                  borderRadius: 0.5,
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  whiteSpace: "pre-line",
                  fontSize: "1.1rem",
                }}
              >
                {resolvedDesc}
              </Typography>

              <AppButton
                variant="contained"
                onClick={onContactClick}
                sx={{
                  width: "fit-content",
                  background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Hire {subcategory || category || "Expert"}
              </AppButton>
            </Stack>
          </Grid>

          {/* RIGHT */}
          <Grid item xs={12} md={6}>
           
              <Box
                component="img"
                src={resolvedImage}
                alt={resolvedTitle}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 450,
                  borderRadius: 0.5,
                  boxShadow: isDark
                    ? "0 20px 40px rgba(0,0,0,0.5)"
                    : "0 20px 40px rgba(0,0,0,0.1)",
                  objectFit: "cover",
                }}
              />
       
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default FullStackDeveloper;
