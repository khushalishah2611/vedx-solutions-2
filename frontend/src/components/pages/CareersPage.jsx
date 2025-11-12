import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  careerBenefits,
  careerCta,
  careerHero,
  careerLogos,
  careerOpenings,
  careerStory,
  hiringJourney
} from '../../data/company.js';

const CareersPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ bgcolor: 'background.default', pb: { xs: 10, md: 16 } }}>
      <Box
        sx={{
          position: 'relative',
          color: '#fff',
          pt: { xs: 14, md: 18 },
          pb: { xs: 12, md: 16 },
          backgroundImage: `linear-gradient(120deg, rgba(8,13,35,0.85) 10%, rgba(42,11,80,0.75) 55%, rgba(0,136,204,0.7) 100%), url(${careerHero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3.5} sx={{ maxWidth: { xs: '100%', md: 720 } }}>
            <Typography variant="h3" sx={{ fontSize: { xs: 34, md: 48 }, fontWeight: 700, lineHeight: 1.2 }}>
              {careerHero.title}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: 16, md: 18 }, color: alpha('#ffffff', 0.9) }}>
              {careerHero.description}
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8), maxWidth: 560 }}>
              {careerHero.caption}
            </Typography>
            <Button
              variant="contained"
              size="large"
              component="a"
              href={careerHero.ctaHref}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                alignSelf: 'flex-start',
                px: 4,
                py: 1.25,
                borderRadius: 999,
                bgcolor: '#f43f5e',
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: alpha('#f43f5e', 0.85)
                }
              }}
            >
              {careerHero.ctaLabel}
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Chip
                label={careerStory.badge}
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  letterSpacing: 1,
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.22 : 0.12),
                  color: theme.palette.primary.main
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: 28, md: 36 } }}>
                {careerStory.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {careerStory.description}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {careerStory.body}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {careerStory.culture}
              </Typography>
              <Stack spacing={1.5}>
                {careerStory.highlights.map((item) => (
                  <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        mt: 1,
                        bgcolor: theme.palette.primary.main
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 5,
                overflow: 'hidden',
                minHeight: { xs: 260, md: 420 },
                backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.65)), url(${careerStory.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: isDark
                  ? '0px 45px 80px rgba(15,23,42,0.6)'
                  : '0px 40px 70px rgba(15,118,110,0.25)'
              }}
            />
          </Grid>
        </Grid>
      </Container>

      <Container id="benefits" maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700 }}>
            Why Join Vedx?
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Benefits that keep our teams energised
          </Typography>
        </Stack>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {careerBenefits.map((benefit) => (
            <Grid key={benefit.title} item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: { xs: 4, md: 4 },
                  borderRadius: 5,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: alpha(theme.palette.background.paper, isDark ? 0.35 : 0.65),
                  border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.25 : 0.12)}`
                }}
              >
                <Avatar
                  src={benefit.icon}
                  alt={benefit.title}
                  variant="rounded"
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    borderRadius: 18
                  }}
                />
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {benefit.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            background: isDark
              ? 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(67,56,202,0.6) 100%)'
              : 'linear-gradient(135deg, rgba(224,242,254,0.95) 0%, rgba(191,219,254,0.9) 100%)'
          }}
        >
          <Stack spacing={4}>
            <Stack spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} textAlign={{ xs: 'left', md: 'center' }}>
              <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: isDark ? alpha('#fff', 0.8) : 'text.secondary' }}>
                Work With Us, Grow With Us
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#fff' : 'text.primary' }}>
                Trusted by teams that ship at scale
              </Typography>
            </Stack>
            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="center">
              {careerLogos.map((brand) => (
                <Grid key={brand.name} item xs={6} sm={4} md={2}>
                  <Box
                    component="img"
                    src={brand.logo}
                    alt={brand.name}
                    sx={{
                      width: '100%',
                      height: 52,
                      objectFit: 'contain',
                      filter: isDark ? 'brightness(0) invert(1)' : 'none',
                      opacity: isDark ? 0.9 : 1
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>
      </Container>

      <Container id="journey" maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            Hiring Process
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Your journey with Vedx
          </Typography>
        </Stack>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: 5,
            border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.3)}`
          }}
        >
          <Grid
            container
            spacing={{ xs: 5, md: 0 }}
            columnSpacing={{ md: 4 }}
            justifyContent="center"
          >
            {hiringJourney.map((step, index) => {
              const isLast = index === hiringJourney.length - 1;

              return (
                <Grid key={step.step} item xs={12} md={2}>
                  <Stack
                    spacing={2}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    textAlign={{ xs: 'left', md: 'center' }}
                    sx={{
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        display: { xs: 'none', md: isLast ? 'none' : 'block' },
                        position: 'absolute',
                        top: 24,
                        left: `calc(50% + ${theme.spacing(4)})`,
                        width: `calc(100% + ${theme.spacing(4)})`,
                        height: 2,
                        bgcolor: alpha(theme.palette.primary.main, isDark ? 0.35 : 0.18)
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 18,
                        bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12),
                        color: theme.palette.primary.main,
                        boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, isDark ? 0.3 : 0.2)}`
                      }}
                    >
                      {step.step}
                    </Box>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {step.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Container>

      <Container id="open-roles" maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Stack spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }} textAlign={{ xs: 'left', md: 'center' }} sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            Does your skill fit the job post?
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Explore opportunities that match your craft
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 640 }}>
            We\'re always on the lookout for passionate innovators. Choose the role that aligns with your strengths and let\'s build impactful products together.
          </Typography>
        </Stack>
        <Grid container spacing={{ xs: 4, md: 4 }}>
          {careerOpenings.map((role) => (
            <Grid key={role.title} item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  p: { xs: 4, md: 5 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`,
                  bgcolor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.7)
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {role.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {role.description}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', fontWeight: 600, flexWrap: 'wrap' }}>
                  <Typography variant="caption">{role.experience}</Typography>
                  <Typography variant="caption">{role.positions}</Typography>
                  <Typography variant="caption">{role.type}</Typography>
                </Stack>
                <Button
                  variant="contained"
                  component="a"
                  href={careerHero.ctaHref}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    alignSelf: 'flex-start',
                    borderRadius: 999,
                    px: 3,
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.85)
                    }
                  }}
                >
                  Apply Now
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 5,
            px: { xs: 4, md: 6 },
            py: { xs: 5, md: 7 },
            backgroundImage: `linear-gradient(120deg, rgba(59,7,100,0.8), rgba(14,116,144,0.7)), url(${careerCta.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff'
          }}
        >
          <Stack
            spacing={2.5}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={1.5} sx={{ maxWidth: 520 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {careerCta.title}
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.9) }}>
                {careerCta.description}
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.75) }}>
                {careerCta.caption}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              size="large"
              component="a"
              href={careerCta.ctaHref}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                borderRadius: 999,
                px: 4,
                bgcolor: '#f43f5e',
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: alpha('#f43f5e', 0.85)
                }
              }}
            >
              {careerCta.ctaLabel}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CareersPage;
