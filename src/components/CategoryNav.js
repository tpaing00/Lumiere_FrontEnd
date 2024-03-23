import React from "react";
import { Typography, Grid, IconButton, Box } from "@mui/material";
import { SvgIcon } from "@mui/material";

import AllCategoriesIcon from "../assets/icons/All.svg";
import HairCareIcon from "../assets/icons/HairCare.svg";
import SkinCareIcon from "../assets/icons/SkinCare.svg";
import BodyCareIcon from "../assets/icons/BodyCare.svg";
import MakeUpIcon from "../assets/icons/MakeUp.svg";

const CategoryNav = ({ handleCategoryChange, selectedCategory }) => {
  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "-50px", marginLeft: "auto", marginRight: "auto" }}
      >
        <Grid item container xs={2} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("All")}
              color={selectedCategory === "All" ? "primary" : "default"}
            >
              <AllCategoriesIcon />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography variant="body2" align="center">
              All Categories
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("Hair Care")}
              color={selectedCategory === "Hair Care" ? "primary" : "default"}
            >
              <SvgIcon component={HairCareIcon} viewBox="0 0 24 24" />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography variant="body2" align="center">
              Hair Care
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("Skin Care")}
              color={selectedCategory === "Skin Care" ? "primary" : "default"}
            >
              <SkinCareIcon />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography variant="body2" align="center">
              Skin Care
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("Make Up")}
              color={selectedCategory === "Makeup" ? "primary" : "default"}
            >
              <MakeUpIcon />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography variant="body2" align="center">
              Makeup
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("Body Care")}
              color={selectedCategory === "Body Care" ? "primary" : "default"}
            >
              <BodyCareIcon />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography variant="body2" align="center">
              Body Care
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CategoryNav;