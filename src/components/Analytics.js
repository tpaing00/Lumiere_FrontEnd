import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, Typography , useTheme, useMediaQuery} from "@mui/material";
import ProductWastage from "./ProductWastage";
import TopTrendProduct from "./TopTrendProduct";
import TotalInventory from "./TotalInventory";


const Analytics = () => {
  const [activeComponent, setActiveComponent] = useState("TotalInventory");
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const handleClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <>
      <Box sx={{ p: 4, paddingRight: isMobile ? "20px" : undefined, paddingLeft: isMobile ? "20px" : undefined}}>
        <Box sx={{ display: "flex", justifyContent: "left"}}>
          <List sx={{ display: "flex", listStyleType: "none" }}>
            <ListItem sx={{ mb: 1 , padding:"0", paddingRight: "20px", margin:"0"}}>
              <Link
                to="#"
                onClick={() => handleClick("TotalInventory")}
                style={{
                  textDecoration: "none",
                  color:
                    activeComponent === "TotalInventory" ? "white" : "inherit",
                  backgroundColor:
                    activeComponent === "TotalInventory"
                      ? "#003C5C"
                      : "inherit",
                  //padding: "10px 10px",
                  padding: isMobile ? "10px 10px" : "10px 40px",
                  width: "100%", // Make links take full width
                  textAlign: "center", // Center text
                  borderRadius: isMobile ? "15px" : "5px",
                }}
              >
                <Typography sx={{ fontSize: "14px" }} noWrap>Total Inventory</Typography>
              </Link>
            </ListItem>

            <ListItem sx={{ mb: 1 , padding:"0", paddingRight: "20px", margin:"0"}}>
              <Link
                to="#"
                onClick={() => handleClick("TopTrendProduct")}
                style={{
                  textDecoration: "none",
                  color:
                    activeComponent === "TopTrendProduct" ? "white" : "inherit",
                  backgroundColor:
                    activeComponent === "TopTrendProduct"
                      ? "#003C5C"
                      : "inherit",
                  padding: isMobile ? "10px 10px" : "10px 40px",
                  width: "100%", // Make links take full width
                  textAlign: "center", // Center text
                  borderRadius: isMobile ? "15px" : "5px",
                }}
              >
                <Typography sx={{ fontSize: "14px" }} noWrap>Top Trend Products</Typography>
              </Link>
            </ListItem>

            <ListItem sx={{ mb: 1 , padding:"0", margin:"0" }}>
              <Link
                to="#"
                onClick={() => handleClick("ProductWastage")}
                style={{
                  textDecoration: "none",
                  color:
                    activeComponent === "ProductWastage" ? "white" : "inherit",
                  backgroundColor:
                    activeComponent === "ProductWastage"
                      ? "#003C5C"
                      : "inherit",
                  padding: isMobile ? "10px 10px" : "10px 40px",
                  width: "100%", // Make links take full width
                  textAlign: "center", // Center text
                  borderRadius: isMobile ? "15px" : "5px",
                }}
              >
                <Typography sx={{ fontSize: "14px" }} noWrap>Product Wastage</Typography>
              </Link>
            </ListItem>
          </List>
        </Box>
        <Box sx={{ p: 1 }}>
          {activeComponent === "TotalInventory" && <TotalInventory />}
          {activeComponent === "ProductWastage" && <ProductWastage />}
          {activeComponent === "TopTrendProduct" && <TopTrendProduct />}
        </Box>
      </Box>
    </>
  );
};

export default Analytics;