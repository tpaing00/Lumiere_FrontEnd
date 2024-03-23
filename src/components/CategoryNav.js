import React from "react";
import { Typography, Grid, IconButton, useTheme } from "@mui/material";
import { SvgIcon } from "@mui/material";

import AllCategoriesIcon from '../assets/icons/All.svg';
import HairCareIcon from '../assets/icons/HairCare.svg';
import SkinCareIcon from '../assets/icons/Face-Icon.svg';
import BodyCareIcon from '../assets/icons/BodyCare.svg';
import MakeUpIcon from '../assets/icons/Make-Up-Icon.svg';

const CategoryNav = ({ handleCategoryChange, selectedCategory }) => {
  const theme = useTheme();
  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "-50px", marginLeft: "auto", marginRight: "auto" }}
      >
        <Grid item container xs={2} direction="column"  alignItems="center" justifyContent="center">
        <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("All")}
              color={selectedCategory === "All" ? "primary" : "black"}
              style={{
                marginTop: '10px',
                background: selectedCategory === "All" ? '#003c5c' : 'white',
                boxShadow:'0px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <SvgIcon component={AllCategoriesIcon} style={{ fill: selectedCategory === "All" ? theme.palette.primary.contrastText : theme.palette.text.body }} />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography variant="body2" align="center" style={{ fontWeight: selectedCategory === "All" ? 'bold' : 'normal' }}>
              All Categories
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("Hair Care")}
              color={selectedCategory === "Hair Care" ? "primary" : "default"}
              style={{
                marginTop: '10px',
                background:selectedCategory === "Hair Care" ? "#003c5c" : "white",
                boxShadow:'0px 2px 4px rgba(0,0,0,0.1)'
                
              }}
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
              style={{
                marginTop: '10px',
                background:selectedCategory === "Skin Care" ? "#003c5c" : "white",
                boxShadow:'0px 2px 4px rgba(0,0,0,0.1)'
                
              }}
            >
              <SvgIcon component={SkinCareIcon} />
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
              style={{
                marginTop: '10px',
                background:selectedCategory === "Makeup" ? "#003c5c" : "white",
                boxShadow:'0px 2px 4px rgba(0,0,0,0.1)'
                
              }}
            >
              <SvgIcon component={MakeUpIcon} />
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
              style={{
                marginTop: '10px',
                background:selectedCategory === "Body Care" ? "#003c5c" : "white",
                boxShadow:'0px 2px 4px rgba(0,0,0,0.1)'
                
              }}
            >
              <SvgIcon component={BodyCareIcon} />
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
