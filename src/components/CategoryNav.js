import React from "react";
import { Typography, Grid, IconButton, useTheme } from "@mui/material";
import { SvgIcon } from "@mui/material";
import All from "../assets/icons/All.svg";
import HairCare from "../assets/icons/HairCare.svg";
import SkinCare from "../assets/icons/Face-Icon.svg";
import BodyCare from "../assets/icons/BodyCare.svg";
import MakeUp from "../assets/icons/Make-Up-Icon.svg";

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
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("All")}
              color={selectedCategory === "All" ? "primary" : "default"}
              style={{
                marginTop: "10px",
                background:
                  selectedCategory === "All" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <SvgIcon component={All} viewBox="0 0 24 24" />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography
              variant="body2"
              align="center"
              style={{
                fontWeight:
                  selectedCategory === "All" ? "bold" : "normal",
              }}
            >
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
                marginTop: "10px",
                background:
                  selectedCategory === "Hair Care" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <SvgIcon component={HairCare} viewBox="0 0 24 24" />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography
              variant="body2"
              align="center"
              style={{
                fontWeight:
                  selectedCategory === "Hair Care" ? "bold" : "normal",
              }}
            >
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
                marginTop: "10px",
                background:
                  selectedCategory === "Skin Care" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <SvgIcon component={SkinCare} />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography
              variant="body2"
              align="center"
              style={{
                fontWeight:
                  selectedCategory === "Skin Care" ? "bold" : "normal",
              }}
            >
              Skin Care
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("Make Up")}
              color={selectedCategory === "Make Up" ? "primary" : "default"}
              style={{
                marginTop: "10px",
                background: selectedCategory === "Make Up" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <SvgIcon component={MakeUp} />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography
              variant="body2"
              align="center"
              style={{
                fontWeight: selectedCategory === "Make Up" ? "bold" : "normal",
              }}
            >
              Make-up
            </Typography>
          </Grid>
        </Grid>
        <Grid item container xs={1} direction="column" alignItems="center">
          <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("Body Care")}
              color={selectedCategory === "Body Care" ? "primary" : "default"}
              style={{
                marginTop: "10px",
                background:
                  selectedCategory === "Body Care" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <SvgIcon component={BodyCare} />
            </IconButton>
          </Grid>
          <Grid item style={{ marginTop: "auto" }}>
            <Typography
              variant="body2"
              align="center"
              style={{
                fontWeight: selectedCategory === "Body Care" ? "bold" : "normal",
              }}
            >
              Body Care
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CategoryNav;
