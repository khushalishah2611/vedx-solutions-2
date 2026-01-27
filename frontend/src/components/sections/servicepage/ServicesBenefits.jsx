import { Box, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { AppButton } from '../../shared/FormControls.jsx';

import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { fullStackServiceFeatures } from "../../../data/servicesPage.js";

const highlightIcons = [
  WorkspacePremiumRoundedIcon,
  VerifiedRoundedIcon,
  AutoAwesomeRoundedIcon,
];

const ServicesBenefits = ({
  onContactClick,
  onRequestContact,
  contactAnchorId = 'contact-section',
  title,
  description,
  benefits,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const handleRequestQuote = () => {
    onRequestContact?.('');
    onContactClick?.();
    const anchor = document.getElementById(contactAnchorId);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box
      component="section"

    >
      {/* Section Header */}
      <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 32, md: 42 },
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {title || 'Benefits of a Full Stack Development Company'}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 760,
            lineHeight: 1.7,
          }}
        >
          {description ||
            `From strategy to support, VedX Solutions unifies design, engineering,
          DevOps, and analytics to deliver outcome-driven digital products.`}
        </Typography>
      </Stack>

      {/* Feature Grid */}
      <Grid
        container
        spacing={3}
        sx={{
          textAlign: "center",
          alignItems: "stretch",
        }}
      >
        {(benefits?.length ? benefits : fullStackServiceFeatures).map((feature, index) => {
          const Icon =
            feature.icon || highlightIcons[index % highlightIcons.length];

          return (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 0.5,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    isDark ? 0.75 : 0.97
                  ),
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.4 : 0.6
                  )}`,
                  transition:
                    "transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease",
                  boxShadow: isDark
                    ? "0 4px 30px rgba(2,6,23,0.35)"
                    : "0 4px 30px rgba(15,23,42,0.15)",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",

                    borderColor: alpha(accentColor, 0.5),
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: alpha(accentColor, 0.16),
                    color: accentColor,
                    mb: 2,
                  }}
                >
                  {feature.image ? (
                    <Box
                      component="img"
                      src={feature.image}
                      alt={feature.title}
                      sx={{ width: 40, height: 40, objectFit: 'contain' }}
                    />
                  ) : (
                    Icon && <Icon fontSize="medium" />
                  )}
                </Box>

                {/* Text */}
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{
                    fontWeight: 700, textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease, background-image 0.3s ease',
                    '&:hover': {
                      color: 'transparent',
                      backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: subtleText }}>
                    {feature.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* CTA Button */}
      <Stack alignItems="center" sx={{ width: "100%", mt: 6 }}>
        <AppButton
          variant="contained"
          size="large"
          endIcon={<ArrowOutwardRoundedIcon />}
          onClick={handleRequestQuote}
          sx={{
            background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
            color: "#fff",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1.1rem",
            px: { xs: 4, md: 8 },
            py: { xs: 1.5, md: 2 },
            "&:hover": {
              background: "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
            },
          }}
        >
          Request a Quote
        </AppButton>
      </Stack>
    </Box>
  );
};

export default ServicesBenefits;
