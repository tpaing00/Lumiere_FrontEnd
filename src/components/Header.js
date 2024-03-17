import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, useMediaQuery, Popover, List, ListItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Notification from './Notification'; // Import your Notification component

const Header = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  let firstName = Cookies.get("firstName");
  let photo = Cookies.get("photo");
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

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
          <IconButton color="inherit" aria-label="notifications" onClick={handleClick}>
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="user">
            {photo && <Avatar alt="User Photo" src={photo} />}
          </IconButton>
          {!isMobile && firstName && (
            <Typography component="div">
              <Typography variant="subtitle1">{firstName}</Typography>
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
          <ListItem button component={Link} to="/notification" onClick={handleClose}>
            <ListItemText primary="See All" />
          </ListItem>
          <Notification inPopup={true} /> {/* Pass inPopup as true when rendering in the popup */}
        </List>
      </Popover>
    </>
  );
};

export default Header;
