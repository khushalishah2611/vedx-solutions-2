import { Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import FooterSection from './shared/FooterSection.jsx';
import NavigationBar from './shared/NavigationBar.jsx';
import ContactDialogContext from '../contexts/ContactDialogContext.jsx';
import ScrollToTopButton from './shared/ScrollToTopButton.jsx';
import LoadingOverlay from './shared/LoadingOverlay.jsx';

const SiteLayout = () => {
  const navigate = useNavigate();

  const openDialog = useCallback(() => {
    navigate('/contact');
  }, [navigate]);
  const closeDialog = useCallback(() => {}, []);

  const contextValue = useMemo(
    () => ({
      openDialog,
      closeDialog,
    }),
    [openDialog, closeDialog]
  );

  return (
    <ContactDialogContext.Provider value={contextValue}>
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <LoadingOverlay />
        <NavigationBar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <ScrollToTopButton />
        <FooterSection />
      </Box>
    </ContactDialogContext.Provider>
  );
};

export default SiteLayout;
