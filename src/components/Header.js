import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios'; // Import axios
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  useMediaQuery,
  Popover,
  List,
  ListItem,
  ListItemText,
  SvgIcon,
  useTheme,
  Grid,
  Button,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Notification from "./Notification";
import Bell from "../assets/icons/Bell.svg";

const Header = ({ loggedIn, handleLogout }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarClose = () => {
    setAvatarAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    // Fetch unread notifications count from backend using axios
    const fetchUnreadNotifications = async () => {
      try {
        console.log("fetching unread notifications...");
        const response = await axios.get("https://api.lumiereapp.ca/api/v1/notifications/unreadCount");
        if (response.status === 200) {
          const data = response.data;
          console.log("unread count is ", data);
          setUnreadNotifications(data.unreadCount);
        } else {
          throw new Error("Failed to fetch unread notifications count");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (loggedIn) {
      fetchUnreadNotifications();
    }
  }, [loggedIn]);

  let firstName = Cookies.get("firstName");
  let photo = Cookies.get("photo");
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <>
      <AppBar
        position="static"
        sx={{
          borderRadius: 0,
          boxShadow: "none",
          backgroundColor: theme.palette.environment.white,
          p: "9px",
        }}
      >
        <Toolbar sx={{ color: theme.palette.secondary.dark }}>
          <Box position="relative" left={30}>
            <Typography
              component="div"
              variant="h6"
              sx={{ flexGrow: 1, display: { lg: "none" } }}
            >
              Lumière
            </Typography>
          </Box>
          <Typography component="div" flexGrow={1}></Typography>
          <IconButton color="inherit" aria-label="notifications" onClick={handleClick} sx={{ padding: '0', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
              <SvgIcon
                component={Bell}
                sx={{
                  width: "15.54",
                  height: "20",
                  color: theme.palette.secondary.dark,
                  position: 'relative',
                }}
              />
              {unreadNotifications > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    transform: 'translate(110%, -50%)',
                    backgroundColor: '#F26419',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="user"
            onClick={(event) => setAvatarAnchorEl(event.currentTarget)}
          >
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
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        fullWidth
      >
        <List>
          <ListItem
            component={Link}
            to="/notification"
            onClick={handleClose}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
              color: "#b86235",
              textDecoration: "underline",
            }}
          >
            <ListItemText primary="See All" />
          </ListItem>
          <Notification inPopup={true} />{" "}
        </List>
      </Popover>
      <Popover
        open={Boolean(avatarAnchorEl)}
        anchorEl={avatarAnchorEl}
        onClose={handleAvatarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Grid container direction="column" spacing={1} sx={{ p: 1 }}>
          <Grid item>
            <Button variant="text">Edit User</Button>
          </Grid>
          <Grid item>
            <Button onClick={handleLogout} variant="text">
              Sign Out
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};

export default Header;
