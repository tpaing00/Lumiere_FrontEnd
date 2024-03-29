import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CategoryNav from "./CategoryNav";
import DateFilter from "./DateFilter";
import StockQuantityChart from "./StockQuantityChart";
import { format } from "date-fns";
import StockQuantityChartByCategory from "./StockQuantityChartByCategory";
import { Typography, Box } from "@mui/material";

const TotalInventory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("Today");
  const [totalInventoryStock, setTotalInventoryStock] = useState();
  const [totalInventoryStockWithData, setTotalInventoryStockWithData] =
    useState();

  useEffect(() => {
    let toDate;
    let fromDate;
    let toDateFormatted;
    let fromDateFormatted;
    
    if (selectedDateFilter === "1 Month") {
      toDate = new Date();
      fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);

      toDateFormatted = format(toDate, "yyyy MMM dd").toUpperCase();
      fromDateFormatted = format(fromDate, "yyyy MMM dd").toUpperCase();
    }

    if (selectedDateFilter === "1 Year") {
      toDate = new Date();
      fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - 1);

      toDateFormatted = format(toDate, "yyyy MMM dd").toUpperCase();
      fromDateFormatted = format(fromDate, "yyyy MMM dd").toUpperCase();
    }
    // console.log("toDateFormatted " +toDateFormatted);
    // console.log("fromDateFormatted " +fromDateFormatted);

    axios
      .get(`https://api.lumiereapp.ca/api/v1/gettotalinventorybycategory`, {
        params: {
          toDate: toDateFormatted,
          fromDate: fromDateFormatted,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setTotalInventoryStock(response.data);
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
        `https://api.lumiereapp.ca/api/v1/gettotalinventorybycategorywithdata`,
        {
          params: {
            toDate: toDateFormatted,
            fromDate: fromDateFormatted,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setTotalInventoryStockWithData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }, [selectedDateFilter]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleDateFilterChange = (dateFilter) => {
    setSelectedDateFilter(dateFilter);
  };

  return (
    <>
      <Typography variant="h1">Total Inventory</Typography>

      <Box sx={{ mb: 5, mt: 8 }}>
        <CategoryNav
          handleCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />
      </Box>

      <Box sx={{ mb: 5, mt: 8, mb: -2 }}>
        <DateFilter
          handleDateFilterChange={handleDateFilterChange}
          selectedDateFilter={selectedDateFilter}
        />
      </Box>

      {selectedCategory === "All" && totalInventoryStock && (
        <StockQuantityChart
          totalInventoryStock={totalInventoryStock}
          selectedCategory={selectedCategory}
        />
      )}
      {selectedCategory !== "All" && totalInventoryStockWithData && (
        <StockQuantityChartByCategory
          selectedCategory={selectedCategory}
          totalInventoryStock={totalInventoryStock}
          totalInventoryStockWithData={totalInventoryStockWithData}
          selectedDateFilter={selectedDateFilter}
        />
      )}
    </>
  );
};

export default TotalInventory;
