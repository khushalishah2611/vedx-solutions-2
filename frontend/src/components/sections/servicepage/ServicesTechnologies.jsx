import {
  Avatar,
  Box,
  Tab,
  Tabs,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { technologyTabs } from "../../../data/servicesPage.js";

const ServicesTechnologies = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const [activeTab, setActiveTab] = useState(0);

  const technologies = useMemo(
    () => technologyTabs[activeTab]?.technologies ?? [],
    [activeTab]
  );

  return (
    <Box component="section">
      {/* Header Section */}
      <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}
        >
          Technologies We Support
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, maxWidth: 760 }}>
          Choose from a comprehensive library of frontend, backend, UI/UX,
          database, and DevOps expertise to ship resilient platforms.
        </Typography>
      </Stack>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        centered={false}
        sx={{
          borderRadius: 0.5,
          bgcolor: alpha(theme.palette.background.paper, isDark ? 0.35 : 0.8),
          width: "fit-content",
          mx: "auto",
          px: 1,
        }}
      >
        {technologyTabs.map((tab, index) => (
          <Tab
            key={tab.category}
            label={tab.category}
            value={index}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 0.5,
              minHeight: 44,
              px: 2,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: theme.palette.primary.contrastText,
              },
            }}
          />
        ))}
      </Tabs>

      {/* Technology Grid */}
      <Grid container spacing={2.5} sx={{ mt: 4 }}>
        {technologies.map((tech) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={tech.name}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 0.5,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.75 : 0.98
                ),
                border: `1px solid ${alpha(
                  theme.palette.divider,
                  isDark ? 0.4 : 0.5
                )}`,
                transition:
                  "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
                boxShadow: isDark
                  ? "0 20px 35px rgba(15,23,42,0.35)"
                  : "0 20px 35px rgba(15,23,42,0.1)",
                "&:hover": {
                  transform: "translateY(-6px)",
                  borderColor: isDark
                    ? "#67e8f9"
                    : theme.palette.primary.main,

                },
              }}
            >
              <Avatar
                src={tech.icon}
                alt={tech.name}
                variant="rounded"
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600, textAlign: "center", "&:hover": {
                    color: isDark ? "#67e8f9" : theme.palette.primary.main,
                  },
                }}
              >
                {tech.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesTechnologies;
