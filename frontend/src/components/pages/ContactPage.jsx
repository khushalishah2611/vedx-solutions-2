import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { AppButton, AppSelectField, AppTextField } from "../shared/FormControls.jsx";

import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import { apiUrl } from "../../utils/const.js";
import { useBannerByType } from "../../hooks/useBannerByType.js";
import { useLoadingFetch } from "../../hooks/useLoadingFetch.js";

/* ---------------- helpers ---------------- */
const safeStr = (v) => (typeof v === "string" ? v.trim() : "");

const createMapSearchUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const createDirectionsUrl = (addressOrLatLng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    addressOrLatLng
  )}`;

// ✅ embed (no API key)
const createEmbedUrl = (addressOrQuery) =>
  `https://www.google.com/maps?q=${encodeURIComponent(addressOrQuery)}&output=embed`;

/* ---------------- fallback project types ---------------- */
const contactProjectTypes = [];

/* ---------------- locations ---------------- */
const contactLocations = [
  {
    key: "vadodara",
    label: "Vadodara Office",
    address: "Vedx Solution Pvt Ltd, Vadodara, Gujarat, India",
    mapUrl: createMapSearchUrl("Vedx Solution Pvt Ltd, Vadodara, Gujarat, India"),
    directionsUrl: createDirectionsUrl("Vedx Solution Pvt Ltd, Vadodara, Gujarat, India"),
    embedUrl: createEmbedUrl("Vedx Solution Pvt Ltd, Vadodara, Gujarat, India"),
  },
  {
    key: "ahmedabad",
    label: "Ahmedabad Office",
    address:
      "A-311, Titanium Business Park, Near Makarba Railway Crossing, B/H. Divya Bhaskar Press, Ahmedabad - 380051",
    mapUrl: createMapSearchUrl(
      "A-311, Titanium Business Park, Near Makarba Railway Crossing, B/H. Divya Bhaskar Press, Ahmedabad - 380051"
    ),
    directionsUrl: createDirectionsUrl(
      "A-311, Titanium Business Park, Near Makarba Railway Crossing, B/H. Divya Bhaskar Press, Ahmedabad - 380051"
    ),
    embedUrl: createEmbedUrl(
      "A-311, Titanium Business Park, Near Makarba Railway Crossing, B/H. Divya Bhaskar Press, Ahmedabad - 380051"
    ),
  },
];

const primaryLocation = contactLocations[0];

/* ---------------- contact cards ---------------- */
const contactDetails = [
  {
    label: "Indian",
    value: "+91 9099924828",
    icon: <PhoneInTalkRoundedIcon fontSize="large" />,
    href: "tel:+919099924828",
  },
  {
    label: "USA",
    value: "+1 320396",
    icon: <PhoneInTalkRoundedIcon fontSize="large" />,
    href: "tel:+1320396",
  },
  {
    label: "Our Email Address",
    value: "contact@vedxsolution.com",
    icon: <MailOutlineRoundedIcon fontSize="large" />,
    href: "mailto:contact@vedxsolution.com",
  },
  {
    label: contactLocations[0].label,
    value: contactLocations[0].address,
    icon: <LocationOnRoundedIcon fontSize="large" />,
    href: contactLocations[0].mapUrl,
    external: true,
  },
  {
    label: contactLocations[1].label,
    value: contactLocations[1].address,
    icon: <LocationOnRoundedIcon fontSize="large" />,
    href: contactLocations[1].mapUrl,
    external: true,
  },
];

const ContactPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const { fetchWithLoading } = useLoadingFetch();
  const { banner } = useBannerByType("contact");
  const [searchParams] = useSearchParams();

  const heroImage = safeStr(banner?.image);
  const heroHasImage = Boolean(heroImage);

  const [projectTypes, setProjectTypes] = useState(contactProjectTypes);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    description: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [statusSeverity, setStatusSeverity] = useState("success");
  const [submitting, setSubmitting] = useState(false);

  const contactTypeParam = searchParams.get("contactType") || "Contact";
  const projectTypeParam = searchParams.get("projectType") || "";
  const planParam = searchParams.get("plan") || "";

  // ✅ map location switch
  const [selectedLocation, setSelectedLocation] = useState(primaryLocation);

  useEffect(() => {
    let isMounted = true;

    const loadProjectTypes = async () => {
      try {
        const response = await fetchWithLoading(apiUrl("/api/project-types"));
        if (!response?.ok) throw new Error("Failed to fetch project types");

        const payload = await response.json().catch(() => null);
        if (!isMounted) return;

        const types = (payload?.projectTypes || [])
          .map((item) => safeStr(item?.name))
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

  useEffect(() => {
    if (!projectTypeParam) return;

    setProjectTypes((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.includes(projectTypeParam)) return list;
      return [...list, projectTypeParam];
    });

    setFormValues((prev) => ({
      ...prev,
      projectType: projectTypeParam,
      description: prev.description || (planParam ? `Plan: ${planParam}` : ""),
    }));
  }, [planParam, projectTypeParam]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const projectTypeOptions = useMemo(
    () => (Array.isArray(projectTypes) ? projectTypes : []),
    [projectTypes]
  );

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
      const response = await fetchWithLoading(apiUrl(endpoint), {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone,
          projectType: formValues.projectType,
          description: formValues.description,
          contactType: contactTypeParam,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response?.ok) throw new Error(payload?.message || "Unable to submit request.");

      setStatusSeverity("success");
      setStatusMessage(payload?.message || "Thanks! Your enquiry has been received.");

      setFormValues({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        description: "",
      });
    } catch (error) {
      setStatusSeverity("error");
      setStatusMessage(error?.message || "Unable to submit your enquiry right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardBorder = `1px solid ${alpha(isDark ? accentColor : theme.palette.primary.main, 0.3)}`;

  return (
    <Box component="main" sx={{ bgcolor: "background.default", overflowX: "hidden" }}>
      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: "54vh", md: "70vh" },
          display: "flex",
          alignItems: "center",
          pb: { xs: 8, md: 14 },
          pt: { xs: 12, md: 18 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: heroHasImage
              ? `url(${heroImage})`
              : "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 50%, rgba(2,6,23,1) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.05)",
            filter: isDark ? "brightness(0.85)" : "brightness(0.7)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: isDark
              ? "linear-gradient(90deg, rgba(5,9,18,0.85) 0%, rgba(5,9,18,0.65) 40%, rgba(5,9,18,0.2) 70%, rgba(5,9,18,0) 100%)"
              : "linear-gradient(90deg, rgba(241,245,249,0.9) 0%, rgba(241,245,249,0.7) 40%, rgba(241,245,249,0.3) 70%, rgba(241,245,249,0) 100%)",
          }}
        />

        <Container
          maxWidth={false}
          sx={{
            position: "relative",
            zIndex: 1,
            px: { xs: 2, sm: 3, md: 12, lg: 20 },
          }}
        >
          <Stack spacing={2.5} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 30, sm: 42, md: 56 },
                fontWeight: 800,
                lineHeight: 1.1,
                textAlign: { xs: "center", md: "left" },
                color: isDark ? "#fff" : "#0f172a",
              }}
            >
              Contact Us
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: isDark ? alpha("#ffffff", 0.85) : alpha("#0f172a", 0.78),
                maxWidth: 640,
                fontSize: { xs: 13.5, md: 16 },
                lineHeight: 1.7,
                textAlign: { xs: "center", md: "left" },
                px: { xs: 1, sm: 0 },
              }}
            >
              We are here to discuss your ideas, understand your challenges, and build the next big
              thing together.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container
        id="contact"
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 12, lg: 20 },
          py: { xs: 5, md: 10 },
        }}
      >
        <Box my={{ xs: 2, md: 5 }}>
          <Stack spacing={{ xs: 5, md: 10 }}>
            {/* Section Title */}
            <Stack spacing={2.5} alignItems="center">
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  borderRadius: 0.5,
                  border: `1px solid ${alpha("#ffffff", isDark ? 0.12 : 0.15)}`,
                  background: !isDark ? alpha("#ddddddff", 0.9) : alpha("#0000007c", 0.9),
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  fontSize: 11,
                  lineHeight: 1.3,
                  width: "fit-content",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Contact Details
                </Box>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: { xs: 22, sm: 30, md: 40 },
                  lineHeight: 1.2,
                }}
              >
                Reach Out to Us @
              </Typography>
            </Stack>

             <Grid spacing={2} container sx={{ p: { xs: 3, sm: 4 }, m: { xs: 0, md: 5 } }}>
              {contactDetails.map((detail) => {
                const isPhone = detail.label === "Indian" || detail.label === "USA";
                const valueText = isPhone ? `${detail.label} - ${detail.value}` : detail.value;

                return (
                  <Grid item xs={12} sm={6} md={4} key={detail.label} sx={{ display: "flex" }}>
                    <Card
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 0.5,
                        background: isDark
                          ? "linear-gradient(160deg, #0f172a 0%, #111827 100%)"
                          : "linear-gradient(160deg, #ffffff 0%, #f7f8ff 100%)",
                        border: cardBorder,
                        boxShadow: isDark
                          ? "0 18px 45px rgba(3, 7, 18, 0.65)"
                          : "0 18px 45px rgba(14, 18, 68, 0.15)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <CardContent
                        sx={{
                          py: { xs: 2.5, md: 3 },
                          px: { xs: 2.25, md: 3 }, // ✅ same left/right space on mobile
                          height: "100%", // ✅ keep equal content area
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Stack spacing={1.75} alignItems="center" textAlign="center" sx={{ width: "100%" }}>
                          <Box
                            sx={{
                              width: { xs: 64, md: 72 },
                              height: { xs: 64, md: 72 },
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              background: "linear-gradient(135deg, #FF5E5E 0%, #A84DFF 100%)",
                              color: "common.white",
                              flexShrink: 0,
                            }}
                          >
                            {detail.icon}
                          </Box>

                          <Stack spacing={0.75} sx={{ width: "100%" }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {isPhone ? "Phone Number" : detail.label}
                            </Typography>

                            <Typography
                              component="a"
                              href={detail.href}
                              target={detail.external ? "_blank" : undefined}
                              rel={detail.external ? "noopener noreferrer" : undefined}
                              sx={{
                                fontSize: { xs: 15.5, md: 18 },
                                fontWeight: 700,
                                textDecoration: "none",
                                color: "inherit",
                                px: { xs: 1, sm: 0 },
                                lineHeight: 1.35,
                                wordBreak: isPhone ? "normal" : "break-word",
                                whiteSpace: isPhone ? "nowrap" : "normal", // ✅ phone one line
                                overflow: isPhone ? "hidden" : "visible",
                                textOverflow: isPhone ? "ellipsis" : "clip",
                              }}
                            >
                              {valueText}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

   
           <Grid >
          
              <Grid item xs={12} md={6}>
                 <Stack
                  spacing={3}
                  sx={{
                    height: "100%",
                    borderRadius: 0.5,
                    p: { xs: 3, sm: 4 },
                    background: isDark
                      ? "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))"
                      : "linear-gradient(145deg, rgba(248,250,252,0.98), rgba(219,234,254,0.9))",
                    boxShadow: isDark
                      ? "0 24px 48px rgba(3,7,18,0.85)"
                      : "0 24px 48px rgba(15,23,42,0.15)",
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Share Your Project Brief
                    </Typography>
                    <Typography variant="body1" sx={{ color: subtleText }}>
                      Fill out the form and we will reach out within 24 hours with a
                      tailored plan for your requirements.
                    </Typography>
                  </Stack>

                  <Stack component="form" spacing={2} noValidate onSubmit={handleSubmit}>
                    {statusMessage ? (
                      <Alert severity={statusSeverity}>{statusMessage}</Alert>
                    ) : null}

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
                        label={formValues.projectType ? "Project Type" : ""}
                        fullWidth
                        required
                        value={formValues.projectType}
                        variant="outlined"
                        size="medium"
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
                      >
                        <MenuItem value="" disabled>
                          Select Project Type
                        </MenuItem>

                        {(Array.isArray(projectTypes) ? projectTypes : []).map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </AppSelectField>
                    </Stack>

                    <AppTextField
                      label="Description"
                      fullWidth
                      multiline
                      minRows={4}
                      variant="outlined"
                      size="medium"
                      value={formValues.description}
                      onChange={handleChange("description")}
                    />

                    <AppButton
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={submitting}
                      sx={{
                        alignSelf: { xs: "stretch", sm: "flex-start" },
                        background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                        color: "#fff",
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                        px: { xs: 4, sm: 6 },
                        py: 1.25,
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                        },
                      }}
                    >
                      {submitting ? "Submitting..." : "Submit Now"}
                    </AppButton>
                  </Stack>
                </Stack>
              </Grid>

              {/* Map column */}
              <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 0.5,
                      overflow: "hidden",
                      boxShadow: isDark
                        ? "0 30px 60px rgba(3, 7, 18, 0.75)"
                        : "0 30px 45px rgba(15, 23, 42, 0.18)",
                      height: { xs: 280, sm: 360, md: 520 },
                      minHeight: 260,
                      width: "100%",
                      border: `1px solid ${alpha(
                        isDark ? accentColor : theme.palette.primary.main,
                        0.22
                      )}`,
                    }}
                  >
                    <Box
                      component="iframe"
                      key={selectedLocation.key} 
                      title={`${selectedLocation.label} map`}
                      src={selectedLocation.embedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                      sx={{
                        display: "block",
                        border: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>

      
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <AppButton
                      fullWidth
                      variant="contained"
                      onClick={() => setSelectedLocation(contactLocations[0])}
                      sx={{
                        background:
                          selectedLocation.key === "vadodara"
                            ? "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)"
                            : isDark
                              ? alpha("#ffffff", 0.12)
                              : alpha("#000", 0.08),
                        color: selectedLocation.key === "vadodara" ? "#fff" : "inherit",
                        textTransform: "none",
                        fontWeight: 800,
                        borderRadius: 0.5,
                        transition: "all 200ms ease",
                        py: 1.1,
                        "&:hover": {
                          background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                          color: "#fff",
                          transform: "translateY(-1px)",
                          boxShadow: isDark
                            ? "0 14px 30px rgba(0,0,0,0.45)"
                            : "0 14px 30px rgba(15,23,42,0.18)",
                        },
                        "&:active": { transform: "translateY(0px)" },
                      }}
                    >
                      Vadodara Directions
                    </AppButton>

                    <AppButton
                      fullWidth
                      variant="contained"
                      onClick={() => setSelectedLocation(contactLocations[1])}
                      sx={{
                        background:
                          selectedLocation.key === "ahmedabad"
                            ? "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)"
                            : isDark
                              ? alpha("#ffffff", 0.12)
                              : alpha("#000", 0.08),
                        color: selectedLocation.key === "ahmedabad" ? "#fff" : "inherit",
                        textTransform: "none",
                        fontWeight: 800,
                        borderRadius: 0.5,
                        transition: "all 200ms ease",
                        py: 1.1,
                        "&:hover": {
                          background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                          color: "#fff",
                          transform: "translateY(-1px)",
                          boxShadow: isDark
                            ? "0 14px 30px rgba(0,0,0,0.45)"
                            : "0 14px 30px rgba(15,23,42,0.18)",
                        },
                        "&:active": { transform: "translateY(0px)" },
                      }}
                    >
                      Ahmedabad Directions
                    </AppButton>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
