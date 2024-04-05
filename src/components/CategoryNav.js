import React from "react";
import { Box, Grid, useTheme, useMediaQuery } from "@mui/material";
import All from "../assets/icons/All.svg";
import HairCare from "../assets/icons/HairCare.svg";
import SkinCare from "../assets/icons/Face-Icon.svg";
import BodyCare from "../assets/icons/BodyCare.svg";
import MakeUp from "../assets/icons/Make-Up-Icon.svg";
import CategoryNavIcon from "./CategoryNavIcon";

const CategoryNav = ({ handleCategoryChange, selectedCategory }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const categories = [
    {
      name: "All",
      label: "All Categories",
      icon: All,
      viewBox: "0 0 18 15",
      mobile: {
        height: "18px",
        width: "18px",
      },
      desktop: {
        height: "22px",
        width: "22px",
      },
    },
    {
      name: "Hair Care",
      label: "Hair Care",
      icon: HairCare,
      viewBox: "0 0 24 24",
      mobile: {
        height: "16px",
        width: "16px",
      },
      desktop: {
        heighh: "24px",
        width: "24px",
      },
    },
    {
      name: "Skin Care",
      label: "Skin Care",
      icon: SkinCare,
      viewBox: "0 0 30 30",
      mobile: {
        height: "16px",
        width: "16px",
      },
      desktop: {
        height: "30px",
        width: "30px",
      },
    },
    {
      name: "Make Up",
      label: "Make-up",
      icon: MakeUp,
      viewBox: "0 0 30 30",
      mobile: {
        height: "16px",
        width: "16px",
      },
      desktop: {
        height: "30px",
        width: "30px",
      },
    },
    {
      name: "Body Care",
      label: "Body Care",
      icon: BodyCare,
      viewBox: "0 0 19 18",
      mobile: {
        height: "16px",
        width: "16px",
      },
      desktop: {
        height: "18px",
        width: "19px",
      },
    },
  ];
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        maxWidth="600px"
        alignItems="center"
        sx={{
          marginTop: { xs: "20px", lg: "36px" },
          marginLeft: "auto",
          marginRight: "auto",
          overflowY: "auto",
        }}
      >
        {categories.map((category) => (
          <CategoryNavIcon
            key={category.name}
            backgroundRule={
              selectedCategory === category.name ? "#003c5c" : "white"
            }
            fonWeightRule={
              selectedCategory === category.name ? "bold" : "normal"
            }
            iconColor={selectedCategory === category.name ? "white" : "body"}
            onClick={() => handleCategoryChange(category.name)}
            bottomText={category.label}
            svgComponent={category.icon}
            svgHeight={
              isMobile ? category.mobile.height : category.desktop.height
            }
            svgWidth={isMobile ? category.mobile.width : category.desktop.width}
            svgViewBox={category.viewBox}
          />
        ))}
      </Box>
    </>
  );
};

export default CategoryNav;
