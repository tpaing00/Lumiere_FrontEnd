import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import inventoryTypeData from "./predefined_data/inventorytype.json";
import productCategoryData from "./predefined_data/productcategory.json";
import StaffCheckOutModal from "./StaffCheckOutModal";

const ProductList = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState(null);
  const [filterByStatus, setFilterByStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearch = async (keywords) => {
    try {
      const response = await axios.get(`http://api.lumiereapp.ca/api/v1/search?keywords=${encodeURIComponent(keywords)}`);
       //console.log(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const getSearchTerm = (value) => {
    setSearchTerm(value); // Update the local state
    handleSearch(value); // Call the API with the entered keywords
  };

  const handleCloseModal = () => {
    setShowInternalModal(false); // Close the modal
  };

  const handleStaffCheckOut = (row) => {
    setSelectedInventoryProduct(row);
    setShowInternalModal(true);
  };

  const handleReloadInternalData = () => {
    // Reload all data from the API
    Promise.all([
      axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
      axios.get("https://api.lumiereapp.ca/api/v1/products"),
      axios.get("https://api.lumiereapp.ca/api/v1/notification"),
    ])
      .then((responses) => {
        const [inventoryResponse, productsResponse, notificationsResponse] =
          responses;
        setInventoryData(inventoryResponse.data);
        setProductData(productsResponse.data);
        setNotificationData(notificationsResponse.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderTableHeader = () => {
    // Define the keys to display in the table
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
          inventoryId: inventoryRow._id,
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
      const statusMatch =
        filterByStatus === "" || row.status === filterByStatus;

      // Return true if both criteria are met
      //return inventoryMatch && categoryMatch;
      return (
        inventoryMatch &&
        categoryMatch &&
        statusMatch &&
        (searchTerm === "" ||
          row.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
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
        case "Wasted":
        return { color: "gray" };
        default:
          return {};
      }
    };

    const handleViewDetail = (inventoryId, barcodeNumber) => {
      navigate("/productdetail", {
        state: { inventoryId, barcodeNumber },
      });
    };

    const handleReportWasted = async  (row) => {
      alert(
        "handleReportWasted (barcodeNumber : " +
          row.barcodeNumber +
          " , inventoryId : " +
          row.inventoryId +
          ")"
      );
        try {
          // const response = await axios.get(`http://api.lumiereapp.ca/api/v1/waste${row.inventoryId}`);
          // console.log(response.data);
          //handleReloadInternalData();
        } catch (error) {
          console.error('Error fetching results:', error);
        }

        const formData = {
          inventoryId: row.inventoryId,
          userId: "user_id",
          barcodeNumber: row.barcodeNumber,
          wasteQuantity: row.stockQuantity,
          reportDate: new Date().toISOString()
        };
        console.log(formData);
        //POST request to the API
        // axios
        //   .post("https://api.lumiereapp.ca/api/v1/waste", formData)
        //   .then((response) => {
        //     alert("Reported Waste successful!");
        //     handleReloadInternalData();
        //   })
        //   .catch((error) => {
        //     // Handle error
        //     console.error("Error during report:", error);
        //     alert("Error during report. Please try again.");
        //   });
    };

    const handleDelete = (row) => {
      alert(
        "handleDelete (barcodeNumber : " +
          row.barcodeNumber +
          " , inventoryId : " +
          row.inventoryId +
          ")"
      );
    };

    return filteredData.map((row, index) => (
      <tr key={index}>
        <td>{row.productName}</td>
        <td>{row.brandName}</td>
        <td>{row.category}</td>
        <td>{row.dateAdded}</td>
        <td>{row.expiryDate}</td>
        <td style={renderStatusStyle(row.status)}>{row.status}</td>
        <td>{row.addToInventory}</td>
        <td>
          <button
            onClick={() => handleViewDetail(row.inventoryId, row.barcodeNumber)}
          >
            View Detail
          </button>
          <button
            onClick={() => handleStaffCheckOut(row)}
            disabled={row.status === "Out of Stock" || row.status === "Expired" || row.status === "Wasted"}
          >
            Staff Check Out
          </button>
          <button
            onClick={() => handleReportWasted(row)}
            disabled={row.status !== "Expired" || row.status === "Wasted"}
          >
            Report Wasted
          </button>
          <button onClick={() => handleDelete(row)}>Delete</button>
        </td>
      </tr>
    ));
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
      <div>
        <label>Filter by Status:</label>
        <select
          value={filterByStatus}
          onChange={(e) => setFilterByStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Expired">Expired</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Wasted">Wasted</option>
        </select>
      </div>
      <div>
        <label>Search:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, brand, or category"
        />
      </div>
      <table>
        <thead>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>

      {showInternalModal && (
        <StaffCheckOutModal
          handleClose={handleCloseModal}
          productData={selectedInventoryProduct}
          inventoryId={selectedInventoryProduct.inventoryId}
          stockQuantity={selectedInventoryProduct.stockQuantity}
          handleReloadInternalData={handleReloadInternalData}
        />
      )}
    </div>
  );
};

export default ProductList;
