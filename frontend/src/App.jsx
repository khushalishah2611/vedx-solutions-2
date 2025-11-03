import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/*" element={<SiteLayout />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;