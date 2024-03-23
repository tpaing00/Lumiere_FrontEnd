import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, IconButton, Tabs, Tab, Box } from '@mui/material';
import { SvgIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AllCategoriesIcon from '../assets/icons/All.svg';
import HairCareIcon from '../assets/icons/HairCare.svg';
import SkinCareIcon from '../assets/icons/Face-Icon.svg';
import BodyCareIcon from '../assets/icons/BodyCare.svg';
import MakeUpIcon from '../assets/icons/Make-Up-Icon.svg';

const TopTrendProducts = () => {
    const iconSize = '32px';
    const navigate = useNavigate();
    const [trendyProducts, setTrendyProducts] = useState([]);
    const [inventory, setInventoryData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        Promise.all([
            axios.get("https://api.lumiereapp.ca/api/v1/topbyproductname"),
            axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
            axios.get("https://api.lumiereapp.ca/api/v1/products")
        ])
        .then((responses) => {
            const topProductsResponse = responses[0].data;
            const inventoryResponse = responses[1].data;
            const productsResponse = responses[2].data;
            console.log("product response ", productsResponse);
    
            setTrendyProducts(topProductsResponse);
    
            // Build a mapping of barcode numbers to inventory ID
            const inventoryMap = {};
            inventoryResponse.forEach(item => {
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

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    }

    const filterProductsByCategory = (product) => {
        if (selectedCategory === "All") {
            return true;
        } else {
            return product.category === selectedCategory;
        }
    }
    

    return (
        
        <div>
            <Box sx={{ width: '100%', marginBottom: '50px' }}>
            <Tabs variant="scrollable" scrollButtons="auto" value={0}>
                {trendyProducts.map((trendyProduct, index) => {
                    const product = productData.find(product => product.productName === trendyProduct._id);
                    if (inventory && product) {
                        const inventoryId = inventory[product.barcodeNumber];
                        if (inventoryId) {
                            return (
                                <Tab
                                    key={index}
                                    icon={<img
                                        src={product.photo[0]}
                                        alt={product.productName}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            margin: '10px',
                                            borderRadius: 30
                                        }}
                                    />}
                                    onClick={() => handleViewDetail(inventoryId, product.barcodeNumber)}
                                />
                            );
                        }
                    }
                    return null;
                })}
            </Tabs>
        </Box>

            <div style={{  width: '80%', margin:'auto', backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px' }}>
                
            <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ marginBottom: '10px', marginTop:'-80px' }}>
            <Grid item spacing={2}>
                <IconButton
                    onClick={() => handleCategoryChange("All")}
                    color={selectedCategory === "All" ? "primary" : "default"}
                    style={{
                        marginTop: '10px',
                        background: 'white',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow
                        fontSize: iconSize,
                    }}
                    sx={{ color: 'black' }}
                >
                    <SvgIcon component={AllCategoriesIcon} viewBox="0 0 24 24" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    onClick={() => handleCategoryChange("Hair Care")}
                    color={selectedCategory === "Hair Care" ? "primary" : "default"}
                    style={{
                        background: 'white',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        padding: '10px', // Adjust padding as needed
                        fontSize: iconSize,
                    }}
                >
                     <SvgIcon
                        component={HairCareIcon}
                        viewBox="0 0 32 32"
                        
                    />
                </IconButton>
            </Grid>
            <Grid item>
            <IconButton
                    onClick={() => handleCategoryChange("Skin Care")}
                    color={selectedCategory === "Skin Care" ? "primary" : "default"}
                    style={{
                        background: 'white',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        padding: '12px', // Adjust padding as needed
                        fontSize: '28px', // Increase icon size to accommodate padding
                        fontSize: iconSize,
                    }}
                >
                    <SvgIcon
                        component={SkinCareIcon}
                        viewBox="0 0 32 32" // Increase the viewBox size
                        style={{ fontSize: '28px' }} // Adjust icon position
                    />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    onClick={() => handleCategoryChange("Makeup")}
                    color={selectedCategory === "Makeup" ? "primary" : "default"}
                    style={{
                        background: 'white',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow
                        fontSize: iconSize,
                    }}
                >
                    <SvgIcon component={MakeUpIcon} viewBox="0 0 24 24" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    onClick={() => handleCategoryChange("Body Care")}
                    color={selectedCategory === "Body Care" ? "primary" : "default"}
                    style={{
                        background: 'white',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow
                        fontSize: iconSize,
                    }}
                >
                    <SvgIcon component={BodyCareIcon} viewBox="0 0 24 24" />
                </IconButton>
            </Grid>
        </Grid>
        {/* Second Grid container for texts */}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item spacing={2}>
                <Typography variant="body2" align="center">All Categories</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body2" align="center">Hair Care</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body2" align="center">Skin Care</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body2" align="center">Makeup</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body2" align="center">Body Care</Typography>
            </Grid>
        </Grid>
                <Typography variant="h5" gutterBottom>
                    Most 5 Latest Trendy Products
                </Typography>
                <Grid container spacing={1} sx={{ justifyContent:"center" }}>
            {trendyProducts.slice(0, 5).map((product, index) => { // Limit to first 5 products
                const productDetails = productData.find(
                    (item) => item.productName === product._id
                );

                if (productDetails && filterProductsByCategory(productDetails)) {
                    const inventoryId = inventory[productDetails.barcodeNumber];

                    return (
                        <Grid key={index} item xs={12} sm={6} md={5} lg={5} >
                            <Card
                                onClick={() => handleViewDetail(inventoryId, productDetails.barcodeNumber)}
                                style={{
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow
                                    cursor: 'pointer', 
                                    margin: '8px',
                                }}
                            >
                                <CardContent sx={{ display: 'flex' }}>
                                    <Avatar
                                        sx={{ width: 80, height: 80, marginRight: 2 }}
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
        </div>
    );
};

export default TopTrendProducts;
