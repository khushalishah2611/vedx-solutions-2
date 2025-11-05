import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import { createAnchorHref } from '../../utils/formatters.js';
import { megaMenuContent } from '../../data/content.js';
import {
  serviceHighlights,
  processSteps,
  industriesServed,
  businessSolutions,
  testimonialList,
  engagementModels,
  blogPreviews,
  servicesContactImage,
  contactProjectTypes
} from '../../data/servicesPage.js';

const SERVICES_HERO_IMAGE =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

const ServicesPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? '#67e8f9' : theme.palette.primary.main;
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.4 : 0.6);
  const serviceCategories = megaMenuContent.services.categories;

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box component="section" sx={{ position: 'relative', pt: { xs: 16, md: 20 }, pb: { xs: 10, md: 14 } }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${SERVICES_HERO_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.45)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              isDark
                ? 'linear-gradient(160deg, rgba(15,23,42,0.9) 0%, rgba(2,6,23,0.95) 65%, rgba(2,6,23,0.98) 100%)'
                : 'linear-gradient(160deg, rgba(248,250,252,0.94) 0%, rgba(226,232,240,0.92) 65%, rgba(226,232,240,0.96) 100%)',
            zIndex: 1
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Stack spacing={3} alignItems="flex-start">
            <Chip
              label="Our Services"
              sx={{
                bgcolor: alpha(accentColor, 0.15),
                color: accentColor,
                fontWeight: 600,
                letterSpacing: 0.75,
                px: 1.5,
                py: 1.5,
                borderRadius: 999
              }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: 40, md: 56 }, fontWeight: 800, maxWidth: 720 }}>
              Digital product teams that deliver clarity, velocity, and measurable business growth.
            </Typography>
            <Typography variant="body1" sx={{ color: subtleText, maxWidth: 640 }}>
              Partner with Vedx Solutions to strategise, design, and build experiences that delight users and accelerate
              operations. From discovery workshops to launch and beyond, we bring a human approach to every engagement.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <Stack spacing={{ xs: 6, md: 10 }}>
          <Box component="section" id="services-overview">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
                Explore our core expertise
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                Seamless cross-functional squads cover product strategy, experience design, engineering, and growth enablement.
                Discover the service lane that matches your next initiative.
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {serviceCategories.map((category) => {
                const sectionId = createAnchorHref(category.label).replace('#', '');
                const overlayGradient = isDark
                  ? 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.85) 85%)'
                  : 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.78) 85%)';

                return (
                  <Grid item xs={12} sm={6} md={4} key={category.label}>
                    <Paper
                      component="article"
                      id={sectionId}
                      elevation={0}
                      sx={{
                        position: 'relative',
                        borderRadius: 3,
                        overflow: 'hidden',
                        minHeight: 360,
                        display: 'flex',
                        flexDirection: 'column',
                        color: 'common.white',
                        backgroundColor: alpha('#0f172a', 0.95),
                        boxShadow: isDark
                          ? '0 28px 60px rgba(2,6,23,0.65)'
                          : '0 28px 60px rgba(15,23,42,0.22)'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${category.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transform: 'scale(1.05)'
                        }}
                      />
                      <Box sx={{ position: 'absolute', inset: 0, background: overlayGradient }} />
                      <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1, p: 3.5, flexGrow: 1 }}>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {category.label}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, color: alpha('#ffffff', 0.75) }}>
                            {category.description}
                          </Typography>
                        </Box>
                        <Divider sx={{ borderColor: alpha('#ffffff', 0.2) }} />
                        <Stack spacing={1.2}>
                          {category.subItems.map((item) => {
                            const itemAnchor = createAnchorHref(item).replace('#', '');
                            return (
                              <Stack
                                key={item}
                                id={itemAnchor}
                                direction="row"
                                spacing={1.2}
                                alignItems="center"
                              >
                                <ArrowOutwardRoundedIcon sx={{ fontSize: 18, color: alpha('#ffffff', 0.75) }} />
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{ color: alpha('#ffffff', 0.85) }}
                                >
                                  {item}
                                </Typography>
                              </Stack>
                            );
                          })}
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />

          <Box component="section">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
                Why choose Vedx Solutions
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                A partner obsessed with outcomes, clarity, and dependable delivery. We build every engagement around collaboration
                and trust.
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              {serviceHighlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <Grid item xs={12} sm={6} md={4} key={highlight.title}>
                    <Paper
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.95),
                        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                        boxShadow: isDark
                          ? '0 20px 45px rgba(15,23,42,0.35)'
                          : '0 20px 45px rgba(15,23,42,0.12)'
                      }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: alpha(accentColor, 0.16),
                          color: accentColor
                        }}
                      >
                        <Icon />
                      </Box>
                      <Stack spacing={1}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {highlight.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: subtleText }}>
                          {highlight.description}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />

          <Box component="section">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
                Process
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                We follow a transparent roadmap—from discovery to deployment—so you always know what is happening next.
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {processSteps.map((step, index) => (
                <Grid item xs={12} md={4} key={step.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.95),
                      border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        height: 200,
                        backgroundImage: `url(${step.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          px: 2,
                          py: 0.5,
                          borderRadius: 999,
                          background: alpha('#0f172a', 0.7),
                          color: 'common.white',
                          fontWeight: 600,
                          letterSpacing: 1.2
                        }}
                      >
                        {index + 1}
                      </Box>
                    </Box>
                    <Stack spacing={1.5} sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: subtleText }}>
                        {step.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />

          <Box component="section">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
                Industry we serve
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                Deep domain partnerships let us tailor solutions that match regulatory, customer, and market realities across
                sectors.
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {industriesServed.map((industry) => (
                <Grid item xs={12} sm={6} md={3} key={industry.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      color: 'common.white',
                      backgroundColor: alpha('#0f172a', 0.95),
                      boxShadow: isDark
                        ? '0 28px 60px rgba(2,6,23,0.65)'
                        : '0 28px 60px rgba(15,23,42,0.22)'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${industry.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: 'scale(1.05)'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: isDark
                          ? 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.85) 90%)'
                          : 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.78) 90%)'
                      }}
                    />
                    <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {industry.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8) }}>
                        {industry.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />

          <Box component="section">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
                Tech solutions for all business types
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                Whether you are validating an idea or optimising global operations, our playbooks adapt to your stage and
                ambition.
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {businessSolutions.map((solution) => (
                <Grid item xs={12} sm={6} md={3} key={solution.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.95),
                      border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {solution.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: subtleText }}>
                        {solution.description}
                      </Typography>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                      variant="text"
                      color="inherit"
                      endIcon={<ArrowOutwardRoundedIcon />}
                      sx={{
                        alignSelf: 'flex-start',
                        fontWeight: 600,
                        color: accentColor,
                        textTransform: 'none'
                      }}
                    >
                      {solution.cta}
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />

          <Box component="section">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
                What people are saying
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                Teams trust Vedx Solutions for transparent communication and consistent delivery.
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {testimonialList.map((testimonial) => (
                <Grid item xs={12} md={6} key={testimonial.name}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.96),
                      border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                      boxShadow: isDark
                        ? '0 30px 60px rgba(2,6,23,0.45)'
                        : '0 30px 60px rgba(15,23,42,0.18)'
                    }}
                  >
                    <FormatQuoteRoundedIcon sx={{ fontSize: 48, color: alpha(accentColor, 0.8) }} />
                    <Typography variant="body1" sx={{ color: subtleText, fontStyle: 'italic' }}>
                      {testimonial.quote}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: subtleText }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />

          <Box component="section">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
                Ways to choose our expertise
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                Select the engagement model that matches your budget, timeline, and delivery rhythm.
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {engagementModels.map((model) => (
                <Grid item xs={12} md={4} key={model.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      color: 'common.white',
                      backgroundColor: alpha('#0f172a', 0.95),
                      boxShadow: isDark
                        ? '0 30px 70px rgba(2,6,23,0.6)'
                        : '0 30px 70px rgba(15,23,42,0.22)'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${model.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: 'scale(1.05)'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: isDark
                          ? 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.85) 85%)'
                          : 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.78) 85%)'
                      }}
                    />
                    <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1, p: 3.5 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {model.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8) }}>
                        {model.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />

          <Box component="section">
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.97),
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                boxShadow: isDark
                  ? '0 30px 70px rgba(2,6,23,0.55)'
                  : '0 30px 70px rgba(15,23,42,0.18)'
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{
                    minHeight: { xs: 220, md: '100%' },
                    backgroundImage: `url(${servicesContactImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <Grid item xs={12} md={7}>
                  <Stack spacing={3} sx={{ p: { xs: 4, md: 6 } }}>
                    <Stack spacing={1}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Ready to build something remarkable?
                      </Typography>
                      <Typography variant="body1" sx={{ color: subtleText }}>
                        Tell us about your next project and we will assemble the right team within 48 hours.
                      </Typography>
                    </Stack>
                    <Stack component="form" spacing={2.5}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                        <TextField label="Name" fullWidth required variant="outlined" />
                        <TextField label="Email" type="email" fullWidth required variant="outlined" />
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                        <TextField label="Mobile Number" fullWidth variant="outlined" />
                        <TextField select label="Project Type" fullWidth defaultValue={contactProjectTypes[0]}>
                          {contactProjectTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Stack>
                      <TextField label="Description" fullWidth multiline minRows={4} variant="outlined" />
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          alignSelf: 'flex-start',
                          background: 'linear-gradient(90deg, #FF5E5E 0%, #A855F7 100%)',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)'
                          }
                        }}
                      >
                        Submit Now
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          <Divider sx={{ borderColor: dividerColor }} />

          <Box component="section">
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 42 }, fontWeight: 700 }}>
                Latest blogs
              </Typography>
              <Typography variant="body1" sx={{ color: subtleText, maxWidth: 720 }}>
                Insights from our engineering, product, and growth teams to help you stay ahead.
              </Typography>
            </Stack>
            <Grid container spacing={4}>
              {blogPreviews.map((post) => (
                <Grid item xs={12} md={4} key={post.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.75 : 0.97),
                      border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        backgroundImage: `url(${post.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <Stack spacing={1.5} sx={{ p: 3, flexGrow: 1 }}>
                      <Chip
                        label={post.category}
                        sx={{
                          alignSelf: 'flex-start',
                          bgcolor: alpha(accentColor, 0.15),
                          color: accentColor,
                          fontWeight: 600
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {post.title}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
                        <CheckCircleRoundedIcon sx={{ fontSize: 18, color: accentColor }} />
                        <Typography variant="body2" sx={{ color: subtleText }}>
                          5 min read
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ServicesPage;
