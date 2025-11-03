import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#050505',
      paper: '#111118'
    },
    primary: {
      main: '#6366f1'
    },
    secondary: {
      main: '#ec4899'
    },
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db'
    }
  },
  typography: {
    fontFamily: 'Manrope, sans-serif',
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 700
    },
    h3: {
      fontWeight: 700
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: 0.2
    }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 24,
          paddingBlock: 12
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(99,102,241,0.1))',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 70px rgba(15,23,42,0.4)'
        }
      }
    }
  }
});

export default theme;