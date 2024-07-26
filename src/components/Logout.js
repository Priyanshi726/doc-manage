// src/components/Logout.js
import React from 'react';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import the Logout icon
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  const { logout } = useAuth();

  return (
    <IconButton
      color="secondary"
      size='large'
      onClick={logout}
      style={{
        color:"red",
     
        position: 'absolute',
        top: '30px',
        right: '35px',
        zIndex: 1000,
      }}
    >
      <ExitToAppIcon />
    </IconButton>
  );
};

export default Logout;
