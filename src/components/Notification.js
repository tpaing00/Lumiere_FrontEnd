import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, ButtonGroup, Button, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import { CustomTypography } from '../components/mui_customization/base_components/CustomTypography'

const Notification = ({ inPopup, onClosePopup }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wasteData, setWasteData] = useState([]);
    const [filterOption, setFilterOption] = useState('all'); // State to track filter option


    const handleViewDetail = async (inventoryId, barcodeNumber, notificationId) => {
        try {
    
            await axios.put(`https://api.lumiereapp.ca/api/v1/notification/${notificationId}/mark-read`);
            
            const productDetailPage = window.openedProductDetailPage;
    
            if (productDetailPage) {
                productDetailPage.updateContent(inventoryId, barcodeNumber);
            } else {
                navigate("/productdetail", {
                    state: { inventoryId, barcodeNumber },
                });
            }
    
            if (inPopup && onClosePopup) {
                onClosePopup();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await axios.get('https://api.lumiereapp.ca/api/v1/products');
                console.log("Product Response ", productsResponse.data);
                setProducts(productsResponse.data);
                const notificationResponse = await axios.get('https://api.lumiereapp.ca/api/v1/activeNotificationList');
                console.log("notification response ", notificationResponse.data);
                generateNotifications(productsResponse.data, notificationResponse.data);
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // No dependencies for initial fetch

    // Function to generate notifications based on filter option
    const generateNotifications = (productsData, notificationsData) => {
        const allNotifications = [];

        // Iterate over low stock notifications and generate notifications
        notificationsData.lowStockResults.forEach(notification => {
            const notificationId = notification.notificationResults[0]._id;
            const productData = findProductByBarcode(productsData, notification.barcodeNumber);
            allNotifications.push({
                type: 'Low Stock',
                productName: productData.productName,
                productPhoto: productData.productPhoto,
                message: `The ${productData.productName} has low-stock.`,
                inventoryId: notification._id, // Include inventoryId from the low stock notification
                notificationId: notificationId, // Include notificationId
                barcodeNumber: productData.barcodeNumber,
                read: notification.notificationResults[0].read 
            });
        });

        // Iterate over expiry notifications and generate notifications
        notificationsData.expiryResults.forEach(notification => {
            const notificationId = notification.notificationResults[0]._id;
            const productData = findProductByBarcode(productsData, notification.barcodeNumber);
            const expiryDate = new Date(notification.expiryDate).toLocaleDateString();
            allNotifications.push({
                type: 'Expiration',
                productName: productData.productName,
                productPhoto: productData.productPhoto,
                message: `The ${productData.productName} is almost expired (${expiryDate}).`,
                inventoryId: notification._id, // Include inventoryId from the expiry notification
                notificationId: notificationId, // Include notificationId
                barcodeNumber: productData.barcodeNumber,
                read: notification.notificationResults[0].read 
            });
        });

        // Apply filtering based on filterOption
        const filteredNotifications = applyFilter(allNotifications, filterOption);
        setNotifications(filteredNotifications);
    };



    // Function to apply filtering based on filterOption
const applyFilter = (notifications, filterOption) => {
    return notifications.filter(notification => {
        // Clone the notification object to avoid modifying the original
        const filteredNotification = { ...notification };

        // Check the filter option
        if (filterOption === 'lowStock') {
            // If filter option is 'lowStock', keep notifications of type 'Low Stock'
            return filteredNotification.type === 'Low Stock';
        } else if (filterOption === 'expiration') {
            // If filter option is 'expiration', keep notifications of type 'Expiration'
            return filteredNotification.type === 'Expiration';
        } else {
            // If filter option is 'all', include all notifications
            return true;
        }
    });
};


    // Function to find product by barcode
    const findProductByBarcode = (productsData, barcodeNumber) => {
        // Check if productsData is empty
        if (productsData.length === 0) {
            return {
                productName: "Product Not Found",
                productPhoto: 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // Default photo URL
            };
        }

        // Find the product by barcode number
        const product = productsData.find(product => product.barcodeNumber === barcodeNumber);

        // Check if product is found
        if (!product) {
            return {
                productName: "Product Not Found",
                productPhoto: 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // Default photo URL
            };
        }

        return {
            productName: product.productName,
            productPhoto: product.photo.length > 0 ? product.photo[0] : 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Default photo URL
            barcodeNumber: product.barcodeNumber
        };
    };
    
    const handleFilterNotifications = async (filterType) => {
        try {
            setLoading(true); // Set loading state while fetching data
            const notificationResponse = await axios.get('https://api.lumiereapp.ca/api/v1/activeNotificationList');
            generateNotifications(products, notificationResponse.data);
            setFilterOption(filterType);
    
            const allNotifications = [];
    
            if (filterType === 'lowStock') {
                allNotifications.push(...notificationResponse.data.lowStockResults.map(notification => {
                    const productData = findProductByBarcode(products, notification.barcodeNumber);
                    return {
                        type: 'Low Stock',
                        productName: productData.productName,
                        productPhoto: productData.productPhoto,
                        message: `The ${productData.productName} has low stock.`,
                        inventoryId: notification._id,
                        notificationId: notification.notificationResults[0]._id, // Include notificationId
                        barcodeNumber: productData.barcodeNumber,
                        read: notification.notificationResults[0].read
                    };
                }));
            } else if (filterType === 'expiration') {
                allNotifications.push(...notificationResponse.data.expiryResults.map(notification => {
                    const productData = findProductByBarcode(products, notification.barcodeNumber);
                    const expiryDate = new Date(notification.expiryDate).toLocaleDateString();
                    return {
                        type: 'Expiration',
                        productName: productData.productName,
                        productPhoto: productData.productPhoto,
                        message: `The ${productData.productName} is almost expired (${expiryDate}).`,
                        inventoryId: notification._id,
                        notificationId: notification.notificationResults[0]._id, // Include notificationId
                        barcodeNumber: productData.barcodeNumber,
                        read: notification.notificationResults[0].read
                    };
                }));
            } else if (filterType === 'all') {
                allNotifications.push(
                    ...notificationResponse.data.lowStockResults.map(notification => {
                        const productData = findProductByBarcode(products, notification.barcodeNumber);
                        return {
                            type: 'Low Stock',
                            productName: productData.productName,
                            productPhoto: productData.productPhoto,
                            message: `The ${productData.productName} has low stock.`,
                            inventoryId: notification._id,
                            notificationId: notification.notificationResults[0]._id, // Include notificationId
                            barcodeNumber: productData.barcodeNumber,
                            read: notification.notificationResults[0].read
                        };
                    }),
                    ...notificationResponse.data.expiryResults.map(notification => {
                        const productData = findProductByBarcode(products, notification.barcodeNumber);
                        const expiryDate = new Date(notification.expiryDate).toLocaleDateString();
                        return {
                            type: 'Expiration',
                            productName: productData.productName,
                            productPhoto: productData.productPhoto,
                            message: `The ${productData.productName} is almost expired (${expiryDate}).`,
                            inventoryId: notification._id,
                            notificationId: notification.notificationResults[0]._id, // Include notificationId
                            barcodeNumber: productData.barcodeNumber,
                            read: notification.notificationResults[0].read
                        };
                    })
                );
            }
    
            setNotifications(allNotifications);
            setLoading(false); // Update loading state
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); // Update loading state
        }
    };
    
    

    const buttonBorder = "5px solid #75500b";

    return (
        <>
            {/* Conditionally render heading and filter options based on inPopup */}
            {!inPopup && (
                <>
                    <Box sx={{ maxWidth: '678px', margin: 'auto', backgroundColor: theme.palette.environment.white, padding: '16px' }}>

                        <Typography variant="h1" sx={{ margin: 0, mb: '24px' }}>Notifications</Typography>
                        <ButtonGroup variant="tab" aria-label="filter notifications" fullWidth disableElevation disableRipple
                            sx={{
                                border: 'none',
                                borderRadius: 0,

                                '& > button:nth-of-type(1)': {
                                    color: filterOption === 'all' ? '#75500b' : '#6a6a6a',
                                    borderBottom: filterOption === 'all' ? buttonBorder : 'none',
                                    borderRadius: 0,
                                },
                                '& > button:nth-of-type(2)': {
                                    color: filterOption === 'lowStock' ? '#75500b' : '#6a6a6a',
                                    borderBottom: filterOption === 'lowStock' ? buttonBorder : 'none',
                                    borderRadius: 0,
                                },
                                '& > button:nth-of-type(3)': {
                                    color: filterOption === 'expiration' ? '#75500b' : '#6a6a6a',
                                    borderBottom: filterOption === 'expiration' ? buttonBorder : 'none',
                                    borderRadius: 0,
                                }
                            }}
                        >
                            <Button onClick={() => handleFilterNotifications('all')} sx={{ m: 0, p: '16px' }}>
                                All</Button>
                            <Button onClick={() => handleFilterNotifications('lowStock')} sx={{ m: 0, p: '16px' }}>Low-Stock</Button>
                            <Button onClick={() => handleFilterNotifications('expiration')} sx={{ m: 0, p: '16px' }}>Expired</Button>
                        </ButtonGroup>
                    </Box>
                </>
            )}

            {loading ? (
                <Box sx={{ width: '678px', maxWidth: '678px', margin: 'auto', backgroundColor: theme.palette.environment.white, padding: '16px' }}>
                    <Typography>Loading...</Typography>
                </Box>
            ) : (
                <Box className="notification-list" sx={{ width: '678px', maxWidth: '678px', margin: 'auto', backgroundColor: theme.palette.environment.white, padding: '16px' }}>
                    {/* Show only the first few notifications in the popup */}
                    {inPopup
                        ? notifications.slice(0, 10).map((notification, index) => {

                            return (
                              
                                <Box sx={{width: '444px', p: '16px'}} >
                                    {/* <Box key={index} onClick={() => handleViewDetail(notification.inventoryId, notification.barcodeNumber, notification.notificationId)} className="notification-item" fullWidth>
                                    <Typography component="h2" sx={{fontSize: '14px', fontWeight: 600}}>
                                        {notification.type}
                                        {!notification.read && <span style={{marginLeft: '5px', width: '10px', height: '10px', backgroundColor: 'orange', borderRadius: '50%', display: 'inline-block'}}></span>}
                                    </Typography>
                                        <Box display="flex" alignItems="center">
                                        <img
                                            src={notification.productPhoto}
                                            alt={notification.productName}
                                            className="notification-image"
                                            style={{ width: '60px', height: '60px' }}
                                        />
                                        <Typography sx={{fontSize: '14px'}}>{notification.message}</Typography>
                                        </Box>
                                    </Box> */}
                                    <Box key={index} onClick={() => handleViewDetail(notification.inventoryId, notification.barcodeNumber, notification.notificationId)} className="notification-item" fullWidth sx={{ position: 'relative','&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}>
                                        <Typography component="h2" sx={{ fontSize: '14px', fontWeight: 600 }}>
                                            {notification.type}
                                        </Typography>
                                        {!notification.read && (
                                            <span style={{ position: 'absolute', top: '0', right: '0', marginRight: '5px', width: '10px', height: '10px', backgroundColor: 'orange', borderRadius: '50%', display: 'inline-block' }}></span>
                                        )}
                                        <Box display="flex" alignItems="center">
                                            <img
                                                src={notification.productPhoto}
                                                alt={notification.productName}
                                                className="notification-image"
                                                style={{ width: '60px', height: '60px' }}
                                            />
                                            <Typography sx={{ fontSize: '14px' }}>{notification.message}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })
                        : notifications.map((notification, index) => {
                            return (
                                <Box key={index} onClick={() => handleViewDetail(notification.inventoryId, notification.barcodeNumber, notification.notificationId)} className="notification-item" sx={{ maxWidth: '678px', margin: 'auto', backgroundColor: theme.palette.environment.white, padding: '12px 16px', position: 'relative', '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}>
                            <Typography component="h2" sx={{ fontSize: '16px', fontWeight: 700, mb: '8px' }}>
                                {notification.type}
                            </Typography>
                            {!notification.read && (
                                <span style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', marginRight: '5px', width: '10px', height: '10px', backgroundColor: 'orange', borderRadius: '50%', display: 'inline-block' }}></span>
                            )}
                            <Box display="flex" alignItems="center">
                                <img
                                    src={notification.productPhoto}
                                    alt={notification.productName}
                                    className="notification-image"
                                    style={{ width: '100px', height: '100px' }}
                                />
                                <Typography sx={{ ml: '16px' }}>{notification.message}</Typography>
                            </Box>
                        </Box>
                            );
                        })
                    }
                </Box>


            )}

        </>
    );
}

export default Notification;
