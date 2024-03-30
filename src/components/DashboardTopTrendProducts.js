import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const TopTrendProducts = () => {
  const navigate = useNavigate();
  const [trendyProducts, setTrendyProducts] = useState([]);
  const [inventory, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    Promise.all([
      axios.get("https://api.lumiereapp.ca/api/v1/topbyproductname"),
      axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
      axios.get("https://api.lumiereapp.ca/api/v1/products"),
    ])
      .then((responses) => {
        const topProductsResponse = responses[0].data;
        const inventoryResponse = responses[1].data;
        const productsResponse = responses[2].data;
        console.log("product response ", productsResponse);

        setTrendyProducts(topProductsResponse);

        // Build a mapping of barcode numbers to inventory ID
        const inventoryMap = {};
        inventoryResponse.forEach((item) => {
          inventoryMap[item.barcodeNumber] = item._id;
        });
        setInventoryData(inventoryMap);

        console.log("inventory response ", inventoryResponse);
        setProductData(productsResponse);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleViewDetail = (inventoryId, barcodeNumber) => {
    navigate("/productdetail", {
      state: { inventoryId, barcodeNumber },
    });
  };

  const filterProductsByCategory = (product) => {
    if (selectedCategory === "All") {
      return true;
    } else {
      return product.category === selectedCategory;
    }
  };

  return (
    <div>
      <Grid container spacing={1} sx={{ justifyContent: "left" }}>
        {trendyProducts.slice(0, 5).map((product, index) => {
          // Limit to first 5 products
          const productDetails = productData.find(
            (item) => item.productName === product._id
          );

          if (productDetails && filterProductsByCategory(productDetails)) {
            const inventoryId = inventory[productDetails.barcodeNumber];

            return (
              <Grid key={index} item xs={12} lg={6}>
                <Card
                  onClick={() =>
                    handleViewDetail(inventoryId, productDetails.barcodeNumber)
                  }
                  style={{
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add shadow
                    cursor: "pointer",
                    margin: "8px",
                    height: "100%"
                  }}>
                  <CardContent sx={{ display: "flex" }}>
                    <Avatar
                      sx={{ width: 50, height: 50, marginRight: 2 }}
                      alt={productDetails.productName}
                      src={productDetails.photo[0]}
                    />
                    <div>
                      <Typography gutterBottom variant="body1" component="div">
                        {productDetails.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Category: {productDetails.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Barcode Number: {productDetails.barcodeNumber}
                      </Typography>
                      {/* Add more product info as needed */}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          } else {
            return null;
          }
        })}
      </Grid>
    </div>
  );
};

export default TopTrendProducts;
