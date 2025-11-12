import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const iconComponents = {
  insights: InsightsRoundedIcon,
  groups: Groups2RoundedIcon,
  verified: VerifiedRoundedIcon,
};

const AboutWhyChooseSection = ({ highlights }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
      
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 1.5, fontWeight: 600, color: 'primary.main' }}
          >
            Why Choose Vedx?
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: isDark ? alpha('#ffffff', 0.95) : alpha('#000000', 0.9),
              maxWidth: 640,
            }}
          >
            Trusted partner in delivering end-to-end IT services
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: isDark ? alpha('#ffffff', 0.75) : 'text.secondary', maxWidth: 780, lineHeight: 1.8 }}
          >
            We specialise in custom software development, mobile applications, enterprise solutions, AI and machine learning
            integration, cloud computing, and digital transformation services tailored to your roadmap.
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {highlights?.map((highlight) => {
            const Icon = iconComponents[highlight.icon] ?? StarRoundedIcon;
            return (
              <Grid key={highlight.title} item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    background: isDark
                      ? 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.9) 100%)'
                      : 'linear-gradient(180deg, rgba(226,232,255,0.6) 0%, rgba(255,255,255,0.9) 100%)',
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12),
                      }}
                    >
                      <Icon color="primary" fontSize="large" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {highlight.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {highlight.description}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutWhyChooseSection;
