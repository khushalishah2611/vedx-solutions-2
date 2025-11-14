import PropTypes from 'prop-types';
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CaseStudyCard = ({ caseStudy }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 0.5,
        overflow: 'hidden',
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        border: `1px solid ${alpha(
          accentColor,
          isDark ? 0.6 : 0.25
        )}`,
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        '&:hover': {
          transform: 'translateY(-8px)',

        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/casestudy/${caseStudy.slug}`}
        sx={{ height: '100%' }}
      >
        {/* ---------- IMAGE ---------- */}
        <Box
          sx={{
            position: 'relative',
            pt: '75%',
            backgroundImage: `url(${caseStudy.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(
                180deg,
                ${alpha('#0f172a', 0)} 0%,
                ${alpha('#0f172a', 0.85)} 100%
              )`,
            }}
          />

          {/* Category Badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.8,
              py: 0.8,
              borderRadius: 0.5,
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              background: isDark
                ? alpha('#000000', 0.45)
                : alpha('#e2e8f0', 0.8),
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              fontSize: 11,
              lineHeight: 1.3,
            }}
          >
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              {caseStudy.category}
            </Box>
          </Box>
        </Box>

        {/* ---------- CONTENT ---------- */}
        <Stack spacing={2} sx={{ p: { xs: 3, md: 3.5 } }}>
          <Stack spacing={1}>
            <Typography variant="h5" sx={{
              fontWeight: 700, textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s ease, background-image 0.3s ease',
              '&:hover': {
                color: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              },
            }}>
              {caseStudy.title}
            </Typography>


          </Stack>

          {/* ---------- TAGS ---------- */}
          {caseStudy.tags?.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {caseStudy.tags.map((tag, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.8,
                    py: 0.7,
                    borderRadius: 0.5,
                    border: `1px solid ${alpha('#ffffff', 0.15)}`,
                    background: isDark
                      ? alpha('#000000', 0.4)
                      : alpha('#e2e8f0', 0.75),
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    fontSize: 11,
                    lineHeight: 1.3,
                    width: 'fit-content',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                    }}
                  >
                    {tag}
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
};

CaseStudyCard.propTypes = {
  caseStudy: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    heroImage: PropTypes.string.isRequired,
    accentColor: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default CaseStudyCard;
