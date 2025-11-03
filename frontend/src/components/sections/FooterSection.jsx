import { Box, Container, Divider, IconButton, Link, Stack, Typography, alpha } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { footerContent } from '../../data/content.js';

const socialIcons = {
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon
};

const FOOTER_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80';

const FooterSection = () => {
  return (
    <Box component="footer" sx={{ position: 'relative', bgcolor: '#020205', mt: { xs: 8, md: 10 } }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${FOOTER_BACKGROUND_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.25)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5,9,18,0.94) 0%, rgba(5,9,18,0.96) 65%, rgba(1,1,3,0.98) 100%)'
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          py: { xs: 6, md: 10 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 5, md: 7 }
        }}
      >
        <Stack spacing={2} textAlign={{ xs: 'center', md: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {footerContent.heading}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.68)',
              maxWidth: 560,
              alignSelf: { xs: 'center', md: 'flex-start' }
            }}
          >
            {footerContent.description}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, md: 6 },
            gridTemplateColumns: {
              xs: 'repeat(1, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(5, minmax(0, 1fr))'
            }
          }}
        >
          {footerContent.columns.map((column) => (
            <Stack key={column.title} spacing={1.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {column.title}
              </Typography>
              <Stack spacing={1}>
                {column.links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    underline="none"
                    color="text.secondary"
                    sx={{ '&:hover': { color: 'common.white' } }}
                  >
                    {link}
                  </Link>
                ))}
              </Stack>
            </Stack>
          ))}

          <Stack spacing={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Stay With Us
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
              Let&apos;s connect on the platforms you love.
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {footerContent.stayWithUs.map((social) => {
                const Icon = socialIcons[social.icon];
                if (!Icon) return null;

                return (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    color="inherit"
                    sx={{
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.18)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        bgcolor: alpha('#67e8f9', 0.18),
                        borderColor: alpha('#67e8f9', 0.45)
                      }
                    }}
                  >
                    <Icon />
                  </IconButton>
                );
              })}
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 0 }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack direction="row" spacing={2.5} flexWrap="wrap" alignItems="center">
            {footerContent.bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                underline="none"
                color="text.secondary"
                sx={{ '&:hover': { color: 'common.white' } }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)' }}>
            {footerContent.copyright}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default FooterSection;
