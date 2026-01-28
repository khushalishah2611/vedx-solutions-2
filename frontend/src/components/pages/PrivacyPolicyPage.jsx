// PrivacyPolicyPage.jsx ✅ (SINGLE FILE) - NO LOADER, NO ALERT

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { apiUrl } from "../../utils/const.js";
import { useBannerByType } from "../../hooks/useBannerByType.js";
import { useLoadingFetch } from "../../hooks/useLoadingFetch.js";

/* ---------------- config ---------------- */
const TABS = [
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms and Condition", path: "/terms-and-condition" },
];

const ENDPOINT = "/api/privacy-policy";
const BANNER_TYPE = "privacy-policy";

/* ---------------- styles ---------------- */
const tabsSx = (theme, isDark) => ({
  borderRadius: 0.5,
  px: 1,
  py: 0.6,
  maxWidth: "100%",
  minHeight: 50,
  bgcolor: alpha(theme.palette.background.paper, isDark ? 0.12 : 0.9),
  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.25 : 0.5)}`,
  "& .MuiTabs-indicator": { height: 0 },
});

const tabSx = (theme, isDark) => ({
  textTransform: "none",
  minHeight: 38,
  px: 2.4,
  borderRadius: 0.5,
  fontWeight: 700,
  letterSpacing: 0.2,
  color: alpha(theme.palette.text.primary, isDark ? 0.78 : 0.7),
  position: "relative",
  "&:hover": {
    bgcolor: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.05),
  },
  "&.Mui-selected": {
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  "&.Mui-selected::after": {
    content: '""',
    position: "absolute",
    left: 10,
    right: 10,
    bottom: -10,
    height: 3,
    borderRadius: 999,
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
  },
});

const contentBoxSx = (theme, isDark) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderRadius: 0.5,
  p: { xs: 3, md: 5 },
  boxShadow: `0 24px 48px ${alpha("#000", 0.12)}`,
  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.25 : 0.5)}`,
});

/* ---------------- component ---------------- */
const PrivacyPolicyPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const { fetchWithLoading } = useLoadingFetch();
  const { banner } = useBannerByType(BANNER_TYPE);

  const [policy, setPolicy] = useState(null);

  const activeTab = useMemo(() => {
    const current = location?.pathname || TABS[0].path;
    return TABS.some((t) => t.path === current) ? current : TABS[0].path;
  }, [location?.pathname]);

  useEffect(() => {
    let isMounted = true;

    const loadPolicy = async () => {
      try {
        const res = await fetchWithLoading(apiUrl(ENDPOINT));
        const payload = await res.json().catch(() => ({}));
        const doc = payload?.policy || payload?.data || payload?.result || null;

        if (!isMounted) return;
        setPolicy(doc);
      } catch {
        if (!isMounted) return;
        setPolicy(null);
      }
    };

    loadPolicy();
    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  const heroImage = banner?.image || "";
  const heroTitle = banner?.title || "Privacy Policy";
  const heroDescription =
    banner?.description ||
    banner?.subtitle ||
    "Read our privacy policy to understand how we collect, use, and protect your information.";

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* ===== HERO ===== */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,.78), rgba(15,23,42,.82)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: { xs: "60vh", md: "70vh" },
          display: "flex",
          alignItems: "center",
          pt: { xs: 12, md: 18 },
          pb: { xs: 10, md: 14 },
          color: "common.white",
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 20 } }}>
          <Stack spacing={2.5}>
            <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 56 }, fontWeight: 800 }}>
              {heroTitle}
            </Typography>
            <Typography sx={{ maxWidth: 680, opacity: 0.85 }}>
              {heroDescription}
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* ===== CONTENT ===== */}
      <Container maxWidth={false} sx={{ px: { xs: 3, md: 20 }, py: { xs: 6, md: 10 } }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => navigate(v)}
          variant="scrollable"
          sx={{ mb: 4, ...tabsSx(theme, isDark) }}
        >
          {TABS.map((t) => (
            <Tab key={t.path} value={t.path} label={t.label} sx={tabSx(theme, isDark)} />
          ))}
        </Tabs>

        <Box sx={contentBoxSx(theme, isDark)}>
          {policy?.description ? (
            <Box
              sx={{
                lineHeight: 1.8,
                "& p": { mb: 2 },
                "& ul, & ol": { pl: 3, mb: 2 },
              }}
              dangerouslySetInnerHTML={{ __html: policy.description }}
            />
          ) : (
            <Typography color="text.secondary" align="center">
              Privacy policy content will appear here once it is published.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;
