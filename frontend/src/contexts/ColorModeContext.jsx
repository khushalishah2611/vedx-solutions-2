import { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createAppTheme from '../theme.js';

export const ColorModeContext = createContext({
  mode: 'dark',
  toggleColorMode: () => {}
});

const getInitialMode = () => {
  if (typeof window === 'undefined') return 'dark';
  const storedMode = window.localStorage?.getItem('colorMode');
  if (storedMode === 'light' || storedMode === 'dark') return storedMode;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  return prefersDark ? 'dark' : 'light';
};

const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => getInitialMode());

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage?.setItem('colorMode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

ColorModeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ColorModeProvider;
