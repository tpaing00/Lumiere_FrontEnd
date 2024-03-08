import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import inventoryTypeData from "./predefined_data/inventorytype.json";
import productCategoryData from "./predefined_data/productcategory.json";
import StaffCheckOutModal from "./StaffCheckOutModal";
import { Box, Button, Grid, IconButton, InputLabel, Menu, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

const ProductList = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [selectedInventoryProduct, setSelectedInventoryProduct] =
    useState(null);
  const [filterByStatus, setFilterByStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByInventory, setFilterByInventory] = useState("");
  const [filterByCategory, setFilterByCategory] = useState("");
  const [sortByBrand, setSortByBrand] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    Promise.all([
      axios.get("https://api.lumiereapp.ca/api/v1/inventory"),
      axios.get("https://api.lumiereapp.ca/api/v1/products"),
      axios.get("https://api.lumiereapp.ca/api/v1/notification"),
      axios.get("https://api.lumiereapp.ca/api/v1/waste"),
    ])
      .then((responses) => {
        const inventoryResponse = responses[0].data;
        const productsResponse = responses[1].data;
        const notificationsResponse = responses[2].data;
        const wastesResponse = responses[3].data;
        setInventoryData(inventoryResponse);
        setProductData(productsResponse);
        setNotificationData(notificationsResponse);
        setWasteData(wastesResponse);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = async (keywords) => {
    try {
      const response = await axios.get(
        `http://api.lumiereapp.ca/api/v1/search?keywords=${encodeURIComponent(
          keywords
        )}`
      );
      //console.log(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
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
      axios.get("https://api.lumiereapp.ca/api/v1/waste"),
    ])
      .then((responses) => {
        const [
          inventoryResponse,
          productsResponse,
          notificationsResponse,
          wastesResponse,
        ] = responses;
        setInventoryData(inventoryResponse.data);
        setProductData(productsResponse.data);
        setNotificationData(notificationsResponse.data);
        setWasteData(wastesResponse.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderTableHeader = () => {
    // Define the keys to display in the table
    let header = [
      "Name",
      "Brand",
      "Category",
      "Date Added",
      "EXP",
      "Status",
      "Inventory",
    ];
    return header.map((key, index) => {
      return <TableCell key={index}>{key}</TableCell>;
    });
  };

  const renderTableData = () => {
    // Check if both inventoryData and productData are available
    if (
      inventoryData.length === 0 ||
      productData.length === 0 ||
      notificationData.length === 0 ||
      wasteData.length === 0
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
          productId: matchingProduct._id,
          wasteId: "",
        };

        // Remove the duplicate _id field if it exists
        delete combined._id;
        return combined;
      } else {
        return inventoryRow;
      }
    });
    const wasteDataWithStatus = wasteData.map((item) => ({
      ...item,
      status: "Wasted",
      inventoryId: "",
      wasteId: item._id
    }));
    const combinedWithWaste = combinedData.concat(wasteDataWithStatus);

    // Sort the combined data based on the selected option for brandName
    let sortedData = [...combinedWithWaste];

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

    const handleViewDetail = (inventoryId, barcodeNumber, wasteId) => {
      navigate("/productdetail", {
        state: { inventoryId, barcodeNumber, wasteId },
      });
    };

    const handleReportWasted = async (row) => {
      try {
        const formData = {
          barcodeNumber: row.barcodeNumber,
          productName: row.productName,
          brandName: row.brandName,
          unitPrice: row.unitPrice,
          category: row.category,
          photo: row.photo,
          periodAfterOpening: row.periodAfterOpening,
          totalValue: row.totalValue,
          dateAdded: row.dateAdded,
          addToInventory: row.addToInventory,
          expiryDate: row.expiryDate,
          wasteQuantity: row.stockQuantity,
        };
        console.log(formData);
        //POST request to the API
        axios
          .post("https://api.lumiereapp.ca/api/v1/waste", formData)
          .then((response) => {
            alert("Reported Waste successful!");
            console.log(response.data);
            handleReloadInternalData();
          })
          .catch((error) => {
            // Handle error
            console.error("Error during report:", error);
            alert("Error during report. Please try again.");
          });
      } catch (error) {
        console.error("Error fetching results:", error);
      }
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

    //Kebab menu:
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return filteredData.map((row, index) => (

      <TableRow key={index}>
        <TableCell>{row.productName}</TableCell>
        <TableCell>{row.brandName}</TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{row.dateAdded}</TableCell>
        <TableCell>{row.expiryDate}</TableCell>
        <TableCell style={renderStatusStyle(row.status)}>{row.status}</TableCell>
        <TableCell>{row.addToInventory}</TableCell>
        <TableCell>
          <IconButton
            id="more"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => handleViewDetail(row.inventoryId, row.barcodeNumber, row.wasteId)}>View Detail</MenuItem>
            <MenuItem onClick={() => handleStaffCheckOut(row)} disabled={
              row.status === "Out of Stock" ||
              row.status === "Expired" ||
              row.status === "Wasted"
            }>Staff Check Out</MenuItem>
            <MenuItem onClick={() => handleReportWasted(row)} disabled={row.status !== "Expired" || row.status === "Wasted"}>Report Wasted</MenuItem>
            <MenuItem onClick={() => handleDelete(row)}>Delete</MenuItem>
          </Menu>

        </TableCell>
      </TableRow>
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

    const inventory = inventoryData.find(
      (inventory) => inventory._id === inventoryId
    );

    const currentDate = new Date();
    const expiryDate = new Date(inventory.expiryDate);

    if (expiryDate < currentDate) return "Expired";
    if (inventory.stockQuantity <= 0) return "Out of Stock";
    if (notification) {
      const lowStockThreshold = notification.lowStockThreshold;
      if (inventory.stockQuantity <= lowStockThreshold) return "Low Stock";
    }
    return "In Stock";
  };

  return (
    <Box component='main'>

      <Grid container spacing={3} sx={{ mt: 2 }} >

        <Grid item xs={8}>
          <Typography component='h1' variant='h1'>
            Product List
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Button onClick={handleNewProduct} variant="outlined">Register New Product</Button>
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ display: "flex", mt: 5, mb: 3 }}>

        <Grid item xs={2}>
          <InputLabel variant="standard" id="filterInventory-label">
            Filter by Inventory:
          </InputLabel>
          <Select
            id="filterInventory"
            name="filterInventory"
            className="dropdown"
            value={filterByInventory}
            onChange={handleInventoryChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {inventoryTypeData.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={2}>
          <InputLabel variant="standard" id="filterCategory-label">
            Filter by Category:
          </InputLabel>
          <Select
            id="filterCategory"
            name="filterCategory"
            className="dropdown"
            value={filterByCategory}
            onChange={handleCategoryChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {productCategoryData.map((type) =>
              type.label !== "Select" ? (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ) : null
            )}
          </Select>
        </Grid>

        <Grid item xs={2}>
          <InputLabel variant="standard" id="sortByBrand-label">
            Sort by Brand:
          </InputLabel>
          <Select
            id="sortByBrand"
            name="sortByBrand"
            className="dropdown"
            value={sortByBrand}
            onChange={handleBrandChange}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={2}>
          <InputLabel variant="standard" id="filterStatus-label">
            Filter by Status:
          </InputLabel>
          <Select
            id="filterStatus"
            name="filterStatus"
            className="dropdown"
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Low Stock">Low Stock</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            <MenuItem value="Wasted">Wasted</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={4}>
          <InputLabel variant="standard" id="searchInventory-label">
            Search:
          </InputLabel>
          <TextField
            id="searchInventory"
            name="searchInventory"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, brand, or category"
          />
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableRow>{renderTableHeader()}</TableRow>
        </TableHead>
        <TableBody>{renderTableData()}</TableBody>
      </Table>

      {showInternalModal && (
        <StaffCheckOutModal
          handleClose={handleCloseModal}
          productData={selectedInventoryProduct}
          inventoryId={selectedInventoryProduct.inventoryId}
          stockQuantity={selectedInventoryProduct.stockQuantity}
          handleReloadInternalData={handleReloadInternalData}
        />
      )}

    </Box>
  );
};

export default ProductList;
