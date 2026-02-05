import { useContext, useEffect, useMemo, useState } from 'react';
import { AppBar, Box, ButtonBase, Collapse, Divider, Drawer, IconButton, List, ListItemButton, ListItemText, MenuItem, MenuList, Popover, Stack, Toolbar, Typography, alpha, useMediaQuery, useTheme } from '@mui/material';
import { AppButton } from './FormControls.jsx';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { megaMenuContent, navigationLinks } from '../../data/content.js';
import { ColorModeContext } from '../../contexts/ColorModeContext.jsx';
import { Link as RouterLink } from 'react-router-dom';
import { createAnchorHref, createSlug } from '../../utils/formatters.js';
import { useContactDialog } from '../../contexts/ContactDialogContext.jsx';
import { useServiceHireCatalog } from '../../hooks/useServiceHireCatalog.js';

const aboutMenuItems = [
  { label: 'About Us', to: '/about' },
  { label: 'Careers', to: '/careers' }
];

const NavigationBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const { openDialog: openContactDialog } = useContactDialog();
  const { serviceMenu, hireMenu } = useServiceHireCatalog();

  const [open, setOpen] = useState(false);

  const menuContent = useMemo(
    () => ({
      services: serviceMenu ?? megaMenuContent.services,
      hireDevelopers: hireMenu ?? megaMenuContent.hireDevelopers,
    }),
    [hireMenu, serviceMenu]
  );

  const createDefaultExpanded = () => ({
    services: false,
    hireDevelopers: false,
    about: false
  });

  const createDefaultCategoryExpanded = (menuConfig) =>
    Object.keys(menuConfig).reduce((acc, key) => {
      acc[key] = {};
      return acc;
    }, {});

  const [expandedMenus, setExpandedMenus] = useState(createDefaultExpanded);
  const [expandedCategories, setExpandedCategories] = useState(
    () => createDefaultCategoryExpanded(menuContent)
  );
  const [serviceAnchor, setServiceAnchor] = useState(null);
  const [hireAnchor, setHireAnchor] = useState(null);
  const [aboutAnchor, setAboutAnchor] = useState(null);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeHireIndex, setActiveHireIndex] = useState(0);

  const gradientTextHover = {
    color: 'transparent',
    backgroundImage: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const highlightColor = mode === 'dark' ? '#67e8f9' : theme.palette.primary.main;

  useEffect(() => {
    setExpandedCategories(createDefaultCategoryExpanded(menuContent));
  }, [menuContent]);

  useEffect(() => {
    if (activeServiceIndex >= menuContent.services.categories.length) {
      setActiveServiceIndex(0);
    }
  }, [activeServiceIndex, menuContent.services.categories.length]);

  useEffect(() => {
    if (activeHireIndex >= menuContent.hireDevelopers.categories.length) {
      setActiveHireIndex(0);
    }
  }, [activeHireIndex, menuContent.hireDevelopers.categories.length]);

  const desktopLinkSx = {
    fontWeight: 600,
    letterSpacing: 0.4,
    opacity: 0.92,
    px: 1.5,
    py: 1,
    color: 'inherit',
    borderRadius: 1.5,
    transition: 'color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease',
    '&:hover': {
      ...gradientTextHover,
      backgroundColor: alpha(
        theme.palette.text.primary,
        mode === 'dark' ? 0.08 : 0.05
      ),
      opacity: 1
    },
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: alpha(highlightColor, 0.5),
      outlineOffset: 2
    }
  };

  const resetDrawerState = () => {
    setExpandedMenus(createDefaultExpanded());
    setExpandedCategories(createDefaultCategoryExpanded(menuContent));
    setServiceAnchor(null);
    setHireAnchor(null);
    setAboutAnchor(null);
  };

  const toggleDrawer = (state) => () => {
    setOpen(state);
    if (!state) {
      resetDrawerState();
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
    resetDrawerState();
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
  const closeAllDesktopMenus = () => {
    setServiceAnchor(null);
    setHireAnchor(null);
    setAboutAnchor(null);
  };

  const toggleDrawerMenu = (key) => () =>
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleCategoryExpansion = (menuKey, categoryLabel) => (event) => {
    event?.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [menuKey]: {
        ...(prev[menuKey] ?? {}),
        [categoryLabel]: !prev[menuKey]?.[categoryLabel]
      }
    }));
  };

  const getLinkProps = (href) => {
    if (!href) return {};
    return href.startsWith('/')
      ? { component: RouterLink, to: href }
      : { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' };
  };

  const renderMegaMenu = (anchorEl, handleClose, config, activeIndex, setActiveIndex) => {
    if (!config) return null;

    const openPopover = Boolean(anchorEl);
    const activeCategory = config.categories[activeIndex] ?? config.categories[0];

    const activeCategoryHref =
      activeCategory?.href ??
      (activeCategory?.label
        ? `/services${createAnchorHref(activeCategory.label)}`
        : undefined);

    const activeCategoryLinkProps = activeCategoryHref
      ? activeCategoryHref.startsWith('/')
        ? { component: RouterLink, to: activeCategoryHref }
        : {
            component: 'a',
            href: activeCategoryHref,
            target: '_blank',
            rel: 'noopener noreferrer'
          }
      : {};

    const surfaceColor = alpha(
      theme.palette.background.paper,
      mode === 'dark' ? 0.95 : 0.98
    );
    const dividerColor = alpha(
      theme.palette.divider,
      mode === 'dark' ? 0.5 : 0.8
    );
    const overlayGradient =
      mode === 'dark'
        ? `linear-gradient(160deg, ${alpha('#0f172a', 0.82)} 0%, ${alpha(
            '#0f172a',
            0.6
          )} 45%, ${alpha('#0f172a', 0.94)} 100%)`
        : `linear-gradient(160deg, ${alpha(
            theme.palette.background.default,
            0.92
          )} 0%, ${alpha(
            theme.palette.background.default,
            0.85
          )} 45%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`;
    const descriptorColor =
      mode === 'dark'
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
          {/* LEFT COLUMN – CATEGORIES LIST */}
          <Box sx={{ p: { xs: 3, md: 4 }, width: { xs: '100%', md: 340 } }}>
            <Stack spacing={2}>
              {config.categories.map((category, index) => {
                const active = index === activeIndex;
                const categoryHref = category.href;
                const isRouteLink = categoryHref?.startsWith('/') ?? false;
                const linkProps = categoryHref
                  ? isRouteLink
                    ? { component: RouterLink, to: categoryHref }
                    : {
                        component: 'a',
                        href: categoryHref,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                      }
                  : {};
                return (
                  <ButtonBase
                    key={category.label}
                    {...linkProps}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={handleClose}
                    sx={{
                      width: '100%',
                      textAlign: 'left',
                      alignItems: 'flex-start',
                      display: 'flex',
                      gap: 1.5,
                      justifyContent: 'space-between',
                      color: 'inherit',
                      borderRadius: 1,
                      px: 1,
                      textDecoration: 'none',
                      transition: 'all 0.25s ease',
                      '&:hover .mega-category-title, &:focus-visible .mega-category-title':
                        gradientTextHover,
                      '& .mega-category-title': {
                        transition: 'color 0.3s ease, background-image 0.3s ease',
                        ...(active ? gradientTextHover : {})
                      },
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: alpha(highlightColor, 0.45),
                        outlineOffset: 3
                      }
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        className="mega-category-title"
                        sx={{ fontWeight: 600 }}
                      >
                        {category.label}
                      </Typography>
                    </Box>
                    <KeyboardArrowRightRoundedIcon sx={{ opacity: active ? 1 : 0.4 }} />
                  </ButtonBase>
                );
              })}
            </Stack>
          </Box>

          {/* DIVIDER */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: dividerColor,
              display: { xs: 'none', md: 'block' }
            }}
          />

          {/* RIGHT COLUMN – ACTIVE CATEGORY DETAILS */}
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
              <Typography
                variant="h6"
                className="drawer-category-title"
                {...activeCategoryLinkProps}
                sx={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: activeCategoryHref ? 'pointer' : 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  '&:hover': gradientTextHover
                }}
                onClick={handleClose}
              >
                {activeCategory?.label}
              </Typography>

              {activeCategory?.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: descriptorColor,
                    maxWidth: 360
                  }}
                >
                  {activeCategory.description}
                </Typography>
              )}

              <Stack spacing={1.2}>
                {activeCategory?.subItems?.map((item) => {
                  const isObject = typeof item === 'object' && item !== null;
                  const label = isObject ? item.label : item;
                  const resolvedHref = isObject && item.href ? item.href : '';
                  const baseHref =
                    activeCategory?.href || activeCategoryHref || '/services';
                  const basePath = baseHref.split('#')[0];
                  const fallbackHref = basePath.startsWith('/services/')
                    ? `${basePath}/${createSlug(label)}`
                    : basePath.startsWith('/hire-developers/')
                      ? `${basePath}/${createSlug(label)}`
                      : `/services${createAnchorHref(label)}`;
                  const href = resolvedHref || fallbackHref;
                  const isRouteLink = href.startsWith('/');
                  const linkProps = isRouteLink
                    ? { component: RouterLink, to: href }
                    : {
                        component: 'a',
                        href,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                      };

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
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: alpha(highlightColor, 0.4),
                          outlineOffset: 4
                        },
                        '&:hover .mega-subtitle, &:focus-visible .mega-subtitle':
                          gradientTextHover,
                        '& .mega-subtitle': {
                          transition: 'color 0.3s ease, background-image 0.3s ease'
                        }
                      }}
                      {...linkProps}
                    >
                      <Typography
                        variant="body2"
                        className="mega-subtitle"
                        sx={{
                          textDecoration: 'none',
                          cursor: 'pointer',
                          fontWeight: 600
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
    const borderColor = alpha(theme.palette.divider, 0.22);

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
              borderRadius: 0,
              minWidth: 200,
              border: `1px solid ${borderColor}`
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
              disableRipple
              sx={{
                fontWeight: 600,
                letterSpacing: 0.4,
                mx: 1,
                my: 0.5,
                px: 2.5,
                py: 1.1,
                borderRadius: 0.5,
                color: theme.palette.text.primary,
                backgroundColor: 'transparent !important',
                '&:hover': {
                  ...gradientTextHover,
                  backgroundColor: 'transparent !important',
                  transform: 'translateX(4px)'
                }
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
        px: { xs: 2.5, md: 10 },
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        backgroundColor: alpha(
          theme.palette.background.paper,
          mode === 'dark' ? 0.85 : 0.9
        ),
        backdropFilter: 'blur(20px)'
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          alignItems: 'center',
          gap: 3,
          minHeight: 80
        }}
      >
        {/* LEFT: LOGO */}
        <ButtonBase
          component={RouterLink}
          to="/"
          sx={{ borderRadius: 1.5, display: 'inline-flex' }}
        >
          <Box
            component="img"
            src="https://vedxsolution.com/wp-content/uploads/2024/04/logo-white.png"
            alt="VedX Solutions logo"
            sx={{ height: 50, width: 'auto', display: 'block' }}
          />
        </ButtonBase>

        {/* RIGHT: DESKTOP NAV */}
        {!isMobile && (
          <Stack direction="row" spacing={2.5} alignItems="center" sx={{ ml: 'auto' }}>
            {navigationLinks.map((item) => {
              if (item.menu) {
                if (item.menu === 'about') {
                  const isOpen = Boolean(aboutAnchor);
                  return (
                    <Box key={item.label}>
                      <AppButton
                        color="inherit"
                        component={RouterLink}
                        to={item.path ?? '/about'}
                        sx={desktopLinkSx}
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
                      </AppButton>
                    </Box>
                  );
                }

                const buttonProps = item.path
                  ? { component: RouterLink, to: item.path }
                  : {};
                const menuKey = item.menu;
                const menuConfig = {
                  services: { anchor: serviceAnchor, handleEnter: handleServiceEnter },
                  hireDevelopers: { anchor: hireAnchor, handleEnter: handleHireEnter }
                }[menuKey];

                if (!menuConfig) return null;

                const isOpen = Boolean(menuConfig.anchor);

                return (
                  <Box key={item.label}>
                    <AppButton
                      color="inherit"
                      sx={desktopLinkSx}
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
                    </AppButton>
                  </Box>
                );
              }

              return (
                <AppButton
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={desktopLinkSx}
                  onMouseEnter={closeAllDesktopMenus}
                  onFocus={closeAllDesktopMenus}
                  onClick={closeAllDesktopMenus}
                >
                  {item.label}
                </AppButton>
              );
            })}

            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: theme.palette.divider }}
            />

            <IconButton
              color="inherit"
              onClick={toggleColorMode}
              aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
              sx={{
                border: `1px solid ${alpha(theme.palette.text.primary, 0.18)}`,
                borderRadius: 2
              }}
            >
              {mode === 'dark' ? <WbSunnyRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>

            <AppButton
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
                  background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                }
              }}
            >
              Hire Now
            </AppButton>
          </Stack>
        )}

        {/* MOBILE RIGHT ICON */}
        {isMobile && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
            <IconButton
              onClick={toggleDrawer(true)}
              color="inherit"
              aria-label="Open navigation menu"
            >
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        )}
      </Toolbar>

      {/* === MOBILE DRAWER === */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary
          }
        }}
      >
        <Box
          sx={{
            width: { xs: '100vw', sm: 360 },
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Box sx={{ textAlign: 'left', px: 2, py: 1 }}>
              <Box
                component="img"
                src="https://vedxsolution.com/wp-content/uploads/2024/04/logo-white.png"
                alt="VedX Solutions logo"
                sx={{ height: 50, width: 'auto' }}
              />
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ pr: 1 }}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
              >
                {mode === 'dark' ? <WbSunnyRoundedIcon /> : <DarkModeRoundedIcon />}
              </IconButton>
              <IconButton
                onClick={handleDrawerClose}
                color="inherit"
                aria-label="Close navigation menu"
              >
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
                          onClick={handleDrawerClose}
                          sx={{
                            '&:hover .MuiListItemText-primary': gradientTextHover,
                            '& .MuiListItemText-primary': {
                              fontWeight: 600,
                              letterSpacing: 0.2
                            }
                          }}
                        >
                          <ListItemText primary={link.label} />
                        </ListItemButton>
                      ))}
                      <Divider
                        sx={{ borderColor: alpha(theme.palette.divider, 0.4) }}
                      />
                    </Box>
                  );
                }

                const isExpanded = expandedMenus[item.menu];
                const config = menuContent[item.menu];

                return (
                  <Box key={item.label}>
                    <ListItemButton onClick={toggleDrawerMenu(item.menu)}>
                      <ListItemText primary={item.label} />
                      {isExpanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                    </ListItemButton>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List disablePadding>
                        {item.path && (
                          <Divider
                            sx={{
                              borderColor: alpha(theme.palette.divider, 0.4)
                            }}
                          />
                        )}

                        {config.categories.map((category) => {
                          const categoryHref =
                            category.href ??
                            `/services${createAnchorHref(category.label)}`;
                          const categoryLinkProps = getLinkProps(categoryHref);
                          const hasCategoryLink = Boolean(categoryHref);
                          const categoryClickHandler = hasCategoryLink
                            ? handleDrawerClose
                            : undefined;
                          const isCategoryExpanded =
                            expandedCategories[item.menu]?.[category.label] ?? false;

                          return (
                            <Box key={category.label} sx={{ px: 2, py: 0.5 }}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{
                                  pl: 2,
                                  pr: 1,
                                  py: 1.5,
                                  borderRadius: 1.5,
                                  transition: 'background-color 0.3s ease'
                                }}
                              >
                                <Box
                                  {...categoryLinkProps}
                                  onClick={categoryClickHandler}
                                  sx={{
                                    flexGrow: 1,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5,
                                    pr: 2,
                                    cursor: hasCategoryLink ? 'pointer' : 'default',
                                    '&:hover .drawer-category-title': gradientTextHover,
                                    '&:focus-visible': {
                                      outline: '2px solid',
                                      outlineColor: alpha(highlightColor, 0.5),
                                      outlineOffset: 4
                                    }
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    className="drawer-category-title"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {category.label}
                                  </Typography>
                                  {category.description && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: alpha(
                                          theme.palette.text.secondary,
                                          0.9
                                        )
                                      }}
                                    >
                                      {category.description}
                                    </Typography>
                                  )}
                                </Box>

                                <IconButton
                                  size="small"
                                  onClick={toggleCategoryExpansion(
                                    item.menu,
                                    category.label
                                  )}
                                  aria-label={`Toggle ${category.label} sub categories`}
                                  aria-expanded={isCategoryExpanded}
                                >
                                  {isCategoryExpanded ? (
                                    <ExpandLessRoundedIcon fontSize="small" />
                                  ) : (
                                    <ExpandMoreRoundedIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Stack>

                              <Collapse
                                in={isCategoryExpanded}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List disablePadding>
                                  {category.subItems.map((subItem) => {
                                    const isObject =
                                      typeof subItem === 'object' && subItem !== null;
                                    const label = isObject ? subItem.label : subItem;
                                    const resolvedHref =
                                      isObject && subItem.href ? subItem.href : '';
                                    const baseHref =
                                      category.href ??
                                      `/services${createAnchorHref(category.label)}`;
                                    const basePath = baseHref.split('#')[0];
                                    const fallbackHref = basePath.startsWith('/services/')
                                      ? `${basePath}/${createSlug(label)}`
                                      : basePath.startsWith('/hire-developers/')
                                        ? `${basePath}/${createSlug(label)}`
                                        : `/services${createAnchorHref(label)}`;
                                    const href = resolvedHref || fallbackHref;
                                    const isRouteLink = href.startsWith('/');
                                    const linkProps = isRouteLink
                                      ? { component: RouterLink, to: href }
                                      : {
                                          component: 'a',
                                          href,
                                          target: '_blank',
                                          rel: 'noopener noreferrer'
                                        };

                                    return (
                                      <Typography
                                        key={label}
                                        variant="body2"
                                        onClick={handleDrawerClose}
                                        {...linkProps}
                                        sx={{
                                          fontWeight: 700,
                                          px: 2,
                                          py: 1.2,
                                          width: '100%',
                                          display: 'block',
                                          textDecoration: 'none',
                                          cursor: 'pointer',
                                          color: '#fff',
                                          transition:
                                            'color 0.3s ease, background-image 0.3s ease',
                                          '&:hover': {
                                            color: 'transparent',
                                            backgroundImage:
                                              'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                                            WebkitBackgroundClip: 'text',
                                            backgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                          }
                                        }}
                                      >
                                        {label}
                                      </Typography>
                                    );
                                  })}
                                </List>
                              </Collapse>
                            </Box>
                          );
                        })}
                      </List>
                    </Collapse>

                    <Divider
                      sx={{ borderColor: alpha(theme.palette.divider, 0.4) }}
                    />
                  </Box>
                );
              }

              return (
                <ListItemButton
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleDrawerClose}
                  sx={{
                    '&:hover .MuiListItemText-primary': gradientTextHover,
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                      letterSpacing: 0.2
                    }
                  }}
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
              alignItems: 'center'
            }}
          >
            <AppButton
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
                px: 2,
                '&:hover': {
                  background: 'linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)'
                }
              }}
            >
              Hire Now
            </AppButton>
          </Box>
        </Box>
      </Drawer>

      {!isMobile &&
        renderMegaMenu(
          serviceAnchor,
          handleServiceClose,
          menuContent.services,
          activeServiceIndex,
          setActiveServiceIndex
        )}
      {!isMobile &&
        renderMegaMenu(
          hireAnchor,
          handleHireClose,
          menuContent.hireDevelopers,
          activeHireIndex,
          setActiveHireIndex
        )}
      {!isMobile && renderAboutMenu(aboutAnchor, handleAboutClose)}
    </AppBar>
  );
};

export default NavigationBar;
