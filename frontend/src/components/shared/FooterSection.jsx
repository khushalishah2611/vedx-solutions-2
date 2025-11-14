import {
  Box,
  Container,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { footerContent } from '../../data/content.js';
import { createAnchorHref } from '../../utils/formatters.js';
import { Link as RouterLink } from 'react-router-dom';

const socialIcons = {
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon
};

const FOOTER_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80';

const FooterSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const overlayGradient = isDark
    ? 'linear-gradient(180deg, rgba(5,9,18,0.94) 0%, rgba(5,9,18,0.96) 65%, rgba(1,1,3,0.98) 100%)'
    : `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.9)} 0%, ${alpha(
      theme.palette.background.default,
      0.95
    )} 65%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`;
  const mutedTextColor = isDark
    ? alpha('#ffffff', 0.7)
    : alpha(theme.palette.text.primary, 0.75);
  const subtleTextColor = isDark
    ? alpha('#ffffff', 0.65)
    : alpha(theme.palette.text.secondary, 0.85);
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;

  return (
    <Box
      component="footer"
      sx={{ position: 'relative', bgcolor: theme.palette.background.default, mt: { xs: 8, md: 10 } }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${FOOTER_BACKGROUND_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: isDark ? 'brightness(0.25)' : 'brightness(0.65)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: overlayGradient
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
          gap: { xs: 6, md: 8 }
        }}
      >
        <Stack
          spacing={2.5}
          alignItems="flex-start"
          sx={{
            textAlign: 'left',
            maxWidth: { xs: '100%', md: '60%' },
            animation: 'fadeInUp 0.8s ease forwards'
          }}
        >
          <Box
            component="img"
            src={
              'https://vedxsolution.com/wp-content/uploads/2024/04/logo-white.png'
            }
            alt="VedX Solutions logo"
            sx={{ height: 50, width: 150, objectFit: 'contain' }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {footerContent.heading}
          </Typography>

        </Stack>
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.6) }} />
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, md: 6 },
            gridTemplateColumns: {
              xs: 'repeat(1, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(5, minmax(0, 1fr))'
            },
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(24px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          {footerContent.columns.map((column, index) => (
            <Stack
              key={column.title}
              spacing={1.5}
              sx={{
                animation: 'fadeInUp 0.8s ease forwards',
                animationDelay: `${0.1 * (index + 1)}s`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                {column.title}
              </Typography>
              <Stack spacing={1}>
                {column.links.map((link) => {
                  const linkData = typeof link === 'string' ? { label: link } : link;
                  const resolvedHref = linkData.href ?? createAnchorHref(linkData.label);
                  const isRouteLink = resolvedHref.startsWith('/');
                  const linkProps = isRouteLink
                    ? { component: RouterLink, to: resolvedHref }
                    : { href: resolvedHref };

                  return (
                    <Link
                      key={linkData.label}
                      underline="none"
                      color="text.secondary"
                      {...linkProps}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.3s ease, background-image 0.3s ease',
                        '&:hover': {
                          color: 'transparent',
                          backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        },

                      }}
                    >
                      {linkData.label}
                    </Link>
                  );
                })}
              </Stack>
            </Stack>
          ))}

          <Stack
            spacing={1.5}
            sx={{
              animation: 'fadeInUp 0.8s ease forwards',
              animationDelay: `${0.1 * (footerContent.columns.length + 1)}s`
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Stay With Us
            </Typography>
            <Typography variant="body2" sx={{ color: subtleTextColor }}>
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
                      border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                      bgcolor: alpha(isDark ? '#ffffff' : theme.palette.primary.light, isDark ? 0.08 : 0.12),
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(accentColor, 0.25),
                        borderColor: alpha(accentColor, 0.6),
                        transform: 'translateY(-2px)'
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

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.6) }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 0 }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack direction="row" spacing={2.5} flexWrap="wrap" alignItems="center">
            {footerContent.bottomLinks.map((link) => {
              const isRouteLink = link.href.startsWith('/');
              const linkProps = isRouteLink ? { component: RouterLink, to: link.href } : { href: link.href };
              return (
                <Link
                  key={link.label}
                  underline="none"
                  color="text.secondary"
                  {...linkProps}
                  sx={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease, background-image 0.3s ease',
                    '&:hover': {
                      color: 'transparent',
                      backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: isDark ? alpha('#ffffff', 0.55) : alpha(theme.palette.text.secondary, 0.75) }}
          >
            {footerContent.copyright}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default FooterSection;
