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
     

      
    </HeroMediaShowcase>
  );
};

export default CareerStorySection;
