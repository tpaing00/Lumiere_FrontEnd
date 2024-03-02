import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {

    const [inventoryData, setInventoryData] = useState([]);
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get('http://52.53.91.15:8080/api/v1/inventory'),
            axios.get('http://52.53.91.15:8080/api/v1/products')
        ])
            .then(responses => {
                const inventoryResponse = responses[0].data;
                const productsResponse = responses[1].data;
                setInventoryData(inventoryResponse);
                setProductData(productsResponse);


            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    console.log(inventoryData)
    console.log(productData)

    const renderTableHeader = () => {
        // Define the keys that you want to display in the table
        let header = ["productName", "brandName", "addToCategory", "dateAdded", "expiryDate", "addToInventory"];
        return header.map((key, index) => {
            return <th key={index}>{key}</th>
        });
    };


    const renderTableData = () => {
        // Combine the data from both arrays
        const combinedData = inventoryData.map(row => {
            // Find the matching object from the other array based on the inventoryId
            const match = productData.find(product => product.barcodeNumber === row.barcodeNumber);
            // Merge the matching objects into a new object
            const combined = Object.assign({}, row, match);
            // Return the new object
            return combined;
        });
        return combinedData.map((row, index) => {
            // Get the values of the keys that you want to display in the table
            let col = [ "productName", "brandName", "addToCategory", "dateAdded", "expiryDate", "addToInventory"].map(key => row[key]);
            return (
                <tr key={index}>
                    {col.map((val, index) => {
                        return <td key={index}>{val}</td>
                    })}
                </tr>
            );
        });
    };



    return (
        <div>
            <h1>Dynamic Table</h1>
            <table>
                <thead>
                    <tr>
                        {renderTableHeader()}
                    </tr>
                </thead>
                <tbody>
                    {renderTableData()}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;