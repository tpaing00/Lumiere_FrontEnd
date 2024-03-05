import { Box, Button } from '@mui/material';
import React from 'react';

const Footer = ({ loggedIn, onLogout }) => {
  return (
    <>
      <Box component='footer'>
        {loggedIn && <Button onClick={onLogout} variant='contained'> Logout</Button>}
      </Box>
    </>
    // <footer>
    //     {loggedIn && <button onClick={onLogout}>Logout</button>}
    // </footer>
  );
}

export default Footer;