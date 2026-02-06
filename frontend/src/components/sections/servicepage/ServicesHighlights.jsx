import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { apiUrl } from "../../../utils/const.js";

export default function ServicePage({
  category,
  subcategory,
  configPath = "/api/why-choose",
  servicesPath = "/api/why-services",
  configIdParam = "whyChooseId",
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const [hero, setHero] = useState(null);
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true); // fetch control only (NO UI)
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (subcategory) params.append("subcategory", subcategory);
    params.append("public", "true");

    const loadHighlights = async () => {
      try {
        setLoading(true);
        setError(false);

        // ---- CONFIG ----
        const configQuery = params.toString();
        const response = await fetch(
          apiUrl(`${configPath}${configQuery ? `?${configQuery}` : ""}`)
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || "Failed to load config");

        const config = Array.isArray(data) ? data[0] : data;
        if (!isMounted) return;

        setHero({
          title: config?.heroTitle || "",
          description: config?.heroDescription || "",
          image: config?.heroImage || "",
        });

        // ---- SERVICES ----
        let services = [];
        const serviceParams = new URLSearchParams(params);

        if (config?.id != null) {
          serviceParams.append(configIdParam, String(config.id));
        }

        const serviceQuery = serviceParams.toString();
        const servicesResponse = await fetch(
          apiUrl(`${servicesPath}${serviceQuery ? `?${serviceQuery}` : ""}`)
        );
        const servicesData = await servicesResponse.json().catch(() => []);
        if (!servicesResponse.ok)
          throw new Error(servicesData?.error || "Failed to load services");

        services = Array.isArray(servicesData) ? servicesData : [];

        // fallback if services API returns empty and config has embedded services
        if (!services.length && Array.isArray(config?.services)) {
          services = config.services;
        }

        if (!isMounted) return;

        const sortedServices = (services || [])
          .filter((item) => (item?.isActive ?? true) === true)
          .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));

        setTable({
          title: config?.tableTitle || "",
          description: config?.tableDescription || "",
          services: sortedServices,
        });
      } catch (err) {
        console.error("Why choose load error:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHighlights();

    return () => {
      isMounted = false;
    };
  }, [category, subcategory, configIdParam, configPath, servicesPath]);

  const resolvedHero = useMemo(
    () => ({
      title: hero?.title || "",
      description: hero?.description || "",
      image: hero?.image || "",
    }),
    [hero]
  );

  const resolvedTable = useMemo(
    () => ({
      title: table?.title || "",
      description: table?.description || "",
      services: Array.isArray(table?.services) ? table.services : [],
    }),
    [table]
  );

  // ✅ NO spinner; keep layout clean
  if (loading) return null;
  if (error) return null;

  const showHero =
    !!resolvedHero.title || !!resolvedHero.description || !!resolvedHero.image;

  const showServices =
    !!resolvedTable.title ||
    !!resolvedTable.description ||
    resolvedTable.services.length > 0;

  return (
    <>
      {/* HERO */}
      {showHero && (
        <Box>
          {/* ✅ Title ABOVE both columns */}
          {!!resolvedHero.title && (
            <Typography
              variant="h3"
              fontWeight={800}
              mb={{ xs: 2.5, sm: 3.5, md: 4 }}
              sx={{
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                fontSize: { xs: 24, sm: 30, md: 40 },
              }}
            >
              {resolvedHero.title}
            </Typography>
          )}

          {/* ✅ Two columns start together */}
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="stretch">
            {/* LEFT: IMAGE */}
            <Grid item xs={12} md={6}>
              {!!resolvedHero.image && (
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: 0.5,
                    overflow: "hidden",
                    boxShadow: isDark
                      ? "0 24px 45px rgba(15,23,42,0.55)"
                      : "0 24px 45px rgba(15,23,42,0.18)",
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.35 : 0.2
                    )}`,
                  }}
                >
                  {/* ✅ Mobile responsive image widget */}
                  <Box
                    component="img"
                    src={resolvedHero.image}
                    alt={resolvedHero.title || "Why choose"}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: { xs: 280, sm: 350, md: 500 }, // ✅ responsive height
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* RIGHT: TEXT */}
            <Grid item xs={12} md={6}>
              {!!resolvedHero.description && (
                <Typography
                  sx={{
                    color: subtleText,
                    lineHeight: 1.8,
                    whiteSpace: "pre-line",
                    fontSize: { xs: 14.5, sm: 15.5, md: 16 },
                  }}
                >
                  {resolvedHero.description}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* SERVICES */}
      {showServices && (
        <Box sx={{ mt: showHero ? { xs: 6, md: 10 } : 0 }}>
          {(!!resolvedTable.title || !!resolvedTable.description) && (
            // ✅ Center always + mobile padding control
            <Stack
              alignItems="center"
              textAlign="center"
              spacing={{ xs: 1.25, sm: 1.6, md: 2 }}
              mb={{ xs: 3.5, sm: 4.5, md: 6 }}
              sx={{
                px: { xs: 1, sm: 2, md: 0 }, // ✅ prevents edge touching on mobile
                mx: "auto",
               
              }}
            >
              {!!resolvedTable.title && (
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: 22, sm: 28, md: 40 },
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {resolvedTable.title}
                </Typography>
              )}

              {!!resolvedTable.description && (
                <Typography
                  sx={{
                    color: subtleText,
                    fontSize: { xs: 14.5, sm: 15.5, md: 16 },
                    lineHeight: 1.8,
                  }}
                >
                  {resolvedTable.description}
                </Typography>
              )}
            </Stack>
          )}

          {resolvedTable.services.length > 0 && (
            <Grid container spacing={{ xs: 2, md: 2 }}>
              {resolvedTable.services.map((service, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={service?.id ?? `${service?.title ?? "service"}-${idx}`}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 0.5,
                      p: { xs: 2, sm: 2.5 }, // ✅ better mobile padding
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        isDark ? 0.85 : 0.98
                      ),
                      border: `1px solid ${alpha(
                        theme.palette.divider,
                        isDark ? 0.5 : 0.6
                      )}`,
                      transition:
                        "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        borderColor: alpha(accentColor, 0.7),
                        boxShadow: isDark
                          ? "0 20px 40px rgba(15,23,42,0.8)"
                          : "0 20px 40px rgba(15,23,42,0.18)",
                      },
                    }}
                  >
                    {!!service?.title && (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          cursor: "pointer",
                          transition:
                            "color 0.3s ease, background-image 0.3s ease",
                          "&:hover": {
                            color: "transparent",
                            backgroundImage:
                              "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          },
                        }}
                      >
                        {service.title}
                      </Typography>
                    )}

                    {!!service?.description && (
                      <Typography
                        variant="body2"
                        sx={{ color: subtleText, lineHeight: 1.75 }}
                      >
                        {service.description}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </>
  );
}
