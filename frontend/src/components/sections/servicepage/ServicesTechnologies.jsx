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
} from '@mui/material';
import { useMemo, useState } from 'react';
import { technologyTabs } from '../../../data/servicesPage.js';

const ServicesTechnologies = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const [activeTab, setActiveTab] = useState(0);

  const technologies = useMemo(
    () => technologyTabs[activeTab]?.technologies ?? [],
    [activeTab]
  );

  return (
    <Box component="section" sx={{ mt: { xs: 6, md: 8 } }}>
      {/* Header Section */}
      <Stack
        spacing={2.5}
        alignItems="center"
        textAlign="center"
        sx={{ mb: { xs: 4, md: 5 }, px: { xs: 2, md: 0 } }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: 28, md: 40 },
            fontWeight: 700,
          }}
        >
          Technologies We Support
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: subtleText,
            maxWidth: 760,
          }}
        >
          Choose from a comprehensive library of frontend, backend, UI/UX,
          database, and DevOps expertise to ship resilient platforms.
        </Typography>
      </Stack>

      {/* Tabs */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 2, md: 0 },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          centered={false}
          sx={{
            borderRadius: 0.5,
            bgcolor: alpha(
              theme.palette.background.paper,
              isDark ? 0.35 : 0.8
            ),
            maxWidth: '100%',
            px: 1,
            '& .MuiTabs-flexContainer': {
              gap: 4,
            },
          }}
        >
          {technologyTabs.map((tab, index) => (
            <Tab
              key={tab.category}
              label={tab.category}
              value={index}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 0.5,
                minHeight: 44,
                px: { xs: 1.5, md: 2.5 },
                fontSize: { xs: 13, md: 14 },
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Technology Grid */}
      <Grid
        container
        spacing={2.5}
        sx={{
          mt: { xs: 4, md: 5 },
          px: { xs: 2, md: 0 },
        }}
      >
        {technologies.map((tech) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={2}
            key={tech.name}
          >
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 0.5,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
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
                  'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
                boxShadow: isDark
                  ? '0 20px 35px rgba(15,23,42,0.35)'
                  : '0 20px 35px rgba(15,23,42,0.08)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: isDark ? '#67e8f9' : theme.palette.primary.main,
                  boxShadow: isDark
                    ? '0 24px 40px rgba(15,23,42,0.6)'
                    : '0 24px 40px rgba(15,23,42,0.14)',
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
                  fontWeight: 600,
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  transition: 'color 0.3s ease, background-image 0.3s ease',
                  '&:hover': {
                    color: 'transparent',
                    backgroundImage:
                      'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
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
