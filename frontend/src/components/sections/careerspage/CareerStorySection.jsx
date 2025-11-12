import { Box, Stack, Typography } from '@mui/material';
import HeroMediaShowcase from '../../shared/HeroMediaShowcase.jsx';

const CareerStorySection = ({ story, onCtaClick }) => {
  const highlights = Array.isArray(story?.highlights) ? story.highlights : [];
  const baseImage = story?.baseImage || story?.image;
  const overlayImage = story?.overlayImage || story?.secondaryImage || story?.image;

  return (
    <HeroMediaShowcase
      eyebrow={story?.label || story?.badge || 'We are Vedx Solutions'}
      title={story?.title}
      description={story?.description}
      extendedDescription={story?.extendedDescription || story?.body}
      baseImage={baseImage}
      overlayImage={overlayImage}
      ctaLabel={story?.ctaLabel || 'Contact Us'}
      onCtaClick={onCtaClick}
    >
      {story?.culture && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.7,
          }}
        >
          {story.culture}
        </Typography>
      )}

      {highlights.length > 0 && (
        <Stack component="ul" spacing={1.25} sx={{ listStyle: 'none', p: 0, m: 0, color: 'text.secondary' }}>
          {highlights.map((item) => (
            <Box component="li" key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
              <Typography variant="body2" component="span">
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </HeroMediaShowcase>
  );
};

export default CareerStorySection;
