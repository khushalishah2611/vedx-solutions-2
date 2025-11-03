import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import { navigationLinks } from '../../data/content.js';

const NavigationBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: alpha('#050912', 0.72),
        backdropFilter: 'blur(20px)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 72, md: 88 }, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component="img"
              src="https://dummyimage.com/120x36/101629/67e8f9&text=VedX"
              alt="VedX Solutions logo"
              sx={{ height: 36, width: 'auto', borderRadius: 1.5 }}
            />
            <Typography variant="caption" sx={{ letterSpacing: 1.5, color: 'text.secondary' }}>
              Hub of Tech
            </Typography>
          </Stack>

          {!isMobile && (
            <Stack direction="row" spacing={3} alignItems="center">
              {navigationLinks.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  color="inherit"
                  sx={{ fontWeight: 500, letterSpacing: 0.5, opacity: 0.88 }}
                >
                  {item.label}
                </Button>
              ))}
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
              <IconButton
                size="large"
                color="secondary"
                sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.18),
                  '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.28) }
                }}
              >
                <PhoneInTalkRoundedIcon />
              </IconButton>
              <Button variant="contained" color="secondary" href="#contact">
                Hire Now
              </Button>
            </Stack>
          )}

          {isMobile && (
            <IconButton onClick={toggleDrawer(true)} color="inherit">
              <MenuRoundedIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#050912',
            color: 'common.white'
          }
        }}
      >
        <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
            <Typography variant="subtitle1">VedX Solutions</Typography>
            <IconButton onClick={toggleDrawer(false)} color="inherit">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <List sx={{ flexGrow: 1 }}>
            {navigationLinks.map((item) => (
              <ListItemButton key={item.label} component="a" href={item.href} onClick={toggleDrawer(false)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ p: 3 }}>
            <Button fullWidth variant="contained" color="secondary" href="#contact">
              Hire Now
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default NavigationBar;
