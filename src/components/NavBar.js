import React from "react";
import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  IconButton,
  SvgIcon,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material/";
import CustomListItem from "./navbar/CustomListItem";
import Close from "../assets/icons/Close.svg";
import Hamburger from "../assets/icons/Hamburger.svg";
import LogoDesktop from "../assets/logo/logoDesktop.svg";
import CustomButton from "./mui_customization/base_components/CustomButton";
import { Link } from "react-router-dom";
import QuickScanWhite from "../assets/icons/QuickScanWhite.svg";

const NavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleItemClick = (variant) => {
    setSelectedItem(variant);
    handleDrawerToggle();
  };

  const drawerContent = (
    <>
      <Box
        component={LogoDesktop}
        sx={{
          width: "100%",
          height: 98.31,
          p: 0,
          m: "auto",
          display: { xs: "none", lg: "block" },
        }}
      />
      <List>
        <Button
          component={Link}
          to="/"
          onClick={handleDrawerToggle}
          fullWidth={false}
          variant="floating"
          sx={{
            p: "19px",
            width: "163px",
            height: "56px",
            borderRadius: "12px",
            m: "8px 16px",
          }}
        >
          <SvgIcon component={QuickScanWhite} sx={{ mr: "8px" }} />
          Quick Scan
        </Button>

        <CustomListItem
          variant="dashboard"
          endpoint="/dashboard"
          onClick={handleDrawerToggle}
          isSelected={selectedItem === "dashboard"}
          handleItemClick={handleItemClick}
        />
        <CustomListItem
          variant="inventory"
          endpoint="/inventory"
          onClick={handleDrawerToggle}
          isSelected={selectedItem === "inventory"}
          handleItemClick={handleItemClick}
        />
        <CustomListItem
          variant="analytics"
          endpoint="/analytics"
          onClick={handleDrawerToggle}
          isSelected={selectedItem === "analytics"}
          handleItemClick={handleItemClick}
        />
      </List>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Box>
          <Box position="absolute" top={20} left={20}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
            >
              <Box
                sx={{
                  backgroundColor: open ? "#75500B" : "transparent",
                  p: 0  ,
                }}
              >
                {open ? (
                  <SvgIcon
                    component={Close}
                    onClick={handleDrawerToggle}
                  />
                ) : (
                  <SvgIcon component={Hamburger} />
                )}
              </Box>
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
                backgroundColor: "#fcfcfc",
                p: "30px 0"
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>
      ) : (
        <Box
          component="nav"
          sx={{ backgroundColor: theme.palette.environment.white, p: "20px 0" }}
        >
          {drawerContent}
        </Box>
      )}
    </>
  );
};

export default NavBar;
