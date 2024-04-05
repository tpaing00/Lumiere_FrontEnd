import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StaffCheckOutModal from "./StaffCheckOutModal";
import RetailCheckOutModal from "./RetailCheckOutModal";
import { SvgIcon} from "@mui/material";
import Inventory from "../assets/icons/Inventory.svg";
import InventoryActive from "../assets/icons/InventoryActive.svg";
import EditIcon from "../assets/icons/Edit.svg";
import {
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Box,
    Container,
    Modal,
    Snackbar,
    Alert,
    useTheme, 
    useMediaQuery
} from "@mui/material";

const ScannerDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    const [productResults, setProductResults] = useState([]);
    const [retailInventory, setretailInventoryResults] = useState([]);
    const [internalInventory, setinternalInventoryResults] = useState([]);
    const [barcode, setBarcode] = useState([]);
    const [showInternalModal, setShowInternalModal] = useState(false);
    const [showRetailModal, setShowRetailModal] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [location.state]);

    const fetchData = async () => {
        const { productResults, inventoryResults, barcode } = location.state;
        setProductResults(productResults);
        setretailInventoryResults(
            inventoryResults.filter(
                (inventory) => inventory.addToInventory === "Retail"
            )
        );
        setinternalInventoryResults(
            inventoryResults.filter(
                (inventory) => inventory.addToInventory === "Internal Use"
            )
        );
        setBarcode(barcode);
    };

    const handleReloadInternalData = (latestData) => {
        if (latestData && latestData.updatedInventory) {
            const latestInventoryResults = latestData.updatedInventory[0];
            setinternalInventoryResults([latestInventoryResults]);
        }
    };

    const handleReloadRetailData = (latestData) => {
        if (latestData && latestData.updatedInventory) {
            const latestInventoryResults = latestData.updatedInventory[0];
            setretailInventoryResults([latestInventoryResults]);
        }
    };

    const handleEdit = (event) => {
        event.preventDefault();
        alert("Click On Edit");
    };

    const handleStaffCheckOut = (event) => {
        event.preventDefault();
        if (!isExpired(internalInventory[0].expiryDate)) {
            setShowInternalModal(true);
        } else {
            alert("Product is expired. Cannot check out.");
        }
    };

    const handleCloseModal = () => {
        setShowInternalModal(false); // Close the modal
    };

    const handleRetailCheckOut = (event) => {
        event.preventDefault();
        if (!isExpired(retailInventory[0].expiryDate)) {
            setShowRetailModal(true);
        } else {
            alert("Product is expired. Cannot check out.");
        }
    };

    const handleRetailCloseModal = () => {
        setShowRetailModal(false); // Close the modal
    };

    const handleAddRetailInventory = (event) => {
        event.preventDefault();
        navigate("/add-product", { state: { barcode, inventoryType: "Retail" } });
    };

    const handleAddInternalInventory = (event) => {
        event.preventDefault();
        navigate("/add-product", {
            state: { barcode, inventoryType: "Internal Use" },
        });
    };

    // Function to format date to display only date portion
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Formats the date to display only date portion
    };

    // Function to check if a product is expired
    const isExpired = (expiryDate) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        // Set the time part of today's date to 00:00:00 to compare date only
        today.setHours(0, 0, 0, 0);
        return expiry < today;
    };

    return (
        <Box sx={{ p: 4, paddingTop:"0", paddingRight: isMobile ? "20px" : undefined, paddingLeft: isMobile ? "20px" : undefined}}>        
            {/* <Box sx={{ mt: 3 }}>
                <Typography component="body1" align="left" variant="body1">
                    Lumiere &gt; Quick Scan &gt; <strong>Scan Result</strong>
                </Typography>
            </Box> */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h1" sx={{ mb: '12px' }}>
                    Scan Result
                </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
                {internalInventory.length > 0 && (
                    <div>
                        <Typography component="h3" variant="h3" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <SvgIcon component={InventoryActive} sx={{ mr: "12px" }} />
                            {internalInventory[0].addToInventory}
                        </Typography>
                        <Card sx={{
                            borderRadius: 5,
                            mt: "20px",
                            mb: "40px",
                            p: 0
                        }}>
                            <CardContent sx={{ padding: { xs: "16px 12px 20px 12px", lg: "24px 32px 24px 24px" } }}>
                                <Grid container spacing={0} xs={12}>
                                    <Grid container item xs={12} lg={10} spacing={1} className="internal-use image-product-details" >
                                        <Grid container item className="internal-use product-image" xs={4} lg={2}>
                                            <img
                                                src={productResults[0].photo[0]}
                                                className="smallPhoto"
                                                alt="Product Photo"
                                                style={{ maxWidth: "100%", height: "auto", maxWidth: "100px", }}
                                            />
                                        </Grid>

                                        <Grid container item className="internal-use product-info" xs={8} lg={10} >
                                            <Grid item xs={12} className="internal-use top-row product-title" sx={{ display: "flex", alignItems: "center" }}>
                                                <Box sx={{
                                                    width: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                    alignItems: "flex-start"
                                                }}
                                                >
                                                    <Box sx={{
                                                        width: { xs: "100%", lg: "80%" },
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        flexShrink: 0,
                                                        mb: 1
                                                    }}>
                                                        <Typography sx={{
                                                            fontSize: { xs: "12px", lg: "16px" }
                                                        }}>
                                                            {productResults[0].barcodeNumber}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                backgroundColor: "#DAEDF5",
                                                                display: "inline-block",
                                                                padding: { xs: "4px 12px", lg: "4px 16px" },
                                                                borderRadius: "100px",
                                                                fontSize: "14px"
                                                            }}>
                                                            {productResults[0].category}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        flexShrink: 0
                                                    }}>
                                                        <Typography component="h3" sx={{
                                                            fontSize: { xs: "16px", lg: "24px" },
                                                            fontWeight: "bold",
                                                            color: theme.palette.secondary.dark,
                                                        }}>
                                                            {productResults[0].productName}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={10} className="internal-use bottom-row stock-info-desktop" sx={{
                                                display: { xs: "none", lg: "flex" },
                                                justifyContent: "space-between",
                                                mt: "24px",
                                            }}>

                                                <Box className="internal-stock-quantity" width="30%">
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: { xs: "14px", lg: "16px" }
                                                    }}>
                                                        Stock Quantity
                                                    </Typography>
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: "16px",
                                                        fontWeight: "bold",
                                                        mt: { xs: "8px", lg: "5px" }
                                                    }}>
                                                        {internalInventory[0].stockQuantity}
                                                    </Typography>
                                                </Box>
                                                <Box className="internal-unit-price" width="30%" sx={{
                                                    borderLeft: "1px solid #919191",
                                                    borderRight: "1px solid #919191",
                                                }}>
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: { xs: "14px", lg: "16px" }
                                                    }}>
                                                        Unit Price
                                                    </Typography>
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: "16px",
                                                        fontWeight: "bold",
                                                        mt: { xs: "8px", lg: "5px" }
                                                    }}>
                                                        {productResults[0].unitPrice}
                                                    </Typography>
                                                </Box>
                                                <Box className="internal-expiry-date" width="30%">
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: { xs: "14px", lg: "16px" }
                                                    }}>
                                                        Expiry Date
                                                    </Typography>
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: "16px",
                                                        fontWeight: "bold",
                                                        mt: { xs: "8px", lg: "5px" }
                                                    }}>
                                                        {formatDate(internalInventory[0].expiryDate)}
                                                    </Typography>
                                                </Box>

                                            </Grid>

                                        </Grid>

                                        <Grid item className="internal-use stock-info-mobile" xs={12} lg={0}
                                            sx={{
                                                display: { xs: "flex", lg: "none" },
                                                justifyContent: "space-between",
                                                mt: "24px",
                                                mb: "25px"
                                            }}
                                        >
                                            <Box className="internal-stock-quantity" width="30%">
                                                <Typography textAlign="center" sx={{
                                                    fontSize: { xs: "14px", lg: "16px" }
                                                }}>
                                                    Stock Quantity
                                                </Typography>
                                                <Typography textAlign="center" sx={{
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    mt: { xs: "8px", lg: "5px" }
                                                }}>
                                                    {internalInventory[0].stockQuantity}
                                                </Typography>
                                            </Box>
                                            <Box className="internal-unit-price" width="30%" sx={{
                                                borderLeft: "1px solid #919191",
                                                borderRight: "1px solid #919191",
                                            }}>
                                                <Typography textAlign="center" sx={{
                                                    fontSize: { xs: "14px", lg: "16px" }
                                                }}>
                                                    Unit Price
                                                </Typography>
                                                <Typography textAlign="center" sx={{
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    mt: { xs: "8px", lg: "5px" }
                                                }}>
                                                    {productResults[0].unitPrice}
                                                </Typography>
                                            </Box>
                                            <Box className="internal-expiry-date" width="30%">
                                                <Typography textAlign="center" sx={{
                                                    fontSize: { xs: "14px", lg: "16px" }
                                                }}>
                                                    Expiry Date
                                                </Typography>
                                                <Typography textAlign="center" sx={{
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    mt: { xs: "8px", lg: "5px" }
                                                }}>
                                                    {formatDate(internalInventory[0].expiryDate)}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                    </Grid>

                                    <Grid container item xs={12} lg={2} className="internal-use buttons"
                                        sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}
                                    >
                                        <Button variant="outlined" onClick={handleEdit} fullWidth sx={{
                                            width: "100%",
                                            m: 0,
                                            mb: { xs: "8px", lg: "16px" },
                                            maxWidth: "180px"
                                        }}>
                                            <SvgIcon component={EditIcon} sx={{ fill: "none" }} />Edit
                                        </Button>
                                        <Button variant="contained" onClick={handleStaffCheckOut} disabled={internalInventory[0].stockQuantity === 0} fullWidth sx={{
                                            width: "100%",
                                            m: 0,
                                            maxWidth: "180px"
                                        }}>
                                            Staff Checkout
                                        </Button>
                                    </Grid>

                                </Grid>

                            </CardContent>
                        </Card>

                    </div>
                )}

                {showInternalModal && (
                    <Modal open={showInternalModal} onClose={handleCloseModal}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid item>
                                <StaffCheckOutModal
                                    handleClose={handleCloseModal}
                                    productData={productResults[0]}
                                    inventoryId={internalInventory[0]._id}
                                    stockQuantity={internalInventory[0].stockQuantity}
                                    handleReloadInternalData={handleReloadInternalData}
                                    setIsSnackbarOpen={setIsSnackbarOpen}
                                    setSnackbarMessage={setSnackbarMessage}
                                />
                            </Grid>
                        </Grid>
                    </Modal>
                )}
                {internalInventory.length === 0 && (
                    <div>
                        <Typography component="h3" variant="h3" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <SvgIcon component={InventoryActive} sx={{ mr: "12px" }} />
                            Internal Use
                        </Typography>                        
                        <Card sx={{
                            borderRadius: 5,
                            mt: "20px",
                            mb: "40px",
                            p: 0
                        }}>
                            <CardContent>
                                <Typography component="p" sx={{ fontWeight: '16px' }} align="center">
                                    No Products Match Your Search
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '15px', mt: 3 }} fullWidth >
                                    <Button onClick={handleAddInternalInventory} variant="outlined" sx={{ m: 0, mt: 3 }}>
                                        Register New Product
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </div>
                )}
                <Box sx={{ mt: 3 }}>
                    {retailInventory.length > 0 && (
                        <div>
                            <Typography component="h3" variant="h3" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <SvgIcon component={InventoryActive} sx={{ mr: "12px" }} /> {retailInventory[0].addToInventory}
                            </Typography>
                            <Card sx={{
                                borderRadius: 5,
                                mt: "20px",
                                mb: "40px",
                                p: 0
                            }}>
                                <CardContent sx={{ padding: { xs: "16px 12px 20px 12px", lg: "24px 32px 24px 24px" } }}>
                                    <Grid container spacing={0} xs={12}>
                                        <Grid container item xs={12} lg={10} spacing={1} className="retail image-product-details" >
                                            <Grid container item className="retail product-image" xs={4} lg={2}>
                                                <img
                                                    src={productResults[0].photo[0]}
                                                    className="smallPhoto"
                                                    alt="Product Photo"
                                                    style={{ maxWidth: "100%", height: "auto", maxWidth: "100px", }}
                                                />
                                            </Grid>

                                            <Grid container item className="retail product-info" xs={8} lg={10} >
                                                <Grid item xs={12} className="retail top-row product-title" sx={{ display: "flex", alignItems: "center" }}>
                                                    <Box sx={{
                                                        width: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        alignItems: "flex-start"
                                                    }}
                                                    >
                                                        <Box sx={{
                                                            width: { xs: "100%", lg: "80%" },
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            flexShrink: 0,
                                                            mb: 1
                                                        }}>
                                                            <Typography sx={{
                                                                fontSize: { xs: "12px", lg: "16px" }
                                                            }}>
                                                                {productResults[0].barcodeNumber}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    backgroundColor: "#DAEDF5",
                                                                    display: "inline-block",
                                                                    padding: { xs: "4px 12px", lg: "4px 16px" },
                                                                    borderRadius: "100px",
                                                                    fontSize: "14px"
                                                                }}>
                                                                {productResults[0].category}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            width: "100%",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            flexShrink: 0
                                                        }}>
                                                            <Typography component="h3" sx={{
                                                                fontSize: { xs: "16px", lg: "24px" },
                                                                fontWeight: "bold",
                                                                color: theme.palette.secondary.dark,
                                                            }}>
                                                                {productResults[0].productName}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={10} className="retail bottom-row stock-info-desktop" sx={{
                                                    display: { xs: "none", lg: "flex" },
                                                    justifyContent: "space-between",
                                                    mt: "24px",
                                                }}>

                                                    <Box className="internal-stock-quantity" width="30%">
                                                        <Typography textAlign="center" sx={{
                                                            fontSize: { xs: "14px", lg: "16px" }
                                                        }}>
                                                            Stock Quantity
                                                        </Typography>
                                                        <Typography textAlign="center" sx={{
                                                            fontSize: "16px",
                                                            fontWeight: "bold",
                                                            mt: { xs: "8px", lg: "5px" }
                                                        }}>
                                                            {retailInventory[0].stockQuantity}
                                                        </Typography>
                                                    </Box>
                                                    <Box className="internal-unit-price" width="30%" sx={{
                                                        borderLeft: "1px solid #919191",
                                                        borderRight: "1px solid #919191",
                                                    }}>
                                                        <Typography textAlign="center" sx={{
                                                            fontSize: { xs: "14px", lg: "16px" }
                                                        }}>
                                                            Unit Price
                                                        </Typography>
                                                        <Typography textAlign="center" sx={{
                                                            fontSize: "16px",
                                                            fontWeight: "bold",
                                                            mt: { xs: "8px", lg: "5px" }
                                                        }}>
                                                            {productResults[0].unitPrice}
                                                        </Typography>
                                                    </Box>
                                                    <Box className="internal-expiry-date" width="30%">
                                                        <Typography textAlign="center" sx={{
                                                            fontSize: { xs: "14px", lg: "16px" }
                                                        }}>
                                                            Expiry Date
                                                        </Typography>
                                                        <Typography textAlign="center" sx={{
                                                            fontSize: "16px",
                                                            fontWeight: "bold",
                                                            mt: { xs: "8px", lg: "5px" }
                                                        }}>
                                                            {formatDate(retailInventory[0].expiryDate)}
                                                        </Typography>
                                                    </Box>

                                                </Grid>

                                            </Grid>

                                            <Grid item className="retail stock-info-mobile" xs={12} lg={0}
                                                sx={{
                                                    display: { xs: "flex", lg: "none" },
                                                    justifyContent: "space-between",
                                                    mt: "24px",
                                                    mb: "25px"
                                                }}
                                            >
                                                <Box className="internal-stock-quantity" width="30%">
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: { xs: "14px", lg: "16px" }
                                                    }}>
                                                        Stock Quantity
                                                    </Typography>
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: "16px",
                                                        fontWeight: "bold",
                                                        mt: { xs: "8px", lg: "5px" }
                                                    }}>
                                                        {retailInventory[0].stockQuantity}
                                                    </Typography>
                                                </Box>
                                                <Box className="internal-unit-price" width="30%" sx={{
                                                    borderLeft: "1px solid #919191",
                                                    borderRight: "1px solid #919191",
                                                }}>
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: { xs: "14px", lg: "16px" }
                                                    }}>
                                                        Unit Price
                                                    </Typography>
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: "16px",
                                                        fontWeight: "bold",
                                                        mt: { xs: "8px", lg: "5px" }
                                                    }}>
                                                        {productResults[0].unitPrice}
                                                    </Typography>
                                                </Box>
                                                <Box className="internal-expiry-date" width="30%">
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: { xs: "14px", lg: "16px" }
                                                    }}>
                                                        Expiry Date
                                                    </Typography>
                                                    <Typography textAlign="center" sx={{
                                                        fontSize: "16px",
                                                        fontWeight: "bold",
                                                        mt: { xs: "8px", lg: "5px" }
                                                    }}>
                                                        {formatDate(retailInventory[0].expiryDate)}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                        </Grid>

                                        <Grid container item xs={12} lg={2} className="retail buttons"
                                            sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}
                                        >
                                            <Button variant="outlined" onClick={handleEdit} fullWidth sx={{
                                                width: "100%",
                                                m: 0,
                                                mb: { xs: "8px", lg: "16px" },
                                                maxWidth: "180px"
                                            }}>
                                                <SvgIcon component={EditIcon} sx={{ fill: "none" }} />Edit
                                            </Button>
                                            <Button variant="contained" onClick={handleRetailCheckOut} disabled={retailInventory[0].stockQuantity === 0} fullWidth sx={{
                                                width: "100%",
                                                m: 0,
                                                maxWidth: "180px"
                                            }}>
                                                Retail Checkout
                                            </Button>
                                        </Grid>

                                    </Grid>

                                </CardContent>
                            </Card>
                        </div>


                    )}

                </Box>
                {showRetailModal && (
                    <Modal open={showRetailModal} onClose={handleRetailCloseModal}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid item>
                                <RetailCheckOutModal
                                    handleClose={handleRetailCloseModal}
                                    productData={productResults[0]}
                                    inventoryId={retailInventory[0]._id}
                                    stockQuantity={retailInventory[0].stockQuantity}
                                    handleReloadRetailData={handleReloadRetailData}
                                    setIsSnackbarOpen={setIsSnackbarOpen}
                                    setSnackbarMessage={setSnackbarMessage}
                                />
                            </Grid>
                        </Grid>
                    </Modal>
                )}
                {retailInventory.length === 0 && (
                    <div>
                        <Typography component="h3" variant="h3" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <SvgIcon component={InventoryActive} sx={{ mr: "12px" }} /> Retail
                        </Typography>
                        <Card sx={{
                            borderRadius: 5,
                            mt: "20px",
                            mb: "40px",
                            p: 0
                        }}>
                            <CardContent>
                                <Typography component="p" sx={{ fontWeight: '16px' }} align="center">
                                    No Products Match Your Search
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '15px' }} fullWidth >
                                    <Button onClick={handleAddRetailInventory} variant="contained" sx={{ m: 0, mt: 3 }}>
                                        Register New Product
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </Box>
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={2000} // Adjust the duration as needed
                onClose={() => setIsSnackbarOpen(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert
                    onClose={() => setIsSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>

            </Snackbar>        
        </Box>
    );
};

export default ScannerDetail;
