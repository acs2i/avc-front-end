import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import logo from '/img/logo.png';

function Spinner() {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '110px',
        height: '80px',
      }}
    >
      <img src="/img/logo.png" alt="" style={{ width: '100%', height: '100%' }} className='animate-pulse' />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <CircularProgress size={110} color="success"/>
      </Box>
    </Box>
  );
}

export default Spinner;
