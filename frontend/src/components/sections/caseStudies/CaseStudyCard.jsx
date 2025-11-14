import PropTypes from 'prop-types';
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CaseStudyCard = ({ caseStudy }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 0.2)}`,
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/casestudy/${caseStudy.slug}`}
        sx={{ height: '100%' }}
      >
        <Box
          sx={{
            position: 'relative',
            pt: '66.66%',
            backgroundImage: `url(${caseStudy.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, ${alpha('#0f172a', 0)} 0%, ${alpha('#0f172a', 0.8)} 100%)`,
            }}
          />
          <Chip
            label={caseStudy.category}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              color: '#fff',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              backgroundColor: alpha(caseStudy.accentColor ?? theme.palette.secondary.main, 0.9),
            }}
          />
        </Box>

        <Stack spacing={2.5} sx={{ p: { xs: 3, md: 3.5 } }}>
          <Stack spacing={1}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {caseStudy.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              {caseStudy.summary}
            </Typography>
          </Stack>

          {caseStudy.tags?.length ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {caseStudy.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    backgroundColor: alpha(theme.palette.text.primary, 0.06),
                  }}
                />
              ))}
            </Stack>
          ) : null}
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
