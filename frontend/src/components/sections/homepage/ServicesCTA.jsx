import { Box, Button, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';

const ServicesCTA = ({ onContactClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box component="section">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
          textAlign: { xs: 'left', md: 'center' },
          background: isDark
            ? 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(59,130,246,0.75))'
            : 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(14,165,233,0.15))',
          border: `1px solid ${alpha('#ffffff', isDark ? 0.1 : 0.35)}`
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Stack spacing={1.5}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Let's Build Your Next Big Product, Together.
            </Typography>
            <Typography variant="body1" sx={{ color: alpha(theme.palette.text.primary, 0.75) }}>
              Let Vedx Solution be your tech growth partner for full stack app development tailored to your needs.
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="large"
            onClick={onContactClick}
            sx={{
              background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
              color: '#fff',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 1.75 },
              '&:hover': {
                background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)'
              }
            }}
          >
            Contact Us
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ServicesCTA;
