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

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80';

const CaseStudyCard = ({ caseStudy }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const accentColor = caseStudy.accentColor || (isDark ? '#67e8f9' : theme.palette.primary.main);
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.9 : 0.75);
  const heroImage = caseStudy.heroImage || caseStudy.coverImage || FALLBACK_IMAGE;
  const summary = caseStudy.summary || caseStudy.subtitle || caseStudy.description || '';
  const categoryLabel =
    caseStudy.category ||
    caseStudy.subtitle ||
    (Array.isArray(caseStudy.tags) && caseStudy.tags.length
      ? (typeof caseStudy.tags[0] === 'string' ? caseStudy.tags[0] : caseStudy.tags[0]?.name)
      : 'Case Study');
  const tags = Array.isArray(caseStudy.tags)
    ? caseStudy.tags
        .map((tag) => (typeof tag === 'string' ? tag : tag?.name))
        .filter(Boolean)
    : [];

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 0.5,
        overflow: 'hidden',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.6)}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: isDark
            ? '0 18px 40px rgba(15,23,42,0.7)'
            : '0 18px 40px rgba(15,23,42,0.18)',
          borderColor: isDark ? '#67e8f9' : theme.palette.primary.main,
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/casestudy/${caseStudy.slug}`} sx={{ height: '100%' }}>
        {/* ---------- IMAGE ---------- */}
        <Box
          sx={{
            position: 'relative',
            pt: '70%',
            backgroundImage: `url(${heroImage})`,
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
              background: isDark ? alpha('#000000', 0.5) : alpha('#e2e8f0', 0.85),
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
              {categoryLabel}
            </Box>
          </Box>
        </Box>

        {/* ---------- CONTENT ---------- */}
        <Stack spacing={2} sx={{ p: { xs: 3, md: 3.5 } }}>
          <Stack spacing={1}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
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
              {caseStudy.title}
            </Typography>

            {/* Summary / excerpt */}
            {summary && (
              <Typography
                variant="body2"
                sx={{
                  color: subtleText,
                  lineHeight: 1.7,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {summary}
              </Typography>
            )}
          </Stack>

          {/* ---------- TAGS ---------- */}
          {tags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {tags.map((tag, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.8,
                    py: 0.7,
                    borderRadius: 0.5,
                    border: `1px solid ${alpha('#ffffff', 0.15)}`,
                    background: isDark ? alpha('#000000', 0.4) : alpha('#e2e8f0', 0.75),
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
    category: PropTypes.string,
    summary: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    heroImage: PropTypes.string,
    accentColor: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      ])
    ),
  }).isRequired,
};

export default CaseStudyCard;
