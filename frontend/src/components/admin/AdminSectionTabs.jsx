import { Box, Tab, Tabs, alpha, useTheme } from '@mui/material';

const AdminSectionTabs = ({ value, onChange, tabs, sx }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const surfaceColor = isDark
    ? alpha(theme.palette.background.paper, 0.08)
    : '#0b1120';

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.4),
        borderRadius: 1,
        bgcolor: surfaceColor,
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 12px 30px rgba(0,0,0,0.35)'
          : '0 12px 30px rgba(15, 23, 42, 0.28)',
        ...sx,
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{
          sx: {
            height: 3,
            borderRadius: '12px',
            backgroundImage: 'linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)',
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
          },
        }}
        sx={{
          px: { xs: 1.5, md: 2.5 },
          '& .MuiTab-root': {
            color: alpha('#fff', 0.75),
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            minHeight: 64,
            px: { xs: 1.5, md: 2.5 },
            '&:hover': {
              color: '#fff',
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
            },
            '&.Mui-selected': {
              color: '#fff',
            },
          },
          '& .MuiTabs-scrollButtons': {
            color: alpha('#fff', 0.8),
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default AdminSectionTabs;
