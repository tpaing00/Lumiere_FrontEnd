import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <nav>
        <ul>
          <li>
            <Link to="#" onClick={() => handleClick("TotalInventory")}>
              Total Inventory
            </Link>
          </li>

          <li>
            <Link to="#" onClick={() => handleClick("TopTrendProduct")}>
              Top Trend Products
            </Link>
          </li>
          <li>
            <Link to="#" onClick={() => handleClick("ProductWastage")}>
              Product Wastage
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        {activeComponent === "TotalInventory" && <TotalInventory />}
        {activeComponent === "ProductWastage" && <ProductWastage />}
        {activeComponent === "TopTrendProduct" && <TopTrendProduct />}
      </div>
    </>
  );
};

export default Analytics;
