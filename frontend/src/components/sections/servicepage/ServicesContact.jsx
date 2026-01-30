// ServicesContact.jsx ✅ (SINGLE FILE)
// ✅ LEFT: Banner Image (API by contactType)
// ✅ RIGHT: Contact Form
// ✅ If banner image missing => left section hidden and form full width
// ✅ Project types API remains (API-only)

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  MenuItem,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  AppButton,
  AppSelectField,
  AppTextField,
} from "../../shared/FormControls.jsx";
import { apiUrl } from "../../../utils/const.js";
import { useBannerByType } from "../../../hooks/useBannerByType.js";
import { useLoadingFetch } from "../../../hooks/useLoadingFetch.js";

/* ---------------- helpers ---------------- */
const safeStr = (v) => String(v ?? "").trim();
const isAbsUrl = (s) => /^https?:\/\//i.test(String(s || ""));

const normalizeImg = (raw) => {
  let val = raw;

  if (val && typeof val === "object") {
    val =
      val.url ||
      val.src ||
      val.path ||
      val.image ||
      val.imageUrl ||
      val.location ||
      "";
  }

  const s = safeStr(val);
  if (!s) return "";
  if (isAbsUrl(s)) return s;

  const withSlash = s.startsWith("/") ? s : `/${s}`;
  return apiUrl(withSlash);
};

const pickBannerImage = (banner) => {
  const candidate =
    banner?.image ||
    banner?.bannerImage ||
    banner?.imageUrl ||
    banner?.imagePath ||
    (Array.isArray(banner?.images) ? banner?.images?.[0] : "") ||
    banner?.data?.image ||
    banner?.data?.bannerImage ||
    banner?.data?.imageUrl ||
    banner?.data?.imagePath ||
    (Array.isArray(banner?.data?.images) ? banner?.data?.images?.[0] : "") ||
    "";

  return normalizeImg(candidate);
};

// Simple hook to detect when an element enters the viewport
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

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

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
};

const ServicesContact = ({
  contactType = "contact",
  prefillProjectType = "",
  sectionId = "contact-section",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const { fetchWithLoading } = useLoadingFetch();
  const { banner } = useBannerByType(contactType);

  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();

  const [projectTypes, setProjectTypes] = useState([]);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: prefillProjectType || "",
    description: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [statusSeverity, setStatusSeverity] = useState("success");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Banner image (API only)
  const resolvedBannerImage = useMemo(() => pickBannerImage(banner), [banner]);
  const hasBannerImage = Boolean(resolvedBannerImage);

  // ✅ Load Project Types (API)
  useEffect(() => {
    let isMounted = true;

    const loadProjectTypes = async () => {
      try {
        const response = await fetchWithLoading(apiUrl("/api/project-types"));
        if (!response.ok) throw new Error("Failed to fetch project types");

        const payload = await response.json();
        if (!isMounted) return;

        const list =
          payload?.projectTypes ||
          payload?.data?.projectTypes ||
          payload?.items ||
          [];

        const types = (Array.isArray(list) ? list : [])
          .map((item) => safeStr(item?.name ?? item))
          .filter(Boolean);

        setProjectTypes(types);
      } catch (error) {
        console.error("Failed to load project types", error);
      }
    };

    loadProjectTypes();
    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  useEffect(() => {
    if (!prefillProjectType) return;
    setFormValues((prev) =>
      prefillProjectType !== prev.projectType
        ? { ...prev, projectType: prefillProjectType }
        : prev
    );
  }, [prefillProjectType]);

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatusMessage("");

    const token = localStorage.getItem("adminToken");
    const endpoint = token
      ? "/api/admin/contacts"
      : "/api/admin/contacts?public=true";

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const response = await fetch(apiUrl(endpoint), {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: safeStr(formValues.name),
          email: safeStr(formValues.email),
          phone: safeStr(formValues.phone),
          projectType: safeStr(formValues.projectType),
          description: safeStr(formValues.description),
          contactType,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(payload?.message || "Unable to submit request.");

      setStatusSeverity("success");
      setStatusMessage(
        payload?.message || "Thanks! Your enquiry has been received."
      );

      setFormValues({
        name: "",
        email: "",
        phone: "",
        projectType: prefillProjectType || "",
        description: "",
      });
    } catch (error) {
      setStatusSeverity("error");
      setStatusMessage(
        error?.message || "Unable to submit your enquiry right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="section" id={sectionId}>
      {/* Heading */}
      <Stack spacing={2} sx={{ mb: { xs: 4, md: 6 } }} alignItems="center">
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 28, md: 40 },
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Contact Us
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: subtleText, textAlign: "center", maxWidth: 820 }}
        >
          Share your idea, challenge, or growth plan — we’ll help you turn it
          into a solid product roadmap.
        </Typography>
      </Stack>

      {/* Main Content */}
      <Grid
        container
        sx={{
          borderRadius: 0.5,
          overflow: "hidden",
          boxShadow: isDark
            ? "0 24px 48px rgba(15,23,42,0.7)"
            : "0 24px 48px rgba(15,23,42,0.14)",
        }}
      >
        {/* ✅ LEFT: Banner Image */}
        {hasBannerImage ? (
          <Grid
            item
            xs={12}
            md={6}
            ref={leftRef}
            sx={{
              position: "relative",
              minHeight: { xs: 260, md: "100%" },
              opacity: leftInView ? 1 : 0,
              transform: leftInView ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <Box
              sx={{
                height: "100%",
                minHeight: { xs: 260, md: 520 },
                width: "100%",
                backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.6)), url("${resolvedBannerImage}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>
        ) : null}

        {/* ✅ RIGHT: Form */}
        <Grid
          item
          xs={12}
          md={hasBannerImage ? 6 : 12}
          ref={rightRef}
          sx={{
            backgroundColor: isDark ? alpha("#020617", 0.96) : "#ffffff",
            opacity: rightInView ? 1 : 0,
            transform: rightInView ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            borderLeft: hasBannerImage
              ? {
                  xs: "none",
                  md: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.3 : 0.2
                  )}`,
                }
              : "none",
          }}
        >
          <Stack spacing={3} sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={1}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Ready to build something remarkable?
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: subtleText,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Tell us about your next project and we’ll assemble the right
                team within 48 hours.
              </Typography>
            </Stack>

            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              {statusMessage ? (
                <Alert severity={statusSeverity}>{statusMessage}</Alert>
              ) : null}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <AppTextField
                  label="Name"
                  fullWidth
                  required
                  value={formValues.name}
                  onChange={handleChange("name")}
                />
                <AppTextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={formValues.email}
                  onChange={handleChange("email")}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <AppTextField
                  label="Mobile Number"
                  fullWidth
                  value={formValues.phone}
                  onChange={handleChange("phone")}
                />

                <AppSelectField
                  label={formValues.projectType ? "Project Type" : ""}
                  fullWidth
                  required
                  value={formValues.projectType}
                  onChange={handleChange("projectType")}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <span
                          style={{
                            color: alpha(
                              theme.palette.text.secondary,
                              isDark ? 0.7 : 0.85
                            ),
                          }}
                        >
                          Select Project Type
                        </span>
                      );
                    }
                    return selected;
                  }}
                  InputLabelProps={{ shrink: Boolean(formValues.projectType) }}
                >
                  <MenuItem value="" disabled>
                    Select Project Type
                  </MenuItem>
                  {projectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </AppSelectField>
              </Stack>

              <AppTextField
                label="Project Description"
                fullWidth
                multiline
                minRows={4}
                value={formValues.description}
                onChange={handleChange("description")}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                  mt: 1,
                }}
              >
                <AppButton
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={submitting}
                  sx={{
                    background:
                      "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 1.75 },
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                    },
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Now"}
                </AppButton>
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServicesContact;
