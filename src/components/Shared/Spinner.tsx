import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SpinnerProps {
  width?: string | number;
  height?: string | number;
  logoSize?: string | number;
  progressSize?: number;
}

const Spinner: React.FC<SpinnerProps> = ({
  width = '110px',
  height = '80px',
  logoSize = '100%',
  progressSize = 110
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
      }}
    >
      <img src="/img/logo.png" alt="" style={{ width: logoSize, height: logoSize }} className="animate-pulse" />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <CircularProgress size={progressSize} color="success" />
      </Box>
    </Box>
  );
}

export default Spinner;
