import { Box, Container, Grid, Stack, Typography, alpha } from '@mui/material';

export default function CreativeAgencySection() {
  return (
    <Box
      sx={{
        bgcolor: '#000',
        color: '#fff',
        py: { xs: 6, md: 10 },
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Image */}
          {/* <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/agency-team.jpg" // Replace with your actual image path
              alt="Creative team working"
              sx={{
                width: '100%',
                borderRadius: 4,
                boxShadow: '0 0 40px rgba(0,0,0,0.5)',
              }}
            />
          </Grid> */}

          {/* Right Content */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography
                variant="overline"
                sx={{
                  color: alpha('#9c27b0', 0.8),
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                We Are
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Creative Digital Agency Working For{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #9c27b0, #2196f3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Brands
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: alpha('#fff', 0.8),
                  mt: 2,
                  lineHeight: 1.7,
                }}
              >
                We’re made up of top product experts and engineers who are capable in the
                invention and development of the industry's most advanced technologies
                including web, mobile apps, eCommerce, mCommerce, IoT, AI/ML, enterprise
                mobility, on-demand, cross-platform, and cloud integration. Technology is
                the medium in which we work.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: alpha('#fff', 0.8),
                  mt: 2,
                  lineHeight: 1.7,
                }}
              >
                If your organization is looking for assistance on an upcoming software
                project or would like access to our talent, feel free to get in touch and
                begin a conversation.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
