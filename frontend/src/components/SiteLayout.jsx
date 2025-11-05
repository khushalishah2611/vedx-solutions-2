import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import FooterSection from './sections/FooterSection.jsx';
import NavigationBar from './shared/NavigationBar.jsx';

const SiteLayout = () => {
  return (
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
    </Box>
  );
};

export default SiteLayout;
