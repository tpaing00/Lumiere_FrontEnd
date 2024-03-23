import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import ProductWastage from "./ProductWastage";
import TopTrendProduct from "./TopTrendProduct";
import TotalInventory from "./TotalInventory";

const Analytics = () => {
  const [activeComponent, setActiveComponent] = useState("TotalInventory");

  const handleClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <>
    <Box sx={{ marginTop: '40px' }}>
      <nav >
          
            <Button
              sx={{ width: '180px' }}
              variant={activeComponent === "TotalInventory" ? "contained" : "outlined"}
              onClick={() => handleClick("TotalInventory")}
            >
              Total Inventory
            </Button>
          

            <Button
              sx={{ width: '180px' }}
              variant={activeComponent === "TopTrendProduct" ? "contained" : "outlined"}
              onClick={() => handleClick("TopTrendProduct")}
            >
              Top Trend Products
            </Button>
            <Button
              sx={{ width: '180px' }}
              variant={activeComponent === "ProductWastage" ? "contained" : "outlined"}
              onClick={() => handleClick("ProductWastage")}
            >
              Product Wastage
            </Button>
      </nav>
      </Box>
      <div>
        {activeComponent === "TotalInventory" && <TotalInventory />}
        {activeComponent === "ProductWastage" && <ProductWastage />}
        {activeComponent === "TopTrendProduct" && <TopTrendProduct />}
      </div>
    </>
  );
};

export default Analytics;
