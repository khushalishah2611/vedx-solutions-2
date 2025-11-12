import { useContext, useState } from 'react';
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
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Tooltip,
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
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { megaMenuContent, navigationLinks } from '../../data/content.js';
import { ColorModeContext } from '../../contexts/ColorModeContext.jsx';
import { Link as RouterLink } from 'react-router-dom';
import { createAnchorHref } from '../../utils/formatters.js';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';

const aboutMenuItems = [
  { label: 'About Us', to: '/about' },
  { label: 'Careers', to: '/careers' }
];

const NavigationBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const { openDialog: openContactDialog } = useContactDialog();
  const [open, setOpen] = useState(false);
  const createDefaultExpanded = () => ({ services: false, hireDevelopers: false, about: false });
  const [expandedMenus, setExpandedMenus] = useState(createDefaultExpanded);
  const [serviceAnchor, setServiceAnchor] = useState(null);
  const [hireAnchor, setHireAnchor] = useState(null);
  const [aboutAnchor, setAboutAnchor] = useState(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeHireIndex, setActiveHireIndex] = useState(0);

  const toggleDrawer = (state) => () => {
    setOpen(state);
    if (!state) {
      setExpandedMenus(createDefaultExpanded());
      setServiceAnchor(null);
      setHireAnchor(null);
      setAboutAnchor(null);
    }
  };

  const handleServiceEnter = (event) => {
    if (isMobile) return;
    setHireAnchor(null);
    setAboutAnchor(null);
    setServiceAnchor(event.currentTarget);
  };

  const handleHireEnter = (event) => {
    if (isMobile) return;
    setServiceAnchor(null);
    setAboutAnchor(null);
    setHireAnchor(event.currentTarget);
  };

  const handleAboutEnter = (event) => {
    if (isMobile) return;
    setServiceAnchor(null);
    setHireAnchor(null);
    setAboutAnchor(event.currentTarget);
  };

  const handleServiceClose = () => setServiceAnchor(null);
  const handleHireClose = () => setHireAnchor(null);
  const handleAboutClose = () => setAboutAnchor(null);

  const toggleDrawerMenu = (key) => () =>
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderMegaMenu = (anchorEl, handleClose, config, activeIndex, setActiveIndex) => {
    const openPopover = Boolean(anchorEl);
    const activeCategory = config.categories[activeIndex] ?? config.categories[0];
    const surfaceColor = alpha(theme.palette.background.paper, mode === 'dark' ? 0.95 : 0.98);
    const dividerColor = alpha(theme.palette.divider, mode === 'dark' ? 0.5 : 0.8);
    const overlayGradient =
      mode === 'dark'
        ? `linear-gradient(160deg, ${alpha('#0f172a', 0.82)} 0%, ${alpha('#0f172a', 0.6)} 45%, ${alpha(
          '#0f172a',
          0.94
        )} 100%)`
        : `linear-gradient(160deg, ${alpha(theme.palette.background.default, 0.92)} 0%, ${alpha(
          theme.palette.background.default,
          0.85
        )} 45%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`;
    const highlightColor = mode === 'dark' ? '#67e8f9' : theme.palette.primary.main;
    const descriptorColor = mode === 'dark'
      ? 'rgba(255,255,255,0.75)'
      : alpha(theme.palette.text.secondary, 0.9);

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
              borderRadius: 0,
              backgroundColor: surfaceColor,
              border: `1px solid ${dividerColor}`,
              minWidth: { xs: 0, md: 500 },
              overflow: 'hidden'
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ p: { xs: 3, md: 4 }, width: { xs: '100%', md: 340 } }}>

            <Stack spacing={2}>
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

                      alignItems: 'flex-start',
                      display: 'flex',
                      gap: 1.5,
                      justifyContent: 'space-between',

                      color: 'inherit'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {category.label}
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
            sx={{
              borderColor: dividerColor,
              display: { xs: 'none', md: 'block' }
            }}
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
                background: overlayGradient
              }}
            />
            <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {activeCategory.label}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: descriptorColor,
                  maxWidth: 360
                }}
              >
                {activeCategory.description}
              </Typography>

              <Stack spacing={1.2}>
                {activeCategory.subItems.map((item) => {
                  const isObject = typeof item === 'object' && item !== null;
                  const label = isObject ? item.label : item;
                  const href = isObject && item.href
                    ? item.href
                    : `/services${createAnchorHref(label)}`;
                  const isRouteLink = href.startsWith('/');
                  const linkProps = isRouteLink
                    ? { component: RouterLink, to: href }
                    : { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' };

                  return (
                    <Stack
                      key={label}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      onClick={handleClose}
                      sx={{
                        textDecoration: 'none',
                        transition: 'all 0.25s ease',
                        color: 'inherit',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}
                      {...linkProps}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            mode === 'dark' ? 'rgba(255,255,255,0.88)' : theme.palette.text.primary,
                          '&:hover': { color: highlightColor }
                        }}
                      >
                        {label}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>

          </Box>
        </Box>
      </Popover>
    );
  };

  const renderAboutMenu = (anchorEl, handleClose) => {
    const openPopover = Boolean(anchorEl);
    const hoverColor = alpha(theme.palette.primary.main, mode === 'dark' ? 0.2 : 0.08);

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
              py: 0.5,
              borderRadius: 0.5,
              minWidth: 180,

            }
          }
        }}
      >
        <MenuList sx={{ py: 0 }}>
          {aboutMenuItems.map((item) => (
            <MenuItem
              key={item.label}
              component={RouterLink}
              to={item.to}
              onClick={handleClose}
              sx={{
                fontWeight: 500,

                mx: 1,
                my: 0.5,
                px: 2,
                py: 1,

              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    );
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        backgroundColor: alpha(theme.palette.background.paper, mode === 'dark' ? 0.85 : 0.9),
        backdropFilter: 'blur(20px)'
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 2 }}>

          <Box
            component="img"
            src={
              'https://vedxsolution.com/wp-content/uploads/2024/04/logo-white.png'
            }
            alt="VedX Solutions logo"
            sx={{ height: 50, width: 'auto' }}
          />


          {!isMobile && (
            <Stack direction="row" spacing={1} alignItems="center">
              {navigationLinks.map((item) => {
                if (item.menu) {
                  if (item.menu === 'about') {
                    const isOpen = Boolean(aboutAnchor);
                    return (
                      <Box key={item.label}>
                        <Button
                          color="inherit"
                          component={RouterLink}
                          to={item.path ?? '/about'}
                          sx={{ fontWeight: 500, letterSpacing: 0.5, opacity: 0.9 }}
                          endIcon={
                            <KeyboardArrowDownRoundedIcon
                              sx={{
                                transition: 'transform 0.2s ease',
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                              }}
                            />
                          }
                          onMouseEnter={handleAboutEnter}
                          onFocus={handleAboutEnter}
                        >
                          {item.label}
                        </Button>
                      </Box>
                    );
                  }

                  const buttonProps = item.path ? { component: RouterLink, to: item.path } : {};
                  const menuKey = item.menu;
                  const menuConfig = {
                    services: { anchor: serviceAnchor, handleEnter: handleServiceEnter },
                    hireDevelopers: { anchor: hireAnchor, handleEnter: handleHireEnter }
                  }[menuKey];

                  if (!menuConfig) {
                    return null;
                  }

                  const isOpen = Boolean(menuConfig.anchor);

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
                        onMouseEnter={menuConfig.handleEnter}
                        onFocus={menuConfig.handleEnter}
                        onClick={!item.path ? menuConfig.handleEnter : undefined}
                        {...buttonProps}
                      >
                        {item.label}
                      </Button>
                    </Box>
                  );
                }

                return (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    sx={{ fontWeight: 500, letterSpacing: 0.5, opacity: 0.88 }}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider }} />

              <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}>
                <IconButton color="inherit" onClick={toggleColorMode}>
                  {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                size="large"
                onClick={openContactDialog}
                startIcon={<PhoneInTalkRoundedIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                  },
                }}
              >
                Hire Now
              </Button>

            </Stack>
          )}

          {isMobile && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}>
                <IconButton color="inherit" onClick={toggleColorMode}>
                  {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                </IconButton>
              </Tooltip>
              <IconButton onClick={toggleDrawer(true)} color="inherit" aria-label="Open navigation menu">
                <MenuRoundedIcon />
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary
          }
        }}
      >
        <Box sx={{ width: { xs: 320, sm: 360 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >

            <Box sx={{ textAlign: 'left', px: 2, py: 1 }}>
              <Box
                component="img"
                src={
                  'https://vedxsolution.com/wp-content/uploads/2024/04/logo-white.png'
                }
                alt="VedX Solutions logo"
                sx={{ height: 50, width: 'auto' }}
              />
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ pr: 1 }}>
              <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}>
                <IconButton color="inherit" onClick={toggleColorMode}>
                  {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                </IconButton>
              </Tooltip>
              <IconButton onClick={toggleDrawer(false)} color="inherit" aria-label="Close navigation menu">
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.6) }} />
          <List sx={{ flexGrow: 1 }}>
            {navigationLinks.map((item) => {
              if (item.menu) {
                if (item.menu === 'about') {
                  return (
                    <Box key={item.label}>
                      {aboutMenuItems.map((link) => (
                        <ListItemButton
                          key={link.label}
                          component={RouterLink}
                          to={link.to}
                          onClick={toggleDrawer(false)}
                        >
                          <ListItemText primary={link.label} />
                        </ListItemButton>
                      ))}
                      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.4) }} />
                    </Box>
                  );
                }

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
                        {item.path && (
                          <>
                            <ListItemButton
                              component={RouterLink}
                              to={item.path}
                              onClick={toggleDrawer(false)}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText primary={`View all ${item.label.replace(/ \+$/, '')}`} />
                            </ListItemButton>
                            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.4), ml: 4 }} />
                          </>
                        )}
                        {config.categories.map((category, categoryIndex) => {
                          const [expandedCategory, setExpandedCategory] = useState(false);
                          return (
                            <Box key={category.label}>
                              {/* Category header with label + toggle icon */}
                              <ListItemButton
                                onClick={() => setExpandedCategory(!expandedCategory)}
                                sx={{ pl: 4 }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {category.label}
                                    </Typography>
                                  }
                                  secondary={
                                    category.description && (
                                      <Typography
                                        variant="caption"
                                        sx={{ color: alpha(theme.palette.text.secondary, 0.9) }}
                                      >
                                        {category.description}
                                      </Typography>
                                    )
                                  }
                                />
                                {expandedCategory ? (
                                  <ExpandLessRoundedIcon fontSize="small" />
                                ) : (
                                  <ExpandMoreRoundedIcon fontSize="small" />
                                )}
                              </ListItemButton>

                              {/* Sub-items list */}
                              <Collapse in={expandedCategory} timeout="auto" unmountOnExit>
                                <List disablePadding>
                                  {category.subItems.map((subItem) => {
                                    const isObject = typeof subItem === 'object' && subItem !== null;
                                    const label = isObject ? subItem.label : subItem;
                                    const href = isObject && subItem.href
                                      ? subItem.href
                                      : `/services${createAnchorHref(label)}`;
                                    const isRouteLink = href.startsWith('/');
                                    const linkProps = isRouteLink
                                      ? { component: RouterLink, to: href }
                                      : { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' };

                                    return (
                                      <ListItemButton
                                        key={label}
                                        sx={{ pl: 6 }}
                                        onClick={toggleDrawer(false)}
                                        {...linkProps}
                                      >
                                        <ListItemText
                                          primary={
                                            <Typography variant="body2">{label}</Typography>
                                          }
                                        />
                                      </ListItemButton>
                                    );
                                  })}
                                </List>
                              </Collapse>
                            </Box>
                          );
                        })}
                      </List>
                    </Collapse>


                    <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.4) }} />
                  </Box>
                );
              }

              return (
                <ListItemButton
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  openContactDialog();
                  setOpen(false);
                }}
                startIcon={<PhoneInTalkRoundedIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2, // optional: adds nice horizontal padding
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)',
                  },
                }}
              >
                Hire Now
              </Button>
          </Box>

        </Box>
      </Drawer>

      {!isMobile &&
        renderMegaMenu(serviceAnchor, handleServiceClose, megaMenuContent.services, activeServiceIndex, setActiveServiceIndex)}
      {!isMobile &&
        renderMegaMenu(hireAnchor, handleHireClose, megaMenuContent.hireDevelopers, activeHireIndex, setActiveHireIndex)}
      {!isMobile && renderAboutMenu(aboutAnchor, handleAboutClose)}
    </AppBar>
  );
};

export default NavigationBar;
