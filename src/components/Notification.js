import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products first
                const productsResponse = await axios.get('https://api.lumiereapp.ca/api/v1/products');
                setProducts(productsResponse.data);
                // Fetch notifications after products are fetched
                const notificationResponse = await axios.get('https://api.lumiereapp.ca/api/v1/activeNotificationList');
                // Call generateNotifications after both products and notifications are fetched
                generateNotifications(productsResponse.data, notificationResponse.data);
                setLoading(false); // Update loading state
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Update loading state
            }
        };
    
        fetchData();
    }, []);
    
    
    const generateNotifications = (productsData, notificationsData) => {
        const allNotifications = [];
    
        if (!notificationsData.lowStockResults || !notificationsData.expiryResults) {
            console.error('Missing notification data');
            return;
        }
    
        // Iterate over notificationsData and generate notifications
        notificationsData.lowStockResults.forEach(notification => {
            const productData = findProductByBarcode(productsData, notification.barcodeNumber);
            
            allNotifications.push({
                type: 'Low Stock',
                productName: productData.productName,
                productPhoto: productData.productPhoto,
                message: `The ${productData.productName} has low-stock.`
            });
        });
    
        notificationsData.expiryResults.forEach(notification => {
            const productData = findProductByBarcode(productsData, notification.barcodeNumber);
            const expiryDate = new Date(notification.expiryDate).toLocaleDateString();
            allNotifications.push({
                type: 'Expiration',
                productName: productData.productName,
                productPhoto: productData.productPhoto,
                message: `The ${productData.productName} is almost expired ( ${expiryDate} ).`
            });
        });
    
        setNotifications(allNotifications);
    };
    
    

    const findProductByBarcode = (productsData, barcodeNumber) => {
        // Check if products is empty
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
            productPhoto: product.photo.length > 0 ? product.photo[0] : 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // Default photo URL
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
                        message: `The ${productData.productName} has low stock.`
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
                        message: `The ${productData.productName} is almost expired ( ${expiryDate} ).`
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
                            message: `The ${productData.productName} has low stock.`
                        };
                    }),
                    ...notificationResponse.data.expiryResults.map(notification => {
                        const productData = findProductByBarcode(products, notification.barcodeNumber);
                        return {
                            type: 'Expiration',
                            productName: productData.productName,
                            productPhoto: productData.productPhoto,
                            message: `The ${productData.productName} is almost expired ${notification.expiryDate}.`
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
            <h1>Notifications</h1>
            <ButtonGroup variant="contained" aria-label="filter notifications">
                    <Button onClick={() => handleFilterNotifications('all')}>All</Button>
                    <Button onClick={() => handleFilterNotifications('lowStock')}>Low-Stock</Button>
                    <Button onClick={() => handleFilterNotifications('expiration')}>Expired</Button>
                </ButtonGroup>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="notification-list">
                    {notifications.map((notification, index) => (
                        <div key={index} className="notification-item">
                            <h2>{notification.type}</h2>
                            <p>{notification.message}</p>
                            <img src={notification.productPhoto} 
                                alt={notification.productName} 
                                className="notification-image" 
                                style={{ width: '100px', height: '100px' }} 
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Notification;
