import React from "react";
import { useState } from "react";
import { Box, Drawer, List, IconButton, SvgIcon, useMediaQuery } from "@mui/material/";
import CustomListItem from "./mui_customization/base_components/CustomListItem";
import Close from '../assets/icons/Close.svg'
import Hamburger from '../assets/icons/Hamburger.svg'

const NavBar = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <List>
      <CustomListItem
        variant="quickscan"
        endpoint="/"
        onClick={handleDrawerToggle}
      />
      <CustomListItem
        variant="dashboard"
        endpoint="/dashboard"
        onClick={handleDrawerToggle}
      />
      <CustomListItem
        variant="inventory"
        endpoint="/inventory"
        onClick={handleDrawerToggle}
      />
      <CustomListItem
        variant="analytics"
        endpoint="/analytics"
        onClick={handleDrawerToggle}
      />
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
              {open ? <SvgIcon component={Close} onClick={handleDrawerToggle} /> : <SvgIcon component={Hamburger} />}
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
