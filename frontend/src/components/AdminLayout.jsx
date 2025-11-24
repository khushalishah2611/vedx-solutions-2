import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  AppBar,
  Stack
} from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import adminProfile from '../data/adminProfile.js';

const drawerWidth = 280;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const menuItems = useMemo(
    () => [
      { label: 'Dashboard', icon: <DashboardRoundedIcon />, to: '/admin/dashboard' },
      { label: 'Contacts', icon: <ContactsRoundedIcon />, to: '/admin/contacts' },
      { label: 'Careers', icon: <WorkOutlineOutlinedIcon />, to: '/admin/careers' },
      { label: 'Services', icon: <DesignServicesOutlinedIcon />, to: '/admin/services' },
      { label: 'Feedbacks', icon: <RateReviewOutlinedIcon />, to: '/admin/feedbacks' },
      { label: 'Navigation', icon: <CategoryOutlinedIcon />, to: '/admin/navigation' },
      { label: 'Blogs', icon: <ArticleOutlinedIcon />, to: '/admin/blogs' },
      { label: 'Profile', icon: <ManageAccountsRoundedIcon />, to: '/admin/profile' },
      { label: 'Change Password', icon: <LockResetRoundedIcon />, to: '/admin/change-password' }
    ],
    []
  );

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
        
          <Box>
          
            <Typography variant="h6" color="text.secondary">
              @{adminProfile.username}
            </Typography>

          </Box>
        </Stack>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const selected = location.pathname === item.to;
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={selected}
                onClick={() => {
                  navigate(item.to);
                  if (!isMdUp) {
                    setMobileOpen(false);
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate('/admin');
            }}
          >
            <ListItemIcon>
              <LogoutRoundedIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error.main', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {!isMdUp && (
              <IconButton onClick={handleDrawerToggle} edge="start">
                {mobileOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
              </IconButton>
            )}
            
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box textAlign="right">
              <Typography variant="subtitle2" fontWeight={600}>
                {adminProfile.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Email: {adminProfile.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mobile: {adminProfile.phone}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.main' }}>{adminProfile.initials}</Avatar>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="admin menu">
        <Drawer
          variant={isMdUp ? 'permanent' : 'temporary'}
          open={isMdUp ? true : mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box'
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 4 }, mt: 8, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
