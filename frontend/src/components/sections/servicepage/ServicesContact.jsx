import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Grid, MenuItem, Stack, Typography, alpha, useTheme } from "@mui/material";
import { AppButton, AppSelectField, AppTextField } from "../../shared/FormControls.jsx";

import { contactProjectTypes, servicesContactImage } from "../../../data/servicesPage.js";
import { apiUrl } from "../../../utils/const.js";
import { useLoadingFetch } from "../../../hooks/useLoadingFetch.js";

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
            observer.unobserve(entry.target); // run once
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
  contactType = "Home",
  prefillProjectType = "",
  sectionId = "contact-section",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const { fetchWithLoading } = useLoadingFetch();

  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();

  // Project types list (from fallback + API)
  const [projectTypes, setProjectTypes] = useState(contactProjectTypes || []);

  // Keep projectType empty initially so placeholder shows
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: prefillProjectType || "", // if prefilled then select it, else show placeholder
    description: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [statusSeverity, setStatusSeverity] = useState("success");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProjectTypes = async () => {
      try {
        const response = await fetchWithLoading(apiUrl("/api/project-types"));
        if (!response.ok) throw new Error("Failed to fetch project types");

        const payload = await response.json();
        if (!isMounted) return;

        const types = (payload.projectTypes || [])
          .map((item) => item?.name)
          .filter(Boolean);

        if (types.length > 0) setProjectTypes(types);
      } catch (error) {
        console.error("Failed to load project types", error);
      }
    };

    loadProjectTypes();

    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  // Default selection rule:
  // - if prefillProjectType exists => set it
  // - else keep empty ("") so placeholder stays until user selects
  // (No auto-select first option.)
  useEffect(() => {
    if (!prefillProjectType) return;
    setFormValues((prev) =>
      prefillProjectType !== prev.projectType ? { ...prev, projectType: prefillProjectType } : prev
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
    const endpoint = token ? "/api/admin/contacts" : "/api/admin/contacts?public=true";
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const response = await fetch(apiUrl(endpoint), {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone,
          projectType: formValues.projectType,
          description: formValues.description,
          contactType,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Unable to submit request.");

      setStatusSeverity("success");
      setStatusMessage(payload?.message || "Thanks! Your enquiry has been received.");

      // Reset after submit:
      // - keep prefillProjectType if provided
      // - else back to empty so placeholder shows again
      setFormValues({
        name: "",
        email: "",
        phone: "",
        projectType: prefillProjectType || "",
        description: "",
      });
    } catch (error) {
      setStatusSeverity("error");
      setStatusMessage(error?.message || "Unable to submit your enquiry right now.");
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
          sx={{
            color: subtleText,
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          Share your idea, challenge, or growth plan — we’ll help you turn it into a solid product roadmap.
        </Typography>
      </Stack>

      {/* Main Content */}
      <Grid
        container
        sx={{
          borderRadius: 0.5,
          overflow: "hidden",
          boxShadow: isDark ? "0 24px 48px rgba(15,23,42,0.7)" : "0 24px 48px rgba(15,23,42,0.14)",
        }}
      >
        {/* Left: Image */}
        <Grid
          item
          xs={12}
          md={5}
          ref={leftRef}
          sx={{
            minHeight: { xs: 260, md: "70vh" },
            backgroundImage: `url(${servicesContactImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: leftInView ? 1 : 0,
            transform: leftInView ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        />

        {/* Right: Form */}
        <Grid
          item
          xs={12}
          md={7}
          ref={rightRef}
          sx={{
            backgroundColor: isDark ? alpha("#020617", 0.96) : "#ffffff",
            opacity: rightInView ? 1 : 0,
            transform: rightInView ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <Stack spacing={3} sx={{ p: { xs: 3, md: 5 } }}>
            {/* Title & Subtitle */}
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
                Tell us about your next project and we’ll assemble the right team within 48 hours.
              </Typography>
            </Stack>

            {/* Form */}
            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              {statusMessage ? <Alert severity={statusSeverity}>{statusMessage}</Alert> : null}

              {/* Name + Email */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <AppTextField
                  label="Name"
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                  value={formValues.name}
                  onChange={handleChange("name")}
                />
                <AppTextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                  value={formValues.email}
                  onChange={handleChange("email")}
                />
              </Stack>

              {/* Mobile + Project Type */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <AppTextField
                  label="Mobile Number"
                  fullWidth
                  variant="outlined"
                  size="medium"
                  value={formValues.phone}
                  onChange={handleChange("phone")}
                />

                <AppSelectField
                  label="Project Type"
                  fullWidth
                  required
                  value={formValues.projectType}
                  variant="outlined"
                  size="medium"
                  onChange={handleChange("projectType")}
                  // IMPORTANT: show placeholder when value is ""
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: alpha(theme.palette.text.secondary, isDark ? 0.7 : 0.85) }}>
                          Select Project Type
                        </span>
                      );
                    }
                    return selected;
                  }}
                >
                  {/* Placeholder item */}
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

              {/* Description */}
              <AppTextField
                label="Project Description"
                fullWidth
                multiline
                minRows={4}
                variant="outlined"
                value={formValues.description}
                onChange={handleChange("description")}
              />

              {/* Submit Button */}
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
                    background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                    color: "#fff",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 1.75 },
                    "&:hover": {
                      background: "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
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
