import React from "react";
import { Grid, useTheme } from "@mui/material";
import All from "../assets/icons/All.svg";
import HairCare from "../assets/icons/HairCare.svg";
import SkinCare from "../assets/icons/Face-Icon.svg";
import BodyCare from "../assets/icons/BodyCare.svg";
import MakeUp from "../assets/icons/Make-Up-Icon.svg";
import CategoryNavIcon from "./CategoryNavIcon";

const CategoryNav = ({ handleCategoryChange, selectedCategory }) => {
  const theme = useTheme();
  const categories = [
    { name: "All", label: "All Categories", icon: All, height: "22px", width: "22px", viewBox: "0 0 18 15" },
    { name: "Hair Care", label: "Hair Care", icon: HairCare, height: "24px", width: "24px", viewBox: "0 0 24 24" },
    { name: "Skin Care", label: "Skin Care", icon: SkinCare, height: "30px", width: "30px", viewBox: "0 0 30 30" },
    { name: "Make Up", label: "Make-up", icon: MakeUp, height: "30px", width: "30px", viewBox: "0 0 30 30" },
    { name: "Body Care", label: "Body Care", icon: BodyCare, height: "18px", width: "19px", viewBox: "0 0 19 18" }
  ];
  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "-50px", marginLeft: "auto", marginRight: "auto" }}
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
            svgHeight={category.height}
            svgWidth={category.width}
            svgViewBox={category.viewBox}
          />
        ))}

      </Grid>
    </>
  );
};

export default CategoryNav;
