import { alpha, Box, CircularProgress, Fade } from '@mui/material';
import { useEffect, useState } from 'react';

const LoadingOverlay = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={show} unmountOnExit timeout={600}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          bgcolor: alpha('#050505', 0.92),
          zIndex: (theme) => theme.zIndex.modal + 1
        }}
      >
        <CircularProgress size={64} thickness={4} color="secondary" />
      </Box>
    </Fade>
  );
};

export default LoadingOverlay;