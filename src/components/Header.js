import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, useMediaQuery, Popover, List, ListItem, ListItemText, SvgIcon, useTheme } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Notification from './Notification';
import Bell from '../assets/icons/Bell.svg'

const Header = (props) => {
  const theme = useTheme();
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
      <AppBar position="static" sx={{borderRadius: 0, boxShadow: 'none', backgroundColor: theme.palette.environment.white, p: '9px'}}>
        <Toolbar sx={{color: theme.palette.secondary.dark, p: 0}}>
          <Box position="relative" left={30}>
            <Typography component="div" variant="h6" sx={{ flexGrow: 1, display: {lg: 'none'}}}>
              Lumière
            </Typography>
          </Box>
          <Typography component="div" flexGrow={1}></Typography>
          {/* <IconButton color="inherit" aria-label="notifications" onClick={handleClick} sx={{p: '16px'}}> */}
          <SvgIcon component={Bell} sx={{ width: '15.54', height: '20', color: theme.palette.secondary.dark, mr: '16px' }} />
          {/* </IconButton> */}
          <IconButton color="inherit" aria-label="user" sx={{p: 0, mr: '4px', ml: '8px'}}>
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
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        fullWidth
      >
        <List>
          <ListItem component={Link} to="/notification" onClick={handleClose} sx={{
            '&:hover': {
              backgroundColor: 'transparent',
            },
            color: '#b86235',
            textDecoration: 'underline'
          }}>
            <ListItemText primary="See All" />
          </ListItem>
          <Notification inPopup={true} /> {/* Pass inPopup as true when rendering in the popup */}
        </List>
      </Popover>
    </>
  );
};

export default Header;
