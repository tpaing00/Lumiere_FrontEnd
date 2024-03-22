import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const StyledImage = styled("img")({
  width: "200px",
  height: "200px",
  background: "white",
  borderRadius: "20px",
  objectFit: "cover",
});


const ProductWastage = () => {
  const [wasteProducts, setWasteProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [totalStockQuantities, setTotalStockQuantities] = useState(null);
  const [totalWasteQuantities, setTotalWasteQuantities] = useState(null);
  const [xLabels, setXLabels] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchWastageData = async () => {
      try {
        const response = await axios.get(
          "https://api.lumiereapp.ca/api/v1/wastetop5bycategory"
        );
        if (response.status === 200) {
          const top5Waste = response.data.flatMap(
            (category) => category.top5Waste
          );
          console.log("top5Waste", top5Waste);
          setWasteProducts(top5Waste);
        } else {
          console.error("Failed to fetch data:", response.status);
        }

        const inventoryResponse = await axios.get(
          "https://api.lumiereapp.ca/api/v1/gettotalinventorybycategory"
        );
        const wasteResponse = await axios.get(
          "https://api.lumiereapp.ca/api/v1/wastetop5bycategory"
        );

        if (inventoryResponse.status === 200 && wasteResponse.status === 200) {
          console.log("Inventory data:", inventoryResponse.data);
          console.log("Wastage data:", wasteResponse.data);

          // Combine inventory and wastage data
          const combinedData = wasteResponse.data.map((wasteItem) => {
            const correspondingInventoryItem = inventoryResponse.data.find(
              (inventoryItem) => wasteItem.category === inventoryItem._id
            );

            // Check if correspondingWasteItem exists and its category matches
            if (
              correspondingInventoryItem &&
              correspondingInventoryItem._id === wasteItem.category
            ) {
              return {
                category: correspondingInventoryItem._id,
                totalStockQuantity:
                  correspondingInventoryItem.totalStockQuantity,
                totalWasteQuantity: wasteItem.totalWasteQuantity,
              };
            }
          });
          console.log("combinedData:", combinedData);

          const totalStockQuantities = combinedData.map(
            (item) => item.totalStockQuantity
          );
          const totalWasteQuantities = combinedData.map(
            (item) => item.totalWasteQuantity
          );
          const xLabels = combinedData.map((item) => item.category);
          const series = combinedData.flatMap((item) => [
            {
              type: "bar",
              data: [item.totalStockQuantity],
              label: `Total Product - ${item.category}`,
              stack: `total-${item.category}`,
            },
            {
              type: "bar",
              data: [item.totalWasteQuantity],
              label: `Wasted - ${item.category}`,
              stack: `total-${item.category}`,
            },
          ]);

          setInventory(combinedData);
          setTotalStockQuantities(totalStockQuantities);
          setTotalWasteQuantities(totalWasteQuantities);
          setXLabels(xLabels);
          setSeries(series);
        } else {
          console.error("Failed to fetch data:", inventoryResponse.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchWastageData();
  }, []);

  return (
    <>
      <Typography variant="h1">Product Wastage</Typography>
      <Box sx={{ width: "100%" }}>
        <Tabs variant="scrollable" scrollButtons="auto" value={0}>
          {wasteProducts.map((product, index) => (
            <Tab
              key={index}
              icon={
                <StyledImage src={product.photo[0]} alt={product.productName} />
              }
            />
          ))}
        </Tabs>
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          {totalStockQuantities &&
            totalWasteQuantities &&
            xLabels &&
            series && (
              <BarChart
                width={800}
                height={300}
                series={[
                  {
                    data: totalWasteQuantities,
                    label: "Wasted",
                    stack: "total",
                    color: "#82ca9d",
                  },
                  {
                    data: totalStockQuantities,
                    label: "Total Product",
                    stack: "total",
                    color: "#8884d8",
                  },
                ]}
                yAxis={[{ data: xLabels, scaleType: "band" }]} // X-axis now takes the category labels
                layout="horizontal" // Setting layout to horizontal
                margin={{ top: 50, right: 30, left: 60, bottom: 20 }} // Adjusting margins
              />
            )}
        </CardContent>
      </Card>
    </>
  );
};

export default ProductWastage;
