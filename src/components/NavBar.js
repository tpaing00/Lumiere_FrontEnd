import React from "react";
import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
} from "@mui/material/";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const NavBar = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <List>
      <ListItem component={Link} to="/">
        <ListItemButton>
          <ListItemIcon>
            <InboxOutlinedIcon />
          </ListItemIcon>
          <ListItemText secondary="Quick Scan" />
        </ListItemButton>
      </ListItem>

      <ListItem component={Link} to="/dashboard">
        <ListItemButton>
          <ListItemIcon>
            <CropFreeOutlinedIcon />
          </ListItemIcon>
          <ListItemText secondary="Dashboard" />
        </ListItemButton>
      </ListItem>

      <ListItem component={Link} to="/inventory">
        <ListItemButton>
          <ListItemIcon>
            <Inventory2OutlinedIcon />
          </ListItemIcon>
          <ListItemText secondary="Inventory" />
        </ListItemButton>
      </ListItem>

      <ListItem component={Link} to="/analytics">
        <ListItemButton>
          <ListItemIcon>
            <InsertChartOutlinedIcon />
          </ListItemIcon>
          <ListItemText secondary="Analytics" />
        </ListItemButton>
      </ListItem>

      {/* <ListItem component={Link} to="/add-product">
        <ListItemButton>
          <ListItemIcon>
            <AddBoxOutlinedIcon />
          </ListItemIcon>
          <ListItemText secondary="Register Product" />
        </ListItemButton>
      </ListItem> */}
    </List>
  );

  return (
    <>
      {isMobile ? (
        <Box>
          <Box position="absolute" top={10} left={10}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
            >
              {open ? <CloseIcon onClick={handleDrawerToggle} /> : <MenuIcon />}
            </IconButton>
          </Box>
          <Drawer
            anchor="left"
            open={open}
            // onClose={() => setOpen(false)}
            variant="persistent"
            PaperProps={{
              sx: {
                marginTop: "55px", // Set margin top to start below the menu icon
                width: "100%", // Set width to 100% for full width
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>
      ) : (
        <Box component="nav">{drawerContent}</Box>
      )}
    </>
  );
};

export default NavBar;
