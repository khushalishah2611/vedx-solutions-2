import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import FooterSection from './shared/FooterSection.jsx';
import NavigationBar from './shared/NavigationBar.jsx';
import ContactDialog from './shared/ContactDialog.jsx';
import ContactDialogContext from '../contexts/ContactDialogContext.jsx';

const SiteLayout = () => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  const openDialog = useCallback(() => setIsContactDialogOpen(true), []);
  const closeDialog = useCallback(() => setIsContactDialogOpen(false), []);

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
        <NavigationBar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <FooterSection />
        <ContactDialog open={isContactDialogOpen} onClose={closeDialog} />
      </Box>
    </ContactDialogContext.Provider>
  );
};

export default SiteLayout;
