import React from 'react';
import {useState, useEffect} from 'react';
import { format, addDays } from 'date-fns';
import axios from 'axios';
import { useLocation } from "react-router-dom";

const ProductDetail = () => {

    const location = useLocation();
    const { inventoryId, barcodeNumber } = location.state;

    const [productResults, setProductResults] = useState("");
    const [inventoryResults, setInventoryResults] = useState("");
    const [notificationResults, setNotificationResults] = useState("");
    const [internalUseListResults, setInternalUseListResults] = useState([]);
    const [formattedExpiryDate, setFormattedexpiryDate] = useState("");

    useEffect(() => {
    
        axios.get(`https://api.lumiereapp.ca/api/v1/products/${barcodeNumber}`)
        .then((response) => {
            if (response.status === 200) {
                setProductResults(response.data[0]);
            } 
        })
        .catch((error) => {
            console.error("Error:", error.message);
        }); 
        
        
        axios.get(`https://api.lumiereapp.ca/api/v1/inventory/${inventoryId}`)
        .then((res) => {
            if (res.status === 200) {
                setInventoryResults(res.data);
                const dateString = res.data.expiryDate;
                const date = new Date(dateString);
                const adjustedDate = addDays(date, 1);
                setFormattedexpiryDate(() => {
                    return format(adjustedDate, 'dd MMM yyyy');
                }); 
            } 
        })
        .catch((error) => {
            console.error("Error:", error.message);
        }); 

        axios.get(`https://api.lumiereapp.ca/api/v1/notification/${inventoryId}`)
        .then((resObj) => {
            if (resObj.status === 200) {
                setNotificationResults(resObj.data[0]);
            } 
        })
        .catch((error) => {
            console.error("Error:", error.message);
        }); 

        axios.get(`http://localhost:8080/api/v1/internalUseList/${inventoryId}`)
        .then((result) => {
            if (result.status === 200) {
                setInternalUseListResults(result.data.InternalUseListResults);
                // console.log(result.data.InternalUseListResults);
            } 
        })
        .catch((error) => {
            console.error("Error:", error.message);
        }); 
        
    },[]);

  return (
    <>
    <h1>Product Detail</h1>
    <p>{inventoryResults.addToInventory}</p>
    <p>{productResults.category}</p>
    <p>{`Brand: ${productResults.brandName}`}</p>
    <h1>{productResults.productName}</h1>
    <img src={productResults.photo} alt="product image" height="327" />

    <div>
        <div>
            <h2>Product Information</h2>
        </div>
        <div>
            <div>
                <p>Stock</p>
                <p>{inventoryResults.stockQuantity}</p>
            </div>
            <div>
                <p>Low Stock Alert</p>
                <p>{notificationResults.lowStockQuantity}</p>
            </div>
            <div>
                <p>Unit Price</p>
                <p>${productResults.unitPrice}</p>
            </div>
            <div>
                <p>Total Value</p>
                <p>{inventoryResults.totalValue}</p>
            </div>
        </div>
        <div>
            <div>
                <p>Barcode Number</p>
                <p>{inventoryResults.barcodeNumber}</p>
            </div>
            <div>
                <p>Expiry Date</p>
                <p>{`${formattedExpiryDate}`}</p>
            </div>
            <div>
                <p>Period After Opening</p>
                <p>{productResults.periodAfterOpening} Months</p>
            </div>
            
        </div>

    </div>
    <div>
        <h3>Activity History</h3>
        <div>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>User Name</th>
                    <th>Activity</th>
                    <th>Quantity Change</th>
                    <th>Date of Open</th>
                </tr>
                </thead>
                <tbody>
                {internalUseListResults.map((list, index) => (
                    <tr key={index}>
                        <td>{formattedDateTime}</td>
                        <td>{list.userId}</td>
                        <td>{list.reason}</td>
                        <td>-{list.quantity}</td>
                        <td>-{list.openingDate}</td>
                    </tr>      
                ))}
                </tbody>
        </table>
        </div>
    </div>
    </>
  );
}

export default ProductDetail;