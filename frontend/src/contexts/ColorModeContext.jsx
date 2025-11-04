import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createAppTheme from '../theme.js';

export const ColorModeContext = createContext({
  mode: 'dark',
  toggleColorMode: () => {}
});

const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

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
