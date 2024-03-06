import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import inventoryTypeData from "./predefined_data/inventorytype.json";
import productCategoryData from "./predefined_data/productcategory.json";

const ProductList = () => {
  // data from db:
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);

  // sorting and filtering:
  const [filterByInventory, setFilterByInventory] = useState("");
  const [filterByCategory, setFilterByCategory] = useState("");
  const [sortByBrand, setSortByBrand] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
      axios.get("https://api.lumiereapp.ca/api/v1/products"),
      axios.get("https://api.lumiereapp.ca/api/v1/notification"),
    ])
      .then((responses) => {
        const inventoryResponse = responses[0].data;
        const productsResponse = responses[1].data;
        const notificationsResponse = responses[2].data;
        setInventoryData(inventoryResponse);
        setProductData(productsResponse);
        setNotificationData(notificationsResponse);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // console.log(inventoryData)
  // console.log(productData)

  const renderTableHeader = () => {
    // Define the keys that you want to display in the table
    let header = [
      "productName",
      "brandName",
      "category",
      "dateAdded",
      "expiryDate",
      "status",
      "addToInventory",
    ];
    return header.map((key, index) => {
      return <th key={index}>{key}</th>;
    });
  };

  const renderTableData = () => {
    // Check if both inventoryData and productData are available
    if (
      inventoryData.length === 0 ||
      productData.length === 0 ||
      notificationData.length === 0
    ) {
      return null; // Return null if either array is empty
    }

    const combinedData = inventoryData.map((inventoryRow) => {
      // Find the matching product object from the productData array based on the barcodeNumber
      const matchingProduct = productData.find(
        (product) => product.barcodeNumber === inventoryRow.barcodeNumber
      );

      // Merge the properties of inventoryRow and matchingProduct into a new object
      if (matchingProduct) {
        const combined = {
          ...inventoryRow,
          ...matchingProduct,
          dateAdded: formatDate(inventoryRow.dateAdded),
          expiryDate: formatDate(inventoryRow.expiryDate),
          status: calculateStatus(inventoryRow._id),
        };

        // Remove the duplicate _id field if it exists
        delete combined._id;
        return combined;
      } else {
        return inventoryRow;
      }
    });

    // Sort the combined data based on the selected option for brandName
    let sortedData = [...combinedData];
    // Sort the filtered data based on the selected option for brandName
    if (sortByBrand === "asc") {
      sortedData.sort((a, b) => a.brandName.localeCompare(b.brandName)); // Sort by ascending order of brandName using string comparison
    } else if (sortByBrand === "desc") {
      sortedData.sort((a, b) => b.brandName.localeCompare(a.brandName)); // Sort by descending order of brandName using string comparison
    }
    // Filter the combined data based on the selected options
    const filteredData = sortedData.filter((row) => {
      // Check if the row matches the filter criteria for addToInventory and category
      const inventoryMatch =
        filterByInventory === "" || row.addToInventory === filterByInventory;
      const categoryMatch =
        filterByCategory === "" || row.category === filterByCategory;
      // Return true if both criteria are met
      return inventoryMatch && categoryMatch;
    });

    // Render table rows
    const renderStatusStyle = (status) => {
      switch (status) {
        case "In Stock":
          return { color: "green" };
        case "Low Stock":
          return { color: "orange" };
        case "Expired":
          return { color: "red" };
        case "Out of Stock":
          return { color: "purple" };
        default:
          return {};
      }
    };

    return filteredData.map((row, index) => {
      let col = [
        "productName",
        "brandName",
        "category",
        "dateAdded",
        "expiryDate",
        "status",
        "addToInventory",
      ].map((key) => {
        // Apply styling only to the status column
        if (key === "status") {
          return (
            <td key={key} style={renderStatusStyle(row.status)}>
              {row[key]}
            </td>
          );
        } else {
          return <td key={key}>{row[key]}</td>;
        }
      });
      return <tr key={index}>{col}</tr>;
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

  const handleNewProduct = () => {
    navigate("/add-product");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Formats the date to display only date portion
  };

  const calculateStatus = (inventoryId) => {
    const notification = notificationData.find(
      (notification) => notification.inventoryId === inventoryId
    );

    const lowStockThreshold = notification.lowStockThreshold;
    const inventory = inventoryData.find(
      (inventory) => inventory._id === inventoryId
    );

    const currentDate = new Date();
    const expiryDate = new Date(inventory.expiryDate);

    if (expiryDate < currentDate) return "Expired";
    if (inventory.stockQuantity <= 0) return "Out of Stock";
    if (inventory.stockQuantity <= lowStockThreshold) return "Low Stock";
    return "In Stock";
  };

  return (
    <div>
      <h1>Product list</h1>
      <div>
        <div>
          <button onClick={handleNewProduct}>Register New Product</button>
        </div>
        <div>
          <label>Filter by Inventory:</label>
          <select
            className="dropdown"
            value={filterByInventory}
            onChange={handleInventoryChange}
          >
            <option value="">All</option>
            {inventoryTypeData.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by Category:</label>
          <select
            className="dropdown"
            value={filterByCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All</option>
            {productCategoryData.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
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
      </div>
      <table>
        <thead>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
};

export default ProductList;
