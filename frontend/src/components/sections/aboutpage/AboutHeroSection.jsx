import { Grid, Stack, Typography, alpha, useTheme } from '@mui/material';
import HeroMediaShowcase from '../../shared/HeroMediaShowcase.jsx';

const AboutHeroSection = ({ hero, stats, onCtaClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!hero) {
    return null;
  }

  const eyebrow = hero.label ?? hero.eyebrow ?? hero.badge ?? hero.subtitle;
  const description = hero.description ?? hero.caption ?? hero.body;
  const extendedDescription =
    hero.extendedDescription ?? hero.secondaryDescription ?? hero.subtext;
  const baseImage = hero.baseImage ?? hero.image ?? hero.primaryImage;
  const overlayImage =
    hero.overlayImage ?? hero.secondaryImage ?? hero.image ?? hero.baseImage;
  const heroStats = Array.isArray(stats)
    ? stats
    : Array.isArray(hero.stats)
    ? hero.stats
    : [];

  const heroBackground =
    hero.background ||
    (isDark
      ? 'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,64,175,0.75) 55%, rgba(99,102,241,0.3) 100%)'
      : 'linear-gradient(135deg, rgba(226,232,255,0.96) 0%, rgba(191,219,254,0.85) 55%, rgba(79,70,229,0.12) 100%)');

  const statValueColor = isDark
    ? alpha('#ffffff', 0.95)
    : alpha(theme.palette.primary.contrastText ?? '#0f172a', 0.92);

  return (
    <HeroMediaShowcase
      eyebrow={eyebrow}
      title={hero.title}
      description={description}
      extendedDescription={extendedDescription}
      baseImage={baseImage}
      overlayImage={overlayImage}
      ctaLabel={hero.ctaLabel}
      onCtaClick={onCtaClick}
      sx={{
        pt: { xs: 12, md: 14 },
        pb: { xs: 10, md: 12 },
        background: heroBackground,
        borderRadius: { xs: 4, md: 6 },
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
        boxShadow: isDark
          ? '0 30px 60px rgba(15,23,42,0.55)'
          : '0 40px 70px rgba(79,70,229,0.18)',
        overflow: 'hidden',
        mx: { xs: 2, md: 4 },
        '& > .MuiContainer-root': {
          position: 'relative',
          zIndex: 1,
          px: { xs: 3, md: 6 },
        },
      }}
    >
      {heroStats.length > 0 && (
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ pt: 1 }}>
          {heroStats.map((stat) => {
            const key = stat.label ?? stat.title ?? stat.value;

            return (
              <Grid key={key} item xs={6} sm={3}>
                <Stack spacing={0.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: statValueColor }}
                  >
                    {stat.value ?? stat.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha('#ffffff', isDark ? 0.75 : 0.82),
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {stat.label ?? stat.subtitle}
                  </Typography>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      )}
    </HeroMediaShowcase>
  );
};

export default AboutHeroSection;
