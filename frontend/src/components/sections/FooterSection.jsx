import { Box, Container, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import { footerLinks } from '../../data/content.js';

const FooterSection = () => {
  return (
    <Box sx={{ bgcolor: '#020205', py: 6, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Typography variant="h5">VEDX Solutions</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Building resilient revenue engines for category-defining teams with strategy, creative, and automation in
                one squad.
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Services
            </Typography>
            <Stack spacing={1.2}>
              {footerLinks.services.map((link) => (
                <Link key={link} href="#" underline="hover" color="text.secondary">
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Resources
            </Typography>
            <Stack spacing={1.2}>
              {footerLinks.resources.map((link) => (
                <Link key={link} href="#" underline="hover" color="text.secondary">
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Get in touch
            </Typography>
            <Stack spacing={1.2}>
              {footerLinks.contact.map((link) => (
                <Typography key={link} variant="body2" sx={{ color: 'text.secondary' }}>
                  {link}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          © {new Date().getFullYear()} VEDX Solutions. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default FooterSection;