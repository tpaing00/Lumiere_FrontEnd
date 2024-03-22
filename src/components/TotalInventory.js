import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CategoryNav from "./CategoryNav";
import StockQuantityChart from "./StockQuantityChart";
import StockQuantityChartByCategory from "./StockQuantityChartByCategory";

const TotalInventory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [totalInventoryStock, setTotalInventoryStock] = useState();
  const [totalInventoryStockWithData, setTotalInventoryStockWithData] =
    useState();

  useEffect(() => {
    axios
      .get(`https://api.lumiereapp.ca/api/v1/gettotalinventorybycategory`)
      .then((response) => {
        if (response.status === 200) {
          setTotalInventoryStock(response.data);
          //   console.log(response.data);
          let totalStockByCategory = {};
          response.data.forEach((item) => {
            totalStockByCategory[item._id] = item.totalStockQuantity;
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .get(
        `https://api.lumiereapp.ca/api/v1/gettotalinventorybycategorywithdata`
      )
      .then((response) => {
        if (response.status === 200) {
          setTotalInventoryStockWithData(response.data);
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <h1>Total Inventory</h1>
      {
        <CategoryNav
          handleCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />
      }
      {selectedCategory === "All" && totalInventoryStock && (
        <StockQuantityChart totalInventoryStock={totalInventoryStock} />
      )}
      {selectedCategory !== "All" && totalInventoryStockWithData && (
        <StockQuantityChartByCategory
          selectedCategory={selectedCategory}
          totalInventoryStock={totalInventoryStock}
          totalInventoryStockWithData={totalInventoryStockWithData}
        />
      )}
    </>
  );
};

export default TotalInventory;
