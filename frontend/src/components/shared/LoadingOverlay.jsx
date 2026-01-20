import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

import { useLoading } from '../../contexts/LoadingContext.jsx';

const logoPulse = keyframes`
  from {
    opacity: 0.7;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 12000,
        backgroundColor: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.4s ease',
      }}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="VEDX Solutions Logo"
        sx={{
          width: 180,
          animation: `${logoPulse} 1.2s ease-in-out infinite alternate`,
        }}
      />
    </Box>
  );
};

export default LoadingOverlay;
