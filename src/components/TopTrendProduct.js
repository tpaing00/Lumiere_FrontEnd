import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Avatar, IconButton } from '@mui/material';
import { SvgIcon } from '@mui/material';


import AllCategoriesIcon from '../assets/icons/All.svg';
import HairCareIcon from '../assets/icons/Icon-hair-care.svg';
import SkinCareIcon from '../assets/icons/Face Icon.svg';
import BodyCareIcon from '../assets/icons/Bodycare Icon.svg';
import MakeUpIcon from '../assets/icons/Make-Up-Icon.svg';

const TopTrendProducts = () => {
    const [trendyProducts, setTrendyProducts] = useState([]);
    const [inventory, setInventoryData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:8080/api/v1/topbyproductname"),
            axios.get("http://localhost:8080/api/v1/inventory"),
            axios.get("https://api.lumiereapp.ca/api/v1/products")
        ])
        .then((responses) => {
            const topProductsResponse = responses[0].data;
            const inventoryResponse = responses[1].data;
            const productsResponse = responses[2].data;
            console.log("product response ", productsResponse);

            setTrendyProducts(topProductsResponse);
            setInventoryData(inventoryResponse);
            setProductData(productsResponse);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

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
    const handleSwipeLeft = () => {
        if (imageContainerRef.current) {
            imageContainerRef.current.scrollLeft += 100; // Adjust the scroll distance as needed
        }
    };

    return (
        
        <div>
            <div style={{ display: 'flex', overflowX: 'auto', marginBottom:'40px' }}>
                {trendyProducts.map((trendyProduct, index) => {
                    // Find the corresponding product in productData
                    const product = productData.find(product => product.productName === trendyProduct._id);
                    if (product) {
                        return (
                            <img
                                key={index}
                                src={product.photo[0]} // Assuming each product object has a photo array with URLs
                                alt={product.productName}
                                style={{
                                    width: 327,
                                    height: 367,
                                    margin: '10px',
                                    borderRadius: 30
                                }}
                            />
                        );
                    }
                    return null;
                })}
            </div>

            <div style={{  width: '80%', margin:'auto', backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '10px' }}>
                
            <Grid container spacing={0} alignItems="center"style={{marginTop:'-50px' , marginLeft:'auto', marginRight:'auto'}} >
                <Grid item container xs={2} direction="column" alignItems="center">
                    <Grid item>
                        <IconButton onClick={() => handleCategoryChange("All")} color={selectedCategory === "All" ? "primary" : "default"}>
                            <AllCategoriesIcon />
                        </IconButton>
                    </Grid>
                    <Grid item style={{ marginTop: 'auto' }}>
                        <Typography variant="body2" align="center">All Categories</Typography>
                    </Grid>
                </Grid>
                <Grid item container xs={1} direction="column" alignItems="center">
                    <Grid item>
                        <IconButton onClick={() => handleCategoryChange("Hair Care")} color={selectedCategory === "Hair Care" ? "primary" : "default"}>
                            <SvgIcon component={HairCareIcon} viewBox="0 0 24 24" />
                        </IconButton>
                    </Grid>
                    <Grid item style={{ marginTop: 'auto' }}>
                        <Typography variant="body2" align="center">Hair Care</Typography>
                    </Grid>
                </Grid>
                <Grid item container xs={1} direction="column" alignItems="center">
                    <Grid item>
                        <IconButton onClick={() => handleCategoryChange("Skin Care")} color={selectedCategory === "Skin Care" ? "primary" : "default"}>
                            <SkinCareIcon />
                        </IconButton>
                    </Grid>
                    <Grid item style={{ marginTop: 'auto' }}>
                        <Typography variant="body2" align="center">Skin Care</Typography>
                    </Grid>
                </Grid>
                <Grid item container xs={1} direction="column" alignItems="center">
                    <Grid item>
                        <IconButton onClick={() => handleCategoryChange("Makeup")} color={selectedCategory === "Makeup" ? "primary" : "default"}>
                            <MakeUpIcon />
                        </IconButton>
                    </Grid>
                    <Grid item style={{ marginTop: 'auto' }}>
                        <Typography variant="body2" align="center">Makeup</Typography>
                    </Grid>
                </Grid>
                <Grid item container xs={1} direction="column" alignItems="center">
                    <Grid item>
                        <IconButton onClick={() => handleCategoryChange("Body Care")} color={selectedCategory === "Body Care" ? "primary" : "default"}>
                            <BodyCareIcon />
                        </IconButton>
                    </Grid>
                    <Grid item style={{ marginTop: 'auto' }}>
                        <Typography variant="body2" align="center">Body Care</Typography>
                    </Grid>
                </Grid>
            </Grid>
                <Typography variant="h5" gutterBottom>
                    Most 5 Latest Trendy Products
                </Typography>
                <Grid container spacing={1}>
                    {trendyProducts.slice(0, 5).map((product, index) => { // Limit to first 5 products
                        // Find the corresponding product details from productData
                        const productDetails = productData.find(
                            (item) => item.productName === product._id
                        );

                        // If product details are found and pass category filter, render the product card
                        if (productDetails && filterProductsByCategory(productDetails)) {
                            return (
                                <Grid key={index} item xs={12} sm={6} md={6} lg={6}>
                                    <Card>
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
