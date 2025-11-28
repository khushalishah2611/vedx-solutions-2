import { useEffect, useState } from 'react';
import { Box, Fade, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = theme.palette.mode === 'dark';
  const backgroundColor = isDark
    ? alpha('#0b1120', 0.92)
    : alpha('#0f172a', 0.85);

  return (
    <Fade in={visible}>
      <Box
        component="button"
        type="button"
        aria-label="Scroll to top"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 28 },
          right: { xs: 16, md: 24 },
          zIndex: (theme) => theme.zIndex.tooltip + 1,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
          backgroundColor,
          boxShadow: isDark
            ? '0 16px 36px rgba(0,0,0,0.55)'
            : '0 16px 36px rgba(15,23,42,0.18)',
          cursor: 'pointer',
          transition:
            'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background-color 200ms ease',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: alpha(theme.palette.primary.main, 0.7),
            boxShadow: isDark
              ? '0 20px 40px rgba(0,0,0,0.65)'
              : '0 20px 46px rgba(15,23,42,0.22)',
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.35)}`,
          },
        }}
      >
        <Box
          component="img"
          src="/icons/scroll-to-top.svg"
          alt="Arrow up"
          sx={{ width: 24, height: 24 }}
        />
      </Box>
    </Fade>
  );
};

export default ScrollToTopButton;
