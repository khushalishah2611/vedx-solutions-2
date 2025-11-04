import { alpha, createTheme } from '@mui/material/styles';

const getPalette = (mode) => {
  const isDark = mode === 'dark';

  return {
    mode,
    background: {
      default: isDark ? '#050505' : '#f8fafc',
      paper: isDark ? '#111118' : '#ffffff'
    },
    primary: {
      main: isDark ? '#6366f1' : '#4f46e5'
    },
    secondary: {
      main: isDark ? '#ec4899' : '#db2777'
    },
    divider: alpha(isDark ? '#f8fafc' : '#0f172a', isDark ? 0.12 : 0.08),
    text: {
      primary: isDark ? '#f9fafb' : '#0f172a',
      secondary: alpha(isDark ? '#e2e8f0' : '#475569', 0.9)
    }
  };
};

const getComponents = (mode) => {
  const isDark = mode === 'dark';
  const paperBackground = isDark
    ? 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(99,102,241,0.1))'
    : 'linear-gradient(145deg, rgba(79,70,229,0.08), rgba(236,72,153,0.08))';

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 24,
          paddingBlock: 12,
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: 0.2
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: paperBackground,
          border: `1px solid ${alpha(isDark ? '#ffffff' : '#0f172a', 0.08)}`,
          boxShadow: isDark
            ? '0 30px 70px rgba(15,23,42,0.4)'
            : '0 20px 60px rgba(15,23,42,0.15)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }
      }
    }
  };
};

const createAppTheme = (mode = 'dark') =>
  createTheme({
    palette: getPalette(mode),
    typography: {
      fontFamily: 'Manrope, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 }
    },
    shape: { borderRadius: 16 },
    components: getComponents(mode)
  });

export default createAppTheme;
