import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = (props) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box position="relative" left={30}>
            <Typography component="div" variant="h6" sx={{ flexGrow: 1 }}>
              Lumière
            </Typography>
          </Box>
          <Typography component="div" sx={{ flexGrow: 1 }}></Typography>
          <IconButton color="inherit" aria-label="notifications" component={Link} to="/notification">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="user">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
