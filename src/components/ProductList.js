import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {

    // data from db:
    const [inventoryData, setInventoryData] = useState([]);
    const [productData, setProductData] = useState([]);

    // sorting and filtering:
    const [filterByInventory, setFilterByInventory] = useState("");
    const [filterByCategory, setFilterByCategory] = useState("");
    const [sortByBrand, setSortByBrand] = useState("");

    useEffect(() => {
        Promise.all([
            axios.get('https://api.lumiereapp.ca/api/v1/inventory'),
            axios.get('https://api.lumiereapp.ca/api/v1/products')
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

    // console.log(inventoryData)
    // console.log(productData)

    const renderTableHeader = () => {
        // Define the keys that you want to display in the table
        let header = ["productName", "brandName", "category", "dateAdded", "expiryDate", "addToInventory"];
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
        // Filter the combined data based on the selected options
        const filteredData = combinedData.filter(row => {
            // Check if the row matches the filter criteria for addToInventory and category
            const inventoryMatch = filterByInventory === "" || row.addToInventory === filterByInventory;
            const categoryMatch = filterByCategory === "" || row.category === filterByCategory;
            // Return true if both criteria are met
            return inventoryMatch && categoryMatch;
        });

        // Sort the filtered data based on the selected option for brandName
        if (sortByBrand === "asc") {
            filteredData.sort((a, b) => a.brandName.localeCompare(b.brandName)); // Sort by ascending order of brandName using string comparison
        } else if (sortByBrand === "desc") {
            filteredData.sort((a, b) => b.brandName.localeCompare(a.brandName)); // Sort by descending order of brandName using string comparison
        }

        return filteredData.map((row, index) => {
            // Get the values of the keys that you want to display in the table
            let col = ["productName", "brandName", "category", "dateAdded", "expiryDate", "addToInventory"].map(key => row[key]);
            return (
                <tr key={index}>
                    {col.map((val, index) => {
                        return <td key={index}>{val}</td>
                    })}
                </tr>
            );
        });
    };

    // Handle the change of the dropdown value for addToInventory
    const handleInventoryChange = (event) => {
        setFilterByInventory(event.target.value);
    };

    // Handle the change of the dropdown value for category
    const handleCategoryChange = (event) => {
        setFilterByCategory(event.target.value);
    };

    // Handle the change of the dropdown value for brandName
    const handleBrandChange = (event) => {
        setSortByBrand(event.target.value);
    };

    return (
        <div>
            <h1>Product list</h1>
            <div>
                <label>Filter by Inventory:</label>
                <select value={filterByInventory} onChange={handleInventoryChange}>
                    <option value="">All</option>
                    <option value="Internal Use">Internal Use</option>
                    <option value="Retail">Retail</option>
                </select>
            </div>
            <div>
                <label>Filter by Category:</label>
                <select value={filterByCategory} onChange={handleCategoryChange}>
                    <option value="">All</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Body Care">Body Care</option>
                    <option value="Make Up">Make Up</option>
                </select>
            </div>
            <div>
                <label>Sort by Brand Name:</label>
                <select value={sortByBrand} onChange={handleBrandChange}>
                    <option value="">None</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
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