import React from "react";
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
import PropTypes from "prop-types";
import { AppButton } from "../../shared/FormControls.jsx";

const CareerOpenRolesSection = ({
  roles = [],
  applyHref = null,
  title = "Does your skill fit the job post?",
  description = "",
  onApply = null,
  forceMode = null, // "dark" | "light" | null (optional)
}) => {
  const theme = useTheme();

  // ✅ Theme driven (optional override)
  const isDark =
    forceMode === "dark"
      ? true
      : forceMode === "light"
      ? false
      : theme.palette.mode === "dark";

  // ✅ Design tokens (dark + light)
  const tokens = isDark
    ? {
        sectionBg:
          "radial-gradient(900px 500px at 0% 50%, rgba(14, 165, 233, 0.18) 0%, rgba(0,0,0,0) 55%), #000",
        cardBg: "#0b0f14",
        border: alpha("#ffffff", 0.22),
        borderHover: alpha("#ffffff", 0.4),
        divider: alpha("#ffffff", 0.18),
        title: "#ffffff",
        text: alpha("#ffffff", 0.86),
        muted: alpha("#ffffff", 0.74),
        dim: alpha("#ffffff", 0.6),
        buttonBg: alpha("#000", 0.22),
        buttonBorder: alpha("#ffffff", 0.24),
        buttonBorderHover: alpha("#ffffff", 0.4),
        buttonBgHover: alpha("#ffffff", 0.06),
        glow: "radial-gradient(420px 260px at 80% 30%, rgba(168, 85, 247, 0.12), rgba(0,0,0,0) 60%)",
      }
    : {
        sectionBg:
          "radial-gradient(900px 500px at 0% 50%, rgba(14, 165, 233, 0.14) 0%, rgba(255,255,255,0) 55%), #F8FAFC",
        cardBg: "#ffffff",
        border: alpha("#0f172a", 0.14),
        borderHover: alpha("#0f172a", 0.22),
        divider: alpha("#0f172a", 0.1),
        title: "#0f172a",
        text: alpha("#0f172a", 0.86),
        muted: alpha("#0f172a", 0.7),
        dim: alpha("#0f172a", 0.58),
        buttonBg: alpha("#0f172a", 0.03),
        buttonBorder: alpha("#0f172a", 0.18),
        buttonBorderHover: alpha("#0f172a", 0.28),
        buttonBgHover: alpha("#0f172a", 0.06),
        glow: "radial-gradient(420px 260px at 80% 30%, rgba(79, 70, 229, 0.10), rgba(255,255,255,0) 60%)",
      };

  const renderCard = (role, idx) => {
    const key =
      role?.id ??
      (role?.title ? `${role.title}-${idx}` : `role-${idx}`);

    return (
      <Paper
        key={key}
        elevation={0}
        sx={{
          height: "100%",
          px: { xs: 3, md: 3.5 },
          py: { xs: 3, md: 3.2 },
          borderRadius: "24px",
          background: `${tokens.glow}, ${tokens.cardBg}`,
          border: `1px solid ${tokens.border}`,
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          boxShadow: isDark
            ? "0 0 0 rgba(0,0,0,0)"
            : "0 10px 30px rgba(2, 6, 23, 0.06)",
          "&:hover": {
            transform: "translateY(-6px)",
            borderColor: tokens.borderHover,
            boxShadow: isDark
              ? "0 14px 35px rgba(0,0,0,0.45)"
              : "0 16px 40px rgba(2, 6, 23, 0.10)",
          },
        }}
      >
        <Stack spacing={2.2}>
          {/* Title */}
          <Typography
            sx={{
              color: tokens.title,
              fontWeight: 800,
              fontSize: { xs: 22, md: 26 },
              lineHeight: 1.15,
            }}
          >
            {role?.title || "Untitled Role"}
          </Typography>

          {/* Divider */}
          <Divider sx={{ borderColor: tokens.divider }} />

          {/* Meta lines */}
          <Stack spacing={0.8}>
            {role?.experience ? (
              <Typography sx={{ color: tokens.muted, fontSize: 15 }}>
                <Box component="span" sx={{ color: tokens.dim }}>
                  Experience:
                </Box>{" "}
                {role.experience}
              </Typography>
            ) : null}

            {role?.positions ? (
              <Typography sx={{ color: tokens.muted, fontSize: 15 }}>
                <Box component="span" sx={{ color: tokens.dim }}>
                  Positions:
                </Box>{" "}
                {role.positions}
              </Typography>
            ) : null}
          </Stack>

          {/* Button */}
          {(applyHref || onApply) ? (
            <Box sx={{ pt: 1, display: "flex", justifyContent: "center" }}>
              <AppButton
                variant="outlined"
                href={onApply ? undefined : applyHref}
                onClick={onApply ? () => onApply(role) : undefined}
                sx={{
                  textTransform: "none",
                  px: 2.4,
                  py: 0.9,
                  minWidth: 120,
                  borderRadius: "10px",
                  color: tokens.text,
                  borderColor: tokens.buttonBorder,
                  backgroundColor: tokens.buttonBg,
                  "&:hover": {
                    borderColor: tokens.buttonBorderHover,
                    backgroundColor: tokens.buttonBgHover,
                  },
                }}
              >
                Apply Now
              </AppButton>
            </Box>
          ) : null}
        </Stack>
      </Paper>
    );
  };

  // ✅ 3 cards top row, 4th next row left (same as your screenshot layout)
  const firstRow = roles.slice(0, 3);
  const secondRowFirst = roles.slice(3, 4);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        background: tokens.sectionBg,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}>
        <Stack
          spacing={1.6}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 5 }}
        >
          <Typography
            sx={{
              color: tokens.title,
              fontWeight: 800,
              fontSize: { xs: 26, md: 40 },
              letterSpacing: 0.2,
            }}
          >
            {title}
          </Typography>

          {description ? (
            <Typography
              sx={{
                color: tokens.muted,
                maxWidth: 760,
                lineHeight: 1.7,
              }}
            >
              {description}
            </Typography>
          ) : null}
        </Stack>

        {/* Row 1: 3 cards */}
        <Grid container spacing={3}>
          {firstRow.map((role, idx) => (
            <Grid key={role?.id ?? `${role?.title || "role"}-${idx}`} item xs={12} md={4}>
              {renderCard(role, idx)}
            </Grid>
          ))}
        </Grid>

        {/* Row 2: 1 card left */}
        {secondRowFirst.length ? (
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={4}>
              {renderCard(secondRowFirst[0], 3)}
            </Grid>

            {/* Empty columns for left alignment on desktop */}
            <Grid item md={8} sx={{ display: { xs: "none", md: "block" } }} />
          </Grid>
        ) : null}
      </Box>
    </Box>
  );
};

CareerOpenRolesSection.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      experience: PropTypes.string,
      positions: PropTypes.string,
    })
  ),
  applyHref: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onApply: PropTypes.func,

  // optional: force mode for this section only
  forceMode: PropTypes.oneOf(["dark", "light", null]),
};

export default CareerOpenRolesSection;
