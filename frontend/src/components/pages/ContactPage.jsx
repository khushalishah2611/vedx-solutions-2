// ContactPage.jsx (SINGLE FILE) ✅ FULL + CORRECTED

import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Rating, // ✅ FIX: Rating import missing
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { AppButton, AppSelectField, AppTextField } from "../shared/FormControls.jsx";

import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import { contactProjectTypes } from "../../data/servicesPage.js";
import { apiUrl } from "../../utils/const.js";
import { useLoadingFetch } from "../../hooks/useLoadingFetch.js";

/* =========================================
   ✅ MAP CONFIG (FIXED)
   - Use lat/lng embed (no API key)
   - Match your Google maps place coords: 22.3446425, 73.2147198
========================================= */
const contactLocation = {
  address: "Vedx Solution Pvt Ltd, Vadodara, Gujarat, India",
  lat: 22.3446425,
  lng: 73.2147198,
  mapUrl:
    "https://www.google.com/maps/place/Vedx+solution+Pvt+ltd/@22.344642,73.21472,14z/data=!4m6!3m5!1s0x395fcdb58438851d:0x38a17515d716976!8m2!3d22.3446425!4d73.2147198!16s%2Fg%2F11x34kz_b1?hl=en-GB&entry=ttu",
  get embedUrl() {
    return `https://www.google.com/maps?q=${this.lat},${this.lng}&z=15&output=embed`;
  },
};

const contactDetails = [
  {
    label: "Contact Phone Number",
    value: "9099968634",
    icon: <PhoneInTalkRoundedIcon fontSize="large" />,
    href: "tel:9099968634",
  },
  {
    label: "Our Email Address",
    value: "contact@vedxsolution.com",
    icon: <MailOutlineRoundedIcon fontSize="large" />,
    href: "mailto:contact@vedxsolution.com",
  },
  {
    label: "Our Location",
    value: contactLocation.address,
    icon: <LocationOnRoundedIcon fontSize="large" />,
    href: contactLocation.mapUrl,
    external: true,
  },
];

const ContactPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const { fetchWithLoading } = useLoadingFetch();

  const [projectTypes, setProjectTypes] = useState(contactProjectTypes || []);
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

  useEffect(() => {
    let isMounted = true;

    const loadProjectTypes = async () => {
      try {
        const response = await fetchWithLoading(apiUrl("/api/project-types"));
        if (!response?.ok) throw new Error("Failed to fetch project types");
        const payload = await response.json();
        if (!isMounted) return;

        const types = (payload?.projectTypes || [])
          .map((item) => item?.name)
          .filter(Boolean);

        if (types.length > 0) setProjectTypes(types);
      } catch (error) {
        console.error("Failed to load project types", error);
        // keep fallback list (contactProjectTypes)
      }
    };

    loadProjectTypes();
    return () => {
      isMounted = false;
    };
  }, [fetchWithLoading]);

  // keep for reset use, not auto-select (still useful if you want later)
  const resolvedProjectType = useMemo(() => projectTypes?.[0] || "", [projectTypes]);

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatusMessage("");

    const token = localStorage.getItem("adminToken");

    // ✅ Keep your logic as-is, but make endpoint a bit safer:
    // If you truly have a public route, prefer "/api/contacts" etc.
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
          contactType: "Contact",
        }),
      });

      let payload = {};
      try {
        payload = await response.json();
      } catch {
        payload = {};
      }

      if (!response?.ok) {
        throw new Error(payload?.message || "Unable to submit request.");
      }

      setStatusSeverity("success");
      setStatusMessage(payload?.message || "Thanks! Your enquiry has been received.");

      setFormValues({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        description: "",
      });

      // Optional: you can auto-reset projectType to first option if you want:
      // setFormValues((p) => ({ ...p, projectType: resolvedProjectType }));
      void resolvedProjectType;
    } catch (error) {
      setStatusSeverity("error");
      setStatusMessage(error?.message || "Unable to submit your enquiry right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="main" sx={{ bgcolor: "background.default", overflowX: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.82)), url(https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: isDark ? "brightness(0.9)" : "brightness(0.85)",
          minHeight: { xs: "60vh", md: "70vh" },
          display: "flex",
          alignItems: "center",
          pb: { xs: 10, md: 14 },
          pt: { xs: 12, md: 18 },
          color: "common.white",
        }}
      >
        <Container maxWidth={false} sx={{ zIndex: 1, px: { xs: 3, md: 20 } }}>
          <Stack spacing={2.5} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 34, sm: 42, md: 56 },
                fontWeight: 800,
                lineHeight: 1.1,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Contact Us
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: alpha("#ffffff", 0.85),
                maxWidth: 640,
                fontSize: { xs: 14, md: 16 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              We are here to discuss your ideas, understand your challenges, and build the next big thing together.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container id="contact" maxWidth={false} sx={{ px: { xs: 3, md: 20 }, py: { xs: 6, md: 10 } }}>
        <Box my={5}>
          <Stack spacing={{ xs: 6, md: 10 }}>
            {/* Section Title */}
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  borderRadius: 0.5,
                  border: `1px solid ${alpha("#ffffff", 0.1)}`,
                  background: !isDark ? alpha("#ddddddff", 0.9) : alpha("#0000007c", 0.9),
                  color: alpha(accentColor, 0.9),
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  fontSize: 11,
                  lineHeight: 1.3,
                  width: "fit-content",
                  mx: { xs: "auto", md: 0 },
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
                  fontSize: { xs: 26, sm: 30, md: 40 },
                }}
              >
                Reach Out to Us @
              </Typography>
            </Stack>

            {/* Contact Cards */}
            <Grid spacing={2} container sx={{ p: { xs: 3, sm: 4 }, m: { xs: 0, md: 5 } }}>
              {contactDetails.map((detail) => (
                <Grid item xs={12} md={4} key={detail.label}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 0.5,
                      background: isDark
                        ? "linear-gradient(160deg, #0f172a 0%, #111827 100%)"
                        : "linear-gradient(160deg, #ffffff 0%, #f7f8ff 100%)",
                      border: `1px solid ${alpha(isDark ? accentColor : theme.palette.primary.main, 0.3)}`,
                      boxShadow: isDark ? "0 18px 45px rgba(3, 7, 18, 0.65)" : "0 18px 45px rgba(14, 18, 68, 0.15)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2} alignItems="center" textAlign="center">
                        <Box
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            background: "linear-gradient(135deg, #FF5E5E 0%, #A84DFF 100%)",
                            color: "common.white",
                          }}
                        >
                          {detail.icon}
                        </Box>

                        <Stack spacing={1}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {detail.label}
                          </Typography>

                          <Typography
                            component="a"
                            href={detail.href}
                            target={detail.external ? "_blank" : undefined}
                            rel={detail.external ? "noopener noreferrer" : undefined}
                            sx={{
                              fontSize: 18,
                              fontWeight: 700,
                              textDecoration: "none",
                              color: "inherit",
                              wordBreak: "break-word",
                            }}
                          >
                            {detail.value}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={{ xs: 4, md: 2 }}>
              {/* Form column */}
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
                    boxShadow: isDark ? "0 24px 48px rgba(3,7,18,0.85)" : "0 24px 48px rgba(15,23,42,0.15)",
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Share Your Project Brief
                    </Typography>
                    <Typography variant="body1" sx={{ color: subtleText }}>
                      Fill out the form and we will reach out within 24 hours with a tailored plan for your requirements.
                    </Typography>
                  </Stack>

                  <Stack component="form" spacing={2} noValidate onSubmit={handleSubmit}>
                    {statusMessage ? <Alert severity={statusSeverity}>{statusMessage}</Alert> : null}

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
                        label="Project Type"
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
                                  color: alpha(theme.palette.text.secondary, isDark ? 0.7 : 0.85),
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

                        {(projectTypes || []).map((type) => (
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
                          background: "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
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
                      boxShadow: isDark ? "0 30px 60px rgba(3, 7, 18, 0.75)" : "0 30px 45px rgba(15, 23, 42, 0.18)",
                      height: { xs: 260, sm: 340, md: 520 },
                      width: "100%",
                      maxWidth: "100%",
                      border: `1px solid ${alpha(isDark ? accentColor : theme.palette.primary.main, 0.22)}`,
                    }}
                  >
                    {/* ✅ MAP IFRAME */}
                    <Box
                      component="iframe"
                      title="Vedx Solution Pvt Ltd map"
                      src={contactLocation.embedUrl}
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

                    {/* ✅ OVERLAY INFO CARD */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        width: { xs: "calc(100% - 28px)", sm: 360 },
                        bgcolor: "common.white",
                        borderRadius: 1,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                        p: 1.5,
                      }}
                    >
                      <Stack spacing={0.8}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>
                              Vedx solution Pvt ltd
                            </Typography>

                            <Typography sx={{ fontSize: 12.5, color: "#374151", lineHeight: 1.4 }}>
                              {contactLocation.address}
                            </Typography>
                          </Box>

                          <Box
                            component="a"
                            href={`https://www.google.com/maps/dir/?api=1&destination=${contactLocation.lat},${contactLocation.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <Typography
                              sx={{
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: "#2563eb",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Directions
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>5.0</Typography>
                          <Rating value={5} precision={0.5} readOnly size="small" />
                          <Typography sx={{ fontSize: 12, color: "#2563eb", fontWeight: 700 }}>2 reviews</Typography>
                        </Stack>

                        <Box
                          component="a"
                          href={contactLocation.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none" }}
                        >
                          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#2563eb" }}>
                            View larger map
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>


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
