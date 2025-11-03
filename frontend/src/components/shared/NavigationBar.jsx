import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  Collapse,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
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
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { megaMenuContent, navigationLinks } from '../../data/content.js';

const NavigationBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const createDefaultExpanded = () => ({ services: false, hireDevelopers: false });
  const [expandedMenus, setExpandedMenus] = useState(createDefaultExpanded);
  const [serviceAnchor, setServiceAnchor] = useState(null);
  const [hireAnchor, setHireAnchor] = useState(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeHireIndex, setActiveHireIndex] = useState(0);

  const toggleDrawer = (state) => () => {
    setOpen(state);
    if (!state) {
      setExpandedMenus(createDefaultExpanded());
    }
  };

  const handleServiceEnter = (event) => {
    if (isMobile) return;
    setHireAnchor(null);
    setServiceAnchor(event.currentTarget);
  };

  const handleHireEnter = (event) => {
    if (isMobile) return;
    setServiceAnchor(null);
    setHireAnchor(event.currentTarget);
  };

  const handleServiceClose = () => setServiceAnchor(null);
  const handleHireClose = () => setHireAnchor(null);

  const toggleDrawerMenu = (key) => () =>
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderMegaMenu = (anchorEl, handleClose, config, activeIndex, setActiveIndex) => {
    const openPopover = Boolean(anchorEl);
    const activeCategory = config.categories[activeIndex] ?? config.categories[0];

    return (
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableRestoreFocus
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            onMouseLeave: handleClose,
            sx: {
              mt: 1.5,
              px: 0,
              py: 0,
              borderRadius: 3,
              backgroundColor: alpha('#050912', 0.96),
              border: '1px solid rgba(103, 232, 249, 0.28)',
              boxShadow: '0 24px 56px rgba(5, 9, 18, 0.55)',
              minWidth: { xs: 0, md: 700 }
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ p: { xs: 3, md: 4 }, width: { xs: '100%', md: 340 } }}>
            <Typography
              variant="caption"
              sx={{ letterSpacing: 1.2, textTransform: 'uppercase', color: 'secondary.light', fontWeight: 600 }}
            >
              {config.heading}
            </Typography>
            <Stack spacing={1.2} mt={3}>
              {config.categories.map((category, index) => {
                const active = index === activeIndex;
                return (
                  <ButtonBase
                    key={category.label}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    sx={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: 2,
                      p: 2,
                      alignItems: 'flex-start',
                      display: 'flex',
                      gap: 1.5,
                      justifyContent: 'space-between',
                      border: '1px solid',
                      borderColor: active ? alpha('#67e8f9', 0.65) : 'rgba(255,255,255,0.08)',
                      backgroundColor: active ? alpha('#67e8f9', 0.12) : 'transparent',
                      transition: 'all 0.2s ease',
                      color: 'inherit'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {category.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                        {category.description}
                      </Typography>
                    </Box>
                    <KeyboardArrowRightRoundedIcon sx={{ opacity: active ? 1 : 0.4 }} />
                  </ButtonBase>
                );
              })}
            </Stack>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: 'rgba(255,255,255,0.08)', display: { xs: 'none', md: 'block' } }}
          />
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              minWidth: { xs: '100%', md: 360 },
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${activeCategory.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.18,
                filter: 'grayscale(0.1)',
                borderRadius: { xs: 0, md: 3 }
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(103,232,249,0.2) 0%, rgba(5,9,18,0.92) 100%)',
                borderRadius: { xs: 0, md: 3 }
              }}
            />
            <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {activeCategory.label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 360 }}>
                {activeCategory.description}
              </Typography>
              <Stack spacing={1.2}>
                {activeCategory.subItems.map((item) => (
                  <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#67e8f9' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.88)' }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Popover>
    );
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
        <Toolbar disableGutters sx={{ minHeight: { xs: 50, md: 80 }, justifyContent: 'space-between' }}>
       
            <Box
              component="img"
              src="https://media.designrush.com/agencies/839770/conversions/Vedx-Solutions-logo-profile.jpg"
              alt="VedX Solutions logo"
              sx={{ height: 60, width: 'auto',  }}
            />
  
       
          {!isMobile && (
            <Stack direction="row" spacing={3} alignItems="center">
              {navigationLinks.map((item) => {
                if (item.menu) {
                  const isServiceMenu = item.menu === 'services';
                  const isOpen = isServiceMenu ? Boolean(serviceAnchor) : Boolean(hireAnchor);

                  return (
                    <Box key={item.label}>
                      <Button
                        color="inherit"
                        sx={{ fontWeight: 500, letterSpacing: 0.5, opacity: 0.9 }}
                        endIcon={
                          <KeyboardArrowDownRoundedIcon
                            sx={{
                              transition: 'transform 0.2s ease',
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          />
                        }
                        onMouseEnter={isServiceMenu ? handleServiceEnter : handleHireEnter}
                        onClick={isServiceMenu ? handleServiceEnter : handleHireEnter}
                      >
                        {item.label}
                      </Button>
                    </Box>
                  );
                }

                return (
                  <Button
                    key={item.label}
                    href={item.href}
                    color="inherit"
                    sx={{ fontWeight: 500, letterSpacing: 0.5, opacity: 0.88 }}
                  >
                    {item.label}
                  </Button>
                );
              })}
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
        <Box sx={{ width: "auto", display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
            <Typography variant="subtitle1">VedX Solutions</Typography>
            <IconButton onClick={toggleDrawer(false)} color="inherit">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <List sx={{ flexGrow: 1 }}>
            {navigationLinks.map((item) => {
              if (item.menu) {
                const isExpanded = expandedMenus[item.menu];
                const config = megaMenuContent[item.menu];

                return (
                  <Box key={item.label}>
                    <ListItemButton onClick={toggleDrawerMenu(item.menu)}>
                      <ListItemText primary={item.label} />
                      {isExpanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                    </ListItemButton>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List disablePadding>
                        {config.categories.map((category) => (
                          <ListItemButton key={category.label} sx={{ pl: 4 }}>
                            <ListItemText
                              primary={category.label}
                              secondary={category.subItems.slice(0, 3).join(' • ')}
                              primaryTypographyProps={{ sx: { fontWeight: 600 } }}
                              secondaryTypographyProps={{
                                sx: { color: 'rgba(255,255,255,0.55)', mt: 0.5, fontSize: 12 }
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                  </Box>
                );
              }

              return (
                <ListItemButton key={item.label} component="a" href={item.href} onClick={toggleDrawer(false)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
          <Box sx={{ p: 2 }}>
            <Button fullWidth variant="contained" color="secondary" href="#contact">
              Hire Now
            </Button>
          </Box>
        </Box>
      </Drawer>

      {!isMobile && renderMegaMenu(serviceAnchor, handleServiceClose, megaMenuContent.services, activeServiceIndex, setActiveServiceIndex)}
      {!isMobile &&
        renderMegaMenu(hireAnchor, handleHireClose, megaMenuContent.hireDevelopers, activeHireIndex, setActiveHireIndex)}
    </AppBar>
  );
};

export default NavigationBar;
