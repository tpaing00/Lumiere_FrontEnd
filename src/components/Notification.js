import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, ButtonGroup, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Notification = ({ inPopup }) => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wasteData, setWasteData] = useState([]);
    const [filterOption, setFilterOption] = useState('all'); // State to track filter option

    const handleViewDetail = (inventoryId, barcodeNumber) => {
        navigate("/productdetail", {
          state: { inventoryId, barcodeNumber },
        });
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products first
                const productsResponse = await axios.get('https://api.lumiereapp.ca/api/v1/products');
                console.log("Product Response ", productsResponse.data);
                setProducts(productsResponse.data);
                // Fetch notifications after products are fetched
                const notificationResponse = await axios.get('https://api.lumiereapp.ca/api/v1/activeNotificationList');
                console.log("notification response ", notificationResponse.data);
                // Call generateNotifications after both products and notifications are fetched
                generateNotifications(productsResponse.data, notificationResponse.data);
                setLoading(false); // Update loading state
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Update loading state
            }
        };
    
        fetchData();
    }, []); // No dependencies for initial fetch
    
    // Function to generate notifications based on filter option
    const generateNotifications = (productsData, notificationsData) => {
        const allNotifications = [];
    
        // Iterate over low stock notifications and generate notifications
        notificationsData.lowStockResults.forEach(notification => {
            const productData = findProductByBarcode(productsData, notification.barcodeNumber);
            allNotifications.push({
                type: 'Low Stock',
                productName: productData.productName,
                productPhoto: productData.productPhoto,
                message: `The ${productData.productName} has low-stock.`,
                inventoryId: notification._id, // Include inventoryId from the low stock notification
                barcodeNumber: productData.barcodeNumber
            });
        });
    
        // Iterate over expiry notifications and generate notifications
        notificationsData.expiryResults.forEach(notification => {
            const productData = findProductByBarcode(productsData, notification.barcodeNumber);
            const expiryDate = new Date(notification.expiryDate).toLocaleDateString();
            allNotifications.push({
                type: 'Expiration',
                productName: productData.productName,
                productPhoto: productData.productPhoto,
                message: `The ${productData.productName} is almost expired (${expiryDate}).`,
                inventoryId: notification._id, // Include inventoryId from the expiry notification
                barcodeNumber: productData.barcodeNumber
            });
        });
    
        // Apply filtering based on filterOption
        const filteredNotifications = applyFilter(allNotifications, filterOption);
        setNotifications(filteredNotifications);
    };
    
    

    // Function to apply filtering based on filterOption
    const applyFilter = (notifications, filterOption) => {
        if (filterOption === 'lowStock') {
            return notifications.filter(notification => notification.type === 'Low Stock');
        } else if (filterOption === 'expiration') {
            return notifications.filter(notification => notification.type === 'Expiration');
        } else {
            return notifications; // Return all notifications if filterOption is 'all'
        }
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
    
            if (filterType === 'lowStock') {
                setNotifications(notificationResponse.data.lowStockResults.map(notification => {
                    const productData = findProductByBarcode(products, notification.barcodeNumber);
                    return {
                        type: 'Low Stock',
                        productName: productData.productName,
                        productPhoto: productData.productPhoto,
                        message: `The ${productData.productName} has low stock.`,
                        inventoryId: notification._id,
                        barcodeNumber: productData.barcodeNumber
                    };
                }));
            } else if (filterType === 'expiration') {
                setNotifications(notificationResponse.data.expiryResults.map(notification => {
                    const productData = findProductByBarcode(products, notification.barcodeNumber);
                    const expiryDate = new Date(notification.expiryDate).toLocaleDateString();
                    return {
                        type: 'Expiration',
                        productName: productData.productName,
                        productPhoto: productData.productPhoto,
                        message: `The ${productData.productName} is almost expired ( ${expiryDate} ).`,
                        inventoryId: notification._id,
                        barcodeNumber: productData.barcodeNumber
                    };
                }));
            } else if (filterType === 'all') {
                const allNotifications = [
                    ...notificationResponse.data.lowStockResults.map(notification => {
                        const productData = findProductByBarcode(products, notification.barcodeNumber);
                        return {
                            type: 'Low Stock',
                            productName: productData.productName,
                            productPhoto: productData.productPhoto,
                            message: `The ${productData.productName} has low stock.`,
                            inventoryId: notification._id,
                            barcodeNumber: productData.barcodeNumber
                        };
                    }),
                    ...notificationResponse.data.expiryResults.map(notification => {
                        const productData = findProductByBarcode(products, notification.barcodeNumber);
                        return {
                            type: 'Expiration',
                            productName: productData.productName,
                            productPhoto: productData.productPhoto,
                            message: `The ${productData.productName} is almost expired ${notification.expiryDate}.`,
                            inventoryId: notification._id,
                            barcodeNumber: productData.barcodeNumber
                        };
                    })
                ];
                setNotifications(allNotifications);
            }
            setLoading(false); // Update loading state
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); // Update loading state
        }
    };
    
    
    
    return (
        <>
            {/* Conditionally render heading and filter options based on inPopup */}
            {!inPopup && (
                <>
                    <Typography variant="h1">Notifications</Typography>
                    <ButtonGroup variant="contained" aria-label="filter notifications">
                        <Button onClick={() => handleFilterNotifications('all')}>All</Button>
                        <Button onClick={() => handleFilterNotifications('lowStock')}>Low-Stock</Button>
                        <Button onClick={() => handleFilterNotifications('expiration')}>Expired</Button>
                    </ButtonGroup>
                </>
            )}
            
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="notification-list">
                {/* Show only the first few notifications in the popup */}
                {inPopup
                    ? notifications.slice(0, 10).map((notification, index) => {
                        
                        console.log("Notification at index", index, ":", notification);
                        return (
                            <div key={index} onClick={() => handleViewDetail(notification.inventoryId, notification.barcodeNumber)} className="notification-item">
                                <h2>{notification.type}</h2>
                                <p>{notification.message}</p>
                                <img
                                    src={notification.productPhoto}
                                    alt={notification.productName}
                                    className="notification-image"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </div>
                        );
                    })
                    : notifications.map((notification, index) => {
                        console.log("data in notifications is ", notifications);
                        console.log("Notification at index", index, ":", notification);
                        return (
                            <div key={index} onClick={() => handleViewDetail(notification.inventoryId, notification.barcodeNumber)} className="notification-item">
                                <h2>{notification.type}</h2>
                                <p>{notification.message}</p>
                                <img
                                    src={notification.productPhoto}
                                    alt={notification.productName}
                                    className="notification-image"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </div>
                        );
                    })
                }
            </div>
            

            )}
        </>
    );
}

export default Notification;
