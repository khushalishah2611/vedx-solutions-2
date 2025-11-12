import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PropTypes from 'prop-types';

const CareerOpenRolesSection = ({ roles = [], applyHref }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const hasRoles = Array.isArray(roles) && roles.length > 0;

  const resolveHref = (role) => {
    if (!applyHref) return undefined;
    return typeof applyHref === 'function' ? applyHref(role) : applyHref;
  };

  return (
    <Container id="open-roles" maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
      {/* Header */}
      <Stack
        spacing={3}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        textAlign={{ xs: 'left', md: 'center' }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Does your skill fit the job post?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 640 }}>
          We're always on the lookout for passionate innovators. Choose the role that aligns with your strengths and let's build impactful products together.
        </Typography>
      </Stack>

      {!hasRoles ? (
        <Paper
          elevation={0}
          role="status"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 1,
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.25)}`,
            bgcolor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.7),
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No open roles at the moment. Please check back soon.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {roles.map((role, idx) => {
            const key = `${role?.title || 'role'}-${idx}`;
            const href = resolveHref(role);
            const disabledApply = !href;

            return (
              <Grid key={key} item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  component="article"
                  tabIndex={0}
                  sx={{
                    height: '100%',
                    borderRadius: 0.5,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                     boxShadow: isDark
                        ? '0 8px 24px rgba(0,0,0,0.35)'
                        : '0 8px 24px rgba(0,0,0,0.12)',
                    gap: 2.5,
                    border: `1px solid ${alpha(isDark ? "#67e8f9" : theme.palette.primary.main, isDark ? 0.5 : 0.25)}`,
                    bgcolor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.7),
                    outline: 'none',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    '&:hover, &:focus-visible': {
                      transform: 'translateY(-3px)',
                      borderColor: alpha(isDark ? "#67e8f9" : theme.palette.primary.main, 0.4),
                     
                    },
                  }}
                >
                  <Stack spacing={1.5}>
                    {!!role?.title && (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          transition: 'color 0.2s ease',
                          '&:hover': {
                            color: isDark ? '#67e8f9' : theme.palette.primary.main,
                          },
                        }}
                      >
                        {role.title}
                      </Typography>
                    )}
                    {!!role?.description && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {role.description}
                      </Typography>
                    )}
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ color: 'text.secondary', fontWeight: 600, flexWrap: 'wrap' }}
                  >
                    {!!role?.experience && <Typography variant="caption">{role.experience}</Typography>}
                    {!!role?.positions && <Typography variant="caption">{role.positions}</Typography>}
                    {!!role?.type && <Typography variant="caption">{role.type}</Typography>}
                    {!!role?.location && <Typography variant="caption">{role.location}</Typography>}
                  </Stack>

                  <Box
                    sx={{
                      mt: 'auto',
                     
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'start',
                    }}
                  >
                    <Button
                      component={href ? 'a' : 'button'}
                      href={href}
                      target={href && href.startsWith('http') ? '_blank' : undefined}
                      rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      disabled={disabledApply}
                      variant="contained"
                      size="large"
                      startIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                        color: '#fff',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2,
                        '&:hover': {
                          background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                        },
                        '&:disabled': {
                          opacity: 0.6,
                          cursor: 'not-allowed',
                        },
                      }}
                      aria-label={href ? `Apply for ${role?.title || 'this role'}` : 'Apply link unavailable'}
                    >
                      Apply Now
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

CareerOpenRolesSection.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      experience: PropTypes.string,
      positions: PropTypes.string,
      type: PropTypes.string,
      location: PropTypes.string,
    })
  ),
  /** Either a URL string or a function that receives the role and returns a URL string */
  applyHref: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default React.memo(CareerOpenRolesSection);
