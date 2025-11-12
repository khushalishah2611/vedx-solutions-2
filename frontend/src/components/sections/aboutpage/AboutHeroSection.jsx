import HeroMediaShowcase from '../../shared/HeroMediaShowcase.jsx';

const AboutHeroSection = ({ hero, onCtaClick }) => {
  if (!hero) {
    return null;
  }

  return (
    <HeroMediaShowcase
      eyebrow={hero.label}
      title={hero.title}
      description={hero.description}
      extendedDescription={hero.extendedDescription}
      baseImage={hero.baseImage}
      overlayImage={hero.overlayImage}
      ctaLabel={hero.ctaLabel}
      onCtaClick={onCtaClick}
      sx={{ pt: { xs: 12, md: 14 } }}
    />
  );
};

export default AboutHeroSection;
