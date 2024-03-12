import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, useMediaQuery} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header = (props) => {

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
          <IconButton color="inherit" aria-label="notifications" component={Link} to="/notification">
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
    </>
  );
};

export default Header;
