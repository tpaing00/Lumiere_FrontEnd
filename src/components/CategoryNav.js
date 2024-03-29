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
    { name: "All", label: "All Categories", icon: All, height: "22px", width: "22px", viewBox: "0 0 22 19" },
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

      
        {/* <Grid item container xs={1} direction="column" alignItems="center"> 

         <SvgIcon component={All} viewBox="0 0 22 19" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '22px', width: '19px' }} /> 

        <Grid item>
            <IconButton
              onClick={() => handleCategoryChange("All")}
              color={selectedCategory === "All" ? "white" : "default"}
              style={{
                marginTop: "10px",
                background:
                  selectedCategory === "All" ? "#003c5c" : "white",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                display: "flex", justifyContent: "center", alignItems: "center",
                width: '57px', height: '57px'
              }}
            >
              <SvgIcon component={All} viewBox="0 0 22 19" sx={{display: "flex", justifyContent: "center", alignItems: "center", height: '22px', width: '19px'}} />
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
        </Grid> */}
      </Grid>
    </>
  );
};

export default CategoryNav;
