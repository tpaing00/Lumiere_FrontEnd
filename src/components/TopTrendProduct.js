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
  Button,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryNav from "./CategoryNav";
import * as XLSX from "xlsx";
import { styled } from "@mui/system";

const TopTrendProducts = () => {
  const navigate = useNavigate();
  const [xLabels, setXLabels] = useState([]);
  const [trendyProducts, setTrendyProducts] = useState([]);
  const [inventory, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const StyledImage = styled("img")({
    width: isMobile ? "150px" : "200px",
    height: isMobile ? "150px" : "200px",
    background: "white",
    borderRadius: "30px",
    objectFit: "cover",
    margin: "0px",
  });

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

        const inventoryMap = {};
        inventoryResponse.forEach((item) => {
          inventoryMap[item.barcodeNumber] = item._id;
        });
        setInventoryData(inventoryMap);

        console.log("inventory response ", inventoryResponse);
        setProductData(productsResponse);

        const labels = topProductsResponse.map((product) => product._id);
        setXLabels(labels);
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filterProductsByCategory = (product) => {
    if (selectedCategory === "All") {
      return true;
    } else {
      return product.category === selectedCategory;
    }
  };

  const handleExport = () => {
    const exportData = trendyProducts
      .map((product) => {
        const productDetails = productData.find(
          (item) => item.productName === product._id
        );
        if (productDetails) {
          return {
            productName: product._id,
            category: productDetails.category,
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Trendy Products");

    const fileData = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([fileData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "trendy_products.xlsx";

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <Box>
      <Box sx={{ marginBottom: "50px" }}>
        <Typography variant="h1">Top Trend Products</Typography>
        <Tabs variant="scrollable" scrollButtons="auto" value={0}>
          {trendyProducts.map((trendyProduct, index) => {
            const product = productData.find(
              (product) => product.productName === trendyProduct._id
            );
            if (inventory && product) {
              const inventoryId = inventory[product.barcodeNumber];
              if (inventoryId) {
                return (
                  <Tab
                    key={index}
                    icon={
                      <StyledImage
                        src={product.photo[0]}
                        alt={product.productName}
                      />
                    }
                    onClick={() =>
                      handleViewDetail(inventoryId, product.barcodeNumber)
                    }
                  />
                );
              }
            }
            return null;
          })}
        </Tabs>
      </Box>

      <div
        style={{
          width: "100%",
          margin: "auto",
          backgroundColor: "#FFFFFF",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Box sx={{ mb: 5, mt: -0 }}>
          <CategoryNav
            handleCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
          />
        </Box>

          <Box sx={{ width: "70%", margin: "auto"}}>
            <Typography variant="h5" gutterBottom>
              Most 5 Latest Trendy Products
            </Typography>
            <Grid container spacing={1} sx={{ justifyContent: "left" }}>
              {trendyProducts.slice(0, 5).map((product, index) => {
                // Limit to first 5 products
                const productDetails = productData.find(
                  (item) => item.productName === product._id
                );

                if (
                  productDetails &&
                  filterProductsByCategory(productDetails)
                ) {
                  const inventoryId = inventory[productDetails.barcodeNumber];

                  return (
                    <Grid key={index} item xs={12} lg={6}>
                      <Card
                        onClick={() =>
                          handleViewDetail(
                            inventoryId,
                            productDetails.barcodeNumber
                          )
                        }
                        sx={{
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add shadow
                          cursor: "pointer",
                          margin: "8px",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <CardContent sx={{ display: "flex"}}>
                          <Avatar
                            sx={{ width: 80, height: 80, marginRight: 2 }}
                            alt={productDetails.productName}
                            src={productDetails.photo[0]}
                          />
                          <div>
                            <Typography
                              gutterBottom
                              variant="body1"
                              component="div"
                            >
                              {productDetails.productName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Category: {productDetails.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Barcode Number: {productDetails.barcodeNumber}
                            </Typography>
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
            <Box mt={2} textAlign={"center"}>
              <Button
                onClick={handleExport}
                variant="contained"
                color="primary"
              >
                Export Report
              </Button>
            </Box>
          </Box>
      </div>
    </Box>
  );
};

export default TopTrendProducts;
