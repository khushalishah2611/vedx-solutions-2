import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import FooterSection from './shared/FooterSection.jsx';
import NavigationBar from './shared/NavigationBar.jsx';
import ContactDialogContext from '../contexts/ContactDialogContext.jsx';
import ScrollToTopButton from './shared/ScrollToTopButton.jsx';
import LoadingOverlay from './shared/LoadingOverlay.jsx';
import ContactDialog from './shared/ContactDialog.jsx';

const SiteLayout = () => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');

  const openDialog = useCallback((jobId = '') => {
    setSelectedJobId(jobId ? String(jobId) : '');
    setContactDialogOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setContactDialogOpen(false);
  }, []);

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
        <ContactDialog
          open={contactDialogOpen}
          onClose={closeDialog}
          initialJobId={selectedJobId}
        />
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
